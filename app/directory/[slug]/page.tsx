import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface RestaurantPageProps {
  params: { slug: string };
}

export const revalidate = 60; // revalidate at most every minute

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: params.slug },
    include: {
      cuisineTags: true,
      categories: {
        include: {
          items: {
            include: {
              modifierGroups: {
                include: { options: true },
              },
            },
          },
        },
        orderBy: { sortOrder: 'asc' },
      },
      address: {
        include: { city: true },
      },
    },
  });
  if (!restaurant) {
    notFound();
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{restaurant.description}</p>
      <div className="mb-6 text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-2">
        {restaurant.cuisineTags.map((tag) => (
          <span key={tag.id} className="bg-brand/10 text-brand dark:bg-brand-dark/20 dark:text-brand-dark px-2 py-1 rounded-md">
            {tag.name}
          </span>
        ))}
      </div>
      {/* Menu */}
      {restaurant.categories.map((category) => (
        <div key={category.id} className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">{category.name}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
          <div className="space-y-4">
            {category.items.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                  <span className="font-semibold">${(item.price / 100).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}