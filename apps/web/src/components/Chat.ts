import { MessageService } from "../services/MessageService";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { SendButton } from "./SendButton";

export class Chat {
  private readonly messageInput: MessageInput;
  private readonly messageList: MessageList;
  private readonly sendButton: SendButton;
  private readonly messageService: MessageService;

  constructor() {
    this.messageInput = new MessageInput();
    this.messageList = new MessageList();
    this.sendButton = new SendButton();
    this.messageService = new MessageService();
  }

  async init(): Promise<void> {
    await this.loadMessages();
    this.setupEventListeners();
  }

  private async loadMessages(): Promise<void> {
    try {
      const messages = await this.messageService.fetchMessages();
      this.messageList.render(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      this.messageList.showError();
    }
  }

  private setupEventListeners(): void {
    this.sendButton.onClick(() => this.handleSendMessage());
    this.messageInput.onEnterPress(() => this.handleSendMessage());
  }

  private async handleSendMessage(): Promise<void> {
    const content = this.messageInput.value;
    if (!content) return;

    try {
      this.sendButton.setLoading();
      this.messageInput.disable();

      const newMessage = await this.messageService.sendMessage(content);
      this.messageList.appendMessage(newMessage);

      this.messageInput.clear();
      this.messageInput.enable();
      this.messageInput.focus();
      this.sendButton.setReady();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
      this.messageInput.enable();
      this.sendButton.setReady();
    }
  }
}
