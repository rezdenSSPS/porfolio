import { motion } from "framer-motion";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithCache, prefetch } from "@/lib/api";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string | null;
  websiteUrl: string | null;
  technologies: string[];
  images?: { url: string; imageUrl?: string }[];
  featured: boolean;
}

// Helper to optimize Cloudinary URLs
function getOptimizedCloudinaryUrl(url: string, width: number = 800): string {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // Insert transformation parameters after /upload/
  return url.replace(
    '/upload/',
    `/upload/f_auto,q_auto,w_${width}/`
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const navigate = useNavigate();
  const imageContainerRef = useRef<HTMLButtonElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleImageClick = () => {
    navigate(`/project/${project.id}`);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    // Prefetch project detail when hovering
    prefetch(`/api/projects/${project.id}`);
  };
  const handleMouseLeave = () => setIsHovering(false);

  const hasWebsite = project.websiteUrl && project.websiteUrl !== '#';
  const rawImageUrl = project.imageUrl || project.images?.[0]?.url || project.images?.[0]?.imageUrl || '';
  const hasImage = rawImageUrl !== '';
  
  // Get optimized image URLs for different sizes
  const displayImage = hasImage ? getOptimizedCloudinaryUrl(rawImageUrl, 800) : '';
  const displayImageSmall = hasImage ? getOptimizedCloudinaryUrl(rawImageUrl, 400) : '';

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-500">
        {/* Project Image - Always clickable to project detail */}
        <button 
          ref={imageContainerRef}
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-muted to-secondary block w-full cursor-none"
          aria-label={`Zobrazit detail projektu ${project.title}`}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center will-change-transform"
            animate={{ scale: isHovering ? 1.1 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <picture>
              <source
                media="(max-width: 640px)"
                srcSet={hasImage ? `${displayImageSmall} 1x, ${displayImage} 2x` : undefined}
              />
              <img
                src={hasImage ? displayImage : 'https://via.placeholder.com/800x500?text=No+Image'}
                alt={`${project.title} - ${project.category}`}
                width={800}
                height={500}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                style={{ aspectRatio: '16/10' }}
              />
            </picture>
          </motion.div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 text-xs font-medium bg-secondary/80 backdrop-blur-md rounded-full text-foreground border border-border">
              {project.category}
            </span>
          </div>

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
            aria-hidden="true"
          >
            <span className="p-3 bg-white text-black rounded-full flex items-center justify-center shadow-lg">
              <ArrowUpRight size={20} />
            </span>
          </div>
        </button>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
            {project.description}
          </p>

          {/* Technologies */}
          {project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Použité technologie">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  role="listitem"
                  className="px-2 py-1 text-xs bg-secondary text-foreground rounded border border-border"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Link */}
          {hasWebsite && (
            <a
              href={project.websiteUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-foreground hover:text-accent transition-colors group/link"
              aria-label={`Navštívit web projektu ${project.title}`}
            >
              <span className="border-b border-transparent group-hover/link:border-accent transition-all">
                Navstivit web
              </span>
              <ExternalLink size={14} className="ml-2 group-hover/link:translate-x-1 transition-transform" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await fetchWithCache<{success: boolean, data: Project[]}>(
        '/api/projects'
      );
      
      if (data.success) {
        setProjects(data.data);
      } else {
        setError('Failed to load projects');
      }
    } catch {
      setError('An error occurred while loading projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="projects" className="py-24 bg-background" aria-busy="true" aria-label="Načítání projektů">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-t-4 border-blue-600" role="status">
              <span className="sr-only">Načítání projektů...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-24 bg-background" aria-label="Chyba načítání">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4" role="alert">{error}</p>
            <button 
              onClick={fetchProjects}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Zkusit znovu
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 bg-background" aria-labelledby="projects-heading">
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
            Portfolio
          </p>
          <h2 id="projects-heading" className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Moje Projekty
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
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
      </div>
    </section>
  );
}
