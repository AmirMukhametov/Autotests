import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect } from 'vitest';
import { FileDisplay } from './FileDisplay';

test('показывает имя файла', () => {
  render(<FileDisplay fileName="test.pdf" onClear={() => {}} />);
  expect(screen.getByText('test.pdf')).toBeInTheDocument();
});

test('кнопка вызывает onClear', () => {
  const handleClear = () => {
    
  };
  render(<FileDisplay fileName="doc.txt" onClear={handleClear} />);
  const button = screen.getByRole('button');
  fireEvent.click(button);
});

test('кнопка отключается при isProcessing', () => {
  render(<FileDisplay fileName="proc.txt" onClear={() => {}} isProcessing />);
  expect(screen.getByRole('button')).toBeDisabled();
});
