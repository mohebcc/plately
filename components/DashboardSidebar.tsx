import Link from 'next/link';

export default function DashboardSidebar() {
  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 hidden md:block">
      <nav className="space-y-4">
        <Link href="/dashboard" className="block text-gray-800 dark:text-gray-200 hover:text-brand dark:hover:text-brand-dark">
          Overview
        </Link>
        <Link
          href="/dashboard/menu"
          className="block text-gray-800 dark:text-gray-200 hover:text-brand dark:hover:text-brand-dark"
        >
          Menu
        </Link>
        <Link
          href="/dashboard/orders"
          className="block text-gray-800 dark:text-gray-200 hover:text-brand dark:hover:text-brand-dark"
        >
          Orders
        </Link>
        <Link
          href="/dashboard/settings"
          className="block text-gray-800 dark:text-gray-200 hover:text-brand dark:hover:text-brand-dark"
        >
          Settings
        </Link>
      </nav>
    </aside>
  );
}