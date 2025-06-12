import type { Message } from "../types/message";

export class MessageList {
  private readonly element: HTMLDivElement;

  constructor(elementId = "messages-list") {
    const element = document.getElementById(elementId) as HTMLDivElement;
    if (!element) {
      throw new Error(`Element #${elementId} not found`);
    }
    this.element = element;
  }

  render(messages: Message[]): void {
    this.element.innerHTML = messages.map(this.createMessageComponent).join("");
    this.scrollToBottom();
  }

  appendMessage(message: Message): void {
    const messageElement = this.createMessageComponent(message);
    this.element.insertAdjacentHTML("beforeend", messageElement);
    this.scrollToBottom();
  }

  showError(): void {
    this.element.innerHTML = this.createErrorAlert();
  }

  private createMessageComponent(message: Message): string {
    return `
      <div class="flex justify-end mb-4">
        <div class="bg-blue-500 text-white rounded-lg py-2 px-4 max-w-[70%] shadow-md">
          <p class="message text-sm">${message.content}</p>
        </div>
      </div>
    `;
  }

  private createErrorAlert(): string {
    return `
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Failed to load messages. Please try again later.</p>
      </div>
    `;
  }

  private scrollToBottom(): void {
    this.element.scrollTop = this.element.scrollHeight;
  }
}
