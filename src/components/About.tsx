import { motion } from "framer-motion";
import { Code, Palette, Rocket, Users, Zap, Globe } from "lucide-react";

const skills = [
  {
    icon: Code,
    title: "Web Development",
    description: "Tvorba moderních webů pomocí React, Next.js, TypeScript a dalších technologií.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Návrh uživatelsky přívětivých rozhraní s důrazem na estetiku a funkčnost.",
  },
  {
    icon: Rocket,
    title: "Optimalizace",
    description: "Rychlost, SEO a výkonnost webů pro lepší pozice ve vyhledávačích.",
  },
  {
    icon: Users,
    title: "Spolupráce",
    description: "Pravidelná komunikace a transparentní proces vývoje s klienty.",
  },
  {
    icon: Zap,
    title: "Responzivita",
    description: "Weby perfektně fungující na všech zařízeních od mobilů po desktop.",
  },
  {
    icon: Globe,
    title: "CMS Integrace",
    description: "Napojení na systémy pro správu obsahu jako WordPress, Sanity nebo Strapi.",
  },
];

export function About() {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold tracking-widest text-accent uppercase mb-4">
              O mně
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Váš partner pro
              <span className="text-accent"> digitální úspěch</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Jsem nadšenec do moderních webových technologií s vášní pro kreativní 
                řešení. Už více než 3 roky pomáhám firmám a jednotlivcům budovat 
                jejich online přítomnost.
              </p>
              <p>
                Každý projekt je pro mě příležitostí vytvořit něco unikátního a 
                funkčního. Věřím, že dobrý web by měl nejen vypadat skvěle, ale 
                také přinášet reálné výsledky.
              </p>
              <p>
                Specializuji se na React ekosystém a moderní přístupy k vývoji, 
                které zajišťují rychlé, bezpečné a škálovatelné řešení.
              </p>
            </div>

            {/* Experience Bar */}
            <div className="mt-8 space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-foreground font-medium">Frontend Development</span>
                  <span className="text-muted-foreground">95%</span>
                </div>
                <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: "95%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-foreground font-medium">UI/UX Design</span>
                  <span className="text-muted-foreground">85%</span>
                </div>
                <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: "85%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-foreground font-medium">Backend & API</span>
                  <span className="text-muted-foreground">75%</span>
                </div>
                <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: "75%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.6 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Skills Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group p-6 bg-secondary/50 rounded-xl border border-border hover:border-primary/50 hover:bg-secondary transition-all duration-300"
              >
                <skill.icon className="w-10 h-10 text-accent mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{skill.title}</h3>
                <p className="text-sm text-muted-foreground">{skill.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
