import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { fetchWithCache } from "@/lib/api";

interface ProjectImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
}

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string | null;
  websiteUrl: string | null;
  technologies: string[];
  featured: boolean;
  images: ProjectImage[];
}

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  const fetchProject = async (projectId: string) => {
    try {
      const data = await fetchWithCache<{success: boolean, data: Project}>(
        `/api/projects/${projectId}`
      );
      
      if (data.success) {
        setProject(data.data);
      } else {
        setError('Project not found');
      }
    } catch {
      setError('An error occurred while loading the project');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate('/');
    // Scroll to projects section after navigation
    setTimeout(() => {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Get all images including main image
  const getAllImages = () => {
    if (!project) return [];
    const images: { url: string; alt: string }[] = [];
    
    // Add main image first
    if (project.imageUrl) {
      images.push({ url: project.imageUrl, alt: project.title });
    }
    
    // Add additional images from gallery
    if (project.images && project.images.length > 0) {
      project.images
        .sort((a, b) => a.order - b.order)
        .forEach(img => {
          images.push({ url: img.url, alt: img.alt || project.title });
        });
    }
    
    return images;
  };

  const images = getAllImages();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-t-4 border-accent"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || 'Project not found'}</p>
            <Button onClick={goBack} variant="outline">
              <ArrowLeft size={16} className="mr-2" />
              Back to Projects
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const hasWebsite = project.websiteUrl && project.websiteUrl !== '#';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={goBack}
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Zpet na projekty</span>
          </motion.button>
        </div>

        {/* Hero Image Section with Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
        >
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br from-muted to-secondary">
            {images.length > 0 ? (
              <>
                <img
                  src={images[currentImageIndex].url}
                  alt={images[currentImageIndex].alt}
                  className="w-full h-full object-cover"
                />
                
                {/* Gallery Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 text-sm font-medium bg-accent text-accent-foreground backdrop-blur-md rounded-full">
                {project.category}
              </span>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? 'border-accent' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Project Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                <span className="text-accent">{project.title.charAt(0)}</span>{project.title.slice(1)}
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {project.description}
              </p>

              {/* Technologies */}
              {project.technologies.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">
                    Pouzite technologie
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 text-sm bg-accent/10 text-foreground rounded-lg border border-accent/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-6">
                {/* Visit Website CTA */}
                {hasWebsite && (
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Navstivit web
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Prohlednete si projekt v akci na zivem webu.
                    </p>
                    <a
                      href={project.websiteUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      Navstivit web
                      <ExternalLink size={16} className="ml-2" />
                    </a>
                  </div>
                )}

                {/* Project Info Card */}
                <div className="bg-card rounded-xl p-6 border-l-4 border-accent">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Informace o projektu
                  </h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm text-muted-foreground">Kategorie</dt>
                      <dd className="text-foreground font-medium">{project.category}</dd>
                    </div>
                    {project.technologies.length > 0 && (
                      <div>
                        <dt className="text-sm text-muted-foreground">Pocet technologii</dt>
                        <dd className="text-foreground font-medium">{project.technologies.length}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm text-muted-foreground">Status</dt>
                      <dd className="text-foreground font-medium">
                        {project.featured ? 'Featured' : 'Standard'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
