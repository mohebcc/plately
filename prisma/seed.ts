import { PrismaClient, UserRole, PriceLevel, FeaturedType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin user if not exists
  const admin = await prisma.user.upsert({
    where: { email: 'admin@plately.us' },
    update: {},
    create: {
      name: 'Plately Admin',
      email: 'admin@plately.us',
      password: '',
      role: UserRole.ADMIN,
    },
  });

  // Create some cuisines
  const cuisines = await Promise.all([
    prisma.cuisineTag.upsert({
      where: { slug: 'italian' },
      update: {},
      create: { name: 'Italian', slug: 'italian' },
    }),
    prisma.cuisineTag.upsert({
      where: { slug: 'mexican' },
      update: {},
      create: { name: 'Mexican', slug: 'mexican' },
    }),
    prisma.cuisineTag.upsert({
      where: { slug: 'sushi' },
      update: {},
      create: { name: 'Sushi', slug: 'sushi' },
    }),
  ]);

  // Create a city
  const la = await prisma.city.upsert({
    where: { slug: 'los-angeles' },
    update: {},
    create: {
      name: 'Los Angeles',
      slug: 'los-angeles',
      state: 'CA',
      country: 'USA',
    },
  });

  // Create a restaurant owner
  const owner = await prisma.user.upsert({
    where: { email: 'owner@italiano.com' },
    update: {},
    create: {
      name: 'Mario Rossi',
      email: 'owner@italiano.com',
      password: '',
      role: UserRole.RESTAURANT_OWNER,
    },
  });

  // Create a subscription plan
  const starterPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: 'starter' },
    update: {},
    create: {
      name: 'Starter',
      slug: 'starter',
      setupFee: 29900, // $299
      monthlyFee: 3900, // $39
      description: 'Hosted restaurant page with menu and ordering',
      features: {
        onlineOrdering: true,
        customDesign: false,
        analytics: false,
      },
    },
  });

  // Create a restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'marios-italian-kitchen' },
    update: {},
    create: {
      name: "Mario's Italian Kitchen",
      slug: 'marios-italian-kitchen',
      description: 'Family‑owned Italian restaurant serving pasta and pizza.',
      priceLevel: PriceLevel.TWO,
      phone: '555‑123‑4567',
      email: 'info@mariositalian.com',
      websiteUrl: 'https://mariositalian.example',
      isPublished: true,
      owner: { connect: { id: owner.id } },
      plan: { connect: { id: starterPlan.id } },
      address: {
        create: {
          street: '1234 Main St',
          postalCode: '90001',
          latitude: 34.0522,
          longitude: -118.2437,
          city: { connect: { id: la.id } },
        },
      },
      cuisineTags: {
        connect: cuisines.filter((c) => c.slug === 'italian').map((c) => ({ id: c.id })),
      },
    },
  });

  // Create menu categories and items
  const starters = await prisma.menuCategory.upsert({
    where: { id: 'starter-' + restaurant.id },
    update: {},
    create: {
      id: 'starter-' + restaurant.id,
      restaurant: { connect: { id: restaurant.id } },
      name: 'Starters',
      description: 'Begin your meal with our delicious starters.',
      sortOrder: 0,
    },
  });
  const mains = await prisma.menuCategory.upsert({
    where: { id: 'main-' + restaurant.id },
    update: {},
    create: {
      id: 'main-' + restaurant.id,
      restaurant: { connect: { id: restaurant.id } },
      name: 'Mains',
      description: 'Our signature main courses.',
      sortOrder: 1,
    },
  });

  // Menu items
  await prisma.menuItem.createMany({
    data: [
      {
        id: 'bruschetta-' + restaurant.id,
        categoryId: starters.id,
        name: 'Bruschetta',
        description: 'Grilled bread with tomato, basil & olive oil.',
        price: 800,
        sortOrder: 0,
      },
      {
        id: 'caprese-salad-' + restaurant.id,
        categoryId: starters.id,
        name: 'Caprese Salad',
        description: 'Fresh mozzarella, tomatoes & basil.',
        price: 1000,
        sortOrder: 1,
      },
      {
        id: 'margherita-pizza-' + restaurant.id,
        categoryId: mains.id,
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato, mozzarella & basil.',
        price: 1500,
        sortOrder: 0,
      },
      {
        id: 'spaghetti-bolognese-' + restaurant.id,
        categoryId: mains.id,
        name: 'Spaghetti Bolognese',
        description: 'Spaghetti with slow‑cooked beef ragù.',
        price: 1700,
        sortOrder: 1,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });