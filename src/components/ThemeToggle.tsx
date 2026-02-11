import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full bg-muted border border-border p-1 transition-colors hover:bg-muted/80"
      aria-label="Přepnout téma"
    >
      <motion.div
        className="absolute top-1 left-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md"
        animate={{
          x: theme === 'dark' ? 32 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: theme === 'dark' ? 360 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'dark' ? (
            <Moon className="w-3.5 h-3.5 text-primary-foreground" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-primary-foreground" />
          )}
        </motion.div>
      </motion.div>
      
      {/* Icons on background */}
      <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none">
        <Sun className="w-3.5 h-3.5 text-muted-foreground" />
        <Moon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
    </button>
  );
}
