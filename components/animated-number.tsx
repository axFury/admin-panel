"use client"

import { motion, AnimatePresence } from "framer-motion"

export function AnimatedNumber({ value }: { value: number }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -12, opacity: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="tabular-nums"
      >
        {value.toLocaleString()}
      </motion.span>
    </AnimatePresence>
  )
}
