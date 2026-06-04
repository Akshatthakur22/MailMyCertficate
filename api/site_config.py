"""
Central URL / CORS configuration for the Flask API (Vercel Python).
Mirrors src/config/site.ts — keep APP_URL aligned with NEXT_PUBLIC_APP_URL.
"""
import os

PRODUCTION_APP_URL = 'https://mailmycertificate.tech'


def get_app_url() -> str:
    for key in ('APP_URL', 'NEXT_PUBLIC_APP_URL', 'SITE_URL'):
        value = os.environ.get(key, '').strip()
        if value:
            return value.rstrip('/')

    # Production deploys: use custom domain, not the per-deployment *.vercel.app URL
    if os.environ.get('VERCEL_ENV') == 'production':
        prod_host = os.environ.get('VERCEL_PROJECT_PRODUCTION_URL', '').strip()
        if prod_host:
            return prod_host if prod_host.startswith('http') else f'https://{prod_host.rstrip("/")}'
        return PRODUCTION_APP_URL

    vercel_url = os.environ.get('VERCEL_URL', '').strip()
    if vercel_url:
        host = vercel_url if vercel_url.startswith('http') else f'https://{vercel_url}'
        return host.rstrip('/')

    if os.environ.get('FLASK_DEBUG') == '1' or os.environ.get('NODE_ENV') == 'development':
        return 'http://localhost:3000'

    return PRODUCTION_APP_URL


def get_oauth_redirect_uri() -> str:
    explicit = os.environ.get('OAUTH_REDIRECT_URI', '').strip()
    if explicit:
        return explicit
    return f'{get_app_url()}/api/auth/callback'


def get_allowed_origins() -> list[str]:
    origins: set[str] = {'http://localhost:3000', get_app_url()}

    extra = os.environ.get('ALLOWED_ORIGINS', '')
    for part in extra.split(','):
        part = part.strip()
        if part:
            origins.add(part.rstrip('/'))

    vercel_url = os.environ.get('VERCEL_URL', '').strip()
    if vercel_url and not vercel_url.startswith('http'):
        origins.add(f'https://{vercel_url.rstrip("/")}')
    elif vercel_url:
        origins.add(vercel_url.rstrip('/'))

    return sorted(origins)


def is_production() -> bool:
    if os.environ.get('FLASK_DEBUG') == '1':
        return False
    if os.environ.get('NODE_ENV') == 'development':
        return False
    return os.environ.get('VERCEL') == '1' or os.environ.get('NODE_ENV') == 'production'
