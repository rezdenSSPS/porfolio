import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Základní Web",
    price: "5 000 Kč",
    description: "Ideální pro osobní prezentaci nebo malé podnikání",
    features: [
      "One-page design",
      "Responzivní layout",
      "Kontaktní formulář",
      "SEO základy",
      "1 měsíc podpory",
    ],
    popular: false,
  },
  {
    title: "Firemní Web",
    price: "15 000 Kč",
    description: "Profesionální řešení pro rostoucí firmy",
    features: [
      "Až 5 podstránek",
      "CMS systém",
      "Blog sekce",
      "Pokročilé SEO",
      "3 měsíce podpory",
      "Analytics integrace",
    ],
    popular: true,
  },
  {
    title: "E-commerce",
    price: "30 000 Kč",
    description: "Kompletní e-shop řešení s platební bránou",
    features: [
      "Neomezené produkty",
      "Platební brána",
      "Uživatelské účty",
      "Admin panel",
      "6 měsíců podpory",
      "Marketing nástroje",
      "Mobilní aplikace ready",
    ],
    popular: false,
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold tracking-widest text-blue-400 uppercase mb-4">
            Ceník
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Služby a ceny
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Transparentní ceny bez skrytých poplatků. Vyberte si balíček 
            podle vašich potřeb.
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
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                service.popular
                  ? "bg-gradient-to-b from-blue-900/30 to-purple-900/30 border-blue-500/50 scale-105"
                  : "bg-secondary/20 border-white/10 hover:border-white/20"
              }`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                    NEJOBLÍBENĚJŠÍ
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{service.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{service.price}</span>
                <span className="text-gray-500 ml-2">/projekt</span>
              </div>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  service.popular
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                }`}
              >
                Nezávazná konzultace
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Custom Project CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center p-8 bg-secondary/20 rounded-2xl border border-white/10"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Potřebujete něco specifického?
          </h3>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Každý projekt je jedinečný. Pokud vaše požadavky nezapadají do 
            standardních balíčků, rád pro vás připravím individuální nabídku.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white hover:text-black"
          >
            Kontaktujte mě
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
