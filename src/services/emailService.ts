import type { Field } from '@/types/field';
import type { CSVRow } from '@/types/csv';

export interface EmailPayload {
    recipients: string[]; // List of emails to send to
    subject: string;
    body: string; // HTML allowed?
    template: string; // Base64
    fields: Field[]; // Position data
    csvData: CSVRow[]; // Full data to prevent regeneration on backend if needed
}

export const sendEmails = async (payload: EmailPayload): Promise<{ success: boolean; message: string }> => {
    try {
        // In a real app with backend:
        /*
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
    
        if (!response.ok) {
            throw new Error(`Failed to send emails: ${response.statusText}`);
        }
    
        return await response.json();
        */

        // Simulate logging
        console.log("Simulating Email Send:", payload);
        return Promise.resolve({ success: true, message: "Emails queued successfully (Simulated)" });

    } catch (error) {
        console.error("Email Service Error:", error);
        throw error;
    }
};
