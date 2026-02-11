export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  websiteUrl: string;
  technologies: string[];
  aiPrompt: string;
}

// AI Prompt Template - Use this to generate mockup images:
// "Professional product photography of a [LAPTOP TYPE] laptop on [SURFACE TYPE], 
// screen displaying [WEBSITE DESCRIPTION], [LIGHTING CONDITIONS], 
// [BACKGROUND DETAILS], [STYLE], photorealistic, 4K quality"

export const projects: Project[] = [
  {
    id: 1,
    title: "E-commerce Platforma",
    category: "Web Development",
    description: "Moderní e-commerce řešení s pokročilými funkcemi pro online prodej produktů.",
    imageUrl: "https://res.cloudinary.com/dg3rfqbvz/image/upload/v1770805803/dilylevne_hofctb.jpg",
    websiteUrl: "#",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    aiPrompt: "Professional product photography of a sleek silver MacBook Pro on a minimalist white marble desk, screen displaying YOUR E-COMMERCE WEBSITE with clean white interface, soft natural lighting from window on left side, shallow depth of field, warm ambient light, coffee cup visible in blurred background, high-end workspace aesthetic, 4K quality, photorealistic"
  },
  {
    id: 2,
    title: "Firemní Web",
    category: "Web Design",
    description: "Elegantní prezentační web pro technologickou firmu s moderním designem.",
    imageUrl: "https://res.cloudinary.com/dg3rfqbvz/image/upload/v1770805804/3567f5f2-cfa5-470b-9c84-8af61a9a7b88_gemini_generated_image_nntz32nntz32nntz_gru60l.jpg",
    websiteUrl: "#",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    aiPrompt: "Professional product photography of a space gray MacBook Pro on a dark walnut wood desk, screen displaying YOUR CORPORATE WEBSITE with professional design, dramatic side lighting from desk lamp creating long shadows, shallow depth of field, moody ambient atmosphere with warm orange undertones, vintage leather notebook and fountain pen visible in blurred foreground, sophisticated office aesthetic, 4K quality, photorealistic"
  },
  {
    id: 3,
    title: "Portfolio Web",
    category: "Web Design",
    description: "Kreativní portfolio web pro fotografa s galerií a rezervačním systémem.",
    imageUrl: "https://res.cloudinary.com/dg3rfqbvz/image/upload/v1770805932/tuturil_lq2fdg.jpg",
    websiteUrl: "#",
    technologies: ["React", "Sanity CMS", "GSAP", "Vercel"],
    aiPrompt: "Professional product photography of a silver Dell XPS laptop on a raw concrete desk, screen displaying YOUR PORTFOLIO WEBSITE, cool blue-tinted LED lighting from above, shallow depth of field, modern minimalist atmosphere, small succulent plant and wireless earbuds visible in blurred background, tech startup workspace aesthetic, 4K quality, photorealistic"
  }
];
