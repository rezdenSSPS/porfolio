import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

interface LogoProps {
  className?: string;
  height?: number;
}

// Cloudinary URLs with optimization - logos uploaded successfully
const LIGHT_LOGO_URL = "https://res.cloudinary.com/dg3rfqbvz/image/upload/f_auto,q_auto/v1770833911/portfolio/logos/logo-light.png"; // Black text, for light backgrounds
const DARK_LOGO_URL = "https://res.cloudinary.com/dg3rfqbvz/image/upload/f_auto,q_auto/v1770833912/portfolio/logos/logo-dark.png";   // White text, for dark backgrounds

export function Logo({ className = "", height = 120 }: LogoProps) {
  const { theme } = useTheme();
  
  // Use dark logo (white text) when in dark mode, light logo (black text) when in light mode
  const logoUrl = theme === "dark" ? DARK_LOGO_URL : LIGHT_LOGO_URL;
  
  // Calculate approximate width based on aspect ratio (logo is roughly 3:1)
  const width = Math.round(height * 3);

  return (
    <motion.img
      src={logoUrl}
      alt="Denis Řezníček - Logo"
      width={width}
      height={height}
      className={`w-auto object-contain ${className}`}
      style={{ height: `${height}px`, width: 'auto' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      loading="eager"
      decoding="async"
    />
  );
}

// Fallback text logo if images fail to load
export function LogoText({ className = "" }: { className?: string }) {
  return (
    <span className={`text-xl font-bold text-foreground tracking-tight ${className}`}>
      Reznucek
    </span>
  );
}
