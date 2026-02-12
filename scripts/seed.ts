import 'dotenv/config'
import { db, schema } from '../api/lib/db.js'
import { sql } from 'drizzle-orm'

async function seed() {
  console.log('🌱 Seeding database...\n')

  try {
    // Clear existing data first
    console.log('🗑️  Clearing existing data...')
    await db.delete(schema.projectImages)
    await db.delete(schema.projects)
    console.log('✅ Existing data cleared\n')

    // Project 1: Handyman Website
    const handymanProject = await db.insert(schema.projects).values({
      title: 'Hodinový manžel - Kutilské služby',
      category: 'Web Development',
      description: 'Prezentační web pro poskytovatele kutilských služeb v Ústeckém kraji (Ústí nad Labem, Teplice, Most, Děčín). Komplexní nabídka služeb včetně zednických prací, rekonstrukcí bytů, pokládky podlah, úklidu domácností, údržby zahrad, malířských prací, elektro a instalatérských prací. Web obsahuje katalog služeb, ceník, sekci hodnocení klientů a kontaktní formulář s emailovou integrací přes Resend.',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
      websiteUrl: 'https://handyman-example.cz',
      technologies: ['React', 'TypeScript', 'Vite', 'shadcn-ui', 'Tailwind CSS', 'Express', 'Resend'],
      aiPrompt: 'Professional product photography of a laptop displaying a handyman services website with tools in background, clean modern design, natural lighting',
      status: 'COMPLETED',
      featured: true,
      order: 1,
    }).returning()

    await db.insert(schema.projectImages).values([
      {
        projectId: handymanProject[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=800&fit=crop',
        isPrimary: true,
        order: 1,
      },
      {
        projectId: handymanProject[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&h=800&fit=crop',
        isPrimary: false,
        order: 2,
      },
      {
        projectId: handymanProject[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&h=800&fit=crop',
        isPrimary: false,
        order: 3,
      },
    ])

    console.log('✅ Handyman project created')

    // Project 2: Real Estate Website
    const realEstateProject = await db.insert(schema.projects).values({
      title: 'Vojta Tuturil - Realitní makléř',
      category: 'Web Development',
      description: 'Profesionální web pro realitního makléře působícího v Praze a Středočeském kraji. Dynamicá databáze nemovitostí s PostgreSQL a Prisma ORM, detailní stránky nabídek včetně mapových podkladů, videoprohlídek a fotogalerií. Integrace Google recenzí, blog, kontaktní formuláře a admin rozhraní pro správu nabídek. SEO optimalizace se structured data pro RealEstateAgent.',
      imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
      websiteUrl: 'https://vojtech-tuturil.cz',
      technologies: ['React', 'TypeScript', 'Vite', 'Prisma', 'PostgreSQL', 'Hono', 'Cloudinary', 'Nodemailer'],
      aiPrompt: 'Professional product photography of a laptop displaying a luxury real estate website, modern apartment interior in background, elegant lighting',
      status: 'COMPLETED',
      featured: true,
      order: 2,
    }).returning()

    await db.insert(schema.projectImages).values([
      {
        projectId: realEstateProject[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=800&fit=crop',
        isPrimary: true,
        order: 1,
      },
      {
        projectId: realEstateProject[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
        isPrimary: false,
        order: 2,
      },
      {
        projectId: realEstateProject[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
        isPrimary: false,
        order: 3,
      },
    ])

    console.log('✅ Real Estate project created')

    // Project 3: Used Car Parts Website
    const carPartsProject = await db.insert(schema.projects).values({
      title: 'Autíčkadily - Prodej autodílů',
      category: 'Web Development',
      description: 'Moderní web pro prodejce náhradních autodílů s osobním přístupem. Poptávkový formulář pro zákazníky, přehled produktů včetně brzdových kotoučů, motorových olejů, vstřikovačů a filtrů. Emailová notifikace přes Resend, rate limiting pomocí Upstash Redis. Na rozdíl od velkých e-shopů osobní komunikace a rychlé vyhledání potřebných dílů za dostupnější ceny než v servisu.',
      imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop',
      websiteUrl: 'https://autickadily.cz',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn-ui', 'Resend', 'Upstash Redis'],
      aiPrompt: 'Professional product photography of a laptop displaying an auto parts e-commerce website, car parts and tools in background, industrial lighting',
      status: 'COMPLETED',
      featured: false,
      order: 3,
    }).returning()

    await db.insert(schema.projectImages).values([
      {
        projectId: carPartsProject[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=800&fit=crop',
        isPrimary: true,
        order: 1,
      },
      {
        projectId: carPartsProject[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&h=800&fit=crop',
        isPrimary: false,
        order: 2,
      },
      {
        projectId: carPartsProject[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=1200&h=800&fit=crop',
        isPrimary: false,
        order: 3,
      },
    ])

    console.log('✅ Car Parts project created')

    console.log('\n🎉 Seeding completed successfully!')
    console.log('\nProjects added:')
    console.log('  1. Hodinový manžel - Kutilské služby (Handyman)')
    console.log('  2. Realitní makléř Vojta Tuturil (Real Estate)')
    console.log('  3. Autíčkadily - Prodej autodílů (Car Parts)')
    console.log('\n📸 All projects now use placeholder images from Unsplash')
    console.log('   To use your own images:')
    console.log('   1. Upload photos to Cloudinary')
    console.log('   2. Go to admin panel: https://www.reznicek.xyz/#/admin')
    console.log('   3. Edit each project and update image URLs')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

seed()
