import { motion } from "framer-motion";
import { Heart, Instagram, Twitter, Linkedin, Github } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "Domů", href: "#home" },
    { label: "Projekty", href: "#projects" },
    { label: "O mně", href: "#about" },
    { label: "Služby", href: "#services" },
    { label: "Kontakt", href: "#contact" },
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
  ];

  return (
    <footer className="bg-[#151515] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#home" className="text-2xl font-bold text-white tracking-tight">
              Logo
            </a>
            <p className="text-gray-400 mt-4 max-w-sm">
              Tvůrce moderních webových stránek a aplikací. 
              Pomáhám firmám růst v digitálním světě.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Rychlé odkazy</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Sledujte mě</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5 text-gray-400" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            {currentYear} Všechna práva vyhrazena.
          </p>
          <p className="text-gray-500 text-sm flex items-center">
            Vytvořeno s{" "}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-red-500 mx-1 fill-current" />
            </motion.span>
            {" "}v České republice
          </p>
        </div>
      </div>
    </footer>
  );
}
