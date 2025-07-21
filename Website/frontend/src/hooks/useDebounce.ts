// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

// This hook takes a value and a delay, and only updates the returned value
// after the user has stopped typing for the specified delay.
export default function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to cancel the timeout if the value changes again
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}