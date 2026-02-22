/**
 * useScrollBackground — a composable that watches you scroll
 * and shifts the cosmic backdrop accordingly.
 *
 * The old site had two separate JS files for this — one for desktop, 
 * one for mobile — because apparently that's how we rolled back then.
 * Now it's one reactive composable that doesn't care about your screen size,
 * just your scroll position and whether you've hit a trigger zone.
 */

import { onMounted, onUnmounted } from 'vue'

interface ScrollTarget {
  elementId: string
  image: string
  color: string
}

/** Threshold offset from top of viewport — how far down before the trip kicks in */
const SCROLL_OFFSET = 300

/**
 * Bottom padding in px added to each target's bounding rect.
 * Keeps the background active slightly past the element's
 * visible bottom edge so transitions aren't jarring.
 */
const TARGET_BOTTOM_PADDING = 100

/** The sacred list of scroll-triggered background hallucinations */
const TARGETS: ScrollTarget[] = [
  { elementId: 'techies_creed', image: '/wave.gif', color: '#003366' },
]

export function useScrollBackground(): void {
  /** Gate so we only schedule one rAF per frame — no double-dipping */
  let ticking = false

  function updateBackground(): void {
    const windowTop = window.scrollY + SCROLL_OFFSET
    let visibleTarget: ScrollTarget | null = null

    for (const target of TARGETS) {
      const el = document.getElementById(target.elementId)
      if (!el) continue

      const rect = el.getBoundingClientRect()
      const targetTop = rect.top + window.scrollY
      const targetBottom = targetTop + rect.height + TARGET_BOTTOM_PADDING

      if (targetTop <= windowTop && targetBottom >= windowTop) {
        visibleTarget = target
        break
      }
    }

    if (visibleTarget) {
      document.body.style.backgroundImage = `url('${visibleTarget.image}')`
      document.body.style.backgroundBlendMode = 'multiply'
      document.body.style.backgroundColor = visibleTarget.color
    } else {
      document.body.style.backgroundImage = ''
      document.body.style.backgroundBlendMode = ''
      document.body.style.backgroundColor = '#000000'
    }

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
}
