import { expect, test } from '@playwright/test';

test('Quiz creation', async ({ page }) => {
  await test.step('Basic quiz info', async () => {
    const titleInput = page.getByRole('textbox', { name: 'Title' }); 
    await page.goto('/quizzes/new');
    await titleInput.click();
    await titleInput.fill('title');
    await page.locator('[id="select::Raq6lajttttej6::trigger"]').click();
    await page.getByRole('option', { name: '00:30' }).click();
    await page.getByRole('combobox').filter({ hasText: 'Select quiz type' }).click();
    await page.getByRole('option', { name: 'Culture' }).click();
    await page.getByRole('button', {name: 'Next'}).click();
  })

  await test.step('Defining Q&As', async () => {
    const questionTypeEl = page.getByRole('combobox', { name: 'Choose question type' });
    const questionTitleInput = page.getByRole('textbox', { name: 'Question title' });
    const addQuestionBtn = page.getByRole('button', { name: 'Add question' });

    await questionTypeEl.click();
    await page.getByRole('option', { name: 'Short answer' }).click();
    await questionTitleInput.click();
    await questionTitleInput.fill('Short question');

    await page.locator('input[name^="answer"]').nth(0).click();
    await page.locator('input[name^="answer"]').nth(0).fill('acceptable option');
    await page.getByRole('button', { name: 'Add answer' }).click();
    await page.locator('input[name^="answer"]').nth(1).click();
    await page.locator('input[name^="answer"]').nth(1).fill('another acceptable option');
    await addQuestionBtn.click();

    await questionTypeEl.click();
    await page.getByRole('option', { name: 'Single choice' }).click();
    await questionTitleInput.click();
    await questionTitleInput.fill('single choice');
    await page.locator('input[name^="answer"]').nth(0).click();
    await page.locator('input[name^="answer"]').nth(0).fill('option1');
    await page.locator('input[name^="answer"]').nth(1).click();
    await page.locator('input[name^="answer"]').nth(1).fill('option2');
    await addQuestionBtn.click();

    await questionTypeEl.click();
    await page.getByRole('option', { name: 'Multiple choice' }).click();
    await questionTitleInput.click();
    await questionTitleInput.fill('multiple choice');
    await page.locator('input[name^="answer"]').nth(0).click();
    await page.locator('input[name^="answer"]').nth(0).fill('option1');
    await page.locator('input[name^="answer"]').nth(1).click();
    await page.locator('input[name^="answer"]').nth(1).fill('option2');
    await addQuestionBtn.click();

    await page.getByRole('button', { name: 'Next' }).click();
  })
  
  await expect(page.locator('form').getByRole('button', { name: 'Create Quiz' })).toBeEnabled();
});
