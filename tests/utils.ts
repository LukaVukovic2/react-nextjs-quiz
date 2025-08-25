import { Page } from "@playwright/test";

export async function loginTest(page: Page) {
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('user@example.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('user123');
  await page.getByRole('button', { name: 'Login' }).click();
};