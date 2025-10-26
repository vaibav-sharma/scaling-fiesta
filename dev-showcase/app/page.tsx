"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MotionDiv } from '@/src/lib/utils'
import { useRouter } from "next/navigation"

const initCards = [
  { id: 1, title: "Movie Planner", emoji: "🎯", uid: 0, link: "/movieplanner", tilt: 2 },
  { id: 2, title: "Meal Planner", emoji: "🚀", uid: 1, link: "/mealplanner", tilt: -6 },
  // { id: 3, title: "Workout Tracker", emoji: "💪", uid: 2, link: "/workout", tilt: 5 },
]

// Hook to detect viewport width
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}

export default function SwipeStack() {
  const [cards, setCards] = useState(initCards)
  const [instanceKey, setInstanceKey] = useState(Date.now())
  const dragDistance = useRef(0)
  const router = useRouter()
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setInstanceKey(Date.now())
    }
    window.addEventListener("pageshow", handlePageShow)
    return () => window.removeEventListener("pageshow", handlePageShow)
  }, [])

  const handleSwipe = () => {
    setCards((prev) => {
      const [first, ...rest] = prev
      const bumped = { ...first, uid: (first.uid || 0) + 1 }
      return [...rest, bumped]
    })
  }

  if (isDesktop) {
    // 🖥️ DESKTOP: Carousel view
    return (
      <div className="relative w-full max-w-5xl mx-auto h-[400px] flex items-center justify-center overflow-hidden">
        <MotionDiv
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {cards.map((card) => (
            <MotionDiv
              key={card.id}
              className="snap-center flex-shrink-0 w-72 h-96 rounded-2xl border border-border shadow-xl bg-white dark:bg-[#001343] flex flex-col items-center justify-center text-center p-4 cursor-pointer select-none hover:scale-105 transition-transform duration-300"
              onClick={() => window.location.href = card.link}
            >
              <span className="text-5xl mb-2">{card.emoji}</span>
              <h3 className="font-semibold text-lg">{card.title}</h3>
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>
    )
  }

  // 📱 MOBILE: Swipe stack
  return (
    <div
      key={instanceKey}
      className="relative w-full h-[500px] flex items-center justify-center overflow-hidden"
    >
      <AnimatePresence initial={false}>
        {cards.map((card, i) => {
          const isTop = i === 0
          const rotation = isTop ? 0 : card.tilt
          const yOffset = i * 10
          const scale = 1 - i * 0.05

          return (
            <MotionDiv
              key={`${card.id}-${card.uid || 0}`}
              className="absolute w-72 h-96 rounded-2xl border border-border shadow-xl bg-white dark:bg-[#001343] flex flex-col items-center justify-center text-center p-4 cursor-pointer select-none"
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              style={{
                rotate: `${rotation}deg`,
                y: yOffset,
                scale,
                zIndex: cards.length - i,
                touchAction: "pan-y",
              }}
              whileDrag={{ scale: 1.05 }}
              // onDrag={(e, info) => (dragDistance.current = Math.abs(info.offset.x))}
              onDrag={((_: MouseEvent | PointerEvent | TouchEvent, info: any) => {
                dragDistance.current = Math.abs(info.offset.x)
              }) as any}
              onDragEnd={() => {
                if (!isTop) return
                if (dragDistance.current > 100) handleSwipe()
              }}
              onClick={() => window.location.href = card.link}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale, y: yOffset, rotate: rotation }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-5xl mb-2">{card.emoji}</span>
              <h3 className="font-semibold text-lg">{card.title}</h3>
            </MotionDiv>
          )
        })}
      </AnimatePresence>

      <div className="absolute bottom-4 text-xs text-muted-foreground animate-pulse text-neutral-900 dark:text-white">
        ⇄ swipe or tap
      </div>
    </div>
  )
}

// "use client"

// import { useState, useEffect, useRef } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { useRouter } from "next/navigation"

// const initCards = [
//   { id: 1, title: "Movie Planner", emoji: "🎯", uid: 0, link: "/movieplanner", tile: 2 },
//   { id: 2, title: "Meal Planner", emoji: "🚀", uid: 1, link: "/mealplanner", tilt: -6},
// ]

// export default function SwipeStack() {
//   const [cards, setCards] = useState(initCards)
//   const [instanceKey, setInstanceKey] = useState(Date.now()) // remount key
//   const dragDistance = useRef(0)
//   const router = useRouter()

//   // 👇 Listen for "pageshow" (fires when coming back via browser Back)
//   useEffect(() => {
//     const handlePageShow = (e: PageTransitionEvent) => {
//       if (e.persisted) {
//         // Page was restored from cache (bfcache)
//         setInstanceKey(Date.now()) // force re-render -> FM remounts
//       }
//     }

//     window.addEventListener("pageshow", handlePageShow)
//     return () => window.removeEventListener("pageshow", handlePageShow)
//   }, [])

//   const handleSwipe = () => {
//     setCards((prev) => {
//       const [first, ...rest] = prev
//       const bumped = { ...first, uid: (first.uid || 0) + 1 }
//       return [...rest, bumped]
//     })
//   }

//   return (
//     <div
//       key={instanceKey} // 👈 fresh mount after Back restores gestures
//       className="relative w-full h-[500px] flex items-center justify-center overflow-hidden"
//     >
//       <AnimatePresence initial={false}>
//         {cards.map((card, i) => {
//           // const isTop = i === 0
//           // const rotation = i * 4 - 4
//           // const yOffset = i * 10
//           // const scale = 1 - i * 0.05
//           const isTop = i === 0
//           const rotation = isTop ? 0 : card.tilt // top card always straight
//           const yOffset = i * 10
//           const scale = 1 - i * 0.05

//           return (
//             <motion.div
//               key={`${card.id}-${card.uid || 0}`}
//               className="absolute w-72 h-96 rounded-2xl border border-border shadow-xl bg-white dark:bg-[#001343] flex flex-col items-center justify-center text-center p-4 cursor-pointer select-none"
//               drag={isTop ? "x" : false}
//               dragConstraints={{ left: 0, right: 0 }}
//               dragElastic={0.2}
//               style={{
//                 rotate: rotation,
//                 y: yOffset,
//                 scale,
//                 zIndex: cards.length - i,
//                 touchAction: "pan-y", // ✅ essential for horizontal drags
//               }}
//               whileDrag={{ scale: 1.05 }}
//               onDrag={(e, info) => (dragDistance.current = Math.abs(info.offset.x))}
//               onDragEnd={() => {
//                 if (!isTop) return
//                 if (dragDistance.current > 100) handleSwipe()
//               }}
//               // onClick={() => router.push(card.link)}
//               onClick={() => window.location.href = card.link}
//               whileTap={{ scale: 0.97 }}
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale, y: yOffset, rotate: rotation }}
//               transition={{ duration: 0.3 }}
//             >
//               <span className="text-5xl mb-2">{card.emoji}</span>
//               <h3 className="font-semibold text-lg">{card.title}</h3>
//             </motion.div>
//           )
//         })}
//       </AnimatePresence>

//       <div className="absolute bottom-4 text-xs text-muted-foreground animate-pulse text-neutral-900 dark:text-white">
//         ⇄ swipe or tap
//       </div>
//     </div>
//   )
// }

// "use client"

// import { useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"

// const cards = [
//   { id: 1, title: "The Pursuit of Happyness", emoji: "🎯" },
//   { id: 2, title: "Hidden Figures", emoji: "🚀" },
//   { id: 3, title: "Moneyball", emoji: "⚾" },
// ]

// export default function SwipeStack() {
//   const [index, setIndex] = useState(0)

//   const handleSwipe = (direction: string) => {
//     if (index < cards.length - 1) setIndex(index + 1)
//   }

//   return (
//     <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
//       <AnimatePresence>
//         {cards.slice(index, index + 1).map((card) => (
//           <motion.div
//             key={card.id}
//             className="absolute bg-card border border-border shadow-xl w-72 h-96 rounded-2xl flex flex-col items-center justify-center text-center p-4"
//             drag="x"
//             dragConstraints={{ left: 0, right: 0 }}
//             whileDrag={{ scale: 1.05 }}
//             onDragEnd={(_, info) => {
//               if (info.offset.x > 100) handleSwipe("right")
//               if (info.offset.x < -100) handleSwipe("left")
//             }}
//             exit={{ opacity: 0, x: infoDirection(card.id) }}
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <span className="text-5xl mb-2">{card.emoji}</span>
//             <h3 className="font-semibold text-lg">{card.title}</h3>
//           </motion.div>
//         ))}
//       </AnimatePresence>
//     </div>
//   )
// }

// function infoDirection(id: number) {
//   return id % 2 === 0 ? 200 : -200
// }

