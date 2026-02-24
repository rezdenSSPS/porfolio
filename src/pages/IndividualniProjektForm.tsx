import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Lightbulb, ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function IndividualniProjektForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    projectType: "",
    technologies: [] as string[],
    features: [] as string[],
    budget: "",
    deadline: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  const projectTypes = [
    "Automatizace",
    "Integrace systémů",
    "Datová analýza",
    "Dashboard/Reporting",
    "API vývoj",
    "Interní nástroj",
    "Migrace",
    "Optimalizace",
    "Koncept/Prototyp",
    "Jiné",
  ];

  const technologyOptions = [
    "React/Next.js",
    "Vue/Nuxt",
    "Node.js",
    "Python",
    "Databáze",
    "Cloud",
    "AI/ML",
    "Blockchain",
    "IoT",
    "Nevím/Potřebuji poradit",
  ];

  const featureOptions = [
    "Uživatelská administrace",
    "Reporting/Analytika",
    "Email notifikace",
    "Import/Export dat",
    "Multi-tenant",
    "API integrace",
    "Real-time data",
    "Škálovatelnost",
    "Zálohování",
    "Dokumentace",
  ];

  const budgetOptions = [
    "< 100 000 Kč",
    "100 000 - 300 000 Kč",
    "300 000 - 500 000 Kč",
    "500 000 - 1 000 000 Kč",
    "> 1 000 000 Kč",
    "Nevím",
  ];

  const handleTechnologyToggle = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech]
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

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
        body: JSON.stringify({
          ...formData,
          subject: `Poptávka: Individuální Projekt - ${formData.projectType}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFormStatus('success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          company: '',
          projectType: '',
          technologies: [],
          features: [],
          budget: '',
          deadline: '',
          message: '',
        });
      } else {
        setFormStatus('error');
        setFormError(result.error || 'Nepodařilo se odeslat zprávu');
      }
    } catch {
      setFormStatus('error');
      setFormError('Nepodařilo se odeslat zprávu. Zkuste to prosím znovu.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Link
              to="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zpět na hlavní stránku
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-10 h-10 text-accent-foreground" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Individuální Projekt
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Máte specifické požadavky? Popište mi váš projekt a společně najdeme nejlepší řešení.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-secondary/30 border-2 border-accent/50 rounded-2xl p-8"
          >
            {formStatus === 'success' ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Poptávka byla odeslána!</h3>
                <p className="text-muted-foreground">Děkuji za váš zájem. Ozvu se vám co nejdříve s analýzou a cenovou nabídkou.</p>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="mt-6 text-accent hover:text-accent/80 font-medium"
                >
                  Odeslat další poptávku
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                      className="w-full px-4 py-3 bg-secondary/50 border-2 border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors"
                      placeholder="Jan Novák"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Společnost
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-secondary/50 border-2 border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors"
                      placeholder="Název firmy"
                    />
                  </div>
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
                      className="w-full px-4 py-3 bg-secondary/50 border-2 border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors"
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
                      className="w-full px-4 py-3 bg-secondary/50 border-2 border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors"
                      placeholder="jan@email.cz"
                      required
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-3">
                    Typ projektu *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {projectTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, projectType: type })}
                        className={`px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all ${
                          formData.projectType === type
                            ? 'bg-accent/20 border-accent text-accent-foreground'
                            : 'bg-secondary/50 border-border text-muted-foreground hover:border-accent/50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-3">
                    Technologie
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {technologyOptions.map((tech) => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => handleTechnologyToggle(tech)}
                        className={`px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all ${
                          formData.technologies.includes(tech)
                            ? 'bg-accent/20 border-accent text-accent-foreground'
                            : 'bg-secondary/50 border-border text-muted-foreground hover:border-accent/50'
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-3">
                    Požadované funkce
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {featureOptions.map((feature) => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => handleFeatureToggle(feature)}
                        className={`flex items-center px-4 py-2 rounded-lg border-2 text-sm transition-all ${
                          formData.features.includes(feature)
                            ? 'bg-accent/20 border-accent text-accent-foreground'
                            : 'bg-secondary/50 border-border text-muted-foreground hover:border-accent/50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                          formData.features.includes(feature)
                            ? 'bg-accent border-accent'
                            : 'border-muted-foreground'
                        }`}>
                          {formData.features.includes(feature) && (
                            <Check className="w-3 h-3 text-accent-foreground" />
                          )}
                        </div>
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-3">
                    Rozpočet
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {budgetOptions.map((budget) => (
                      <button
                        key={budget}
                        type="button"
                        onClick={() => setFormData({ ...formData, budget })}
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.budget === budget
                            ? 'bg-accent/20 border-accent text-accent-foreground'
                            : 'bg-secondary/50 border-border text-muted-foreground hover:border-accent/50'
                        }`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Termín dokončení
                  </label>
                  <input
                    type="text"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-secondary/50 border-2 border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors"
                    placeholder="Např. Q2 2025, do konce roku..."
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Popis projektu *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={5}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                    placeholder="Podrobně popište váš projekt, cíle, problémy které řešíte, současný stav..."
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
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus === 'sending' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Odesílám...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Odeslat poptávku
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
