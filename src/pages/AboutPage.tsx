import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

export function AboutPage() {
  return (
    <>
      <Navbar />
      <SEO 
        title="O mně"
        description="Poznejte Denis Řezníčka - web designera a developera s více než 3 lety zkušeností. Specializace na React, Next.js, TypeScript a moderní webové technologie."
        keywords="o mně, Denis Řezníček, web developer, React vývojář, Praha, zkušenosti"
      />
      <main className="pt-24 pb-16 min-h-screen" role="main">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold tracking-widest text-accent uppercase mb-4">
              O mně
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Kdo jsem
            </h1>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            {/* Profile Image Placeholder */}
            <div className="flex justify-center mb-12">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-4 border-border overflow-hidden">
                {/* Add your profile image here */}
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span className="text-6xl">👤</span>
                </div>
              </div>
            </div>

            {/* About Text - Customize this section */}
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-foreground font-medium text-center"
              >
                Ahoj! Jsem Denis Řezníček a vítejte na mém portfoliu.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-secondary/50 rounded-xl p-8 border border-border"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Moje cesta</h2>
                <p>
                  Zde můžete napsat o své cestě do světa webového vývoje. Kdy jste začali, 
                  co vás motivovalo, jaké byly vaše první kroky...
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-secondary/50 rounded-xl p-8 border border-border"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Co mě baví</h2>
                <p>
                  Zde můžete napsat o svých zájmech a vášních. Jaké technologie vás zajímají, 
                  co děláte ve volném čase, jaké máte koníčky...
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-secondary/50 rounded-xl p-8 border border-border"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Moje hodnoty</h2>
                <p>
                  Zde můžete napsat o svých hodnotách a přístupu k práci. Co je pro vás důležité, 
                  jak přistupujete k projektům, co můžete nabídnout klientům...
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center mt-12"
              >
                <p className="text-foreground">
                  Zajímá vás více? Neváhejte mě kontaktovat!
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
