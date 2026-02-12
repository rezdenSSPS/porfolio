import 'dotenv/config'
import { db, schema } from '../api/lib/db.js'

async function seed() {
  console.log('🌱 Seeding database...\n')

  try {
    // Project 1: Handyman Website
    const handymanProject = await db.insert(schema.projects).values({
      title: 'Profesionální HandyMan Služby',
      category: 'Web Development',
      description: 'Moderní webové stránky pro profesionálního řemeslníka nabízejícího kompletní služby od oprav po renovace. Web obsahuje rezervační systém, galerii prací a kontaktní formulář.',
      imageUrl: 'https://res.cloudinary.com/dg3rfqbvz/image/upload/v1770805803/handyman_website.jpg',
      websiteUrl: 'https://handyman-example.cz',
      technologies: ['React', 'Next.js', 'Tailwind CSS', 'Node.js'],
      aiPrompt: 'Professional product photography of a laptop displaying a handyman services website with tools in background, clean modern design, natural lighting',
      status: 'COMPLETED',
      featured: true,
      order: 1,
    }).returning()

    await db.insert(schema.projectImages).values([
      {
        projectId: handymanProject[0].id,
        imageUrl: 'https://res.cloudinary.com/dg3rfqbvz/image/upload/v1770805803/handyman_hero.jpg',
        isPrimary: true,
        order: 1,
      },
      {
        projectId: handymanProject[0].id,
        imageUrl: 'https://res.cloudinary.com/dg3rfqbvz/image/upload/v1770805803/handyman_services.jpg',
        isPrimary: false,
        order: 2,
      },
      {
        projectId: handymanProject[0].id,
        imageUrl: 'https://res.cloudinary.com/dg3rfqbvz/image/upload/v1770805803/handyman_contact.jpg',
        isPrimary: false,
        order: 3,
      },
    ])

    console.log('✅ Handyman project created')

    // Project 2: Real Estate Website
    const realEstateProject = await db.insert(schema.projects).values({
      title: 'Realitní Kancelář Premium',
      category: 'Web Development',
      description: 'Elegantní prezentační web pro realitní kancelář s pokročilým vyhledáváním nemovitostí, virtuálními prohlídkami a online rezervačním systémem pro prohlídky.',
      imageUrl: 'https://res.cloudinary.com/dg3rfqbvz/image/upload/v1770805803/realestate_website.jpg',
      websiteUrl: 'https://realestate-example.cz',
      technologies: ['React', 'TypeScript', 'PostgreSQL', 'Prisma'],
      aiPrompt: 'Professional product photography of a laptop displaying a luxury real estate website, modern apartment interior in background, elegant lighting',
      status: 'COMPLETED',
      featured: true,
      order: 2,
    }).returning()

    await db.insert(schema.projectImages).values([
      {
        projectId: realEstateProject[0].id,
        imageUrl: 'https://res.cloudinary.com/dg3rfqbvz/image/upload/v1770805803/realestate_hero.jpg',
        isPrimary: true,
        order: 1,
      },
      {
        projectId: realEstateProject[0].id,
        imageUrl: 'https://res.cloudinary.com/dg3rfqbvz/image/upload/v1770805803/realestate_listings.jpg',
        isPrimary: false,
        order: 2,
      },
      {
        projectId: realEstateProject[0].id,
        imageUrl: 'https://res.cloudinary.com/dg3rfqbvz/image/upload/v1770805803/realestate_details.jpg',
        isPrimary: false,
        order: 3,
      },
    ])

    console.log('✅ Real Estate project created')

    // Project 3: Used Car Parts Website
    const carPartsProject = await db.insert(schema.projects).values({
      title: 'Bazar Auto Dílů Pro',
      category: 'Web Development',
      description: 'Rozsáhlý e-commerce web pro prodejce použitých autodílů s pokročilým filtrováním, správou skladu, online platbami a systémem pro sledování objednávek.',
      imageUrl: 'https://res.cloudinary.com/dg3rfqbvz/image/upload/v1770805803/carparts_website.jpg',
      websiteUrl: 'https://autodily-example.cz',
      technologies: ['Next.js', 'Stripe', 'MongoDB', 'Tailwind CSS'],
      aiPrompt: 'Professional product photography of a laptop displaying an auto parts e-commerce website, car parts and tools in background, industrial lighting',
      status: 'COMPLETED',
      featured: false,
      order: 3,
    }).returning()

    await db.insert(schema.projectImages).values([
      {
        projectId: carPartsProject[0].id,
        imageUrl: 'https://res.cloudinary.com/dg3rfqbvz/image/upload/v1770805803/carparts_hero.jpg',
        isPrimary: true,
        order: 1,
      },
      {
        projectId: carPartsProject[0].id,
        imageUrl: 'https://res.cloudinary.com/dg3rfqbvz/image/upload/v1770805803/carparts_catalog.jpg',
        isPrimary: false,
        order: 2,
      },
      {
        projectId: carPartsProject[0].id,
        imageUrl: 'https://res.cloudinary.com/dg3rfqbvz/image/upload/v1770805803/carparts_checkout.jpg',
        isPrimary: false,
        order: 3,
      },
    ])

    console.log('✅ Car Parts project created')

    console.log('\n🎉 Seeding completed successfully!')
    console.log('\nProjects added:')
    console.log('  1. Profesionální HandyMan Služby (Handyman)')
    console.log('  2. Realitní Kancelář Premium (Real Estate)')
    console.log('  3. Bazar Auto Dílů Pro (Used Car Parts)')
    console.log('\n📸 Replace the Cloudinary URLs with your actual photos:')
    console.log('   - Edit the seed file: scripts/seed.ts')
    console.log('   - Update the imageUrl values')
    console.log('   - Run: npm run db:seed')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

seed()
