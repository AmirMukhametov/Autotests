import { test, expect, describe, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryModal } from './HistoryModal';
import { useHistoryStore } from '@store/historyStore';

// Мокаем zustand store
vi.mock('@store/historyStore', async () => {
  const actual = await vi.importActual<typeof import('@store/historyStore')>('@store/historyStore');
  return {
    ...actual,
    useHistoryStore: vi.fn(),
  };
});

// Мокаем конвертер хайлайтов
vi.mock('@utils/analysis', () => ({
  convertHighlightsToArray: () => [
    { title: 'test highlight', description: 'test description' },
  ],
}));

describe('HistoryModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('не отображает модалку, если нет selectedItem или highlights', () => {
    vi.mocked(useHistoryStore).mockReturnValue({
      isOpenModal: true,
      selectedItem: null,
      hideModal: vi.fn(),
    });

    const { container } = render(<HistoryModal />);
    expect(container.firstChild).toBeNull();
  });

  test('не отображает модалку, если isOpenModal === false', () => {
    vi.mocked(useHistoryStore).mockReturnValue({
      isOpenModal: false,
      selectedItem: { highlights: { key: 'value' } },
      hideModal: vi.fn(),
    });

    const { container } = render(<HistoryModal />);
    expect(container.firstChild).toBeNull();
  });

  test('не отображает модалку, если highlights пустые', () => {
    vi.mocked(useHistoryStore).mockReturnValue({
      isOpenModal: true,
      selectedItem: { highlights: {} },
      hideModal: vi.fn(),
    });

    const { container } = render(<HistoryModal />);
    expect(container.firstChild).toBeNull();
  });

  test('отображает модалку с хайлайтами, если selectedItem содержит highlights', () => {
    vi.mocked(useHistoryStore).mockReturnValue({
      isOpenModal: true,
      selectedItem: { highlights: { some_key: 'some_value' } },
      hideModal: vi.fn(),
    });

    render(<HistoryModal />);
    expect(screen.getByText('some_value')).toBeInTheDocument();
expect(screen.getByText('Неизвестный параметр')).toBeInTheDocument();
  });

  test('вызывает hideModal при нажатии на кнопку закрытия', () => {
    const hideModal = vi.fn();
    vi.mocked(useHistoryStore).mockReturnValue({
      isOpenModal: true,
      selectedItem: { highlights: { some_key: 'some_value' } },
      hideModal,
    });

    render(<HistoryModal />);

    // Находим первую кнопку (иконка закрытия, без aria-label)
    const closeButton = screen.getAllByRole('button')[0];
    fireEvent.click(closeButton);

    expect(hideModal).toHaveBeenCalled();
  });
});
