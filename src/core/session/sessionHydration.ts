import { db } from '@/core/db/schema';
import { useAppStore } from '@/store/useAppStore';
import { loadTemplate } from '@/services/templateService';

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Restore in-memory Zustand preview state from IndexedDB for the active session.
 */
export async function hydrateSessionFromIDB(sessionId: string): Promise<void> {
  const session = await db.sessions.get(sessionId);
  const templateFile = await db.files.get(`${sessionId}-template`);

  if (templateFile?.blob) {
    try {
      const file = new File([templateFile.blob], 'template', {
        type: templateFile.blob.type || 'image/png',
      });
      const { base64, width, height } = await loadTemplate(file);
      const dimensions =
        session?.templateDimensions ?? useAppStore.getState().templateDimensions ?? { width, height };
      useAppStore.getState().setTemplate(base64, dimensions);
    } catch {
      const dataUrl = await blobToDataUrl(templateFile.blob);
      useAppStore.getState().setTemplate(dataUrl, session?.templateDimensions ?? null);
    }
  }

  const rows = await db.rows.where({ sessionId }).toArray();
  if (rows.length > 0) {
    const data = rows.map((row) => row.data);
    const headersFromStore = useAppStore.getState().csvHeaders;
    const headers =
      headersFromStore.length > 0
        ? headersFromStore
        : Object.keys(data[0] ?? {}).filter((key) => key !== '__rowIndex');
    useAppStore.getState().setCsvData(data);
    if (headers.length > 0) {
      useAppStore.getState().setCsvHeaders(headers);
    }
  }
}
