import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HighlightsSection } from './HighlightsSection';
import type { AnalysisHighlight } from '@app-types/analysis';

test('отображает плейсхолдер при отсутствии хайлайтов', () => {
  render(<HighlightsSection highlights={[]} />);
  expect(screen.getByText(/здесь появятся хайлайты/i)).toBeInTheDocument();
});

test('рендерит переданные хайлайты', () => {
  const highlights: AnalysisHighlight[] = [
    {
      title: 'Первый заголовок',
      description: 'Первое описание',
    },
    {
      title: 'Второй заголовок',
      description: 'Второе описание',
    },
  ];

  render(<HighlightsSection highlights={highlights} />);

  expect(screen.getByText(/первый заголовок/i)).toBeInTheDocument();
  expect(screen.getByText(/второй заголовок/i)).toBeInTheDocument();
  expect(screen.getByText(/первое описание/i)).toBeInTheDocument();
  expect(screen.getByText(/второе описание/i)).toBeInTheDocument();
});
