import Link from 'next/link';
import { CuisineTag, PriceLevel } from '@prisma/client';

export interface RestaurantCardProps {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  priceLevel: PriceLevel;
  ratingAvg?: number | null;
  cuisineTags?: CuisineTag[];
}

export function RestaurantCard({
  id,
  name,
  slug,
  priceLevel,
  ratingAvg,
  cuisineTags,
}: RestaurantCardProps) {
  const priceSymbols = Array.from({ length: priceLevel === 'ONE' ? 1 : priceLevel === 'TWO' ? 2 : priceLevel === 'THREE' ? 3 : 4 }).fill('$').join('');
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
      <Link href={`/directory/${slug}`}
        className="block text-lg font-semibold mb-2 text-brand dark:text-brand-dark hover:underline"
      >
        {name}
      </Link>
      <div className="flex items-center justify-between text-sm mb-2">
        <span>{priceSymbols}</span>
        <span>{ratingAvg ? ratingAvg.toFixed(1) : '–'}</span>
      </div>
      {cuisineTags && (
        <div className="flex flex-wrap gap-2 mt-2">
          {cuisineTags.map((tag) => (
            <span key={tag.id} className="bg-brand/10 text-brand dark:bg-brand-dark/20 dark:text-brand-dark text-xs px-2 py-1 rounded-md">
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}