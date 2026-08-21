import { motion } from "framer-motion";
import { MessageSquare, PenTool, Code2, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Poptávka a konzultace",
    description:
      "Ozvete se přes formulář nebo telefon. Probereme cíle, rozsah a termín. Do 24 hodin se vám ozvu s orientační cenou.",
  },
  {
    icon: PenTool,
    title: "Návrh a nabídka",
    description:
      "Připravím návrh řešení a pevnou cenovou nabídku. Než začneme pracovat, všechno spolu odsouhlasíme.",
  },
  {
    icon: Code2,
    title: "Vývoj",
    description:
      "Web nebo aplikaci postavím na moderních technologiích. Průběžně vidíte pokrok a máte prostor na zpětnou vazbu.",
  },
  {
    icon: Rocket,
    title: "Spuštění a podpora",
    description:
      "Projekt spustíme naostro, předám vám všechny přístupy a jsem tu i nadále pro další úpravy a údržbu.",
  },
];

export function Process() {
  return (
    <section id="process" className="py-24 bg-background">
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
            Jak spolupráce probíhá
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Od nápadu k hotovému projektu
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Jednoduchý a transparentní postup, díky kterému přesně víte, co vás čeká
            v každém kroku.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-8 bg-secondary/50 rounded-2xl border border-border hover:border-accent/50 transition-all duration-300"
            >
              {/* Step number */}
              <span className="absolute top-6 right-6 text-5xl font-bold text-border/60 leading-none select-none">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                <step.icon className="w-6 h-6 text-accent" aria-hidden="true" />
              </div>

              <h3 className="text-lg font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
