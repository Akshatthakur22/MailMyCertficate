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
}

export interface AuthLoginResponse {
  authorization_url: string;
  state: string;
  csrf_token: string;
  error?: string;
}

// Persist CSRF token across refreshes
let csrfToken: string | null =
  typeof window !== 'undefined'
    ? localStorage.getItem('csrf_token')
    : null;

// Update CSRF token (for OAuth callback refresh)
export const updateCsrfToken = (newToken: string) => {
  csrfToken = newToken;
};

export const emailService = {
  // Authentication endpoints
  async login(): Promise<AuthLoginResponse> {
    try {
      const response = await fetch('/api/auth/login', { credentials: 'include' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store CSRF token
      csrfToken = data.csrf_token;

      if (typeof window !== 'undefined') {
        localStorage.setItem('csrf_token', data.csrf_token);
      }

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Login failed'
      );
    }
  },

  async getStatus(): Promise<AuthStatusResponse> {
    try {
      const response = await fetch('/api/auth/status', { credentials: 'include' });
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
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Attach CSRF token
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Logout failed');
      }

      // Clear token after logout
      csrfToken = null;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('csrf_token');
      }

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
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Attach CSRF token
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers,
        credentials: 'include',
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

      const headers: Record<string, string> = {};

      // Attach CSRF token
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers,
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