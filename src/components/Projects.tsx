import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
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

// Helper to optimize Cloudinary URLs (passes through non-Cloudinary URLs such
// as the DB-served /api/images/:id paths).
function getOptimizedCloudinaryUrl(url: string, width: number = 600): string {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}

function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate();

  const rawImageUrl =
    project.imageUrl || project.images?.[0]?.url || project.images?.[0]?.imageUrl || '';
  const hasImage = rawImageUrl !== '';
  const displayImage = hasImage ? getOptimizedCloudinaryUrl(rawImageUrl, 600) : '';
  const hasWebsite = project.websiteUrl && project.websiteUrl !== '#';

  return (
    <article className="group/card w-[300px] sm:w-[340px] flex-shrink-0">
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl bg-card border border-border transition-colors duration-300 hover:border-primary/50">
        {/* Image - clickable to detail */}
        <button
          onClick={() => navigate(`/project/${project.id}`)}
          onMouseEnter={() => prefetch(`/api/projects/${project.id}`)}
          className="relative block aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-muted to-secondary"
          aria-label={`Zobrazit detail projektu ${project.title}`}
        >
          {hasImage ? (
            <img
              src={displayImage}
              alt={`${project.title} - ${project.category}`}
              width={340}
              height={213}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              Bez náhledu
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="rounded-full border border-border bg-secondary/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-md">
              {project.category}
            </span>
          </div>
        </button>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="mb-2 line-clamp-1 text-lg font-bold text-foreground transition-colors group-hover/card:text-accent">
            {project.title}
          </h3>
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          {project.technologies.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2" role="list" aria-label="Použité technologie">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  role="listitem"
                  className="rounded border border-border bg-secondary px-2 py-1 text-xs text-foreground"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-2 py-1 text-xs text-muted-foreground">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          )}

          {hasWebsite && (
            <a
              href={project.websiteUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center text-sm text-foreground transition-colors hover:text-accent"
              aria-label={`Navštívit web projektu ${project.title}`}
            >
              <span className="border-b border-transparent transition-all hover:border-accent">
                Navštívit web
              </span>
              <ExternalLink size={14} className="ml-2" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    fetchProjects();
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithCache<{ success: boolean; data: Project[] }>('/api/projects');
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

  const SectionHeader = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto mb-16 max-w-7xl px-4 text-center sm:px-6 lg:px-8"
    >
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">Portfolio</p>
      <h2 id="projects-heading" className="mb-6 text-4xl font-bold text-foreground sm:text-5xl">
        Moje Projekty
      </h2>
      <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
        Zde jsou některé z mých nedávných projektů. Každý z nich je unikátní
        a přizpůsobený potřebám klienta.
      </p>
    </motion.div>
  );

  if (loading) {
    return (
      <section id="projects" className="bg-background py-24" aria-busy="true" aria-label="Načítání projektů">
        {SectionHeader}
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-4 border-t-4 border-blue-600" role="status">
            <span className="sr-only">Načítání projektů...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="bg-background py-24" aria-label="Chyba načítání">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-4 text-red-500" role="alert">{error}</p>
          <button onClick={fetchProjects} className="text-blue-600 underline hover:text-blue-800">
            Zkusit znovu
          </button>
        </div>
      </section>
    );
  }

  // Duration scales with project count so the pace stays roughly constant.
  const duration = Math.max(24, projects.length * 6);
  // Duplicate the list so the loop is seamless (track animates to -50%).
  const loopProjects = [...projects, ...projects];

  return (
    <section
      id="projects"
      className="overflow-hidden bg-background py-24"
      aria-labelledby="projects-heading"
    >
      {SectionHeader}

      {reducedMotion ? (
        // Reduced motion: static, manually scrollable row
        <div className="flex gap-6 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            maskImage:
              'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          }}
        >
          <div
            className="animate-marquee flex w-max gap-6"
            style={{
              // custom props consumed by the .animate-marquee class
              ['--marquee-duration' as string]: `${duration}s`,
              animationPlayState: paused ? 'paused' : 'running',
            }}
          >
            {loopProjects.map((project, i) => (
              <ProjectCard key={`${project.id}-${i}`} project={project} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
