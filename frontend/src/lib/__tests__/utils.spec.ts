import { cn, formatDate, formatRelativeDate, debounce, getRandomColor, truncate } from '../utils';
import { mockDate, mockDateString, mockInvalidDate, mockClassNames, mockLongString, mockShortString } from '../__fixtures__/utils.fixture';

describe('utils', () => {
  describe('cn', () => {
    it('debería fusionar clases de Tailwind correctamente', () => {
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toBe('py-1 px-4');
    });

    it('debería manejar arrays de clases', () => {
      const result = cn(mockClassNames);
      expect(result).toBeDefined();
    });

    it('debería manejar clases condicionales', () => {
      const result = cn('px-2', false && 'py-1', 'px-4');
      // tailwind-merge puede eliminar clases duplicadas, así que verificamos que contenga las clases
      expect(result).toContain('px-4');
      expect(result).not.toContain('py-1');
    });
  });

  describe('formatDate', () => {
    it('debería formatear una fecha correctamente con formato por defecto', () => {
      const result = formatDate(mockDate);
      expect(result).toBe('15/01/2024');
    });

    it('debería formatear una fecha string', () => {
      const result = formatDate(mockDateString);
      expect(result).toBe('15/01/2024');
    });

    it('debería retornar "Fecha inválida" para fechas inválidas', () => {
      const result = formatDate(mockInvalidDate);
      expect(result).toBe('Fecha inválida');
    });

    it('debería usar formato personalizado', () => {
      const result = formatDate(mockDate, 'dd/MM/yyyy');
      expect(result).toBe('15/01/2024');
    });
  });

  describe('formatRelativeDate', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T10:30:00.000Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('debería retornar "Hace X minutos" para fechas recientes', () => {
      const date = new Date('2024-01-15T10:25:00.000Z');
      const result = formatRelativeDate(date);
      expect(result).toContain('minuto');
    });

    it('debería retornar "Hace X horas" para fechas de hace horas', () => {
      const date = new Date('2024-01-15T08:30:00.000Z');
      const result = formatRelativeDate(date);
      expect(result).toContain('hora');
    });

    it('debería retornar "Ayer" para fechas de ayer', () => {
      const date = new Date('2024-01-14T10:30:00.000Z');
      const result = formatRelativeDate(date);
      expect(result).toBe('Ayer');
    });

    it('debería retornar "Hace X días" para fechas recientes', () => {
      const date = new Date('2024-01-13T10:30:00.000Z');
      const result = formatRelativeDate(date);
      expect(result).toContain('días');
    });

    it('debería retornar "Hace X semanas" para fechas de hace semanas', () => {
      const date = new Date('2024-01-08T10:30:00.000Z');
      const result = formatRelativeDate(date);
      expect(result).toContain('semana');
    });

    it('debería retornar fecha formateada para fechas antiguas', () => {
      const date = new Date('2023-12-15T10:30:00.000Z');
      const result = formatRelativeDate(date);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('debería ejecutar la función después del delay', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn('arg1', 'arg2');
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('debería cancelar la ejecución anterior si se llama de nuevo', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn('first');
      jest.advanceTimersByTime(500);
      debouncedFn('second');
      jest.advanceTimersByTime(500);
      expect(mockFn).not.toHaveBeenCalled();
      jest.advanceTimersByTime(500);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('second');
    });
  });

  describe('getRandomColor', () => {
    it('debería retornar un color hexadecimal válido', () => {
      const color = getRandomColor();
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it('debería retornar un color de la lista predefinida', () => {
      const validColors = [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#EF4444',
        '#8B5CF6',
        '#EC4899',
        '#14B8A6',
        '#F97316',
      ];
      const color = getRandomColor();
      expect(validColors).toContain(color);
    });
  });

  describe('truncate', () => {
    it('debería truncar texto largo', () => {
      const result = truncate(mockLongString, 50);
      expect(result.length).toBeLessThanOrEqual(53); // 50 + '...'
      expect(result).toContain('...');
    });

    it('debería retornar el texto completo si es corto', () => {
      const result = truncate(mockShortString, 50);
      expect(result).toBe(mockShortString);
      expect(result).not.toContain('...');
    });

    it('debería truncar exactamente en el límite', () => {
      const result = truncate(mockLongString, 20);
      expect(result.length).toBe(23); // 20 + '...'
      expect(result.slice(0, 20)).toBe(mockLongString.slice(0, 20));
    });
  });
});

