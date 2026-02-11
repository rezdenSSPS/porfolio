import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, Linkedin, Github } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setFormError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setFormStatus('success');
        setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      } else {
        setFormStatus('error');
        setFormError(result.error || 'Nepodařilo se odeslat zprávu');
      }
    } catch (error) {
      setFormStatus('error');
      setFormError('Nepodařilo se odeslat zprávu. Zkuste to prosím znovu.');
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "denis@reznicek.xyz",
      href: "mailto:denis@reznicek.xyz",
    },
    {
      icon: Phone,
      label: "Telefon",
      value: "+420 776 523 655",
      href: "tel:+420776523655",
    },
    {
      icon: MapPin,
      label: "Lokalita",
      value: "Praha, Česká republika",
      href: "#",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold tracking-widest text-accent uppercase mb-4">
              Kontakt
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Pojďme spolupracovat
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Máte nápad na projekt nebo potřebujete nový web? 
              Ozvěte se mi a společně to dáme dohromady.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-8">
                Kontaktní informace
              </h3>

              <div className="space-y-6 mb-12">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center p-4 bg-secondary/50 rounded-xl border border-border hover:border-primary/50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary/30 transition-colors">
                      <item.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="text-foreground font-medium group-hover:text-accent transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <p className="text-sm text-muted-foreground mb-4">Sledujte mě na</p>
                <div className="flex space-x-4">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center border border-border hover:border-primary/50 hover:bg-secondary transition-all group"
                  >
                    <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center border border-border hover:border-primary/50 hover:bg-secondary transition-all group"
                  >
                    <Github className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {formStatus === 'success' ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Zpráva byla odeslána!</h3>
                  <p className="text-muted-foreground">Děkuji za váš zájem. Ozvu se vám co nejdříve.</p>
                  <button
                    onClick={() => setFormStatus('idle')}
                    className="mt-6 text-accent hover:text-accent/80 font-medium"
                  >
                    Odeslat další zprávu
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Jméno a příjmení *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="Jan Novák"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        placeholder="+420 123 456 789"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        placeholder="jan@email.cz"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Předmět
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="O čem je váš projekt?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Zpráva
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={5}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                      placeholder="Popište svůj projekt..."
                      required
                    />
                  </div>

                  {formStatus === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                      <p className="text-red-500">{formError}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={formStatus === 'sending'}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formStatus === 'sending' ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Odesílám...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Odeslat zprávu
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
