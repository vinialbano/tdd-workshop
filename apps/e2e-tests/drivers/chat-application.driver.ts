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

  async messageIsVisible(index: number) {
    const messages = this.page.locator("div.message p");
    const message = messages.nth(index);
    await expect(message).toBeVisible();
    return this;
  }
}
