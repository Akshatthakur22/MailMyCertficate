export interface LoadedTemplate {
    base64: string;
    width: number;
    height: number;
}

export const loadTemplate = (file: File): Promise<LoadedTemplate> => {
    return new Promise((resolve, reject) => {
        // Validate type first
        if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
            reject(new Error("Invalid file type. Only JPG and PNG are supported."));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            if (!result) {
                reject(new Error("Failed to read file."));
                return;
            }

            const img = new Image();
            img.onload = () => {
                resolve({
                    base64: result,
                    width: img.width,
                    height: img.height,
                });
            };
            img.onerror = () => reject(new Error("Failed to load image."));
            img.src = result;
        };
        reader.onerror = () => reject(new Error("Error reading file."));
        reader.readAsDataURL(file);
    });
};
