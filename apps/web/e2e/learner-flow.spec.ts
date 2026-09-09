import { test, expect } from '@playwright/test';

test.describe('Learner Core Practice Journey', () => {
  test('Complete deliberate practice loop: login, syllabus, sentence drill, and feedback inspection', async ({ page }) => {
    // 1. Visit Login Page
    await page.goto('/login');
    await expect(page).toHaveTitle(/EnglishFluency/i);

    // 2. Fill Credentials and Authenticate
    await page.fill('input[type="email"]', 'learner@example.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // 3. Navigate to Dashboard
    await page.waitForURL('/dashboard');
    await expect(page.locator('text=Ready to speak')).toBeVisible();

    // 4. Access Course Catalog & Syllabus
    await page.click('text=Courses');
    await page.waitForURL('/courses');
    await page.click('text=Everyday Conversational Foundations');

    // 5. Open Sentence Practice Session
    await page.click('text=Introducing Yourself & Greetings');
    await page.waitForURL(/\/practice\/sentence\/.+/);

    // Verify Target Sentence and Audio Controls
    await expect(page.locator('text=Priya')).toBeVisible();
    const micButton = page.locator('button:has-text("Record")').or(page.locator('button[aria-label="Record voice"]'));
    await expect(micButton).toBeVisible();

    // 6. Simulate Recording & Submit Attempt
    await micButton.click();
    await page.waitForTimeout(2000);
    await micButton.click();

    // 7. Verify Accuracy Diff Matrix & Phoneme Scores
    await expect(page.locator('text=Accuracy Score')).toBeVisible();
    await expect(page.locator('text=Fluency Score')).toBeVisible();

    // 8. Verify Daily Challenge & Quota Check
    await page.goto('/challenges/today');
    await expect(page.locator('text=Daily Speaking Quest')).toBeVisible();
  });
});

