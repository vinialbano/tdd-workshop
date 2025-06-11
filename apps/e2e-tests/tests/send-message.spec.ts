import { expect, test } from "@playwright/test";

test.describe.configure({ mode: 'serial' });
test.describe("Send Message", () => {
  test("should allow user to send a new message", async ({ page }) => {
    await page.goto("/");

    // Wait for the page to load
    await expect(page.getByText("Messages")).toBeVisible();

    // Get the initial message count
    const messagesBefore = page.locator("div.message p");
    const initialCount = await messagesBefore.count();

    // Find the message input and send button
    const messageInput = page.locator("#messageInput");
    const sendButton = page.locator("#sendButton");

    await expect(messageInput).toBeVisible();
    await expect(sendButton).toBeVisible();

    // Type a unique test message
    const testMessage = `Test message ${Date.now()}`;
    await messageInput.fill(testMessage);

    // Click the send button
    await sendButton.click();

    // Wait for the button to show "Sending..." and then return to "Send"
    await expect(sendButton).toHaveText("Sending...");
    await expect(sendButton).toHaveText("Send");

    // Verify the input is cleared
    await expect(messageInput).toHaveValue("");

    // Verify our specific message is visible
    await expect(page.getByText(testMessage)).toBeVisible();

    // Verify the new message appears in the messages list
    const messagesAfter = page.locator("div.message p");
    await expect(messagesAfter).toHaveCount(initialCount + 1);

    // Verify the new message is at the bottom (most recent)
    const lastMessage = messagesAfter.last();
    await expect(lastMessage).toHaveText(testMessage);
  });

  test("should allow sending message with Enter key", async ({ page }) => {
    await page.goto("/");

    // Wait for the page to load
    await expect(page.getByText("Messages")).toBeVisible();

    // Get the initial message count
    const messagesBefore = page.locator("div.message p");
    const initialCount = await messagesBefore.count();

    // Find the message input
    const messageInput = page.locator("#messageInput");
    await expect(messageInput).toBeVisible();

    // Type a unique test message
    const testMessage = `Enter key test ${Date.now()}`;
    await messageInput.fill(testMessage);

    // Press Enter to send
    await messageInput.press("Enter");

    // Wait for the send button to show loading state and return
    const sendButton = page.locator("#sendButton");
    await expect(sendButton).toHaveText("Sending...");
    await expect(sendButton).toHaveText("Send");

    // Verify the input is cleared
    await expect(messageInput).toHaveValue("");

    // Verify the new message appears
    const messagesAfter = page.locator("div.message p");
    await expect(messagesAfter).toHaveCount(initialCount + 1);

    // Verify our specific message is visible
    await expect(page.getByText(testMessage)).toBeVisible();
  });

  test("should not send empty messages", async ({ page }) => {
    await page.goto("/");

    // Wait for the page to load
    await expect(page.getByText("Messages")).toBeVisible();

    // Get the initial message count
    const messagesBefore = page.locator("div.message p");
    const initialCount = await messagesBefore.count();

    // Find the message input and send button
    const messageInput = page.locator("#messageInput");
    const sendButton = page.locator("#sendButton");

    // Try to send empty message
    await messageInput.fill("");
    await sendButton.click();

    // Verify no new message was added
    const messagesAfter = page.locator("div.message p");
    await expect(messagesAfter).toHaveCount(initialCount);

    // Try to send whitespace-only message
    await messageInput.fill("   ");
    await sendButton.click();

    // Verify no new message was added
    await expect(messagesAfter).toHaveCount(initialCount);
  });
});
