import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      
      setDarkMode: (darkMode: boolean) => {
        set({ darkMode });
      },
      
      toggleDarkMode: () => {
        set({ darkMode: !get().darkMode });
      }
    }),
    {
      name: 'ez-moto-theme'
    }
  )
);