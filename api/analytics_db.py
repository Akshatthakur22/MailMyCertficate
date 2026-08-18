"""
Analytics Database Layer for MailMyCertificate
===============================================
Provides a unified interface over two backends:
  - SQLite  (local development — db stored at /tmp/mmc_analytics.db)
  - PostgreSQL via DATABASE_URL env var (production — e.g. Neon free tier)

Usage:
    from analytics_db import get_db, record_event, get_overview, close_db

The DB is initialised lazily on first use.
If DATABASE_URL is not set AND SQLite is not available, every call
returns gracefully with empty/zero data so the app never breaks.
"""

import os
import json
import time
import uuid
import hashlib
import logging
from datetime import datetime, timezone, timedelta
from contextlib import contextmanager
from typing import Optional

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────
# Backend detection
# ─────────────────────────────────────────────

DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()

_USE_POSTGRES = bool(DATABASE_URL)

# For local dev: write to /tmp which is writable even on Vercel (but ephemeral)
# For production: DATABASE_URL must point to Neon/Supabase/etc.
_SQLITE_PATH = os.environ.get("ANALYTICS_DB_PATH", "/tmp/mmc_analytics.db")

_db_available: Optional[bool] = None  # None = not yet probed


# ─────────────────────────────────────────────
# Schema DDL (shared between both backends)
# ─────────────────────────────────────────────

_SCHEMA_SQLITE = """
PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS events (
    id          TEXT PRIMARY KEY,
    ts          INTEGER NOT NULL,
    date        TEXT NOT NULL,
    event_name  TEXT NOT NULL,
    visitor_id  TEXT,
    user_id     TEXT,
    session_id  TEXT,
    source      TEXT DEFAULT 'frontend',
    success     INTEGER DEFAULT 1,
    error_code  TEXT,
    meta        TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_date       ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_name       ON events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_visitor    ON events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_events_user       ON events(user_id);

CREATE TABLE IF NOT EXISTS sessions (
    id              TEXT PRIMARY KEY,
    visitor_id      TEXT,
    user_id         TEXT,
    user_email      TEXT,
    started_at      INTEGER NOT NULL,
    last_active_at  INTEGER NOT NULL,
    date            TEXT NOT NULL,
    is_google_authed INTEGER DEFAULT 0,
    tool_opened     INTEGER DEFAULT 0,
    template_used   INTEGER DEFAULT 0,
    csv_imported    INTEGER DEFAULT 0,
    certs_generated INTEGER DEFAULT 0,
    emails_attempted INTEGER DEFAULT 0,
    emails_succeeded INTEGER DEFAULT 0,
    emails_failed   INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_sessions_date     ON sessions(date);
CREATE INDEX IF NOT EXISTS idx_sessions_visitor  ON sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user     ON sessions(user_id);

CREATE TABLE IF NOT EXISTS daily_stats (
    date                TEXT PRIMARY KEY,
    unique_visitors     INTEGER DEFAULT 0,
    tool_opens          INTEGER DEFAULT 0,
    templates_uploaded  INTEGER DEFAULT 0,
    csv_imports         INTEGER DEFAULT 0,
    certs_generated     INTEGER DEFAULT 0,
    cert_count          INTEGER DEFAULT 0,
    zip_downloads       INTEGER DEFAULT 0,
    oauth_started       INTEGER DEFAULT 0,
    oauth_success       INTEGER DEFAULT 0,
    oauth_failed        INTEGER DEFAULT 0,
    email_attempts      INTEGER DEFAULT 0,
    email_success       INTEGER DEFAULT 0,
    email_failed        INTEGER DEFAULT 0
);
"""

_SCHEMA_POSTGRES = """
CREATE TABLE IF NOT EXISTS events (
    id          TEXT PRIMARY KEY,
    ts          BIGINT NOT NULL,
    date        TEXT NOT NULL,
    event_name  TEXT NOT NULL,
    visitor_id  TEXT,
    user_id     TEXT,
    session_id  TEXT,
    source      TEXT DEFAULT 'frontend',
    success     INTEGER DEFAULT 1,
    error_code  TEXT,
    meta        TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_date       ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_name       ON events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_visitor    ON events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_events_user       ON events(user_id);

CREATE TABLE IF NOT EXISTS sessions (
    id              TEXT PRIMARY KEY,
    visitor_id      TEXT,
    user_id         TEXT,
    user_email      TEXT,
    started_at      BIGINT NOT NULL,
    last_active_at  BIGINT NOT NULL,
    date            TEXT NOT NULL,
    is_google_authed INTEGER DEFAULT 0,
    tool_opened     INTEGER DEFAULT 0,
    template_used   INTEGER DEFAULT 0,
    csv_imported    INTEGER DEFAULT 0,
    certs_generated INTEGER DEFAULT 0,
    emails_attempted INTEGER DEFAULT 0,
    emails_succeeded INTEGER DEFAULT 0,
    emails_failed   INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_sessions_date     ON sessions(date);
CREATE INDEX IF NOT EXISTS idx_sessions_visitor  ON sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user     ON sessions(user_id);

CREATE TABLE IF NOT EXISTS daily_stats (
    date                TEXT PRIMARY KEY,
    unique_visitors     INTEGER DEFAULT 0,
    tool_opens          INTEGER DEFAULT 0,
    templates_uploaded  INTEGER DEFAULT 0,
    csv_imports         INTEGER DEFAULT 0,
    certs_generated     INTEGER DEFAULT 0,
    cert_count          INTEGER DEFAULT 0,
    zip_downloads       INTEGER DEFAULT 0,
    oauth_started       INTEGER DEFAULT 0,
    oauth_success       INTEGER DEFAULT 0,
    oauth_failed        INTEGER DEFAULT 0,
    email_attempts      INTEGER DEFAULT 0,
    email_success       INTEGER DEFAULT 0,
    email_failed        INTEGER DEFAULT 0
);
"""

# ─────────────────────────────────────────────
# Connection helpers
# ─────────────────────────────────────────────

def _get_sqlite_conn():
    import sqlite3
    conn = sqlite3.connect(_SQLITE_PATH, timeout=5)
    conn.row_factory = sqlite3.Row
    return conn


def _get_pg_conn():
    import psycopg2
    import psycopg2.extras
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = False
    return conn


def _placeholder(use_pg: bool) -> str:
    """Return %s for Postgres, ? for SQLite."""
    return "%s" if use_pg else "?"


@contextmanager
def get_db():
    """
    Context manager that yields (conn, cursor, use_pg).
    Commits on success, rolls back on exception, always closes.
    Yields (None, None, False) when no DB is available — callers must guard.
    """
    global _db_available
    if _db_available is False:
        yield None, None, False
        return

    try:
        if _USE_POSTGRES:
            conn = _get_pg_conn()
            cur = conn.cursor()
            use_pg = True
        else:
            conn = _get_sqlite_conn()
            cur = conn.cursor()
            use_pg = False

        _db_available = True
        try:
            yield conn, cur, use_pg
            conn.commit()
        except Exception:
            try:
                conn.rollback()
            except Exception:
                pass
            raise
        finally:
            try:
                cur.close()
            except Exception:
                pass
            try:
                conn.close()
            except Exception:
                pass

    except Exception as e:
        logger.error("Analytics DB unavailable: %s", e)
        _db_available = False
        yield None, None, False


def init_db():
    """Create tables if they don't exist. Called once at startup."""
    global _db_available
    try:
        with get_db() as (conn, cur, use_pg):
            if conn is None:
                return False
            schema = _SCHEMA_POSTGRES if use_pg else _SCHEMA_SQLITE
            if use_pg:
                # Execute Postgres statements one at a time
                for stmt in schema.strip().split(";"):
                    s = stmt.strip()
                    if s:
                        cur.execute(s)
            else:
                cur.executescript(schema)
        _db_available = True
        logger.info("Analytics DB initialised (%s)", "postgres" if _USE_POSTGRES else "sqlite")
        return True
    except Exception as e:
        logger.error("Analytics DB init failed: %s", e)
        _db_available = False
        return False

# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────

def _now_ts() -> int:
    return int(time.time() * 1000)


def _today() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def _date_from_ts(ts_ms: int) -> str:
    return datetime.fromtimestamp(ts_ms / 1000, tz=timezone.utc).strftime("%Y-%m-%d")


def _new_id() -> str:
    return str(uuid.uuid4())


def _hash_id(value: str) -> str:
    """One-way hash for visitor/user IDs — never store raw emails in events table."""
    return hashlib.sha256(value.encode()).hexdigest()[:16]


def _safe_meta(meta: Optional[dict]) -> Optional[str]:
    if not meta:
        return None
    try:
        # Remove any keys that look like PII before persisting
        safe = {k: v for k, v in meta.items()
                if k not in ("email", "password", "token", "refresh_token", "recipient")}
        return json.dumps(safe)
    except Exception:
        return None


# ─────────────────────────────────────────────
# Core write operations
# ─────────────────────────────────────────────

def record_event(
    event_name: str,
    visitor_id: Optional[str] = None,
    user_id: Optional[str] = None,
    session_id: Optional[str] = None,
    source: str = "frontend",
    success: bool = True,
    error_code: Optional[str] = None,
    meta: Optional[dict] = None,
) -> bool:
    """
    Insert one analytics event row.
    Also updates the daily_stats counter for the matching column.
    Never raises — returns False silently on failure.
    """
    ts = _now_ts()
    date = _today()
    event_id = _new_id()

    # Map event_name → daily_stats column
    _COUNTER_MAP = {
        "page_viewed":                    None,
        "tool_opened":                    "tool_opens",
        "template_selected":              "templates_uploaded",
        "csv_uploaded":                   "csv_imports",
        "certificate_generation_started": None,
        "certificate_generated":          "certs_generated",
        "certificate_downloaded":         "zip_downloads",
        "google_oauth_started":           "oauth_started",
        "google_oauth_success":           "oauth_success",
        "google_oauth_failed":            "oauth_failed",
        "email_send_started":             "email_attempts",
        "email_send_completed":           "email_success",
        "email_send_failed":              "email_failed",
    }
    counter_col = _COUNTER_MAP.get(event_name)

    try:
        with get_db() as (conn, cur, use_pg):
            if conn is None:
                return False
            ph = _placeholder(use_pg)

            # Insert event
            cur.execute(
                f"""INSERT INTO events
                    (id, ts, date, event_name, visitor_id, user_id,
                     session_id, source, success, error_code, meta)
                    VALUES ({ph},{ph},{ph},{ph},{ph},{ph},{ph},{ph},{ph},{ph},{ph})""",
                (event_id, ts, date, event_name, visitor_id, user_id,
                 session_id, source, 1 if success else 0, error_code,
                 _safe_meta(meta))
            )

            # Upsert daily_stats counter
            if counter_col:
                if use_pg:
                    cur.execute(
                        f"""INSERT INTO daily_stats (date, {counter_col})
                            VALUES (%s, 1)
                            ON CONFLICT (date) DO UPDATE
                            SET {counter_col} = daily_stats.{counter_col} + 1""",
                        (date,)
                    )
                else:
                    cur.execute(
                        f"""INSERT INTO daily_stats (date, {counter_col})
                            VALUES (?, 1)
                            ON CONFLICT(date) DO UPDATE
                            SET {counter_col} = {counter_col} + 1""",
                        (date,)
                    )

            # cert_count is a sum, not a simple count
            if event_name == "certificate_generated" and meta and isinstance(meta.get("certificates_count"), int):
                cnt = meta["certificates_count"]
                if use_pg:
                    cur.execute(
                        """INSERT INTO daily_stats (date, cert_count)
                           VALUES (%s, %s)
                           ON CONFLICT (date) DO UPDATE
                           SET cert_count = daily_stats.cert_count + EXCLUDED.cert_count""",
                        (date, cnt)
                    )
                else:
                    cur.execute(
                        """INSERT INTO daily_stats (date, cert_count)
                           VALUES (?, ?)
                           ON CONFLICT(date) DO UPDATE
                           SET cert_count = cert_count + ?""",
                        (date, cnt, cnt)
                    )

        return True
    except Exception as e:
        logger.error("record_event failed (%s): %s", event_name, e)
        return False

def record_unique_visitor(visitor_id: str, date: Optional[str] = None) -> bool:
    """
    Increments unique_visitors in daily_stats only if this visitor_id
    has not been seen today (idempotent).
    """
    if not visitor_id:
        return False
    today = date or _today()
    try:
        with get_db() as (conn, cur, use_pg):
            if conn is None:
                return False
            ph = _placeholder(use_pg)

            # Check if already seen today
            cur.execute(
                f"SELECT 1 FROM events WHERE visitor_id={ph} AND date={ph} AND event_name='page_viewed' LIMIT 1",
                (visitor_id, today)
            )
            already_seen = cur.fetchone() is not None

            # Insert the page_viewed event regardless
            cur.execute(
                f"""INSERT INTO events (id, ts, date, event_name, visitor_id, source)
                    VALUES ({ph},{ph},{ph},'page_viewed',{ph},'frontend')""",
                (_new_id(), _now_ts(), today, visitor_id)
            )

            if not already_seen:
                if use_pg:
                    cur.execute(
                        """INSERT INTO daily_stats (date, unique_visitors)
                           VALUES (%s, 1)
                           ON CONFLICT (date) DO UPDATE
                           SET unique_visitors = daily_stats.unique_visitors + 1""",
                        (today,)
                    )
                else:
                    cur.execute(
                        """INSERT INTO daily_stats (date, unique_visitors)
                           VALUES (?, 1)
                           ON CONFLICT(date) DO UPDATE
                           SET unique_visitors = unique_visitors + 1""",
                        (today,)
                    )
        return True
    except Exception as e:
        logger.error("record_unique_visitor failed: %s", e)
        return False


def upsert_session(
    session_id: str,
    visitor_id: Optional[str] = None,
    user_id: Optional[str] = None,
    user_email: Optional[str] = None,
    updates: Optional[dict] = None,
) -> bool:
    """
    Create or update an analytics session row.
    'updates' is a dict of column_name -> value for integer increment columns.
    Supported increment keys: tool_opened, template_used, csv_imported,
    certs_generated, emails_attempted, emails_succeeded, emails_failed,
    is_google_authed.
    """
    ts = _now_ts()
    today = _today()
    updates = updates or {}

    allowed_cols = {
        "tool_opened", "template_used", "csv_imported",
        "certs_generated", "emails_attempted", "emails_succeeded",
        "emails_failed", "is_google_authed"
    }
    increment_cols = {k: v for k, v in updates.items() if k in allowed_cols}

    try:
        with get_db() as (conn, cur, use_pg):
            if conn is None:
                return False
            ph = _placeholder(use_pg)

            # Check if session exists
            cur.execute(f"SELECT id FROM sessions WHERE id={ph}", (session_id,))
            exists = cur.fetchone() is not None

            if not exists:
                cur.execute(
                    f"""INSERT INTO sessions
                        (id, visitor_id, user_id, user_email,
                         started_at, last_active_at, date)
                        VALUES ({ph},{ph},{ph},{ph},{ph},{ph},{ph})""",
                    (session_id, visitor_id, user_id, user_email, ts, ts, today)
                )
            else:
                # Update user_id/email if now known
                set_parts = [f"last_active_at={ph}"]
                params = [ts]
                if user_id:
                    set_parts.append(f"user_id={ph}")
                    params.append(user_id)
                if user_email:
                    set_parts.append(f"user_email={ph}")
                    params.append(user_email)
                params.append(session_id)
                cur.execute(
                    f"UPDATE sessions SET {', '.join(set_parts)} WHERE id={ph}",
                    params
                )

            # Apply increments
            for col, val in increment_cols.items():
                if isinstance(val, int) and val > 0:
                    cur.execute(
                        f"UPDATE sessions SET {col}={col}+{ph} WHERE id={ph}",
                        (val, session_id)
                    )
                elif isinstance(val, bool) and val:
                    cur.execute(
                        f"UPDATE sessions SET {col}=1 WHERE id={ph}",
                        (session_id,)
                    )
        return True
    except Exception as e:
        logger.error("upsert_session failed: %s", e)
        return False

# ─────────────────────────────────────────────
# Admin read operations
# ─────────────────────────────────────────────

def _date_range_condition(use_pg: bool, range_type: str) -> tuple:
    """
    Returns (sql_condition_string, params_list) for WHERE clauses.
    range_type: 'today' | '7d' | '30d' | 'all'
    """
    today = _today()
    if range_type == "today":
        ph = "%s" if use_pg else "?"
        return f"date = {ph}", [today]
    elif range_type in ("7d", "30d"):
        days = 7 if range_type == "7d" else 30
        cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).strftime("%Y-%m-%d")
        ph = "%s" if use_pg else "?"
        return f"date >= {ph}", [cutoff]
    else:
        return "1=1", []


def get_overview(range_type: str = "all") -> dict:
    """
    Returns aggregated KPI numbers for the overview section.
    """
    empty = {
        "unique_visitors": 0, "tool_opens": 0, "templates_uploaded": 0,
        "csv_imports": 0, "certs_generated": 0, "cert_count": 0,
        "zip_downloads": 0, "oauth_started": 0, "oauth_success": 0,
        "oauth_failed": 0, "email_attempts": 0, "email_success": 0,
        "email_failed": 0, "db_available": False,
    }
    try:
        with get_db() as (conn, cur, use_pg):
            if conn is None:
                return empty

            cond, params = _date_range_condition(use_pg, range_type)
            cur.execute(
                f"""SELECT
                    COALESCE(SUM(unique_visitors),0)    as unique_visitors,
                    COALESCE(SUM(tool_opens),0)         as tool_opens,
                    COALESCE(SUM(templates_uploaded),0) as templates_uploaded,
                    COALESCE(SUM(csv_imports),0)        as csv_imports,
                    COALESCE(SUM(certs_generated),0)    as certs_generated,
                    COALESCE(SUM(cert_count),0)         as cert_count,
                    COALESCE(SUM(zip_downloads),0)      as zip_downloads,
                    COALESCE(SUM(oauth_started),0)      as oauth_started,
                    COALESCE(SUM(oauth_success),0)      as oauth_success,
                    COALESCE(SUM(oauth_failed),0)       as oauth_failed,
                    COALESCE(SUM(email_attempts),0)     as email_attempts,
                    COALESCE(SUM(email_success),0)      as email_success,
                    COALESCE(SUM(email_failed),0)       as email_failed
                    FROM daily_stats WHERE {cond}""",
                params
            )
            row = cur.fetchone()
            if row is None:
                return {**empty, "db_available": True}

            if use_pg:
                keys = [desc[0] for desc in cur.description]
                result = dict(zip(keys, row))
            else:
                result = dict(row)

            result["db_available"] = True
            return result
    except Exception as e:
        logger.error("get_overview failed: %s", e)
        return empty


def get_daily_trend(days: int = 30) -> list:
    """Returns per-day stats for the trend chart."""
    try:
        cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).strftime("%Y-%m-%d")
        with get_db() as (conn, cur, use_pg):
            if conn is None:
                return []
            ph = "%s" if use_pg else "?"
            cur.execute(
                f"""SELECT date, unique_visitors, tool_opens, certs_generated,
                    cert_count, email_attempts, email_success, email_failed,
                    oauth_success
                    FROM daily_stats WHERE date >= {ph}
                    ORDER BY date ASC""",
                (cutoff,)
            )
            rows = cur.fetchall()
            if use_pg:
                keys = [d[0] for d in cur.description]
                return [dict(zip(keys, r)) for r in rows]
            return [dict(r) for r in rows]
    except Exception as e:
        logger.error("get_daily_trend failed: %s", e)
        return []


def get_recent_events(limit: int = 50) -> list:
    """Returns recent events for the activity feed."""
    try:
        with get_db() as (conn, cur, use_pg):
            if conn is None:
                return []
            ph = "%s" if use_pg else "?"
            cur.execute(
                f"""SELECT id, ts, event_name, visitor_id, user_id,
                    session_id, source, success, error_code, meta
                    FROM events
                    ORDER BY ts DESC LIMIT {ph}""",
                (limit,)
            )
            rows = cur.fetchall()
            if use_pg:
                keys = [d[0] for d in cur.description]
                return [dict(zip(keys, r)) for r in rows]
            return [dict(r) for r in rows]
    except Exception as e:
        logger.error("get_recent_events failed: %s", e)
        return []


def get_user_list(limit: int = 100, offset: int = 0) -> list:
    """Returns authenticated users with aggregated activity."""
    try:
        with get_db() as (conn, cur, use_pg):
            if conn is None:
                return []
            lph = "%s" if use_pg else "?"
            cur.execute(
                f"""SELECT
                    user_id, user_email,
                    MIN(started_at)     as first_seen,
                    MAX(last_active_at) as last_active,
                    MAX(is_google_authed) as google_authed,
                    SUM(certs_generated)  as total_certs,
                    SUM(emails_attempted) as total_email_attempts,
                    SUM(emails_succeeded) as total_email_success,
                    SUM(emails_failed)    as total_email_failed
                    FROM sessions
                    WHERE user_id IS NOT NULL
                    GROUP BY user_id, user_email
                    ORDER BY MAX(last_active_at) DESC
                    LIMIT {lph} OFFSET {lph}""",
                (limit, offset)
            )
            rows = cur.fetchall()
            if use_pg:
                keys = [d[0] for d in cur.description]
                return [dict(zip(keys, r)) for r in rows]
            return [dict(r) for r in rows]
    except Exception as e:
        logger.error("get_user_list failed: %s", e)
        return []


def get_user_journey(user_id: str) -> list:
    """Returns the ordered event timeline for a specific user."""
    try:
        with get_db() as (conn, cur, use_pg):
            if conn is None:
                return []
            ph = "%s" if use_pg else "?"
            cur.execute(
                f"""SELECT ts, event_name, source, success, error_code, meta
                    FROM events
                    WHERE user_id={ph} OR visitor_id={ph}
                    ORDER BY ts ASC LIMIT 200""",
                (user_id, user_id)
            )
            rows = cur.fetchall()
            if use_pg:
                keys = [d[0] for d in cur.description]
                return [dict(zip(keys, r)) for r in rows]
            return [dict(r) for r in rows]
    except Exception as e:
        logger.error("get_user_journey failed: %s", e)
        return []


def get_health() -> dict:
    """Quick health/diagnostics check."""
    try:
        with get_db() as (conn, cur, use_pg):
            if conn is None:
                return {"db_available": False, "backend": "none"}
            cur.execute("SELECT COUNT(*) FROM events")
            row = cur.fetchone()
            total = row[0] if row else 0
            return {
                "db_available": True,
                "backend": "postgres" if use_pg else "sqlite",
                "total_events": total,
            }
    except Exception as e:
        return {"db_available": False, "backend": "error", "error": str(e)}
