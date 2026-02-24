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
            {/* Profile Image */}
            <div className="flex justify-center mb-12">
              <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-border shadow-lg">
                <img
                  src="https://res.cloudinary.com/dg3rfqbvz/image/upload/v1771188351/WhatsApp_Image_2026-02-11_at_20.10.21_egqihb.jpg"
                  alt="Denis Řezníček - Web Designer & Developer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* About Text */}
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-foreground font-medium text-center"
              >
                Ahoj! Jsem Denis a vítejte na mém portfoliu.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-secondary/50 rounded-xl p-8 border border-border"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Moje cesta</h2>
                <p>
                  Do světa webového vývoje jsem se dostal před více než třemi lety, 
                  kdy jsem zjistil, že kombinace kreativity a logiky je přesně to, co mě baví.
                  Od té doby jsem pomohl desítkám klientů vybudovat si silnou online přítomnost.
                  Začínal jsem jako samouk, postupně jsem prošel kurzy a praxí, až jsem se 
                  dostal k profesionálnímu webovému vývoji.
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
                  Baví mě celý proces od nápadu po fungující web. Největší radost mi dělá 
                  vidět, když projekt začne fungovat a přináší klientovi reálné výsledky.
                  Specializuju se na React ekosystém – Next.js, TypeScript a moderní nástroje,
                  které umožňují stavět rychlé a spolehlivé aplikace. Neustále se učím 
                  nové věci a sleduju nejnovější trendy ve vývoji.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-secondary/50 rounded-xl p-8 border border-border"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Jak pracuju</h2>
                <p>
                  Věřím v transparentní komunikaci a pravidelné zpětné vazby. Každý projekt 
                  beru jako partnerství – moje práce není hotová předáním kódu, ale tehdy, 
                  když klient dosáhne svých cílů. Proto dbám na to, aby weby nejen skvěle 
                  vypadaly, ale hlavně fungovaly a přinášely hodnotu.
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
