import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

// TODO: Nahraď tyto ukázkové recenze skutečnými od svých klientů.
// Stačí upravit text, jméno, roli a počet hvězdiček (rating 1–5).
const testimonials = [
  {
    quote:
      "Denis odvedl skvělou práci. Nový web nám výrazně zjednodušil získávání poptávek a celý proces byl rychlý a bez starostí.",
    name: "Jana Nováková",
    role: "Majitelka, malá firma",
    rating: 5,
  },
  {
    quote:
      "Profesionální přístup od první konzultace až po předání. Komunikace byla jasná a všechno bylo hotové v termínu.",
    name: "Petr Svoboda",
    role: "Jednatel, e-shop",
    rating: 5,
  },
  {
    quote:
      "Přesně pochopil, co jsme potřebovali. Web je moderní, rychlý a konečně vypadá tak, jak jsme si vždycky přáli.",
    name: "Lucie Dvořáková",
    role: "Marketing, startup",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-background">
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
            Reference
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Co říkají klienti
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Na spokojenosti klientů mi záleží nejvíc. Tady je pár slov od těch,
            se kterými jsem spolupracoval.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.figure
              key={item.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex flex-col p-8 bg-secondary/50 rounded-2xl border border-border hover:border-accent/50 transition-all duration-300"
            >
              <Quote
                className="w-10 h-10 text-accent/30 mb-4"
                aria-hidden="true"
              />

              {/* Rating */}
              <div
                className="flex gap-1 mb-4"
                aria-label={`Hodnocení ${item.rating} z 5 hvězdiček`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < item.rating
                        ? "text-accent fill-accent"
                        : "text-border"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <blockquote className="text-foreground leading-relaxed mb-6 flex-grow">
                „{item.quote}"
              </blockquote>

              <figcaption className="mt-auto">
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
