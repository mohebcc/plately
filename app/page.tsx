import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center px-4 py-16 sm:py-24">
      <h1 className="text-4xl sm:text-5xl font-bold max-w-2xl">
        Your restaurant. Your orders. <span className="text-brand">No commissions</span>.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-gray-700 dark:text-gray-300">
        Plately combines beautiful restaurant websites, direct online ordering and a local directory so you can own your customer
        relationships and keep more of your revenue.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link
          href="/directory"
          className="inline-block px-6 py-3 rounded-md bg-brand text-white font-medium hover:bg-brand-dark transition-colors"
        >
          Browse Restaurants
        </Link>
        <Link
          href="/pricing"
          className="inline-block px-6 py-3 rounded-md border border-brand text-brand font-medium hover:bg-brand/10 dark:hover:bg-brand-dark/10 transition-colors"
        >
          View Plans
        </Link>
      </div>
      {/* Benefits section */}
      <section className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl w-full">
        <div>
          <h3 className="text-xl font-semibold mb-2">Professional Website</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Get a modern, responsive website for your restaurant with zero coding. We handle hosting and maintenance so you can focus on cooking.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Direct Ordering</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Keep 100% of your revenue. Customers order directly from you via our seamless ordering system powered by Stripe.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Local Discovery</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Reach nearby diners through Plately’s curated directory and city pages. Featured placement boosts your visibility even more.
          </p>
        </div>
      </section>
      {/* Pricing highlights */}
      <section className="mt-20 w-full max-w-5xl">
        <h2 className="text-3xl font-bold mb-8">Simple pricing for every stage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 flex flex-col">
            <h3 className="text-xl font-semibold mb-2">Starter</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">$299 setup • $39/month</p>
            <ul className="text-left text-sm space-y-2 flex-1">
              <li>Hosted restaurant page</li>
              <li>Menu & online ordering</li>
              <li>Basic updates</li>
            </ul>
            <Link href="/signup?plan=starter" className="mt-6 inline-block px-4 py-2 rounded-md bg-brand text-white text-center">
              Get started
            </Link>
          </div>
          <div className="border rounded-lg p-6 flex flex-col">
            <h3 className="text-xl font-semibold mb-2">Growth</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">$499 setup • $79/month</p>
            <ul className="text-left text-sm space-y-2 flex-1">
              <li>Custom design options</li>
              <li>Analytics & SEO settings</li>
              <li>Priority updates</li>
            </ul>
            <Link href="/signup?plan=growth" className="mt-6 inline-block px-4 py-2 rounded-md bg-brand text-white text-center">
              Get started
            </Link>
          </div>
          <div className="border rounded-lg p-6 flex flex-col">
            <h3 className="text-xl font-semibold mb-2">Premium</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">$899 setup • $129/month</p>
            <ul className="text-left text-sm space-y-2 flex-1">
              <li>Custom domain support</li>
              <li>Marketing & promotions</li>
              <li>Featured ranking</li>
            </ul>
            <Link href="/signup?plan=premium" className="mt-6 inline-block px-4 py-2 rounded-md bg-brand text-white text-center">
              Get started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}