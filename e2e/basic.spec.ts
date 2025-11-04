import { test, expect } from '@playwright/test';

test('homepage has correct title and content', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/FlareForge AI Studio/);

  // Create a locator.
  const getStarted = page.getByText('Enter Studio');

  // Expect an attribute "to be strictly equal" to the value.
  await expect(getStarted).toBeVisible();

  // Click the get started link.
  await getStarted.click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*studio/);
});

test('studio page loads correctly', async ({ page }) => {
  await page.goto('/studio');

  // Check if the main heading is present
  await expect(page.getByText('FlareForge Studio')).toBeVisible();
});

test('can create a new project', async ({ page }) => {
  await page.goto('/studio');

  // Fill in project name
  await page.fill('input[placeholder="Enter project name..."]', 'Test Project');

  // Click create button
  await page.click('button:has-text("Create Project")');

  // Check if project appears in the list
  await expect(page.getByText('Test Project')).toBeVisible();
});