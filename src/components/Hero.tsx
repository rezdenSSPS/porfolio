import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 100, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
        delay: 0.4,
      },
    },
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-16 bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#2a2a2a]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Greeting */}
            <motion.p
              variants={itemVariants}
              className="text-sm font-semibold tracking-widest text-gray-400 uppercase"
            >
              Ahoj, jsem tvůrce webů
            </motion.p>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight"
            >
              <span className="block">JSEM</span>
              <span className="block mt-2">WEB DESIGNER</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-400 max-w-md leading-relaxed"
            >
              Specializuji se na tvorbu moderních a funkčních webových stránek, 
              které pomáhají firmám růst a zaujmout jejich zákazníky. 
              Každý projekt je pro mě novou výzvou.
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-white/30 bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-6 text-sm font-semibold tracking-wider"
                >
                  ZOBRAZIT PROJEKTY
                  <motion.span
                    className="ml-2 inline-block"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="flex gap-12 pt-8 border-t border-white/10"
            >
              <div>
                <p className="text-3xl font-bold text-white">3+</p>
                <p className="text-sm text-gray-500 mt-1">Roky zkušeností</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">15+</p>
                <p className="text-sm text-gray-500 mt-1">Dokončených projektů</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-sm text-gray-500 mt-1">Spokojených klientů</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl rounded-full scale-150" />
              
              {/* Person Image Placeholder */}
              <motion.div
                className="relative z-10 w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-b from-gray-700 to-gray-800"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face"
                  alt="Profilová fotografie"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </motion.div>

              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-4 -left-4 z-20 bg-white text-black px-4 py-2 rounded-lg shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <p className="text-sm font-semibold">Dostupný pro projekty</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 bg-white rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
