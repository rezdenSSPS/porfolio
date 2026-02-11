import { motion } from "framer-motion";
import { Instagram, Twitter, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { name: "Domů", href: "#home" },
  { name: "Projekty", href: "#projects" },
  { name: "O mně", href: "#about" },
  { name: "Služby", href: "#services" },
  { name: "Kontakt", href: "#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="#home"
            className="text-xl font-bold text-white tracking-tight"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logo
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="text-sm text-gray-300 hover:text-white transition-colors duration-300"
                whileHover={{ y: -2 }}
              >
                {link.name}
              </motion.a>
            ))}

            {/* Divider */}
            <div className="h-4 w-px bg-white/20" />

            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Instagram size={18} />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter size={18} />
              </motion.a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ 
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ x: -20, opacity: 0 }}
                animate={{ 
                  x: isOpen ? 0 : -20, 
                  opacity: isOpen ? 1 : 0 
                }}
                transition={{ delay: 0.1 * index }}
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </motion.a>
            ))}
            <div className="flex space-x-4 pt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
