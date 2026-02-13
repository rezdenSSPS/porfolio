import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Webová Aplikace",
    description: "Moderní responzivní weby a webové aplikace na míru",
    features: [
      "Responzivní design",
      "Moderní technologie",
      "CMS systém",
      "SEO optimalizace",
      "Rychlé načítání",
      "Podpora a údržba",
    ],
    popular: false,
    link: "/poptavka/web",
  },
  {
    title: "Mobilní Aplikace",
    description: "Nativní a multiplatformní mobilní aplikace",
    features: [
      "iOS & Android",
      "Nativní výkon",
      "Offline režim",
      "Push notifikace",
      "Integrace API",
      "App Store publikování",
    ],
    popular: true,
    link: "/poptavka/app",
  },
  {
    title: "Individuální Projekt",
    description: "Speciální řešení podle vašich jedinečných požadavků",
    features: [
      "Analýza potřeb",
      "Individuální návrh",
      "Škálovatelné řešení",
      "Dlhodobá spolupráce",
      "Technická podpora",
      "Rozšíření funkcí",
    ],
    popular: false,
    link: "/poptavka/custom",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold tracking-widest text-accent uppercase mb-4">
            Nejoblíbenější webové stránky
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Každý projekt je jedinečný
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Každý projekt je speciální a vyžaduje individuální přístup. 
            Podívejte se, s čím vám mohu pomoci, a nechte si vypracovat cenovou nabídku na míru.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl border transition-all duration-300 flex flex-col ${
                service.popular
                  ? "p-10 md:p-12 bg-gradient-to-b from-primary/20 to-accent/20 border-primary scale-105 min-h-[480px] md:min-h-[520px]"
                  : "p-8 bg-secondary/50 border-border hover:border-primary/50"
              }`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    NEJOBLÍBENĚJŠÍ
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm mb-6">{service.description}</p>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-foreground">
                    <Check className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to={service.link} className="w-full">
                <Button
                  className={`w-full ${
                    service.popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                  }`}
                >
                  Zadat poptávku
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
