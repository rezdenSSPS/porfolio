import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

export function Hero() {
  const navigate = useNavigate();
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleImageClick = () => {
    navigate('/about');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

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
      className="min-h-screen flex items-center pt-16 bg-gradient-to-br from-card via-background to-secondary"
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
              className="text-sm font-semibold tracking-widest text-muted-foreground uppercase"
            >
              Ahoj, jsem tvůrce webů
            </motion.p>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[0.95] tracking-tight"
            >
              <span className="block">JSEM</span>
              <span className="block mt-2">WEB DESIGNER</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-md leading-relaxed"
            >
              Specializuji se na tvorbu moderních a funkčních webových stránek,
              které pomáhají firmám růst a zaujmout jejich zákazníky.
              Každý projekt je pro mě novou výzvou.
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={itemVariants}>
              <Link to="/projects">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="group border-border bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 px-8 py-6 text-sm font-semibold tracking-wider"
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
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="flex gap-12 pt-8 border-t border-border"
            >
              <div>
                <p className="text-3xl font-bold text-foreground">3+</p>
                <p className="text-sm text-muted-foreground mt-1">Roky zkušeností</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">15+</p>
                <p className="text-sm text-muted-foreground mt-1">Dokončených projektů</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground mt-1">Spokojených klientů</p>
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
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl rounded-full scale-150" />

              {/* Person Image Placeholder - Now Clickable */}
              <motion.div
                ref={imageContainerRef}
                onClick={handleImageClick}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative z-10 w-full max-w-md aspect-[3/4] rounded-[var(--radius)] overflow-hidden bg-secondary cursor-none"
              >
                <motion.img
                  src="https://res.cloudinary.com/dg3rfqbvz/image/upload/v1770832163/615768307_1592252328450020_3440170313654590281_n_qas5tj.jpg"
                  alt="Profilová fotografie"
                  className="w-full h-full object-cover"
                  animate={{ scale: isHovering ? 1.1 : 1 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Custom Cursor - Arrow follows mouse */}
                <div 
                  className="absolute pointer-events-none z-20"
                  style={{
                    left: mousePosition.x - 24,
                    top: mousePosition.y - 24,
                    opacity: isHovering ? 1 : 0,
                    transform: `scale(${isHovering ? 1 : 0.5})`,
                    transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
                  }}
                >
                  <span className="p-3 bg-white text-black rounded-full flex items-center justify-center shadow-lg">
                    <ArrowUpRight size={20} />
                  </span>
                </div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-4 -left-4 z-20 bg-primary text-primary-foreground px-4 py-2 rounded-[var(--radius)] shadow-[var(--shadow-xl)]"
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
          className="w-6 h-10 border-2 border-border rounded-full flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 bg-foreground rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
