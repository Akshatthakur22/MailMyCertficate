const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HEADER_SCORES: Array<{ test: (header: string) => boolean; score: number }> = [
  { test: (h) => /^e[-_]?mail$/i.test(h), score: 100 },
  { test: (h) => /^recipient[-_]?email$/i.test(h), score: 95 },
  { test: (h) => /^participant[-_]?email$/i.test(h), score: 90 },
  { test: (h) => /^student[-_]?email$/i.test(h), score: 90 },
  { test: (h) => /^mail$/i.test(h), score: 80 },
  { test: (h) => /email/i.test(h), score: 70 },
  { test: (h) => /^to$/i.test(h), score: 50 },
  { test: (h) => /recipient/i.test(h) && !/name/i.test(h), score: 45 },
];

export function isValidEmail(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && EMAIL_REGEX.test(trimmed);
}

export function normalizeEmail(value: string): string {
  return value.trim();
}

export function getFieldCaseInsensitive(
  data: Record<string, unknown>,
  key: string
): unknown {
  if (key in data) return data[key];
  const lower = key.toLowerCase();
  const match = Object.entries(data).find(([k]) => k.toLowerCase() === lower);
  return match?.[1];
}

export function buildTemplateText(
  template: string,
  data: Record<string, unknown>
): string {
  return template.replace(/{{(\w+)}}/g, (_, key) =>
    String(getFieldCaseInsensitive(data, key) ?? '')
  );
}

function headerNameScore(header: string): number {
  const normalized = header.trim();
  let score = 0;
  for (const { test, score: value } of HEADER_SCORES) {
    if (test(normalized)) score = Math.max(score, value);
  }
  if (/^name$/i.test(normalized) || (/name/i.test(normalized) && !/mail|email/i.test(normalized))) {
    score -= 60;
  }
  return score;
}

function contentScore(
  header: string,
  rows: Array<Record<string, unknown>>,
  sampleSize: number
): { validRatio: number; validCount: number } {
  const sample = rows.slice(0, sampleSize);
  if (sample.length === 0) return { validRatio: 0, validCount: 0 };

  let validCount = 0;
  for (const row of sample) {
    if (isValidEmail(row[header])) validCount += 1;
  }

  return { validRatio: validCount / sample.length, validCount };
}

export interface EmailColumnDetection {
  column: string | null;
  /** When multiple columns look like email fields */
  ambiguousColumns: string[];
  scores: Array<{ header: string; score: number; validRatio: number }>;
}

export function detectEmailColumn(
  headers: string[],
  rows: Array<Record<string, unknown>>,
  sampleSize = 25
): EmailColumnDetection {
  if (headers.length === 0) {
    return { column: null, ambiguousColumns: [], scores: [] };
  }

  const scores = headers.map((header) => {
    const { validRatio, validCount } = contentScore(header, rows, sampleSize);
    const score = headerNameScore(header) + validRatio * 100;
    return { header, score, validRatio, validCount };
  });

  scores.sort((a, b) => b.score - a.score);

  const best = scores[0];
  if (!best || best.validRatio < 0.5) {
    return { column: null, ambiguousColumns: [], scores };
  }

  const strongCandidates = scores.filter(
    (entry) => entry.validRatio >= 0.8 && entry.score >= best.score - 8
  );

  const ambiguousColumns =
    strongCandidates.length > 1
      ? strongCandidates.map((entry) => entry.header)
      : [];

  return {
    column: best.header,
    ambiguousColumns,
    scores,
  };
}

export function detectNameColumn(headers: string[]): string | null {
  const priority = [
    'name',
    'full_name',
    'fullname',
    'participant',
    'student',
    'attendee',
  ];

  const normalizedHeaders = headers.map((h) => ({
    original: h,
    key: h.toLowerCase().replace(/[\s-]/g, '_'),
  }));

  for (const candidate of priority) {
    const match = normalizedHeaders.find((h) => h.key === candidate);
    if (match) return match.original;
  }

  const loose = normalizedHeaders.find(
    (h) =>
      /name/i.test(h.original) &&
      !/email|mail|company|organization|college|event/i.test(h.original)
  );
  return loose?.original ?? null;
}

export function resolveRecipientEmail(
  rowData: Record<string, unknown>,
  emailColumn: string
): string {
  const raw = rowData[emailColumn];
  return typeof raw === 'string' ? normalizeEmail(raw) : '';
}

export function getDisplayName(
  rowData: Record<string, unknown>,
  nameColumn: string | null
): string {
  if (nameColumn) {
    const value = rowData[nameColumn];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }

  for (const key of ['name', 'Name', 'fullName', 'FullName', 'participant', 'Participant']) {
    const value = rowData[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }

  return 'Participant';
}

export interface RecipientValidationSummary {
  valid: number;
  invalid: number;
  invalidExamples: string[];
}

export function summarizeRecipientValidation(
  rows: Array<Record<string, unknown>>,
  emailColumn: string
): RecipientValidationSummary {
  let valid = 0;
  let invalid = 0;
  const invalidExamples: string[] = [];

  for (const row of rows) {
    const email = resolveRecipientEmail(row, emailColumn);
    if (isValidEmail(email)) {
      valid += 1;
    } else {
      invalid += 1;
      if (invalidExamples.length < 3) {
        invalidExamples.push(email || '(empty)');
      }
    }
  }

  return { valid, invalid, invalidExamples };
}
