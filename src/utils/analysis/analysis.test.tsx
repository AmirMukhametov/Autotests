import { HIGHLIGHT_TITLES } from '@utils/consts';
import { describe, it, expect } from 'vitest';

import {
  transformAnalysisData,
  convertHighlightsToArray,
  isCsvFile,
  validateServerResponse,
  InvalidServerResponseError,
} from './analysis';

// Вспомогательная функция кодирования JSON в Uint8Array (мок имитации потока)
const encodeToStream = (data: Record<string, any>) => {
  const text = JSON.stringify(data) + '\n';
  return new TextEncoder().encode(text);
};

describe('convertHighlightsToArray', () => {
  it('правильно формирует массив из значений с описаниями из HIGHLIGHT_TITLES', () => {
    const input = { name: 'Alice', score: 42 };
    // @ts-ignore
    const result = convertHighlightsToArray(input);

    expect(result).toEqual([
      {
        title: 'Alice',
        description: HIGHLIGHT_TITLES['name'] ?? 'Неизвестный параметр',
      },
      {
        title: '42',
        description: HIGHLIGHT_TITLES['score'] ?? 'Неизвестный параметр',
      },
    ]);
  });

  it('использует описание по умолчанию, если ключ не найден в HIGHLIGHT_TITLES', () => {
    const input = { unknown_key: '???' };
    // @ts-ignore
    const result = convertHighlightsToArray(input);

    expect(result[0].description).toBe('Неизвестный параметр');
  });
});

describe('isCsvFile', () => {
  it('возвращает true для файлов с расширением .csv в любом регистре', () => {
    const file = new File([''], 'report.CSV');
    expect(isCsvFile(file)).toBe(true);
  });

  it('возвращает false для файлов с другими расширениями', () => {
    const file = new File([''], 'image.png');
    expect(isCsvFile(file)).toBe(false);
  });
});

describe('validateServerResponse', () => {
  it('возвращает true, если хотя бы один ключ соответствует HIGHLIGHT_TITLES', () => {
    const validKey = Object.keys(HIGHLIGHT_TITLES)[0];
    const response = { [validKey]: 'something' };
    expect(validateServerResponse(response)).toBe(true);
  });

  it('возвращает false, если все ключи невалидные', () => {
    const response = { unrelatedKey: 123 };
    expect(validateServerResponse(response)).toBe(false);
  });

  it('бросает исключение, если значение допустимого ключа — null', () => {
    const validKey = Object.keys(HIGHLIGHT_TITLES)[0];
    const response = { [validKey]: null };
    // @ts-ignore
    expect(() => validateServerResponse(response)).toThrow(InvalidServerResponseError);
  });
});

describe('transformAnalysisData', () => {
  it('возвращает highlights и highlightsToStore при валидных данных', () => {
    const key = Object.keys(HIGHLIGHT_TITLES)[0];
    const input = encodeToStream({
      [key]: 'yes',
      count: 12,
      rows_affected: 5,
    });

    const result = transformAnalysisData(input);
    expect(result.highlights).toEqual({ [key]: 'yes', count: 12 });
    expect(result.highlightsToStore).toEqual([
      {
        title: 'yes',
        description: HIGHLIGHT_TITLES[key],
      },
      {
        title: '12',
        description: HIGHLIGHT_TITLES['count'] ?? 'Неизвестный параметр',
      },
    ]);
  });

  it('бросает InvalidServerResponseError, если нет валидных ключей', () => {
    const invalid = encodeToStream({ foo: 'bar' });
    expect(() => transformAnalysisData(invalid)).toThrow(InvalidServerResponseError);
  });
});
