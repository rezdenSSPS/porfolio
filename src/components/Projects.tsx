import { motion } from "framer-motion";
import { projects, type Project } from "@/lib/data";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [copied, setCopied] = useState(false);

  const copyPrompt = () => {
    navigator.clipboard.writeText(project.aiPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-xl bg-secondary/50 border border-white/10 hover:border-white/20 transition-all duration-500">
        {/* Project Image */}
        <a 
          href={project.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 block"
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />
          </motion.div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-xs font-medium bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20">
              {project.category}
            </span>
          </div>

          {/* View Website Button on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium flex items-center gap-2">
              Navštívit web
              <ExternalLink size={14} />
            </span>
          </div>
        </a>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs bg-white/5 text-gray-300 rounded border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* AI Prompt Section */}
          <div className="bg-black/30 rounded-lg p-3 mb-4 border border-white/5">
            <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">
              AI Prompt pro mockup:
            </p>
            <p className="text-xs text-gray-400 line-clamp-2 mb-2">
              {project.aiPrompt.substring(0, 100)}...
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyPrompt}
              className="w-full text-xs bg-white/5 hover:bg-white/10 text-gray-300"
            >
              {copied ? (
                <>
                  <Check size={14} className="mr-2 text-green-400" />
                  Zkopírováno!
                </>
              ) : (
                <>
                  <Copy size={14} className="mr-2" />
                  Kopírovat celý prompt
                </>
              )}
            </Button>
          </div>

          {/* Link */}
          <a
            href={project.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-white hover:text-blue-400 transition-colors group/link"
          >
            <span className="border-b border-transparent group-hover/link:border-blue-400 transition-all">
              Zobrazit projekt
            </span>
            <ExternalLink size={14} className="ml-2 group-hover/link:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="py-24 bg-[#1a1a1a]">
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
            Portfolio
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Moje Projekty
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Zde jsou některé z mých nedávných projektů. Každý z nich je unikátní 
            a přizpůsobený potřebám klienta.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Instructions for adding custom images */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 p-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl border border-white/10"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            🎨 Jak přidat vlastní mockupy
          </h3>
          <div className="space-y-4 text-gray-400">
            <p>
              <strong className="text-white">Krok 1:</strong> Použijte AI prompt níže ke generování obrázku notebooku s vaším webem na obrazovce.
            </p>
            <p>
              <strong className="text-white">Krok 2:</strong> Nahrajte vygenerovaný obrázek do složky <code className="bg-black/30 px-2 py-1 rounded">public/projects/</code> nebo na cloud (Cloudinary, Imgur).
            </p>
            <p>
              <strong className="text-white">Krok 3:</strong> Upravte soubor <code className="bg-black/30 px-2 py-1 rounded">src/lib/data.ts</code> a změňte <code className="bg-black/30 px-2 py-1 rounded">imageUrl</code> na cestu k vašemu obrázku a <code className="bg-black/30 px-2 py-1 rounded">websiteUrl</code> na URL vašeho webu.
            </p>
          </div>

          <div className="mt-6 p-4 bg-black/30 rounded-lg">
            <p className="text-sm text-gray-500 mb-2 font-semibold uppercase tracking-wider">
              Generický AI Prompt Template:
            </p>
            <p className="text-sm text-gray-300 font-mono">
              Professional product photography of a [TYP NOTEBOOKU] on [TYP STOlu], 
              screen displaying [POPIS VAŠEHO WEBU], [SVĚTLO], 
              [POZADÍ], [STYL], photorealistic, 4K quality
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
