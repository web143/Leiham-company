"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function LightRays({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 w-full h-full overflow-hidden opacity-40 dark:opacity-25", className)}>
      <svg
        className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[220%] h-[150%] origin-top opacity-70"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
      >
        <motion.g
          animate={{
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="origin-[50%_0%]"
        >
          {/* Ray 1 */}
          <polygon
            points="50,0 15,100 35,100"
            fill="url(#ray-grad-1)"
          />
          {/* Ray 2 */}
          <polygon
            points="50,0 40,100 60,100"
            fill="url(#ray-grad-2)"
          />
          {/* Ray 3 */}
          <polygon
            points="50,0 70,100 85,100"
            fill="url(#ray-grad-1)"
          />
          {/* Ray 4 */}
          <polygon
            points="50,0 0,100 20,100"
            fill="url(#ray-grad-2)"
          />
        </motion.g>
        <defs>
          <linearGradient id="ray-grad-1" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#0066B3" stopOpacity="0.45" />
            <stop offset="40%" stopColor="#4169E1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ray-grad-2" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#4169E1" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#0066B3" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
