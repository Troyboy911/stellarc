'use client';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-orange-950 dark:to-slate-950">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          {/* Coming Soon Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 dark:bg-orange-500/10 border border-yellow-500/20 dark:border-orange-500/20 mb-8 animate-pulse">
            <Sparkles className="w-4 h-4 text-yellow-400 dark:text-orange-400" />
            <span className="text-yellow-400 dark:text-orange-400 font-semibold text-sm">Full Site Coming Soon</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
            <span className="block">Welcome to</span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 dark:from-orange-400 dark:via-red-400 dark:to-pink-400 bg-clip-text text-transparent">
              Stellarc Dynamics
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-gray-300 dark:text-gray-200 mb-8 leading-relaxed">
            The future of automation and intelligent data extraction. 
            <span className="block mt-2 text-purple-300 dark:text-orange-300 font-semibold">
              We don't just raise the bar — we ARE the bar.
            </span>
          </p>

          {/* Company Description */}
          <div className="max-w-4xl mx-auto mb-12 p-6 rounded-2xl bg-white/5 dark:bg-white/10 backdrop-blur-sm border border-white/10 dark:border-orange-500/20">
            <p className="text-gray-200 dark:text-gray-100 text-lg leading-relaxed">
              Stellarc Dynamics is pioneering the next generation of business automation and data intelligence. 
              Our elite platform combines cutting-edge AI with battle-tested automation frameworks to deliver 
              solutions that don't just work — they dominate. From LinkedIn lead generation to real-time market 
              intelligence, we provide the tools that separate industry leaders from followers.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              variant="premium"
              className="group"
              onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Solutions
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-xl bg-white/5 dark:bg-white/10 backdrop-blur-sm border border-white/10 dark:border-orange-500/20">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-8 h-8 text-yellow-400 dark:text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">10+</div>
              <div className="text-gray-400 dark:text-gray-300">Elite Solutions</div>
            </div>
            <div className="p-6 rounded-xl bg-white/5 dark:bg-white/10 backdrop-blur-sm border border-white/10 dark:border-orange-500/20">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="w-8 h-8 text-purple-400 dark:text-red-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">AI-Powered</div>
              <div className="text-gray-400 dark:text-gray-300">Next-Gen Tech</div>
            </div>
            <div className="p-6 rounded-xl bg-white/5 dark:bg-white/10 backdrop-blur-sm border border-white/10 dark:border-orange-500/20">
              <div className="flex items-center justify-center mb-2">
                <ArrowRight className="w-8 h-8 text-blue-400 dark:text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">Instant</div>
              <div className="text-gray-400 dark:text-gray-300">Activation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
    </div>
  );
}