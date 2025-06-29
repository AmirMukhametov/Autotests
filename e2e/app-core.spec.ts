import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { test, expect } from '@playwright/test';

const currentDir = dirname(fileURLToPath(import.meta.url));

test('После загрузки CSV-файла он появляется в списке истории', async ({ page }) => {
  await page.goto('/');

  const csvPath = resolve(currentDir, 'fixtures', 'test.csv');
  const uploadInput = 'input[type="file"]';

  await page.setInputFiles(uploadInput, csvPath);

  const analyticsTitle = page.getByText('Анализ данных');
  const uploadedFile = page.getByText('test.csv');

  await expect(analyticsTitle).toBeVisible();
  await expect(uploadedFile).toBeVisible();
});
