import { test } from "@playwright/test";
import { ChatApplicationDriver } from "../drivers/chat-application.driver";

test.describe.configure({ mode: "serial" });
test.describe("Send Message", () => {
  test("should allow user to send a new message", async ({ page }) => {
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

  test("should not send empty messages", async ({ page }) => {
    const driver = new ChatApplicationDriver(page);
    const chat = await driver.openChat();
    const initialCount = await chat.countMessages();
    await chat.sendMessage("");
    await chat.hasMessageCount(initialCount);
  });
});
