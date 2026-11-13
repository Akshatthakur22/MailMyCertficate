import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { temporal } from 'zundo';
import type { CSVRow } from '@/types/csv';
import type { TemplateDimensions } from '@/types/template';
import type { Field } from '@/types/field';

interface AppState {
    // --- Session Identity ---
    sessionId: string;
    /** Bumped after session restore so step views re-sync from IDB */
    sessionHydrationVersion: number;

    // --- Input State (Persist only metadata) ---
    template: string | null; // This will now be a temporary preview URL or handled via IDB
    templateDimensions: TemplateDimensions | null;
    csvHeaders: string[];
    fields: Field[];
    verificationEnabled: boolean;
    verificationIds: Record<string, string>;
    currentStep: number;

    // --- Transient UI State (Do Not Persist) ---
    csvData: CSVRow[]; // Loaded from IDB when needed
    isGenerating: boolean;
    generationProgress: number;
    errorState: string | null;
    selectedFieldIds: string[];
}

interface AppActions {
    setSessionId: (id: string) => void;
    setTemplate: (base64: string | null, dimensions: TemplateDimensions | null) => void;
    setCsvHeaders: (headers: string[]) => void;
    setCsvData: (data: CSVRow[]) => void;
    setFields: (fields: Field[]) => void;
    setVerificationEnabled: (enabled: boolean) => void;
    setVerificationIds: (ids: Record<string, string>) => void;
    updateField: (id: string, updates: Partial<Field>) => void;
    updateMultipleFields: (ids: string[], updates: Partial<Field> | ((f: Field) => Partial<Field>)) => void;
    addField: (field: Field) => void;
    removeField: (id: string) => void;
    removeMultipleFields: (ids: string[]) => void;
    setCurrentStep: (step: number) => void;

    setSelectedFieldIds: (ids: string[]) => void;
    toggleFieldSelection: (id: string) => void;
    groupSelectedFields: () => void;
    ungroupSelectedFields: () => void;
    alignSelectedFields: (alignType: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
    distributeSelectedFields: (axis: 'horizontal' | 'vertical') => void;

    setGenerationProgress: (progress: number) => void;
    setGenerating: (isGenerating: boolean) => void;
    setError: (error: string | null) => void;
    bumpSessionHydration: () => void;
    resetAll: () => void;
}

type AppStore = AppState & AppActions;

// Function to generate a simple session ID
const generateSessionId = () => Math.random().toString(36).substring(2, 11);

export const useAppStore = create<AppStore>()(
    temporal(
        persist(
            (set) => ({
                sessionId: generateSessionId(),
                sessionHydrationVersion: 0,
                template: null,
                templateDimensions: null,
                csvHeaders: [],
                csvData: [],
                fields: [],
                verificationEnabled: false,
                verificationIds: {},
                currentStep: 1,

                isGenerating: false,
                generationProgress: 0,
                errorState: null,
                selectedFieldIds: [],

                setSessionId: (id) => set({ sessionId: id }),

                setTemplate: (base64, dimensions) => set({ template: base64, templateDimensions: dimensions }),

                setCsvHeaders: (headers) => set({ csvHeaders: headers }),

                setCsvData: (data) => set({ csvData: data }),

                setFields: (fields) => set({ fields }),

                setVerificationEnabled: (enabled) => set({ verificationEnabled: enabled }),

                setVerificationIds: (ids) => set({ verificationIds: ids }),

                updateField: (id, updates) => set((state) => ({
                    fields: state.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
                })),

                updateMultipleFields: (ids, updates) => set((state) => {
                    const idSet = new Set(ids);
                    return {
                        fields: state.fields.map((f) => {
                            if (!idSet.has(f.id)) return f;
                            const u = typeof updates === 'function' ? updates(f) : updates;
                            return { ...f, ...u };
                        }),
                    };
                }),

                addField: (field) => set((state) => ({ 
                    fields: [...state.fields, field],
                    selectedFieldIds: [field.id],
                })),

                removeField: (id) => set((state) => ({
                    fields: state.fields.filter((f) => f.id !== id),
                    selectedFieldIds: state.selectedFieldIds.filter((selId) => selId !== id),
                })),

                removeMultipleFields: (ids) => set((state) => {
                    const idSet = new Set(ids);
                    return {
                        fields: state.fields.filter((f) => !idSet.has(f.id)),
                        selectedFieldIds: state.selectedFieldIds.filter((selId) => !idSet.has(selId)),
                    };
                }),

                setCurrentStep: (step) => set({ currentStep: step }),

                setSelectedFieldIds: (ids) => set({ selectedFieldIds: ids }),

                toggleFieldSelection: (id) => set((state) => {
                    const exists = state.selectedFieldIds.includes(id);
                    return {
                        selectedFieldIds: exists
                            ? state.selectedFieldIds.filter((item) => item !== id)
                            : [...state.selectedFieldIds, id],
                    };
                }),

                groupSelectedFields: () => set((state) => {
                    if (state.selectedFieldIds.length < 2) return state;
                    const newGroupId = `group-${Math.random().toString(36).substring(2, 9)}`;
                    const idSet = new Set(state.selectedFieldIds);
                    return {
                        fields: state.fields.map((f) => (idSet.has(f.id) ? { ...f, groupId: newGroupId } : f)),
                    };
                }),

                ungroupSelectedFields: () => set((state) => {
                    if (state.selectedFieldIds.length === 0) return state;
                    const idSet = new Set(state.selectedFieldIds);
                    return {
                        fields: state.fields.map((f) => (idSet.has(f.id) ? { ...f, groupId: undefined } : f)),
                    };
                }),

                alignSelectedFields: (alignType) => set((state) => {
                    const targetFields = state.fields.filter((f) => state.selectedFieldIds.includes(f.id));
                    if (targetFields.length < 2) return state;

                    const minX = Math.min(...targetFields.map((f) => f.x));
                    const maxX = Math.max(...targetFields.map((f) => f.x + (f.width || 0)));
                    const minY = Math.min(...targetFields.map((f) => f.y));
                    const maxY = Math.max(...targetFields.map((f) => f.y + (f.fontSize || 30)));
                    const centerX = (minX + maxX) / 2;
                    const centerY = (minY + maxY) / 2;

                    const targetMap = new Map<string, Partial<Field>>();
                    for (const f of targetFields) {
                        const w = f.width || 0;
                        const h = f.fontSize || 30;
                        if (alignType === 'left') targetMap.set(f.id, { x: minX });
                        else if (alignType === 'right') targetMap.set(f.id, { x: maxX - w });
                        else if (alignType === 'center') targetMap.set(f.id, { x: centerX - w / 2 });
                        else if (alignType === 'top') targetMap.set(f.id, { y: minY });
                        else if (alignType === 'bottom') targetMap.set(f.id, { y: maxY - h });
                        else if (alignType === 'middle') targetMap.set(f.id, { y: centerY - h / 2 });
                    }

                    return {
                        fields: state.fields.map((f) => {
                            const update = targetMap.get(f.id);
                            return update ? { ...f, ...update } : f;
                        }),
                    };
                }),

                distributeSelectedFields: (axis) => set((state) => {
                    const targetFields = state.fields
                        .filter((f) => state.selectedFieldIds.includes(f.id))
                        .sort((a, b) => (axis === 'horizontal' ? a.x - b.x : a.y - b.y));

                    if (targetFields.length < 3) return state;

                    const first = targetFields[0];
                    const last = targetFields[targetFields.length - 1];

                    const updates = new Map<string, Partial<Field>>();

                    if (axis === 'horizontal') {
                        const totalSpan = last.x - first.x;
                        const step = totalSpan / (targetFields.length - 1);
                        targetFields.forEach((f, index) => {
                            updates.set(f.id, { x: first.x + step * index });
                        });
                    } else {
                        const totalSpan = last.y - first.y;
                        const step = totalSpan / (targetFields.length - 1);
                        targetFields.forEach((f, index) => {
                            updates.set(f.id, { y: first.y + step * index });
                        });
                    }

                    return {
                        fields: state.fields.map((f) => {
                            const u = updates.get(f.id);
                            return u ? { ...f, ...u } : f;
                        }),
                    };
                }),

                setGenerationProgress: (progress) => set({ generationProgress: progress }),

                setGenerating: (isGenerating) => set({ isGenerating }),

                setError: (error) => set({ errorState: error }),

                bumpSessionHydration: () =>
                    set((state) => ({ sessionHydrationVersion: state.sessionHydrationVersion + 1 })),

                resetAll: () => {
                    import('@/core/session/sessionManager').then(({ startNewBatch }) => {
                        startNewBatch().catch(console.error);
                    });
                },
            }),
            {
                name: 'mailmycertificate-v2-storage',
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({
                    sessionId: state.sessionId,
                    templateDimensions: state.templateDimensions,
                    csvHeaders: state.csvHeaders,
                    fields: state.fields,
                    verificationEnabled: state.verificationEnabled,
                    verificationIds: state.verificationIds,
                    currentStep: state.currentStep,
                } as Partial<AppStore>),
            }
        ),
        {
            partialize: (state) => ({ fields: state.fields }),
            limit: 50, // Keep last 50 actions
        }
    )
);


