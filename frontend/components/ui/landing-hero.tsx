import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Link2, Users } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/ui/aurora-background';

interface LandingHeroProps {
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const LandingHero = ({ className }: LandingHeroProps) => {
  return (
    <AuroraBackground className={cn('min-h-screen', className)}>
      <div className="relative container mx-auto px-6 lg:px-16 py-20 lg:py-32 z-10">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Marketing Content */}
          <div className="flex flex-col space-y-8 text-center">
            <motion.h1
              className="text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-tight"
              variants={itemVariants}
            >
              Turn Your Big Ideas Into Real Events
            </motion.h1>

            <motion.p
              className="text-xl text-slate-600 leading-relaxed max-w-xl mx-auto"
              variants={itemVariants}
            >
              A comprehensive platform to help you discover local events and build meaningful connections. From finding workshops to hosting community gatherings, GroupBy makes event management simple and free.
            </motion.p>

            {/* Key Features */}
            <motion.div
              className="flex flex-wrap gap-6 text-slate-700 justify-center"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0066FF]" />
                <span className="text-sm font-medium">Host events for free.</span>
              </div>
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-[#0066FF]" />
                <span className="text-sm font-medium">Discover local gatherings.</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0066FF]" />
                <span className="text-sm font-medium">Connect with your community.</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 items-center justify-center"
              variants={itemVariants}
            >
              <Link href="/login">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base font-semibold bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full shadow-lg"
                >
                  Sign up to get started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base font-semibold border-2 border-[#0066FF] text-[#0066FF] hover:bg-[#E6F0FF] rounded-full bg-white/80 backdrop-blur-sm"
                >
                  Already have an account? Login
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AuroraBackground>
  );
};
