import { formatDate } from '@utils/formatDate/formateDate.ts';
import { describe, it, expect } from 'vitest';

const testData: Array<[number | Date, string]> = [
  [new Date('2024-01-01'), '01.01.2024'],
  [new Date('2024-12-31'), '31.12.2024'],
  [new Date('2020-02-29'), '29.02.2020'],
  [new Date('2023-04-05'), '05.04.2023'],
  [new Date('1999-11-09'), '09.11.1999'],
  [new Date(2022, 11, 31).getTime(), '31.12.2022'],
  [0, '01.01.1970'],
];

describe('Форматирование дат через formatDate()', () => {
  it.each(testData)(
    'корректно форматирует %p в строку "%s"',
    (input, output) => {
      const formatted = formatDate(input);
      expect(formatted).toBe(output);
    }
  );

  it('возвращает строку формата DD.MM.YYYY для текущего времени', () => {
    const current = new Date();
    const formatted = formatDate(current);
    expect(formatted).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
  });
});
