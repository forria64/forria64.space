/**
 * useScrollBackground — a composable that watches you scroll
 * and shifts the cosmic backdrop accordingly.
 *
 * Instead of snapping backgrounds on/off, it computes a 0→1
 * blend factor for each zone so the layers crossfade seamlessly
 * at their edges through opacity-driven overlay divs.
 */

import { ref, reactive, onMounted, onUnmounted, type Ref } from 'vue'

export interface BackgroundLayer {
  image: string
  color: string
  elementId: string
  opacity: number
}

/** Threshold offset from top of viewport — how far down before the trip kicks in */
const SCROLL_OFFSET = 300

/**
 * Bottom padding in px added to each target's bounding rect.
 * Keeps the background active slightly past the element's
 * visible bottom edge so transitions aren't jarring.
 */
const TARGET_BOTTOM_PADDING = 100

/**
 * Distance in px over which a background fades in at the
 * entry edge and fades out at the exit edge. The larger this
 * value, the softer the blend between zones.
 */
const BLEND_DISTANCE = 350

/** The sacred list of scroll-triggered background hallucinations */
const TARGETS: Omit<BackgroundLayer, 'opacity'>[] = [
  { elementId: 'techies_creed', image: '/wave.gif', color: '#003366' },
  { elementId: 'blog_section', image: '/log.gif', color: '#1a1a0a' },
]

interface ScrollBackgroundReturn {
  /** Normalized scroll depth 0 → 1 (top → bottom of page) */
  scrollDepth: Ref<number>
  /** Raw scroll position in pixels */
  scrollY: Ref<number>
  /** Reactive background layers with computed opacity values */
  layers: BackgroundLayer[]
}

export function useScrollBackground(): ScrollBackgroundReturn {
  /** Gate so we only schedule one rAF per frame — no double-dipping */
  let ticking = false

  /** How deep we are — 0 at the top, 1 at the very bottom */
  const scrollDepth = ref(0)

  /** Raw pixel scroll position — drives the particle scrubber */
  const scrollY = ref(0)

  /** Reactive layers whose opacity is continuously recomputed */
  const layers: BackgroundLayer[] = reactive(
    TARGETS.map((t) => ({ ...t, opacity: 0 })),
  )

  /** Clamp a number between 0 and 1 */
  function clamp01(v: number): number {
    return v < 0 ? 0 : v > 1 ? 1 : v
  }

  function updateBackground(): void {
    const windowTop = window.scrollY + SCROLL_OFFSET

    for (let i = 0; i < TARGETS.length; i++) {
      const target = TARGETS[i]!
      const layer = layers[i]!
      const el = document.getElementById(target.elementId)
      if (!el) {
        layer.opacity = 0
        continue
      }

      const rect = el.getBoundingClientRect()
      const targetTop = rect.top + window.scrollY
      const targetBottom = targetTop + rect.height + TARGET_BOTTOM_PADDING

      // Smooth ramp: fade in over BLEND_DISTANCE at the top edge,
      // stay full in the middle, fade out over BLEND_DISTANCE at the bottom edge.
      const fadeIn = clamp01((windowTop - (targetTop - BLEND_DISTANCE)) / BLEND_DISTANCE)
      const fadeOut = clamp01((targetBottom + BLEND_DISTANCE - windowTop) / BLEND_DISTANCE)
      layer.opacity = fadeIn * fadeOut
    }

    /** Update scroll depth — clamped 0-1 */
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    scrollDepth.value = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0

    /** Update raw scroll position */
    scrollY.value = window.scrollY

    ticking = false
  }

  /** Throttle via rAF — one DOM read per frame, no more, no less */
  function handleScroll(): void {
    if (!ticking) {
      requestAnimationFrame(updateBackground)
      ticking = true
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return { scrollDepth, scrollY, layers }
}
