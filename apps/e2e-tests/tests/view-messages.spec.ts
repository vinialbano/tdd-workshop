import { expect, test } from '@playwright/test';

test.describe('View Messages', () => {
  test('should display messages and allow scrolling to see all messages', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the "Messages" text to appear
    await expect(page.getByText('Messages')).toBeVisible();

    // Get all messages and verify they are visible after scrolling
    const messages = page.locator('div.message p');
    const count = await messages.count();
    expect(count).toBeGreaterThan(0);

    // Scroll through each message and verify it becomes visible
    for (let i = 0; i < count; i++) {
      const message = messages.nth(i);
      await message.scrollIntoViewIfNeeded();
      await expect(message).toBeVisible();
    }
  });
}); 