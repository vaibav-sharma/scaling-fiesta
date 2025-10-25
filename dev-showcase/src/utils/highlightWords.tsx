"use client";
import { motion } from "motion/react";
import { HeroHighlight, Highlight } from "@/src/components/ui/hero-highlight";

export function HeroHighlightDemo({text}: {text: any}) {
  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
      >
        <Highlight className="text-black dark:text-white ">
          {text}
        </Highlight>
      </motion.h1>
    </HeroHighlight>
  );
}
