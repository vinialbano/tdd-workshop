import { expect, test } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the page to be ready
  await expect(page).toHaveTitle(/TDD Workshop/);
  
  // Check if the main content is visible
  const mainContent = page.getByRole('main');
  await expect(mainContent).toBeVisible();
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'homepage.png' });
}); 