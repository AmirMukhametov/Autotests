import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, vi } from 'vitest';

import { Dropzone } from './Dropzone';

describe('Компонент Dropzone', () => {
    test('Вызывает onFileSelect при выборе файла', () => {
        const onFileSelect = vi.fn();

        const { container } = render(
            <Dropzone file={null} status="idle" error={null} onFileSelect={onFileSelect} onClear={vi.fn()} />
        );

        const input = container.querySelector('input[type="file"]');
        expect(input).toBeInTheDocument();

        fireEvent.change(input!, {
            target: { files: [new File(['тест'], 'test.csv', { type: 'text/csv' })] },
        });

        expect(onFileSelect).toHaveBeenCalled();
    });

    test('Отображает сообщение об ошибке, если передан текст ошибки', () => {
        render(
            <Dropzone file={null} status="idle" error="Что-то пошло не так" onFileSelect={vi.fn()} onClear={vi.fn()} />
        );

        expect(screen.getByText(/что-то пошло не так/i)).toBeInTheDocument();
    });

    test('Отображает индикатор загрузки при статусе "processing"', () => {
        render(
            <Dropzone file={null} status="processing" error={null} onFileSelect={vi.fn()} onClear={vi.fn()} />
        );

        expect(screen.getByText(/идёт парсинг файла/i)).toBeInTheDocument();
    });
});
