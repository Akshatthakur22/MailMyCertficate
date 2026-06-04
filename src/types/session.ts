export type WorkflowStage =
  | 'UPLOAD'
  | 'GENERATE'
  | 'DOWNLOAD'
  | 'EMAIL_SETUP'
  | 'SENDING'
  | 'COMPLETED';

export type EmailStatus = 'none' | 'partial' | 'complete';

export interface SessionSummary {
  sessionId: string;
  createdAt: number;
  lastActivity: number;
  updatedAt: number;
  workflowStage: WorkflowStage;
  workflowStageLabel: string;
  certificatesCount: number;
  recipientsCount: number;
  emailStatus: EmailStatus;
  currentStep: number;
  hasTemplate: boolean;
  hasCsv: boolean;
  expired: boolean;
}

export const WORKFLOW_STAGE_LABELS: Record<WorkflowStage, string> = {
  UPLOAD: 'Upload template & data',
  GENERATE: 'Generate certificates',
  DOWNLOAD: 'Download ZIP',
  EMAIL_SETUP: 'Set up email delivery',
  SENDING: 'Sending emails',
  COMPLETED: 'Batch complete',
};
