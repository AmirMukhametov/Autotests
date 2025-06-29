import { test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenerateMoreButton } from './GenerateMoreButton';


const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

test('по клику вызывает navigate с "/generate"', () => {
  render(<GenerateMoreButton />);

  const button = screen.getByRole('button', { name: /сгенерировать больше/i });
  fireEvent.click(button);

  expect(mockNavigate).toHaveBeenCalledWith('/generate');
});
