import { motion } from "framer-motion";
import { Heart, Instagram, Linkedin, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "Domů", href: "/" },
    { label: "Projekty", href: "/projects" },
    { label: "O mně", href: "/about" },
    { label: "Služby", href: "/services" },
    { label: "Kontakt", href: "/contact" },
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/denis-řezníček-151b6a3ab", label: "LinkedIn" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/">
              <Logo height={120} />
            </Link>
            <p className="text-muted-foreground mt-4 max-w-sm">
              Tvůrce moderních webových stránek a aplikací.
              Pomáhám firmám růst v digitálním světě.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Rychlé odkazy</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Sledujte mě</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-secondary/50 rounded-lg flex items-center justify-center border border-border hover:border-primary/50 hover:bg-secondary transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5 text-muted-foreground" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            {currentYear} Řezníček Denis Všechna práva vyhrazena.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/zasady-ochrany-osobnich-udaju.html" className="text-muted-foreground hover:text-foreground transition-colors">
              Ochrana osobních údajů
            </a>
            <a href="/obchodni-podminky.html" className="text-muted-foreground hover:text-foreground transition-colors">
              Obchodní podmínky
            </a>
            <a href="/zasady-pouzivani-cookies.html" className="text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </a>
            <a href="/gdpr-informace.html" className="text-muted-foreground hover:text-foreground transition-colors">
              GDPR
            </a>
          </div>
          <p className="text-muted-foreground text-sm flex items-center">
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
