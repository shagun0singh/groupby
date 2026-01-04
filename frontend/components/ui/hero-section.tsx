import React from 'react';

import { motion } from 'framer-motion';

import { ArrowRight } from 'lucide-react';

import Link from 'next/link';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

// Define the props for the component

interface FinancialHeroProps {
  title: React.ReactNode;
  description: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  imageUrl1: string;
  imageUrl2: string;
  className?: string;
}

// Reusable animation variants for Framer Motion

const containerVariants = {

  hidden: { opacity: 0 },

  visible: {

    opacity: 1,

    transition: {

      staggerChildren: 0.2,

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

const cardsVariants = {

  hidden: { opacity: 0, x: 50 },

  visible: {

    opacity: 1,

    x: 0,

    transition: {

      duration: 0.8,

      ease: 'easeOut',

      staggerChildren: 0.3,

    },

  },

};

const cardItemVariants = {

  hidden: { opacity: 0, x: 50 },

  visible: { opacity: 1, x: 0 },

};

/**

 * A responsive hero section component with animated text and card images.

 */

export const FinancialHero = ({

  title,

  description,

  buttonText,

  buttonLink,

  secondaryButtonText,

  secondaryButtonLink,

  imageUrl1,

  imageUrl2,

  className,

}: FinancialHeroProps) => {

  // Inline style for the grid background to easily use CSS variables

  const gridBackgroundStyle = {

    backgroundImage:

      'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',

    backgroundSize: '3rem 3rem',

  };

  return (

    <section

      className={cn(

        'relative w-full overflow-hidden bg-gradient-to-br from-[#f7f2ff] via-[#f3f7ff] to-[#e3e0ff] text-slate-900',

        className

      )}

    >

      <div

        className="absolute inset-0 opacity-20"

        style={gridBackgroundStyle}

      />

      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />

      <motion.div

        className="relative container mx-auto flex min-h-[80vh] items-center justify-between px-6 py-20 lg:flex-row flex-col gap-12"

        initial="hidden"

        animate="visible"

        variants={containerVariants}

      >

        {/* Left: Text Content */}

        <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:w-1/2">

          <motion.h1

            className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"

            variants={itemVariants}

          >

            {title}

          </motion.h1>

          <motion.p

            className="mt-6 max-w-xl text-lg text-slate-600"

            variants={itemVariants}

          >

            {description}

          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href={buttonLink}>
              <Button
                size="lg"
                className="h-12 px-8 text-base rounded-full bg-[#5b4bff] text-white hover:bg-[#4635e6] shadow-md"
              >
                {buttonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            {secondaryButtonText && secondaryButtonLink && (
              <Link href={secondaryButtonLink}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base rounded-full bg-white/80 text-slate-900 border border-slate-200 hover:bg-white"
                >
                  {secondaryButtonText}
                </Button>
              </Link>
            )}
          </motion.div>

        </div>

        {/* Right: Card Images */}

        <motion.div

          className="relative lg:w-1/2 h-full w-full flex items-center justify-center min-h-[400px] md:min-h-[500px]"

          variants={cardsVariants}

        >

          {/* Left Card (Birds Forest) - Front */}

          <motion.img

            src={imageUrl1}

            alt="Card Front"

            variants={cardItemVariants}

            whileHover={{ y: -10, rotate: 8, transition: { duration: 0.3 } }}

            className="absolute h-48 md:h-80 lg:h-96 rounded-2xl shadow-2xl object-cover transform rotate-[10deg] -translate-x-[15%] md:-translate-x-[12%] lg:-translate-x-[10%] z-20"

          />

          {/* Right Card (Blue Abstract) - Back */}

          <motion.img

            src={imageUrl2}

            alt="Card Back"

            variants={cardItemVariants}

            whileHover={{ y: -10, rotate: -8, transition: { duration: 0.3 } }}

            className="absolute h-48 md:h-80 lg:h-96 rounded-2xl shadow-2xl object-cover transform rotate-[-10deg] translate-x-[15%] md:translate-x-[12%] lg:translate-x-[10%] z-10"

          />

        </motion.div>

      </motion.div>

    </section>

  );

};

