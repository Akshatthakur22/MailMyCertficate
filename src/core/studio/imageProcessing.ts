/**
 * Strips paper background from scanned or photographed ink signatures using luminance thresholding.
 * Formula:
 * Luminance = 0.299 * R + 0.587 * G + 0.114 * B
 * Alpha = clamp((255 - Luminance) / Threshold, 0, 1)
 */
export async function removePaperBackground(
    imageSrc: string | Blob,
    threshold: number = 60 // 1 to 255 sensitivity
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Canvas 2D context not available'));
                return;
            }

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            const t = Math.max(1, Math.min(255, threshold));

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Calculate human-perceived luminance (ITU-R BT.601)
                const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

                // Ink is dark (low luminance), paper is bright (high luminance)
                // Normalize darkness relative to threshold
                const darkness = 255 - luminance;
                let alpha = darkness / t;

                if (alpha < 0.15) {
                    alpha = 0; // Clear paper texture
                } else if (alpha > 1) {
                    alpha = 1;
                }

                // Preserve original ink color or deepen to crisp black/blue
                data[i + 3] = Math.round(alpha * 255);
            }

            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };

        img.onerror = (e) => reject(new Error('Failed to load image for background removal'));

        if (imageSrc instanceof Blob) {
            img.src = URL.createObjectURL(imageSrc);
        } else {
            img.src = imageSrc;
        }
    });
}

/**
 * Creates dynamic shape masks (circle, pill, rounded rect) on an image
 */
export async function applyShapeMask(
    imageSrc: string | Blob,
    shape: 'none' | 'circle' | 'pill' | 'rounded',
    options: {
        borderRadius?: number;
        borderWidth?: number;
        borderColor?: string;
    } = {}
): Promise<string> {
    if (shape === 'none') {
        if (typeof imageSrc === 'string') return imageSrc;
        return URL.createObjectURL(imageSrc);
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            const w = img.naturalWidth || img.width;
            const h = img.naturalHeight || img.height;
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Canvas 2D context not available'));
                return;
            }

            ctx.save();
            ctx.beginPath();

            if (shape === 'circle') {
                const radius = Math.min(w, h) / 2;
                ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
            } else if (shape === 'pill') {
                const r = Math.min(w, h) / 2;
                ctx.roundRect(0, 0, w, h, r);
            } else if (shape === 'rounded') {
                const r = options.borderRadius || 16;
                ctx.roundRect(0, 0, w, h, r);
            }

            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, 0, 0, w, h);

            // Draw optional border stroke
            if (options.borderWidth && options.borderWidth > 0) {
                ctx.strokeStyle = options.borderColor || '#3B82F6';
                ctx.lineWidth = options.borderWidth;
                ctx.stroke();
            }

            ctx.restore();
            resolve(canvas.toDataURL('image/png'));
        };

        img.onerror = () => reject(new Error('Failed to load image for masking'));

        if (imageSrc instanceof Blob) {
            img.src = URL.createObjectURL(imageSrc);
        } else {
            img.src = imageSrc;
        }
    });
}
