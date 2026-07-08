import { USER_PLAN } from '@/config/analytics';
import type { AnalyticsEvent, UserPlan } from '@/lib/analytics/types';

export interface EmailRequest {
  recipient: string;
  subject: string;
  body: string;
}

export interface EmailWithAttachmentRequest extends EmailRequest {
  certificate: Uint8Array;
}

export interface EmailResponse {
  success: boolean;
  message_id?: string;
  recipient?: string;
  error?: string;
}

export interface AuthStatusResponse {
  authenticated: boolean;
  email: string | null;
  csrf_token?: string;
}

export interface AuthLoginResponse {
  authorization_url: string;
  state: string;
  csrf_token: string;
  error?: string;
}

// ✅ CSRF tokens MUST come from server-set HTTPOnly cookies, NOT localStorage
// Never store security tokens in accessible storage
export const updateCsrfToken = (newToken: string) => {
  // Server manages CSRF token in HTTPOnly cookie
  // Frontend acknowledges receipt but does NOT store it
  console.debug('[Auth] Server provided CSRF token in secure cookie');
};

export const emailService = {
  // Authentication endpoints
  async login(): Promise<AuthLoginResponse> {
    try {
      const response = await fetch('/api/auth/login', { 
        credentials: 'include' // Automatically includes HTTPOnly cookies
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // ✅ Trust server-set HTTPOnly cookie for CSRF
      // Do NOT manually store the token
      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Login failed'
      );
    }
  },

  async getStatus(): Promise<AuthStatusResponse> {
    try {
      const response = await fetch('/api/auth/status', { 
        credentials: 'include'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Status check failed');
      }

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Status check failed'
      );
    }
  },

  async logout(): Promise<{ success: boolean }> {
    try {
      // ✅ Send POST to logout endpoint
      // Server will clear HTTPOnly cookie
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include HTTPOnly cookie
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Logout failed');
      }

      // ✅ Server handles cleanup; client doesn't need to do anything
      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Logout failed'
      );
    }
  },

  // Email sending endpoint
  async sendEmail(emailRequest: EmailRequest): Promise<EmailResponse> {
    try {
      // ✅ CSRF token sent via HTTPOnly cookie automatically
      // No manual header insertion needed
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Browser automatically includes HTTPOnly cookies
        body: JSON.stringify(emailRequest),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Email sending failed');
      }

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Email sending failed'
      );
    }
  },

  // Email sending with attachment
  async sendEmailWithAttachment(emailRequest: EmailWithAttachmentRequest): Promise<EmailResponse> {
    try {
      const formData = new FormData();
      
      // Add email fields
      formData.append('recipient', emailRequest.recipient);
      formData.append('subject', emailRequest.subject);
      formData.append('body', emailRequest.body);
      
      // Add certificate as attachment
      const uint8Array = new Uint8Array(emailRequest.certificate);
      const pdfBlob = new Blob([uint8Array], { type: 'application/pdf' });
      formData.append('attachment', pdfBlob, 'certificate.pdf');

      // ✅ HTTPOnly cookie sent automatically by browser
      const response = await fetch('/api/send-email', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Email sending failed');
      }

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Email sending failed'
      );
    }
  },

  // Batch email sending
  async sendBatchEmails(
    emailRequests: EmailRequest[]
  ): Promise<EmailResponse[]> {
    const results: EmailResponse[] = [];

    // Sequential sending to reduce Gmail rate-limit risk
    for (const request of emailRequests) {
      try {
        const result = await this.sendEmail(request);

        results.push(result);

        // Small delay between sends
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        results.push({
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Unknown error',
          recipient: request.recipient,
        });
      }
    }

    return results;
  },
};
