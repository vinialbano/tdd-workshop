import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class ChatApplicationDriver {
  constructor(private readonly page: Page) {}

  async openChat() {
    await this.page.goto("/");
    await this.waitForPageLoad();
    return this;
  }

  private async waitForPageLoad() {
    await expect(this.page.getByText("Messages")).toBeVisible();
  }

  async showsMessageList() {
    const messages = this.page.locator("div.message p");
    const count = await messages.count();
    expect(count).toBeGreaterThan(0);
    return this;
  }

  async forEachMessage(callback: (index: number) => Promise<void>) {
    const messages = this.page.locator("div.message p");
    const count = await messages.count();

    for (let i = 0; i < count; i++) {
      await callback(i);
    }
    return this;
  }

  async scrollToMessage(index: number) {
    const messages = this.page.locator("div.message p");
    const message = messages.nth(index);
    await message.scrollIntoViewIfNeeded();
    await expect(message).toBeVisible();
    return this;
  }

  async countMessages() {
    const messages = this.page.locator("div.message p");
    return messages.count();
  }

  async sendMessage(text: string) {
    const messageInput = this.page.locator("#messageInput");
    const sendButton = this.page.locator("#sendButton");

    await messageInput.fill(text);
    await sendButton.click();
    return this;
  }

  async messageWithTextIsVisible(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
    return this;
  }

  async messageAtPositionIsVisible(index: number) {
    const messages = this.page.locator("div.message p");
    const message = messages.nth(index);
    await expect(message).toBeVisible();
    return this;
  }

  async hasMessageCount(expectedCount: number) {
    const currentCount = await this.countMessages();
    expect(currentCount).toBe(expectedCount);
    return this;
  }

  async reloadPage() {
    await this.page.reload();
    await this.waitForPageLoad();
    return this;
  }
}
