export interface EmailRequest {
  recipient: string;
  subject: string;
  body: string;
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
  error?: string;
}

export const emailService = {
  // Authentication endpoints
  async login(): Promise<AuthLoginResponse> {
    try {
      const response = await fetch('/api/auth/login');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  },

  async getStatus(): Promise<AuthStatusResponse> {
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Status check failed');
      }
      
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Status check failed');
    }
  },

  async logout(): Promise<{ success: boolean }> {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Logout failed');
      }
      
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Logout failed');
    }
  },

  // Email sending endpoint
  async sendEmail(emailRequest: EmailRequest): Promise<EmailResponse> {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailRequest),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Email sending failed');
      }
      
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Email sending failed');
    }
  },

  // Batch email sending for multiple recipients
  async sendBatchEmails(emailRequests: EmailRequest[]): Promise<EmailResponse[]> {
    const results: EmailResponse[] = [];
    
    // Send emails sequentially to avoid rate limiting
    for (const request of emailRequests) {
      try {
        const result = await this.sendEmail(request);
        results.push(result);
        
        // Add small delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          recipient: request.recipient,
        });
      }
    }
    
    return results;
  },
};
