'use client'

import { BsMoon, BsSun } from 'react-icons/bs';
import { useThemeStore } from "@/stores/theme"
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion';

export function ToggleDarkModeButton() {
  const { darkMode, setDarkMode } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [darkMode, mounted]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (!mounted) return null;

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="flex items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {darkMode ? (
          <BsSun className="w-5 h-5 text-warning" />
        ) : (
          <BsMoon className="w-5 h-5 text-primary" />
        )}
      </motion.div>
    </motion.button>
  )
}