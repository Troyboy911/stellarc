import Hero from '@/components/landing/Hero';
import AuthSection from '@/components/landing/AuthSection';
import ProductsSection from '@/components/landing/ProductsSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ProductsSection />
      <AuthSection />
      
      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
              Stellarc Dynamics
            </h3>
            <p className="text-gray-400 dark:text-gray-300 mb-4">
              We don't just raise the bar — we ARE the bar.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 Stellarc Dynamics. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}