import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { JsonLd } from "@/components/JsonLd";
import { Analytics } from "@/components/Analytics";
import { prefetch } from "@/lib/api";

const ProjectDetail = lazy(() => import("@/components/ProjectDetail").then(m => ({ default: m.ProjectDetail })));
const AdminLogin = lazy(() => import("@/components/AdminLogin").then(m => ({ default: m.default })));
const AdminDashboard = lazy(() => import("@/components/AdminDashboard").then(m => ({ default: m.default })));
const AboutPage = lazy(() => import("@/pages/AboutPage").then(m => ({ default: m.AboutPage })));
const ProjectsPage = lazy(() => import("@/pages/ProjectsPage").then(m => ({ default: m.ProjectsPage })));
const ServicesPage = lazy(() => import("@/pages/ServicesPage").then(m => ({ default: m.ServicesPage })));
const ContactPage = lazy(() => import("@/pages/ContactPage").then(m => ({ default: m.ContactPage })));
const WebovaAplikaceForm = lazy(() => import("@/pages/WebovaAplikaceForm").then(m => ({ default: m.WebovaAplikaceForm })));
const MobilniAplikaceForm = lazy(() => import("@/pages/MobilniAplikaceForm").then(m => ({ default: m.MobilniAplikaceForm })));
const IndividualniProjektForm = lazy(() => import("@/pages/IndividualniProjektForm").then(m => ({ default: m.IndividualniProjektForm })));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
    </div>
  );
}

function HomePage() {
  useEffect(() => {
    // Prefetch projects as soon as the app loads
    prefetch('/api/projects');
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <JsonLd />
        <Analytics />
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/poptavka/web" element={<WebovaAplikaceForm />} />
            <Route path="/poptavka/app" element={<MobilniAplikaceForm />} />
            <Route path="/poptavka/custom" element={<IndividualniProjektForm />} />
            </Routes>
          </Suspense>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
