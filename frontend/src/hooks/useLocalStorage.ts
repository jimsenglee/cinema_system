import { useState, useCallback } from 'react';

interface StorageValue<T> {
  value: T;
  timestamp: number;
  expiresAt?: number;
}

/**
 * Custom hook for localStorage with expiration support
 * Following DRY principles - use this instead of direct localStorage calls
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  expirationMinutes?: number
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get initial value from localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      
      const parsed: StorageValue<T> = JSON.parse(item);
      
      // Check if expired
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        window.localStorage.removeItem(key);
        return initialValue;
      }
      
      return parsed.value;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Setter function
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        const storageValue: StorageValue<T> = {
          value: valueToStore,
          timestamp: Date.now(),
          expiresAt: expirationMinutes 
            ? Date.now() + expirationMinutes * 60 * 1000 
            : undefined
        };
        
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(storageValue));
        
        // Dispatch custom event for cross-tab sync
        window.dispatchEvent(
          new CustomEvent('localStorageChange', {
            detail: { key, value: valueToStore }
          })
        );
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, expirationMinutes]
  );

  // Remove function
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook to sync localStorage across browser tabs
 */
export function useLocalStorageSync<T>(
  key: string,
  callback: (value: T) => void
): void {
  useState(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        callback(e.detail.value);
      }
    };

    window.addEventListener('localStorageChange' as any, handleStorageChange);
    
    return () => {
      window.removeEventListener('localStorageChange' as any, handleStorageChange);
    };
  });
}
