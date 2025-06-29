import { useHistoryStore } from '@store/historyStore.ts';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, beforeEach, expect, vi } from 'vitest';

import { HistoryList } from './HistoryList';
import '@testing-library/jest-dom';

type VitestMock = ReturnType<typeof vi.fn>;
const useHistoryStoreMock = useHistoryStore as unknown as VitestMock;

vi.mock('@store/historyStore.ts', async () => {
  const actual = (await vi.importActual('@store/historyStore.ts')) as any;
  return {
    ...actual,
    useHistoryStore: vi.fn(),
  };
});

describe('HistoryList', () => {
  const defaultItem = {
    id: '1',
    fileName: 'file.csv',
    timestamp: Date.now(),
    highlights: [{}],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useHistoryStoreMock.mockReturnValue({
      history: [defaultItem],
      showModal: vi.fn(),
      setSelectedItem: vi.fn(),
      removeFromHistoryStore: vi.fn(),
      updateHistoryFromStorage: vi.fn(),
    });
  });

  test('отображает элемент истории', () => {
    render(<HistoryList />);
    expect(screen.getByText(/file\.csv/i)).toBeInTheDocument();
  });

  test('вызывает setSelectedItem и showModal при клике', () => {
    const setSelectedItem = vi.fn();
    const showModal = vi.fn();

    useHistoryStoreMock.mockReturnValue({
      history: [defaultItem],
      setSelectedItem,
      showModal,
      removeFromHistoryStore: vi.fn(),
      updateHistoryFromStorage: vi.fn(),
    });

    render(<HistoryList />);

    fireEvent.click(screen.getByText(/file\.csv/i));

    expect(setSelectedItem).toHaveBeenCalledWith(defaultItem);
    expect(showModal).toHaveBeenCalled();
  });

  test('вызывает removeFromHistoryStore при нажатии на кнопку удаления', () => {
    const removeFromHistoryStore = vi.fn();

    useHistoryStoreMock.mockReturnValue({
      history: [defaultItem],
      setSelectedItem: vi.fn(),
      showModal: vi.fn(),
      removeFromHistoryStore,
      updateHistoryFromStorage: vi.fn(),
    });

    render(<HistoryList />);
    const deleteButton = screen.getByRole('button', { name: /удалить/i });
    fireEvent.click(deleteButton);
    expect(removeFromHistoryStore).toHaveBeenCalledWith('1');
  });

  test('не отображает ничего, если история пуста', () => {
    useHistoryStoreMock.mockReturnValue({
      history: [],
      setSelectedItem: vi.fn(),
      showModal: vi.fn(),
      removeFromHistoryStore: vi.fn(),
      updateHistoryFromStorage: vi.fn(),
    });

    render(<HistoryList />);
    expect(screen.queryByText(/file\.csv/i)).not.toBeInTheDocument();
  });
});
