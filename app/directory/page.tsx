import { prisma } from '@/lib/prisma';
import { RestaurantCard } from '@/components/RestaurantCard';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getRestaurants() {
  // Fetch a limited list of restaurants with cuisines for the directory
  const restaurants = await prisma.restaurant.findMany({
    where: { isPublished: true },
    take: 20,
    include: {
      cuisineTags: true,
    },
    orderBy: { name: 'asc' },
  });
  return restaurants;
}

export default async function DirectoryPage() {
  const restaurants = await getRestaurants();
  if (!restaurants) {
    notFound();
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Your Next Meal</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {restaurants.map((r) => (
          <RestaurantCard
            key={r.id}
            id={r.id}
            name={r.name}
            slug={r.slug}
            priceLevel={r.priceLevel}
            ratingAvg={r.ratingAvg}
            cuisineTags={r.cuisineTags}
          />
        ))}
      </div>
    </div>
  );
}