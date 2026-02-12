import { motion } from "framer-motion";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { fetchWithCache, prefetch } from "@/lib/api";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string | null;
  websiteUrl: string | null;
  technologies: string[];
  featured: boolean;
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
  const hasImage = project.imageUrl && project.imageUrl !== '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-500">
        <button 
          ref={imageContainerRef}
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-muted to-secondary block w-full cursor-none"
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: isHovering ? 1.1 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={hasImage ? project.imageUrl! : 'https://via.placeholder.com/800x500?text=No+Image'}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 text-xs font-medium bg-secondary/80 backdrop-blur-md rounded-full text-foreground border border-border">
              {project.category}
            </span>
          </div>

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
        </button>

        <div className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
            {project.description}
          </p>

          {project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs bg-secondary text-foreground rounded border border-border"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {hasWebsite && (
            <a
              href={project.websiteUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-foreground hover:text-accent transition-colors group/link"
            >
              <span className="border-b border-transparent group-hover/link:border-accent transition-all">
                Navstivit web
              </span>
              <ExternalLink size={14} className="ml-2 group-hover/link:translate-x-1 transition-transform" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsPage() {
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

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold tracking-widest text-accent uppercase mb-4">
              Portfolio
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Moje Projekty
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Zde jsou některé z mých nedávných projektů. Každý z nich je unikátní 
              a přizpůsobený potřebám klienta.
            </p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-t-4 border-accent"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={fetchProjects}
                className="text-accent hover:text-accent/80 underline"
              >
                Zkusit znovu
              </button>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Zatím zde nejsou žádné projekty.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
