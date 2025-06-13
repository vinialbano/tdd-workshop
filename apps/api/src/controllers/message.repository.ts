export interface Message {
  id: number;
  content: string;
}

export interface MessageRepository {
  getMessages(): Promise<Message[]>;
  createMessage(content: string): Promise<Message>;
}
