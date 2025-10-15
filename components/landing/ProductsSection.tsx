'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AUTOMATIONS } from '@/lib/automations/definitions';
import { SCRAPERS } from '@/lib/scrapers/definitions';
import { Check, Zap, Database } from 'lucide-react';

export default function ProductsSection() {
  return (
    <section id="products-section" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Automations Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-orange-900/30 mb-4">
              <Zap className="w-5 h-5 text-blue-600 dark:text-orange-400" />
              <span className="text-blue-600 dark:text-orange-400 font-semibold">Elite Automations</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Premium Automation Solutions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              AI-powered automations that work while you sleep. Each solution is battle-tested and ready to deploy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {AUTOMATIONS.map((automation) => (
              <Card key={automation.id} className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-500 dark:hover:border-orange-500 flex flex-col dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="text-5xl mb-4">{automation.icon}</div>
                  <CardTitle className="text-xl dark:text-white">{automation.name}</CardTitle>
                  <CardDescription className="text-sm dark:text-gray-300">
                    {automation.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-3 mb-6">
                    {automation.features.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Per Use:</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-orange-400">
                        ${automation.pricePerUse.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Full License:</span>
                      <span className="text-lg font-bold text-purple-600 dark:text-red-400">
                        ${automation.fullPurchasePrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button className="w-full" variant="default">
                    Try Now
                  </Button>
                  <Button className="w-full" variant="premium">
                    Buy Full License
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Scrapers Section */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-red-900/30 mb-4">
              <Database className="w-5 h-5 text-purple-600 dark:text-red-400" />
              <span className="text-purple-600 dark:text-red-400 font-semibold">Elite Scrapers</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Premium Data Extraction Solutions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Enterprise-grade scrapers that harvest the data you need. Real-time intelligence at your fingertips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SCRAPERS.map((scraper) => (
              <Card key={scraper.id} className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-500 dark:hover:border-red-500 flex flex-col dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="text-5xl mb-4">{scraper.icon}</div>
                  <CardTitle className="text-xl dark:text-white">{scraper.name}</CardTitle>
                  <CardDescription className="text-sm dark:text-gray-300">
                    {scraper.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-3 mb-6">
                    {scraper.features.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Per Use:</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-orange-400">
                        ${scraper.pricePerUse.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Full License:</span>
                      <span className="text-lg font-bold text-purple-600 dark:text-red-400">
                        ${scraper.fullPurchasePrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button className="w-full" variant="default">
                    Try Now
                  </Button>
                  <Button className="w-full" variant="premium">
                    Buy Full License
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}