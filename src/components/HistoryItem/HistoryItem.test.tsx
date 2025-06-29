import { test, expect, vi, describe } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryItem } from './HistoryItem';
import type { HistoryItemType } from '@app-types/history';

const mockHighlights = {
  total_spend_galactic: 1402868385.230134,
  rows_affected: 2862779,
  less_spent_at: 273,
  big_spent_at: 248,
  less_spent_value: 2380854.4619028047,
  big_spent_value: 5524160.104993988,
  average_spend_galactic: 490.03726282403704,
  big_spent_civ: "humans",
  less_spent_civ: "blobs",
  ivalid_rows: 0,
};

const itemWithHighlights: HistoryItemType = {
  id: '1',
  fileName: 'report.csv',
  timestamp: Date.now(),
  highlights: mockHighlights,
};

const itemWithoutHighlights: HistoryItemType = {
  ...itemWithHighlights,
  id: '2',
  highlights: undefined,
};

describe('HistoryItem', () => {
  test('рендерит имя файла и дату', () => {
    render(<HistoryItem item={itemWithHighlights} onClick={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/report.csv/i)).toBeInTheDocument();
  });

  test('вызывает onClick при клике, если есть highlights', () => {
    const onClick = vi.fn();
    render(<HistoryItem item={itemWithHighlights} onClick={onClick} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByLabelText(/открыть хайлайты/i));
    expect(onClick).toHaveBeenCalledWith(itemWithHighlights);
  });

  test('не вызывает onClick, если нет highlights', () => {
    const onClick = vi.fn();
    render(<HistoryItem item={itemWithoutHighlights} onClick={onClick} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByLabelText(/открыть хайлайты/i));
    expect(onClick).not.toHaveBeenCalled();
  });

  test('вызывает onDelete при клике по кнопке удаления', () => {
    const onDelete = vi.fn();
    render(<HistoryItem item={itemWithHighlights} onClick={vi.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getByLabelText(/удалить файл/i));
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
