import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HighlightCard } from './HighlightCard';
import type { AnalysisHighlight } from '@app-types/analysis';

test('рендерит заголовок и описание', () => {
  const mockHighlight: AnalysisHighlight = {
    title: 'Тестовый заголовок',
    description: 'Тестовое описание',
  };

  render(<HighlightCard highlight={mockHighlight} />);

  expect(screen.getByText(/тестовый заголовок/i)).toBeInTheDocument();
  expect(screen.getByText(/тестовое описание/i)).toBeInTheDocument();
});
