export interface TemplateDimensions {
    width: number;
    height: number;
}

export interface TemplateState {
    base64: string | null;
    dimensions: TemplateDimensions;
}
