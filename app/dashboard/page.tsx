import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardHome() {
  const session = await getAuthSession();
  const userId = session?.user?.id;
  // Fetch orders summary for the owner's restaurant(s)
  let orderCount = 0;
  if (session?.user.role === 'RESTAURANT_OWNER') {
    const restaurants = await prisma.restaurant.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });
    const restaurantIds = restaurants.map((r) => r.id);
    orderCount = await prisma.order.count({
      where: { restaurantId: { in: restaurantIds } },
    });
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome back, {session?.user?.name ?? 'Restaurant Owner'}!</p>
      <div className="mt-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Orders Summary</h2>
          <p className="text-4xl font-bold">{orderCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total orders received</p>
        </div>
      </div>
    </div>
  );
}