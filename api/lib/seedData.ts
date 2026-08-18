import { sql } from 'drizzle-orm'
import { db, schema } from './db.js'

// The initial project set. Kept in sync with scripts/seed.ts.
// Images are added later via the admin panel.
const seedProjects = [
  {
    title: 'Hodinový manžel - Kutilské služby',
    category: 'Web Development',
    description: 'Prezentační web pro poskytovatele kutilských služeb v Ústeckém kraji. Komplexní nabídka služeb včetně zednických prací, rekonstrukcí bytů, pokládky podlah, údržby zahrad a malířských prací. Web obsahuje katalog služeb, ceník, sekci hodnocení klientů a kontaktní formulář s emailovou integrací.',
    websiteUrl: '#',
    technologies: ['React', 'TypeScript', 'Vite', 'shadcn-ui', 'Tailwind CSS', 'Express', 'Resend'],
    featured: true,
    order: 1,
  },
  {
    title: 'Vojta Tuturil - Realitní makléř',
    category: 'Web Development',
    description: 'Profesionální web pro realitního makléře v Praze a Středočeském kraji. Dynamická databáze nemovitostí s PostgreSQL, detailní stránky nabídek včetně fotogalerií. Integrace Google recenzí, blog, kontaktní formuláře a admin rozhraní pro správu nabídek.',
    websiteUrl: '#',
    technologies: ['React', 'TypeScript', 'Vite', 'Prisma', 'PostgreSQL', 'Hono', 'Cloudinary', 'Nodemailer'],
    featured: true,
    order: 2,
  },
  {
    title: 'Autíčkadíly - Prodej autodílů',
    category: 'Web Development',
    description: 'Moderní web pro prodejce náhradních autodílů. Poptávkový formulář pro zákazníky, přehled produktů včetně brzdových kotoučů, motorových olejů, vstřikovačů a filtrů. Emailová notifikace přes Resend, rate limiting pomocí Upstash Redis.',
    websiteUrl: '#',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn-ui', 'Resend', 'Upstash Redis'],
    featured: false,
    order: 3,
  },
  {
    title: 'Šichtovnice - Správa směn kurýrů',
    category: 'Webová Aplikace',
    description: 'Kompletní webová aplikace pro správu směn doručovacích kurýrů. Admin panel s přehledem obsazenosti, správou řidičů, logem změn a fakturačním modulem. Kurýrská verze zobrazuje pouze vlastní směny a dostupnost. Autentizace pomocí JWT, real-time aktualizace dat.',
    websiteUrl: '#',
    technologies: ['React', 'TypeScript', 'Vite', 'Express', 'PostgreSQL', 'JWT', 'ExcelJS'],
    featured: true,
    order: 4,
  },
  {
    title: 'Sládek - Prokopský pivovar',
    category: 'Webová Aplikace',
    description: 'Aplikace pro správu docházky zaměstnanců Prokopského pivovaru. Evidence směn, manuální úpravy docházky, export dat a přehled odpracovaných hodin. Sdílené přihlášení pro pivovar s JWT autentizací. Nasazeno na Railway.',
    websiteUrl: '#',
    technologies: ['React', 'TypeScript', 'Express', 'PostgreSQL', 'JWT', 'Railway'],
    featured: false,
    order: 5,
  },
  {
    title: 'Auto-Bazar & Aukce',
    category: 'Web Design',
    description: 'Prototyp webového portálu pro prodej a dražbu automobilů. Pět propojených stránek včetně domovské stránky, výpisu inzerátů, detailu dražby, formuláře pro přidání inzerátu a kontaktu. Responzivní design s moderním UI.',
    websiteUrl: '#',
    technologies: ['HTML', 'Tailwind CSS', 'JavaScript'],
    featured: false,
    order: 6,
  },
  {
    title: 'Fotbalový prediktor zápasů',
    category: 'Python / Data Science',
    description: 'Pokročilý systém pro predikci fotbalových zápasů. Kombinuje statistický model Dixon-Coles (bivariate Poisson) s Elo ratingem a kontextovými faktory (taktika, forma, psychologie, absence). Produkuje pravděpodobnosti 1X2, očekávané góly, nejpravděpodobnější skóre a value bety. Web dashboard přes FastAPI.',
    websiteUrl: '#',
    technologies: ['Python', 'FastAPI', 'SQLAlchemy', 'NumPy', 'Pandas', 'SciPy', 'PostgreSQL'],
    featured: false,
    order: 7,
  },
  {
    title: 'JPN Faktury - Automatizace fakturace',
    category: 'Automatizace',
    description: 'Python automatizační skripty pro generování a odesílání faktur restauračním partnerům. Hromadné zpracování faktur z Excel dat, automatické odesílání emailem a evidence v CSV logu. Zpracovává desítky restaurací měsíčně.',
    websiteUrl: '#',
    technologies: ['Python', 'Excel', 'Email automation', 'CSV'],
    featured: false,
    order: 8,
  },
]

// Insert the initial projects only when the table is empty. Safe to call on
// every startup — existing data (and admin-added images) is never touched.
export async function ensureSeeded() {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.projects)

  if (count > 0) {
    console.log(`Seed skipped: ${count} projects already present`)
    return
  }

  await db.insert(schema.projects).values(
    seedProjects.map((p) => ({ ...p, status: 'COMPLETED' as const }))
  )
  console.log(`Seeded ${seedProjects.length} projects`)
}
