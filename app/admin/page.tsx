import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminHome() {
  const session = await getAuthSession();
  // Basic stats: number of restaurants, users, orders
  const [restaurantCount, userCount, orderCount] = await Promise.all([
    prisma.restaurant.count(),
    prisma.user.count(),
    prisma.order.count(),
  ]);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome back, {session?.user?.name ?? 'Admin'}!</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Restaurants</h2>
          <p className="text-4xl font-bold">{restaurantCount}</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <p className="text-4xl font-bold">{userCount}</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Orders</h2>
          <p className="text-4xl font-bold">{orderCount}</p>
        </div>
      </div>
    </div>
  );
}