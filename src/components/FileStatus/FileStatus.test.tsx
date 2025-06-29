import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { FileStatus } from './FileStatus';
import '@testing-library/jest-dom';
import styles from './FileStatus.module.css'; 




describe('FileStatus', () => {
        test('отображает сообщение об успешной обработке и иконку улыбки', () => {
    render(<FileStatus type="success" isActive={false} />);
    expect(screen.getByText(/обработан успешно/i)).toBeInTheDocument();
    expect(screen.getByTestId('smile-icon')).toBeInTheDocument(); // обновили селектор
    });

    test('отображает сообщение об ошибке и иконку грустного смайла', () => {
    render(<FileStatus type="error" isActive={false} />);
    expect(screen.getByText(/не удалось обработать/i)).toBeInTheDocument();
    expect(screen.getByTestId('icon-smile-sad')).toBeInTheDocument();
; // используйте правильный testid
    });


    test('добавляет активный класс при isActive === true', () => {
        const { container } = render(<FileStatus type="success" isActive={true} />);
        expect(container.firstChild).toHaveClass(styles.active);
    });
});
