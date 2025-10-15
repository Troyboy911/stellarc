'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { AUTOMATIONS } from '@/lib/automations/definitions';
import { SCRAPERS } from '@/lib/scrapers/definitions';
import { LogOut, CreditCard, Key, Activity } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [credits, setCredits] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setPurchases(data.purchases || []);
        setCredits(data.credits || {});
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    window.location.href = '/';
  };

  const handlePurchase = async (itemId: string, itemType: string, purchaseType: string, amount: number) => {
    try {
      const response = await fetch('/api/payments/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          itemId,
          itemType,
          purchaseType,
          amount,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to Stripe checkout or handle payment
        alert('Payment initiated! (Stripe integration pending)');
      }
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/'}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                Stellarc Dynamics
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Total Purchases</CardTitle>
              <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{purchases.length}</div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Active API Keys</CardTitle>
              <Key className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">
                {purchases.filter(p => p.apiKey).length}
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Available Credits</CardTitle>
              <Activity className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">
                {Object.values(credits).reduce((a: any, b: any) => a + b, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Automations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Available Automations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AUTOMATIONS.map((automation) => {
              const userCredits = credits[automation.id] || 0;
              const hasPurchased = purchases.some(
                p => p.itemId === automation.id && p.purchaseType === 'full'
              );

              return (
                <Card key={automation.id} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <div className="text-4xl mb-2">{automation.icon}</div>
                    <CardTitle className="text-lg dark:text-white">{automation.name}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2 dark:text-gray-300">
                      {automation.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {hasPurchased ? (
                      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4 text-center">
                        <p className="text-green-800 dark:text-green-300 font-semibold">✓ Owned</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Credits: {userCredits}
                        </div>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() =>
                            handlePurchase(
                              automation.id,
                              'automation',
                              'per-use',
                              automation.pricePerUse
                            )
                          }
                        >
                          Buy Credit (${automation.pricePerUse})
                        </Button>
                        <Button
                          size="sm"
                          variant="premium"
                          className="w-full"
                          onClick={() =>
                            handlePurchase(
                              automation.id,
                              'automation',
                              'full',
                              automation.fullPurchasePrice
                            )
                          }
                        >
                          Buy Full (${automation.fullPurchasePrice})
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Scrapers */}
        <div>
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Available Scrapers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCRAPERS.map((scraper) => {
              const userCredits = credits[scraper.id] || 0;
              const hasPurchased = purchases.some(
                p => p.itemId === scraper.id && p.purchaseType === 'full'
              );

              return (
                <Card key={scraper.id} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <div className="text-4xl mb-2">{scraper.icon}</div>
                    <CardTitle className="text-lg dark:text-white">{scraper.name}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2 dark:text-gray-300">
                      {scraper.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {hasPurchased ? (
                      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4 text-center">
                        <p className="text-green-800 dark:text-green-300 font-semibold">✓ Owned</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Credits: {userCredits}
                        </div>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() =>
                            handlePurchase(
                              scraper.id,
                              'scraper',
                              'per-use',
                              scraper.pricePerUse
                            )
                          }
                        >
                          Buy Credit (${scraper.pricePerUse})
                        </Button>
                        <Button
                          size="sm"
                          variant="premium"
                          className="w-full"
                          onClick={() =>
                            handlePurchase(
                              scraper.id,
                              'scraper',
                              'full',
                              scraper.fullPurchasePrice
                            )
                          }
                        >
                          Buy Full (${scraper.fullPurchasePrice})
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}