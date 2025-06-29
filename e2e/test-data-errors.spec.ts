import { test, expect } from '@playwright/test';

test('обработка ошибки при генерации отчета', async ({ page }) => {
  await page.goto('/generate');

  await page.route('**/report?size=*', async (intercept) => {
    await intercept.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'generation failed' }),
    });
  });

  const startBtn = page.getByRole('button', { name: /запустить генерацию/i });
  await startBtn.click();

  const errorMsg = page.getByText(/ошибка/i);
  await expect(errorMsg).toBeVisible();
});
