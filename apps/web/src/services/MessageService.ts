import type { Message } from "../types/message";

export class MessageService {
  private readonly apiUrl: string;

  constructor(
    apiUrl: string = import.meta.env.VITE_API_URL || "http://localhost:4000",
  ) {
    this.apiUrl = apiUrl;
  }

  async fetchMessages(): Promise<Message[]> {
    const response = await fetch(`${this.apiUrl}/messages`);
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }
    return response.json();
  }

  async sendMessage(content: string): Promise<Message> {
    const response = await fetch(`${this.apiUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }
}
