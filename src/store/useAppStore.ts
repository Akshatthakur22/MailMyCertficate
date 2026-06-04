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
    currentStep: number;

    // --- Transient UI State (Do Not Persist) ---
    csvData: CSVRow[]; // Loaded from IDB when needed
    isGenerating: boolean;
    generationProgress: number;
    errorState: string | null;
}

interface AppActions {
    setSessionId: (id: string) => void;
    setTemplate: (base64: string | null, dimensions: TemplateDimensions | null) => void;
    setCsvHeaders: (headers: string[]) => void;
    setCsvData: (data: CSVRow[]) => void;
    setFields: (fields: Field[]) => void;
    updateField: (id: string, updates: Partial<Field>) => void;
    addField: (field: Field) => void;
    removeField: (id: string) => void;
    setCurrentStep: (step: number) => void;

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
                currentStep: 1,

                isGenerating: false,
                generationProgress: 0,
                errorState: null,

                setSessionId: (id) => set({ sessionId: id }),

                setTemplate: (base64, dimensions) => set({ template: base64, templateDimensions: dimensions }),

                setCsvHeaders: (headers) => set({ csvHeaders: headers }),

                setCsvData: (data) => set({ csvData: data }),

                setFields: (fields) => set({ fields }),

                updateField: (id, updates) => set((state) => ({
                    fields: state.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
                })),

                addField: (field) => set((state) => ({ fields: [...state.fields, field] })),

                removeField: (id) => set((state) => ({ fields: state.fields.filter((f) => f.id !== id) })),

                setCurrentStep: (step) => set({ currentStep: step }),

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


