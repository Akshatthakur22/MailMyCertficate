export type Alignment = 'left' | 'center' | 'right';

export interface Field {
    id: string; // Unique ID (e.g., column name or generated)
    columnName: string; // From CSV
    x: number; // Percentage or absolute? Image coords. Prompt says "Map Fabric-style coordinates". So absolute pixels (image dimensions).
    y: number; // Absolute pixels (image dimensions)
    width: number; // Constraints
    fontSize: number;
    fontFamily: string; // 'Inter' | 'Roboto' | ...
    color: string; // Hex
    align: Alignment;
}
