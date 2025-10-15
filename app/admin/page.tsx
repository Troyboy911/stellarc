'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, Users, Activity, TrendingUp } from 'lucide-react';

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading...</div>
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
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Stellarc Dynamics Analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Total Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-green-500 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">
                ${analytics?.totalRevenue?.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Total Users</CardTitle>
              <Users className="w-4 h-4 text-blue-500 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{analytics?.totalUsers || 0}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Registered</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Total Usage</CardTitle>
              <Activity className="w-4 h-4 text-purple-500 dark:text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{analytics?.totalUsage || 0}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">API calls</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Growth Rate</CardTitle>
              <TrendingUp className="w-4 h-4 text-yellow-500 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">+{analytics?.growthRate || 0}%</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Revenue Over Time</CardTitle>
            <CardDescription className="dark:text-gray-300">Daily revenue for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.revenueByDay || []}>
                <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
                <XAxis dataKey="date" className="dark:fill-gray-300" />
                <YAxis className="dark:fill-gray-300" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--tw-bg-opacity)', borderColor: 'var(--tw-border-opacity)' }} />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#f97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Top Automations</CardTitle>
              <CardDescription className="dark:text-gray-300">Most used automation solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.topAutomations || []}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
                  <XAxis dataKey="name" className="dark:fill-gray-300" />
                  <YAxis className="dark:fill-gray-300" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--tw-bg-opacity)', borderColor: 'var(--tw-border-opacity)' }} />
                  <Bar dataKey="usage" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Top Scrapers</CardTitle>
              <CardDescription className="dark:text-gray-300">Most used scraper solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.topScrapers || []}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
                  <XAxis dataKey="name" className="dark:fill-gray-300" />
                  <YAxis className="dark:fill-gray-300" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--tw-bg-opacity)', borderColor: 'var(--tw-border-opacity)' }} />
                  <Bar dataKey="usage" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}