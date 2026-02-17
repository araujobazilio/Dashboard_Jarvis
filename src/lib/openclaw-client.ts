interface OpenClawConfig {
  apiUrl: string;
  apiKey: string;
  userId: string;
}

interface OpenClawRequest {
  user_id: string;
  content: string;
  type: string;
  timestamp: string;
}

interface OpenClawResponse {
  status: string;
  message: string;
  analysis?: {
    detected_type: string;
    priority: string;
    category: string;
    suggested_action: string;
  };
  suggestions?: Array<{
    type: string;
    message: string;
    action: string;
  }>;
}

class OpenClawClient {
  private config: OpenClawConfig;

  constructor(config: OpenClawConfig) {
    this.config = config;
  }

  async health(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async analyze(content: string, type: string = 'capture'): Promise<OpenClawResponse> {
    try {
      const request: OpenClawRequest = {
        user_id: this.config.userId,
        content,
        type,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(`${this.config.apiUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OpenClaw API Error:', error);
      return {
        status: 'error',
        message: 'Erro ao conectar com OpenClaw',
      };
    }
  }

  async sync(data: any): Promise<OpenClawResponse> {
    try {
      const response = await fetch(`${this.config.apiUrl}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          user_id: this.config.userId,
          data,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OpenClaw Sync Error:', error);
      return {
        status: 'error',
        message: 'Erro ao sincronizar com OpenClaw',
      };
    }
  }
}

export default OpenClawClient;
