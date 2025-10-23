import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { motion } from "framer-motion"
import type { MotionProps } from "framer-motion"
import type { HTMLAttributes } from "react"

type MotionDivProps = MotionProps & HTMLAttributes<HTMLDivElement>

export const MotionDiv: React.FC<MotionDivProps> = motion.div