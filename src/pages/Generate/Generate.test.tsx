import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, beforeAll, beforeEach, vi, expect } from 'vitest';
import { GeneratePage } from './GeneratePage';


beforeAll(() => {
  Object.defineProperty(window, 'location', {
    value: {
      assign: vi.fn(),
    },
    writable: true,
  });
});



beforeEach(() => {
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn(() => 'blob:http://localhost/fake'),
    revokeObjectURL: vi.fn(),
  });

  const mockFetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      headers: { get: () => 'attachment; filename="file.csv"' },
      blob: () => Promise.resolve(new Blob(['data'], { type: 'text/csv' })),
    })
  );
  vi.stubGlobal('fetch', mockFetch);
});

describe('GeneratePage', () => {
  test('показывает уведомление об успешной генерации', async () => {
    render(<GeneratePage />);
    fireEvent.click(screen.getByRole('button', { name: /начать генерацию/i }));

    await waitFor(() => {
      expect(screen.getByText('Отчёт успешно сгенерирован!')).toBeInTheDocument();
    });
  });

  test('показывает сообщение об ошибке при неудачной генерации', async () => {

    const fetchMock = globalThis.fetch as ReturnType<typeof vi.fn>;
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Ошибка генерации' }),
      })
    );

    render(<GeneratePage />);
    fireEvent.click(screen.getByRole('button', { name: /начать генерацию/i }));

    await waitFor(() => {
      expect(screen.getByText(/произошла ошибка/i)).toBeInTheDocument();
    });
  });

  test('кнопка отключается во время загрузки', async () => {
    let resolveFetch: (value: any) => void;
    const pendingFetch = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    const fetchMock = globalThis.fetch as ReturnType<typeof vi.fn>;
    fetchMock.mockImplementationOnce(() => pendingFetch);

    render(<GeneratePage />);
    const generateButton = screen.getByRole('button', { name: /начать генерацию/i });
    fireEvent.click(generateButton);

    expect(generateButton).toBeDisabled();


    resolveFetch!({
      ok: true,
      headers: { get: () => '' },
      blob: () => Promise.resolve(new Blob()),
    });
  });
});
