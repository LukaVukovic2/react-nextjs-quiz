import { expect, test } from '@playwright/test';
import { loginTest } from './utils';

test('Quiz creation', async ({ page }) => {
  const nextBtn = page.getByRole('button').getByText('Next');
  await test.step('Basic quiz info', async () => {
    const titleInput = page.getByRole('textbox', { name: 'Title' }); 
    await page.goto('/quizzes/new');
    await titleInput.fill('title');
    await page.getByRole('combobox').filter({ hasText: 'Select time' }).click();
    await page.getByRole('option', { name: '00:30' }).click();
    await page.getByRole('combobox').filter({ hasText: 'Select quiz type' }).click();
    await page.getByRole('option', { name: 'Culture' }).click();
    await expect(nextBtn).toBeVisible();
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();
  })

  await test.step('Defining Q&As', async () => {
    
    const questionTypeEl = page.getByRole('combobox', { name: 'Choose question type' });
    await questionTypeEl.click();
    await page.getByRole('option', { name: 'Short answer' }).click();
    const questionTitleInput = page.getByRole('textbox', { name: 'Question title' });
    await questionTitleInput.click();
    await questionTitleInput.fill('Short question');
    
    await page.locator('input[name^="answer"]').nth(0).fill('acceptable option');
    await page.getByRole('button', { name: 'Add answer' }).click();
    await page.locator('input[name^="answer"]').nth(1).fill('another acceptable option');
    const addQuestionBtn = page.getByRole('button', { name: 'Add question' });
    await addQuestionBtn.click();

    await questionTypeEl.click();
    await page.getByRole('option', { name: 'Single choice' }).click();
    await questionTitleInput.fill('single choice');
    await page.locator('input[name^="answer"]').nth(0).fill('option1');
    await page.locator('input[name^="answer"]').nth(1).fill('option2');
    await addQuestionBtn.click();

    await questionTypeEl.click();
    await page.getByRole('option', { name: 'Multiple choice' }).click();
    await questionTitleInput.fill('multiple choice');
    await page.locator('input[name^="answer"]').nth(0).fill('option1');
    await page.locator('input[name^="answer"]').nth(1).fill('option2');
    await addQuestionBtn.click();

    await expect(nextBtn).toBeVisible();
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();
  })

  await test.step('Authenticating and creating quiz', async () => {
    const createQuizBtn = page.locator('form').getByRole('button', { name: 'Create Quiz' }); 
    await expect(createQuizBtn).toBeEnabled();

    await createQuizBtn.click();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

    await loginTest(page);
    const titleInput = page.getByRole('textbox', { name: 'Title' }); 
    await expect(titleInput).toHaveText("");
  })
});
