import { useState, useEffect } from 'react';

/**
 * Hook personalizado para debouncing
 * 
 * @param {any} value - Valor a ser debounced
 * @param {number} delay - Tempo de delay em milissegundos
 * @returns {any} Valor debounced
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}