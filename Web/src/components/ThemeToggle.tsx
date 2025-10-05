import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="glass rounded-xl p-3 hover:scale-105 transition-all duration-300 group"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-6 h-6">
        {/* Sun icon for light mode */}
        <Sun 
          className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
            isDark 
              ? 'opacity-0 rotate-90 scale-0' 
              : 'opacity-100 rotate-0 scale-100'
          } text-yellow-500`} 
        />
        
        {/* Moon icon for dark mode */}
        <Moon 
          className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
            isDark 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          } text-blue-400`} 
        />
      </div>
    </button>
  );
};

export default ThemeToggle;

