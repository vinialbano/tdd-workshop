export class MessageInput {
  private readonly element: HTMLInputElement;

  constructor(elementId = "message-input") {
    const element = document.getElementById(elementId) as HTMLInputElement;
    if (!element) {
      throw new Error(`Element #${elementId} not found`);
    }
    this.element = element;
  }

  get value(): string {
    return this.element.value.trim();
  }

  clear(): void {
    this.element.value = "";
  }

  focus(): void {
    this.element.focus();
  }

  disable(): void {
    this.element.disabled = true;
  }

  enable(): void {
    this.element.disabled = false;
  }

  onEnterPress(callback: () => void): void {
    this.element.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        callback();
      }
    });
  }
}
