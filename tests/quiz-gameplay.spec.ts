import { test, expect } from '@playwright/test';
import { loginTest } from './utils';

test.beforeEach('Logging in', async ({ page }) => {
  test.setTimeout(100000)
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Anonymous' })).toBeVisible();

  await loginTest(page);
  await expect(page.getByText("Logged in successfully")).toBeVisible();

  await page.getByRole('link', { name: 'Culture ' }).click();
  await page.getByTestId('quiz_link').nth(0).click();

  await expect(page.getByRole('button', { name: 'Start quiz' })).toBeVisible({ timeout: 10_000 });
});

test('Quiz gameplay', async ({ page }) => {
  await page.getByRole('button', { name: 'Start quiz' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('button', { name: 'Resume' }).click();
  await page.getByRole('button', { name: 'Finish quiz' }).click();
  await expect(page.getByText('Percentage0%')).toBeVisible();
});

test('Reviews form access', async ({ page }) => {
  await page.getByRole('tab', { name: 'Reviews' }).click();
  await expect(page.getByRole('heading', { name: 'Add a review' })).toBeVisible({ timeout: 10000 });

  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page.getByText('You can\'t add a review as a')).toBeVisible();
});

test('Review submission', async ({ page }) => {
  await page.getByRole('tab', { name: 'Reviews' }).click();
  await page.getByPlaceholder('Enter your comment').fill('A review comment');
  await page.getByRole('button', { name: 'Post' }).click();
  await expect(page.getByPlaceholder("Enter your comment")).toHaveText("");
})