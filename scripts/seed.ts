import 'dotenv/config'
import { db, schema } from '../api/lib/db.js'

async function seed() {
  console.log('Seeding database...\n')

  try {
    console.log('Clearing existing data...')
    await db.delete(schema.projectImages)
    await db.delete(schema.projects)
    console.log('Existing data cleared\n')

    // Project 1: Handyman Website
    const handymanProject = await db.insert(schema.projects).values({
      title: 'Hodinový manžel - Kutilské služby',
      category: 'Web Development',
      description: 'Prezentační web pro poskytovatele kutilských služeb v Ústeckém kraji. Komplexní nabídka služeb včetně zednických prací, rekonstrukcí bytů, pokládky podlah, údržby zahrad a malířských prací. Web obsahuje katalog služeb, ceník, sekci hodnocení klientů a kontaktní formulář s emailovou integrací.',
      websiteUrl: null,
      technologies: ['React', 'TypeScript', 'Vite', 'shadcn-ui', 'Tailwind CSS', 'Express', 'Resend'],
      status: 'COMPLETED',
      featured: true,
      order: 1,
    }).returning()
    console.log('  Handyman project created')

    // Project 2: Real Estate Website
    const realEstateProject = await db.insert(schema.projects).values({
      title: 'Vojta Tuturil - Realitní makléř',
      category: 'Web Development',
      description: 'Profesionální web pro realitního makléře v Praze a Středočeském kraji. Dynamická databáze nemovitostí s PostgreSQL, detailní stránky nabídek včetně fotogalerií. Integrace Google recenzí, blog, kontaktní formuláře a admin rozhraní pro správu nabídek.',
      websiteUrl: null,
      technologies: ['React', 'TypeScript', 'Vite', 'Prisma', 'PostgreSQL', 'Hono', 'Cloudinary', 'Nodemailer'],
      status: 'COMPLETED',
      featured: true,
      order: 2,
    }).returning()
    console.log('  Real Estate project created')

    // Project 3: Used Car Parts Website
    const carPartsProject = await db.insert(schema.projects).values({
      title: 'Autíčkadíly - Prodej autodílů',
      category: 'Web Development',
      description: 'Moderní web pro prodejce náhradních autodílů. Poptávkový formulář pro zákazníky, přehled produktů včetně brzdových kotoučů, motorových olejů, vstřikovačů a filtrů. Emailová notifikace přes Resend, rate limiting pomocí Upstash Redis.',
      websiteUrl: null,
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn-ui', 'Resend', 'Upstash Redis'],
      status: 'COMPLETED',
      featured: false,
      order: 3,
    }).returning()
    console.log('  Car Parts project created')

    // Project 4: Sichtovnice (Donna) - Shift Management
    const sichtovniceProject = await db.insert(schema.projects).values({
      title: 'Šichtovnice - Správa směn kurýrů',
      category: 'Webová Aplikace',
      description: 'Kompletní webová aplikace pro správu směn doručovacích kurýrů. Admin panel s přehledem obsazenosti, správou řidičů, logem změn a fakturačním modulem. Kurýrská verze zobrazuje pouze vlastní směny a dostupnost. Autentizace pomocí JWT, real-time aktualizace dat.',
      websiteUrl: null,
      technologies: ['React', 'TypeScript', 'Vite', 'Express', 'PostgreSQL', 'JWT', 'ExcelJS'],
      status: 'COMPLETED',
      featured: true,
      order: 4,
    }).returning()
    console.log('  Sichtovnice project created')

    // Project 5: Sladek (Pivovar) - Brewery Attendance
    const sladekProject = await db.insert(schema.projects).values({
      title: 'Sládek - Prokopský pivovar',
      category: 'Webová Aplikace',
      description: 'Aplikace pro správu docházky zaměstnanců Prokopského pivovaru. Evidence směn, manuální úpravy docházky, export dat a přehled odpracovaných hodin. Sdílené přihlášení pro pivovar s JWT autentizací. Nasazeno na Railway.',
      websiteUrl: null,
      technologies: ['React', 'TypeScript', 'Express', 'PostgreSQL', 'JWT', 'Railway'],
      status: 'COMPLETED',
      featured: false,
      order: 5,
    }).returning()
    console.log('  Sladek project created')

    // Project 6: Auto-Bazar & Aukce
    const autobazarProject = await db.insert(schema.projects).values({
      title: 'Auto-Bazar & Aukce',
      category: 'Web Design',
      description: 'Prototyp webového portálu pro prodej a dražbu automobilů. Pět propojených stránek včetně domovské stránky, výpisu inzerátů, detailu dražby, formuláře pro přidání inzerátu a kontaktu. Responzivní design s moderním UI.',
      websiteUrl: null,
      technologies: ['HTML', 'Tailwind CSS', 'JavaScript'],
      status: 'COMPLETED',
      featured: false,
      order: 6,
    }).returning()
    console.log('  Auto-Bazar project created')

    // Project 7: Football Match Predictor
    const fotbalProject = await db.insert(schema.projects).values({
      title: 'Fotbalový prediktor zápasů',
      category: 'Python / Data Science',
      description: 'Pokročilý systém pro predikci fotbalových zápasů. Kombinuje statistický model Dixon-Coles (bivariate Poisson) s Elo ratingem a kontextovými faktory (taktika, forma, psychologie, absence). Produkuje pravděpodobnosti 1X2, očekávané góly, nejpravděpodobnější skóre a value bety. Web dashboard přes FastAPI.',
      websiteUrl: null,
      technologies: ['Python', 'FastAPI', 'SQLAlchemy', 'NumPy', 'Pandas', 'SciPy', 'PostgreSQL'],
      status: 'COMPLETED',
      featured: false,
      order: 7,
    }).returning()
    console.log('  Football Predictor project created')

    // Project 8: JPN Faktury - Invoice Automation
    const fakturyProject = await db.insert(schema.projects).values({
      title: 'JPN Faktury - Automatizace fakturace',
      category: 'Automatizace',
      description: 'Python automatizační skripty pro generování a odesílání faktur restauračním partnerům. Hromadné zpracování faktur z Excel dat, automatické odesílání emailem a evidence v CSV logu. Zpracovává desítky restaurací měsíčně.',
      websiteUrl: null,
      technologies: ['Python', 'Excel', 'Email automation', 'CSV'],
      status: 'COMPLETED',
      featured: false,
      order: 8,
    }).returning()
    console.log('  JPN Faktury project created')

    console.log('\nSeeding completed successfully!')
    console.log('\nProjects added:')
    console.log('  1. Hodinovy manzel - Kutilske sluzby')
    console.log('  2. Vojta Tuturil - Realitni makler')
    console.log('  3. Autickadily - Prodej autodilu')
    console.log('  4. Sichtovnice - Sprava smen kururu')
    console.log('  5. Sladek - Prokopsky pivovar')
    console.log('  6. Auto-Bazar & Aukce')
    console.log('  7. Fotbalovy prediktor zapasu')
    console.log('  8. JPN Faktury - Automatizace fakturace')
    console.log('\nAdd images via the admin panel at /admin')

  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

seed()
