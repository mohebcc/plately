import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 hidden md:block">
      <nav className="space-y-4">
        <Link href="/admin" className="block text-gray-800 dark:text-gray-200 hover:text-brand dark:hover:text-brand-dark">
          Overview
        </Link>
        <Link
          href="/admin/restaurants"
          className="block text-gray-800 dark:text-gray-200 hover:text-brand dark:hover:text-brand-dark"
        >
          Restaurants
        </Link>
        <Link href="/admin/orders" className="block text-gray-800 dark:text-gray-200 hover:text-brand dark:hover:text-brand-dark">
          Orders
        </Link>
        <Link href="/admin/plans" className="block text-gray-800 dark:text-gray-200 hover:text-brand dark:hover:text-brand-dark">
          Plans
        </Link>
        <Link href="/admin/domains" className="block text-gray-800 dark:text-gray-200 hover:text-brand dark:hover:text-brand-dark">
          Domains
        </Link>
      </nav>
    </aside>
  );
}