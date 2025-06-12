import { test } from "@playwright/test";
import { ChatApplicationDriver } from "../drivers/chat-application.driver";

test.describe("TDD Chat", () => {
  test("displays previous messages", async ({ page }) => {
    const driver = new ChatApplicationDriver(page);
    const chat = await driver.openChat();

    await chat.showsMessageList();
    await chat.forEachMessage(async (index: number) => {
      await chat.scrollToMessage(index);
      await chat.messageAtPositionIsVisible(index);
    });
  });

  test("sends a new message", async ({ page }) => {
    const driver = new ChatApplicationDriver(page);
    const chat = await driver.openChat();
    const initialCount = await chat.countMessages();

    const testMessage = `Test message ${Date.now()}`;
    await chat.sendMessage(testMessage);
    await chat.messageWithTextIsVisible(testMessage);
    await chat.hasMessageCount(initialCount + 1);

    await chat.reloadPage();
    await chat.messageWithTextIsVisible(testMessage);
    await chat.hasMessageCount(initialCount + 1);
  });
});
