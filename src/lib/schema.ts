export interface OrganizationSchema {
  name: string;
  url: string;
  logo: string;
  description: string;
  email: string;
  telephone?: string;
  address?: {
    locality: string;
    country: string;
  };
  sameAs?: string[];
}

export interface PersonSchema {
  name: string;
  url: string;
  image?: string;
  jobTitle: string;
  description: string;
  email: string;
  telephone?: string;
  address?: {
    locality: string;
    country: string;
  };
  sameAs?: string[];
}

export interface WebSiteSchema {
  name: string;
  url: string;
  description: string;
  author: string;
}

export interface ServiceSchema {
  name: string;
  description: string;
  provider: string;
  url: string;
}

export interface ProjectSchema {
  name: string;
  description: string;
  image?: string;
  url?: string;
  author: string;
}

export const SITE_URL = 'https://www.reznicek.xyz';

export const organizationData: OrganizationSchema = {
  name: 'Denis Řezníček - Web Development',
  url: SITE_URL,
  logo: `${SITE_URL}/logo-dark.png`,
  description: 'Profesionální tvorba moderních webových stránek a aplikací na míru.',
  email: 'denis@reznicek.xyz',
  telephone: '+420776523655',
  address: {
    locality: 'Praha',
    country: 'CZ',
  },
  sameAs: [
    'https://www.linkedin.com/in/denis-řezníček-151b6a3ab',
  ],
};

export const personData: PersonSchema = {
  name: 'Denis Řezníček',
  url: SITE_URL,
  image: 'https://res.cloudinary.com/dg3rfqbvz/image/upload/v1771188351/WhatsApp_Image_2026-02-11_at_20.10.21_egqihb.jpg',
  jobTitle: 'Web Designer & Developer',
  description: 'Tvorce moderních webových stránek a aplikací. Specializace na React, Next.js a TypeScript.',
  email: 'denis@reznicek.xyz',
  telephone: '+420776523655',
  address: {
    locality: 'Praha',
    country: 'CZ',
  },
  sameAs: [
    'https://www.linkedin.com/in/denis-řezníček-151b6a3ab',
  ],
};

export const websiteData: WebSiteSchema = {
  name: 'Denis Řezníček Portfolio',
  url: SITE_URL,
  description: 'Portfolio web designera a vývojáře. Tvorba webových stránek a aplikací na míru.',
  author: 'Denis Řezníček',
};

export function createProjectSchema(project: ProjectSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.name,
    description: project.description,
    image: project.image,
    url: project.url,
    author: {
      '@type': 'Person',
      name: project.author,
    },
    applicationCategory: 'WebApplication',
  };
}

export function createServiceSchema(service: ServiceSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Person',
      name: service.provider,
    },
    url: service.url,
  };
}
