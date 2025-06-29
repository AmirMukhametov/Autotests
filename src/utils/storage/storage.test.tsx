import { STORAGE_KEY } from '@utils/consts.ts';
import {
  addToHistory,
  clearHistory,
  getHistory,
  removeFromHistory,
} from '@utils/storage/storage.ts';
import { describe, it, beforeEach, expect, vi } from 'vitest';

describe('функции работы с localStorage', () => {
  let uuidCallCount = 0;
  const fakeIds = [
    'abcde-00000-00000-00000-00001',
    'abcde-00000-00000-00000-00002',
  ];

  beforeEach(() => {
    localStorage.clear();
    uuidCallCount = 0;

    // @ts-ignore
    vi.spyOn(crypto, 'randomUUID').mockImplementation(() => fakeIds[uuidCallCount++]);
    vi.spyOn(Date, 'now').mockReturnValue(1672531200000); // 01.01.2023
  });

  it('возвращает пустой список, если ничего не сохранено', () => {
    const result = getHistory();
    expect(result).toEqual([]);
  });

  it('добавляет элемент с id и временем, сохраняет в localStorage', () => {
    const result = addToHistory({ fileName: 'data.csv' });

    expect(result).toEqual({
      id: fakeIds[0],
      timestamp: 1672531200000,
      fileName: 'data.csv',
    });

    const saved = localStorage.getItem(STORAGE_KEY);
    expect(saved).not.toBeNull();

    const parsed = JSON.parse(saved!);
    expect(parsed).toEqual([result]);
  });

  it('возвращает элементы в обратном порядке добавления', () => {
    const one = addToHistory({ fileName: 'first.csv' });
    const two = addToHistory({ fileName: 'second.csv' });

    const stored = getHistory();
    expect(stored).toEqual([two, one]);
  });

  it('удаляет конкретный элемент по его id', () => {
    const itemA = addToHistory({ fileName: 'old.csv' });
    const itemB = addToHistory({ fileName: 'new.csv' });

    removeFromHistory(itemA.id);

    const after = getHistory();
    expect(after).toEqual([itemB]);
  });

  it('ничего не делает при попытке удалить несуществующий id', () => {
    addToHistory({ fileName: 'log.csv' });

    expect(() => removeFromHistory('unknown-id')).not.toThrow();
    expect(getHistory()).toHaveLength(1);
  });

  it('полностью очищает историю', () => {
    addToHistory({ fileName: 'temp.csv' });

    clearHistory();

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(getHistory()).toEqual([]);
  });

  it('не падает при кривом JSON в localStorage', () => {
    localStorage.setItem(STORAGE_KEY, '[invalid json');

    const result = getHistory();
    expect(result).toEqual([]);
  });
});
