import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { test, expect } from '@playwright/test';

const currentPath = dirname(fileURLToPath(import.meta.url));

test.describe('верхнее меню навигации', () => {
  test.beforeEach(async ({ page: browserPage }) => {
    await browserPage.goto('/');
  });

  test('отображение ссылок в меню', async ({ page: browserPage }) => {
    await expect(browserPage.getByRole('link', { name: /csv аналитик/i })).toBeVisible();
    await expect(browserPage.getByRole('link', { name: /csv генератор/i })).toBeVisible();
    await expect(browserPage.getByRole('link', { name: /история/i })).toBeVisible();
  });

  test('подсветка активной ссылки на главной', async ({ page: browserPage }) => {
    const analystTab = browserPage.getByRole('link', { name: /csv аналитик/i });
    await expect(analystTab).toHaveClass(/active/);

    const genTab = browserPage.getByRole('link', { name: /csv генератор/i });
    const logsTab = browserPage.getByRole('link', { name: /история/i });

    await expect(genTab).not.toHaveClass(/active/);
    await expect(logsTab).not.toHaveClass(/active/);
  });

  test('переход на генератор', async ({ page: browserPage }) => {
    await browserPage.getByRole('link', { name: /csv генератор/i }).click();
    await expect(browserPage).toHaveURL(/.*\/generate/);
    await expect(browserPage.getByRole('link', { name: /csv генератор/i })).toHaveClass(/active/);
    await expect(browserPage.getByRole('button', { name: /начать генерацию/i })).toBeVisible();
  });

  test('переход к истории', async ({ page: browserPage }) => {
    await browserPage.getByRole('link', { name: /история/i }).click();
    await expect(browserPage).toHaveURL(/.*\/history/);
    await expect(browserPage.getByRole('link', { name: /история/i })).toHaveClass(/active/);
    await expect(browserPage.getByText(/история/i)).toBeVisible();
  });

  test('возврат на стартовую', async ({ page: browserPage }) => {
    await browserPage.getByRole('link', { name: /csv генератор/i }).click();
    await expect(browserPage).toHaveURL(/.*\/generate/);

    await browserPage.getByRole('link', { name: /csv аналитик/i }).click();
    await expect(browserPage).toHaveURL(/.*\/$/);
    await expect(browserPage.getByRole('link', { name: /csv аналитик/i })).toHaveClass(/active/);
    await expect(browserPage.getByText(/загрузить/i)).toBeVisible();
  });

  test('последовательная смена разделов', async ({ page: browserPage }) => {
    const navTo = async (label: string, url: RegExp) => {
      await browserPage.getByRole('link', { name: new RegExp(label, 'i') }).click();
      await expect(browserPage).toHaveURL(url);
      await expect(browserPage.getByRole('link', { name: new RegExp(label, 'i') })).toHaveClass(/active/);
    };

    await navTo('csv генератор', /\/generate/);
    await navTo('история', /\/history/);
    await navTo('csv аналитик', /\/$/);
    await navTo('история', /\/history/);
    await navTo('csv генератор', /\/generate/);
  });

  test('навигация после загрузки csv-файла', async ({ page: browserPage }) => {
    const sampleCSV = resolve(currentPath, 'fixtures', 'test.csv');
    await browserPage.setInputFiles('input[type="file"]', sampleCSV);
    await browserPage.getByRole('button', { name: /отправить/i }).click();

    await expect(browserPage.getByText(/готово/i)).toBeVisible();

    await browserPage.getByRole('link', { name: /csv генератор/i }).click();
    await expect(browserPage).toHaveURL(/.*\/generate/);

    await browserPage.getByRole('link', { name: /история/i }).click();
    await expect(browserPage).toHaveURL(/.*\/history/);

    await browserPage.getByRole('link', { name: /csv аналитик/i }).click();
    await expect(browserPage).toHaveURL(/.*\/$/);
  });
});
