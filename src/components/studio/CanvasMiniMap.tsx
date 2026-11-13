'use client';

import { useRef, useEffect } from 'react';

interface CanvasMiniMapProps {
    templateSrc: string;
    templateWidth: number;
    templateHeight: number;
    scale: number;
    workspaceRef: React.RefObject<HTMLDivElement | null>;
}

export function CanvasMiniMap({
    templateSrc,
    templateWidth,
    templateHeight,
    scale,
    workspaceRef,
}: CanvasMiniMapProps) {
    const miniMapRef = useRef<HTMLDivElement>(null);
    const viewportRectRef = useRef<HTMLDivElement>(null);

    const miniMapWidth = 140;
    const miniMapHeight = (miniMapWidth * templateHeight) / templateWidth;

    useEffect(() => {
        const workspace = workspaceRef.current;
        if (!workspace) return;

        const updateMiniMap = () => {
            const vRect = viewportRectRef.current;
            if (!vRect) return;

            const scrollLeft = workspace.scrollLeft;
            const scrollTop = workspace.scrollTop;
            const clientWidth = workspace.clientWidth;
            const clientHeight = workspace.clientHeight;

            // Total canvas width in screen coords
            const totalWidth = templateWidth * scale;
            const totalHeight = templateHeight * scale;

            if (totalWidth <= 0 || totalHeight <= 0) return;

            const ratioX = miniMapWidth / totalWidth;
            const ratioY = miniMapHeight / totalHeight;

            const vx = Math.max(0, scrollLeft * ratioX);
            const vy = Math.max(0, scrollTop * ratioY);
            const vw = Math.min(miniMapWidth, clientWidth * ratioX);
            const vh = Math.min(miniMapHeight, clientHeight * ratioY);

            vRect.style.left = `${vx}px`;
            vRect.style.top = `${vy}px`;
            vRect.style.width = `${vw}px`;
            vRect.style.height = `${vh}px`;
        };

        updateMiniMap();
        workspace.addEventListener('scroll', updateMiniMap);
        window.addEventListener('resize', updateMiniMap);

        return () => {
            workspace.removeEventListener('scroll', updateMiniMap);
            window.removeEventListener('resize', updateMiniMap);
        };
    }, [scale, templateWidth, templateHeight, workspaceRef, miniMapWidth, miniMapHeight]);

    const handleMiniMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const workspace = workspaceRef.current;
        const miniMap = miniMapRef.current;
        if (!workspace || !miniMap) return;

        const rect = miniMap.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const totalWidth = templateWidth * scale;
        const totalHeight = templateHeight * scale;

        const targetScrollLeft = (clickX / miniMapWidth) * totalWidth - workspace.clientWidth / 2;
        const targetScrollTop = (clickY / miniMapHeight) * totalHeight - workspace.clientHeight / 2;

        workspace.scrollTo({
            left: Math.max(0, targetScrollLeft),
            top: Math.max(0, targetScrollTop),
            behavior: 'smooth',
        });
    };

    return (
        <div
            ref={miniMapRef}
            onClick={handleMiniMapClick}
            style={{ width: `${miniMapWidth}px`, height: `${miniMapHeight}px` }}
            className="fixed bottom-4 right-4 z-40 bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-border/80 overflow-hidden cursor-crosshair group transition-opacity hover:opacity-100 opacity-80"
            title="Mini-map navigator · Click or drag to pan"
        >
            {/* Background Thumbnail */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={templateSrc}
                alt="Mini-map"
                className="w-full h-full object-cover pointer-events-none select-none opacity-70"
            />

            {/* Viewport Box */}
            <div
                ref={viewportRectRef}
                className="absolute border-2 border-accent bg-accent/20 pointer-events-none rounded-[2px] transition-all duration-75"
            />
        </div>
    );
}
