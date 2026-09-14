import { createContext, useState, useEffect, useCallback } from 'react';

export const ThemeContext = createContext(null);
const STORAGE_KEY = 'shopsphere_theme';

const getInitialTheme = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  // Drives the orbiting-products overlay; null means no transition is in flight
  const [fx, setFx] = useState(null); // { targetTheme }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(
    (event) => {
      const next = theme === 'dark' ? 'light' : 'dark';
      const x = event?.clientX ?? window.innerWidth / 2;
      const y = event?.clientY ?? window.innerHeight / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      document.documentElement.style.setProperty('--theme-x', `${x}px`);
      document.documentElement.style.setProperty('--theme-y', `${y}px`);
      document.documentElement.style.setProperty('--theme-radius', `${radius}px`);
      document.documentElement.style.setProperty(
        '--theme-duration',
        next === 'dark' ? '700ms' : '600ms'
      );

      const reduced = prefersReducedMotion();

      // Reduced motion or unsupported browsers: switch instantly, no fanfare
      if (reduced || !document.startViewTransition) {
        setTheme(next);
        return;
      }

      setFx({ targetTheme: next });
      const transition = document.startViewTransition(() => setTheme(next));
      transition.finished.finally(() => {
        // Small buffer so the orbit overlay's own fade-out isn't cut short
        setTimeout(() => setFx(null), 150);
      });
    },
    [theme]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, fx }}>{children}</ThemeContext.Provider>
  );
}
