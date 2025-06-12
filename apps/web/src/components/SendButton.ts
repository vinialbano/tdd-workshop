export class SendButton {
  private readonly element: HTMLButtonElement;

  constructor(elementId = "send-button") {
    const element = document.getElementById(elementId) as HTMLButtonElement;
    if (!element) {
      throw new Error(`Element #${elementId} not found`);
    }
    this.element = element;
  }

  onClick(callback: () => void): void {
    this.element.addEventListener("click", callback);
  }

  setLoading(): void {
    this.element.textContent = "Sending...";
    this.element.disabled = true;
  }

  setReady(): void {
    this.element.textContent = "Send";
    this.element.disabled = false;
  }
}
