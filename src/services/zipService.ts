import JSZip from 'jszip';

interface FileEntry {
    name: string;
    content: Uint8Array;
}

export const generateZip = async (files: FileEntry[]): Promise<Blob> => {
    const zip = new JSZip();

    files.forEach((file) => {
        zip.file(file.name, file.content);
    });

    return await zip.generateAsync({ type: 'blob' });
};
