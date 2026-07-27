import { formatPageDate, getPageDates, type DatedPath } from '@/data/pageDates';

type LastUpdatedProps = {
  path: DatedPath;
  className?: string;
};

/**
 * Renders a visible, machine-readable content freshness signal.
 *
 * The audit flagged that dateModified was passed into page metadata but never
 * shown to readers. Search engines and AI engines both weight visible dates, and
 * human readers use them to judge whether a guide is still current.
 */
export function LastUpdated({ path, className }: LastUpdatedProps) {
  const { published, modified } = getPageDates(path);

  return (
    <p className={className ?? 'text-sm text-secondary'}>
      <span className="sr-only">Content freshness: </span>
      Last updated{' '}
      <time dateTime={modified} className="font-medium text-foreground">
        {formatPageDate(modified)}
      </time>
      {published !== modified && (
        <>
          {' '}
          · First published{' '}
          <time dateTime={published}>{formatPageDate(published)}</time>
        </>
      )}
    </p>
  );
}
