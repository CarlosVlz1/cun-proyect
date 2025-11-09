import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input', () => {
  it('debería renderizar correctamente', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText(/enter text/i);
    expect(input).toBeInTheDocument();
  });

  it('debería manejar cambios de valor', async () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test');
    expect(handleChange).toHaveBeenCalled();
  });

  it('debería aceptar diferentes tipos', () => {
    const { rerender } = render(<Input type="text" />);
    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');

    rerender(<Input type="password" />);
    input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('debería estar deshabilitado cuando se pasa disabled', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('debería aceptar className personalizado', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('debería mostrar placeholder', () => {
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText(/type here/i);
    expect(input).toBeInTheDocument();
  });
});

