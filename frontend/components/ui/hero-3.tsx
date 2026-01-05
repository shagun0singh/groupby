"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import SuggestiveSearch from "@/components/ui/suggestive-search";
import { useRouter } from "next/navigation";

// Props interface for the component
interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: React.ReactNode;
  description: string;
  images: string[];
  className?: string;
  onSearch?: (query: string) => void;
}

// Search bar component using SuggestiveSearch from events page
const SearchBar = ({ onSearch }: { onSearch?: (query: string) => void }) => {
  const router = useRouter();

  const handleSearchChange = (value: string) => {
    if (value.trim()) {
      if (onSearch) {
        onSearch(value);
      } else {
        // Navigate to events page with search query
        router.push(`/events?search=${encodeURIComponent(value)}`);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-6 w-full max-w-md mx-auto scale-75"
    >
      <SuggestiveSearch
        onChange={handleSearchChange}
        suggestions={["Workshops", "Tech Events", "College Fests", "Concerts", "Meetups", "Sports"]}
        className="w-full"
      />
    </motion.div>
  );
};

// The main hero component
export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  title,
  description,
  images,
  className,
  onSearch,
}) => {
  // Animation variants for the text content
  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  // Duplicate images for a seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <section
      className={cn(
        "relative w-screen h-screen overflow-x-hidden bg-transparent flex flex-col items-center justify-start text-center px-4 pt-32 pb-0",
        className
      )}
    >
      <div className="z-10 flex flex-col items-center max-w-5xl mx-auto px-12 mb-12">
        {/* Tagline - Only show if provided */}
        {tagline && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={FADE_IN_ANIMATION_VARIANTS}
            className="mb-6 inline-block rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-5 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 backdrop-blur-sm shadow-sm"
          >
            {tagline}
          </motion.div>
        )}

        {/* Main Title */}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
          style={{ fontSize: '72px', fontWeight: '700', lineHeight: '1.1', letterSpacing: '-0.02em' }}
          className="text-slate-900 dark:text-white mb-6"
        >
          {typeof title === 'string' ? (
            title.split(" ").map((word, i) => (
              <motion.span
                key={i}
                variants={FADE_IN_ANIMATION_VARIANTS}
                className="inline-block"
              >
                {word}&nbsp;
              </motion.span>
            ))
          ) : (
            title
          )}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.3 }}
          className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto mb-6 leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Search Bar (replaces Get Started button) */}
        <SearchBar onSearch={onSearch} />
      </div>

      {/* Animated Image Marquee - Positioned After Search Bar */}
      <div className="absolute bottom-0 left-0 right-0 w-screen h-[40vh] md:h-[45vh] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_100%)]">
        <motion.div
          className="flex gap-4 h-full items-end pb-0"
          animate={{
            x: ["-50%", "0%"],
            transition: {
              ease: "linear",
              duration: 40,
              repeat: Infinity,
            },
          }}
        >
          {duplicatedImages.map((src, index) => (
            <div
              key={index}
              className="relative aspect-[3/4] h-[80%] flex-shrink-0"
              style={{
                rotate: `${(index % 2 === 0 ? -2 : 5)}deg`,
              }}
            >
              <img
                src={src}
                alt={`Event showcase ${index + 1}`}
                className="w-full h-full object-cover rounded-2xl shadow-md"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

