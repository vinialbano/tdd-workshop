import { test } from "@playwright/test";
import { ChatApplicationDriver } from "../drivers/chat-application.driver";

test.describe("View Messages", () => {
  test("should display messages and allow scrolling to see all messages", async ({
    page,
  }) => {
    const driver = new ChatApplicationDriver(page);
    const chat = await driver.openChat();

    await chat.showsMessageList();
    await chat.forEachMessage(async (index: number) => {
      await chat.scrollToMessage(index);
      await chat.messageAtPositionIsVisible(index);
    });
  });
});
