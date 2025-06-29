import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

const currentDir = dirname(fileURLToPath(import.meta.url));

test('пользовательский сценарий: загрузка файла, просмотр истории и генерация', async ({ page }) => {
    await page.goto('/');

    const csvFile = resolve(currentDir, 'fixtures', 'test.csv');
    await page.setInputFiles('input[type="file"]', csvFile);

    const sendBtn = page.getByRole('button', { name: /отправить/i });
    await sendBtn.click();

    await expect(page.locator('text=Готово')).toBeVisible();
    await expect(page.getByText(/аналитика|хайлайты/i)).toBeVisible();

    await page.getByRole('link', { name: /история/i }).click();
    await expect(page.getByText('test.csv')).toBeVisible();

    const clearBtn = page.getByRole('button', { name: /очистить/i });
    if (await clearBtn.isVisible()) {
        await clearBtn.click();
        await expect(page.locator('text=test1.csv')).toHaveCount(0);
    }

    await page.getByRole('link', { name: /генератор/i }).click();
    await expect(page.getByRole('button', { name: /начать генерацию/i })).toBeVisible();
});
