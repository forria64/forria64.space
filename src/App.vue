<!--
  App.vue — The root component. 
  
  This is the content-container from the old site,
  now properly componentized. The dashed-border terminal window 
  that wraps the entire experience like a CRT bezel.
  
  All child components are rendered sequentially inside
  a <main> element, preserving the original monospace aesthetic.
-->

<script setup lang="ts">
/**
 * Wire up the scroll-background hallucination engine,
 * the glow-border reactor, and assemble the component choir.
 */
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useScrollBackground } from '@/composables/useScrollBackground'
import AsciiHeader from '@/components/AsciiHeader.vue'
import ContactLinks from '@/components/ContactLinks.vue'
import ArrowDivider from '@/components/ArrowDivider.vue'
import TechiesCreed from '@/components/TechiesCreed.vue'
import BlogSection from '@/components/BlogSection.vue'
import ArcadeGame from '@/components/ArcadeGame.vue'
import ArrowBridge from '@/components/ArrowBridge.vue'

const { scrollDepth, scrollY, layers } = useScrollBackground()

/**
 * Deep-link handler — if the URL hash points to a known section
 * (other than blog post slugs, which BlogSection handles itself),
 * scroll there once the page has settled.
 */
onMounted(async () => {
  await nextTick()
  const hash = window.location.hash.slice(1)
  if (hash === 'techies_creed') {
    setTimeout(() => {
      const el = document.getElementById('techies_creed')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 400)
  }
})

const terminalStyle = computed(() => ({
  '--scroll-depth': scrollDepth.value,
}))

/** Height of the black-background zone (top of page to top of creed) */
const creedTop = ref(0)
const creedEl = ref<HTMLElement | null>(null)

function measureCreed(): void {
  if (creedEl.value) {
    const rect = creedEl.value.getBoundingClientRect()
    creedTop.value = rect.top + window.scrollY
  }
}

let resizeTimer: ReturnType<typeof setTimeout> | null = null
function onResize(): void {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(measureCreed, 100)
}

/** Re-measure on first few scrolls to catch late-rendering content */
let scrollMeasureCount = 0
function onScrollMeasure(): void {
  if (scrollMeasureCount < 5) {
    scrollMeasureCount++
    measureCreed()
  } else {
    window.removeEventListener('scroll', onScrollMeasure)
  }
}

onMounted(() => {
  measureCreed()
  // Re-measure after layout settles (child components may render async)
  nextTick(() => requestAnimationFrame(measureCreed))
  // And once more after a beat for lazy-loaded content (BlogSection etc.)
  setTimeout(measureCreed, 500)
  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onScrollMeasure, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('scroll', onScrollMeasure)
  if (resizeTimer) clearTimeout(resizeTimer)
})

/**
 * Particle definitions — each mote has a horizontal position,
 * a starting vertical offset (0–100 in vh), a scroll-speed
 * multiplier, and a pixel size. Positions wrap via modulo
 * so they loop endlessly from bottom to top as you scroll.
 */
interface Particle {
  left: number   // % from left edge
  start: number  // initial vertical offset 0–100 (vh)
  speed: number  // px of upward travel per px of scroll
  size: number   // px
}

const PARTICLES: Particle[] = [
  { left:  2, start: 95, speed: 0.35, size: 2 },
  { left:  6, start: 40, speed: 0.20, size: 1 },
  { left: 10, start: 75, speed: 0.45, size: 3 },
  { left: 14, start: 20, speed: 0.15, size: 1 },
  { left: 17, start: 60, speed: 0.38, size: 2 },
  { left: 21, start: 10, speed: 0.22, size: 1 },
  { left: 24, start: 85, speed: 0.42, size: 2 },
  { left: 28, start: 50, speed: 0.30, size: 3 },
  { left: 31, start: 30, speed: 0.18, size: 1 },
  { left: 35, start: 70, speed: 0.40, size: 2 },
  { left: 38, start: 15, speed: 0.25, size: 1 },
  { left: 41, start: 55, speed: 0.33, size: 2 },
  { left: 44, start: 90, speed: 0.48, size: 3 },
  { left: 48, start: 35, speed: 0.20, size: 1 },
  { left: 51, start: 65, speed: 0.36, size: 2 },
  { left: 54, start:  5, speed: 0.28, size: 1 },
  { left: 57, start: 80, speed: 0.44, size: 2 },
  { left: 60, start: 45, speed: 0.32, size: 3 },
  { left: 63, start: 25, speed: 0.16, size: 1 },
  { left: 66, start: 88, speed: 0.41, size: 2 },
  { left: 69, start:  8, speed: 0.24, size: 1 },
  { left: 72, start: 58, speed: 0.37, size: 2 },
  { left: 76, start: 72, speed: 0.46, size: 3 },
  { left: 80, start: 18, speed: 0.19, size: 1 },
  { left: 84, start: 42, speed: 0.34, size: 2 },
  { left:  4, start: 52, speed: 0.29, size: 1 },
  { left:  8, start: 82, speed: 0.43, size: 2 },
  { left: 12, start: 12, speed: 0.17, size: 1 },
  { left: 16, start: 68, speed: 0.39, size: 3 },
  { left: 19, start: 38, speed: 0.26, size: 1 },
  { left: 23, start: 92, speed: 0.47, size: 2 },
  { left: 26, start: 22, speed: 0.21, size: 1 },
  { left: 30, start: 78, speed: 0.41, size: 2 },
  { left: 33, start: 48, speed: 0.31, size: 3 },
  { left: 37, start:  3, speed: 0.14, size: 1 },
  { left: 40, start: 62, speed: 0.36, size: 2 },
  { left: 43, start: 33, speed: 0.23, size: 1 },
  { left: 46, start: 87, speed: 0.45, size: 2 },
  { left: 50, start: 17, speed: 0.19, size: 1 },
  { left: 53, start: 73, speed: 0.38, size: 3 },
  { left: 56, start: 43, speed: 0.27, size: 1 },
  { left: 59, start: 97, speed: 0.49, size: 2 },
  { left: 62, start: 28, speed: 0.22, size: 1 },
  { left: 65, start: 83, speed: 0.42, size: 2 },
  { left: 68, start: 53, speed: 0.33, size: 3 },
  { left: 71, start:  7, speed: 0.16, size: 1 },
  { left: 75, start: 63, speed: 0.35, size: 2 },
  { left: 88, start: 37, speed: 0.25, size: 1 },
  { left: 92, start: 77, speed: 0.40, size: 2 },
  { left: 96, start: 47, speed: 0.30, size: 1 },
]

/**
 * Compute wrapped particle styles. Each particle's vertical
 * position loops within the black-background zone (top of
 * page down to the creed). The wrap range is the creed's
 * offsetTop so particles never drift into the colored sections.
 */
const particleStyles = computed(() => {
  const range = creedTop.value || window.innerHeight
  return PARTICLES.map((p) => {
    const startPx = (p.start / 100) * range
    const travel = scrollY.value * p.speed
    const y = ((startPx - travel) % range + range) % range
    return {
      left: `${p.left}%`,
      top: `${y}px`,
      width: `${p.size}px`,
      height: `${p.size}px`,
    }
  })
})
</script>

<template>
  <!-- Background blend layers — fixed overlays with scroll-driven opacity -->
  <div
    v-for="(layer, i) in layers"
    :key="layer.elementId"
    class="bg-layer"
    aria-hidden="true"
    :style="{
      backgroundImage: `url('${layer.image}')`,
      backgroundColor: layer.color,
      opacity: layer.opacity,
    }"
  />

  <main class="terminal-wrapper">
    <!-- Particle field — full-width, clipped to the black zone above the creed -->
    <div
      class="particle-field"
      aria-hidden="true"
      :style="{ height: creedTop ? creedTop + 'px' : '100vh' }"
    >
      <span
        v-for="(style, i) in particleStyles"
        :key="i"
        class="particle"
        :style="style"
      />
    </div>

    <div class="content-container" :style="terminalStyle">
      <AsciiHeader />
      <ContactLinks />
      <pre
        class="section-divider"
      >~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
<span class="blink">V^V^V^V^V^V^V <em>PROUD STACK STUMBLER &amp; BYTE MANGLER</em> V^V^V^V^V^V^V</span>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</pre>
      <ArrowDivider />
      <div ref="creedEl">
        <TechiesCreed />
      </div>
      <BlogSection />
    </div>

    <!-- Semicolon waterfall bridging content area to arcade zone -->
    <ArrowBridge class="hide-on-mobile" />

    <!-- Arcade game — sits outside the content-container in its own black zone -->
    <ArcadeGame class="hide-on-mobile" />
  </main>
</template>

<style scoped>
/* === BACKGROUND BLEND LAYERS ===
   Fixed overlays for each scroll-zone background. Their opacity
   is smoothly ramped by the composable so zones crossfade into
   each other at the edges instead of snapping on/off. */
.bg-layer {
  position: fixed;
  inset: 0;
  background-attachment: fixed;
  background-blend-mode: multiply;
  pointer-events: none;
  will-change: opacity;
  z-index: -1;
}

/* The main wrapper must grow to fill the flex parent */
.terminal-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  font-weight: bold;
  position: relative;
}

/* The terminal window — dashed borders, fixed width, fills the viewport */
.content-container {
  --scroll-depth: 0;
  width: 600px;
  border-left: 2px dashed #ffa5a3;
  border-right: 2px dashed #ffa5a3;
  border-bottom: 2px dashed #ffa5a3;
  padding: 0 10px 10px;
  backdrop-filter: blur(10px);
  font-family: monospace;
  position: relative;
  /* === EFFECT 3: REACTIVE GLOW BORDERS ===
     Border color intensifies as you descend into the page.
     At the top: default dashed. At the bottom: bright hot wire. */
  border-color: rgba(255, 165, 163, calc(0.4 + 0.6 * var(--scroll-depth)));
  transition: border-color 0.3s ease-out;
}

/* === EFFECT 1: CRT SCANLINES + FLICKER ===
   Horizontal scanlines burned across the terminal face.
   A repeating gradient for the lines, a fast erratic flicker
   for that dying-CRT-in-a-cold-room energy, and a slow
   scrolling band that crawls down the screen like a
   detuned VHS tracking bar. */
.content-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    /* Scanlines — tight horizontal bars, heavier darkness */
    repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 2px,
      rgba(0, 0, 0, 0.35) 2px,
      rgba(0, 0, 0, 0.35) 4px
    ),
    /* Rolling band — brighter bar that scrolls down continuously */
    linear-gradient(
      to bottom,
      transparent 0%,
      transparent 40%,
      rgba(255, 165, 163, 0.08) 44%,
      rgba(255, 165, 163, 0.14) 50%,
      rgba(255, 165, 163, 0.08) 56%,
      transparent 60%,
      transparent 100%
    );
  background-size: 100% 4px, 100% 200%;
  pointer-events: none;
  z-index: 10;
  animation:
    crtFlicker 3s ease-in-out infinite,
    crtBand 6s linear infinite;
}

/* Smooth phosphor flicker — gentle breathing, not a seizure */
@keyframes crtFlicker {
  0%, 100% { opacity: 0.8; }
  25%      { opacity: 0.7; }
  50%      { opacity: 0.9; }
  75%      { opacity: 0.65; }
}

/* Slow rolling bright band — VHS tracking artifact crawling downward */
@keyframes crtBand {
  0%   { background-position: 0 0, 0 -100%; }
  100% { background-position: 0 0, 0 100%; }
}

/* Shrink the terminal for pocket-sized devices */
@media only screen and (max-width: 900px) {
  .content-container {
    width: 365px;
  }
}

/* The tilde divider — same treatment as the header's dividers */
.section-divider {
  margin: 0;
  text-align: center;
}

/* === EFFECT 2: AMBIENT FLOATING PARTICLES ===
   Dust motes that only move when you scroll. Positions are
   computed in JS with modulo wrapping so they loop endlessly
   from bottom to top of the viewport. No CSS animation. */

.particle-field {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 5;
}

.particle {
  position: absolute;
  border-radius: 0;
  background: #ffa5a3;
  box-shadow: 0 0 1px 0 rgba(255, 165, 163, 0.8);
  opacity: 0.6;
}

/* === ACCESSIBILITY === */
@media (prefers-reduced-motion: reduce) {
  .content-container::before {
    animation: none;
    opacity: 0.8;
  }
  .particle {
    display: none;
    opacity: 0;
  }
}
</style>

<style>
/**
 * FORRIA64.SPACE — BASE STYLES
 *
 * The aesthetic foundation of a digital fever dream.
 * Black void, monospace text, CRT-red glow —
 * this is the visual language of someone who stared
 * into the terminal and the terminal stared back.
 */

/* ===== RESET & BODY ===== */

/* Anchor rem units across browsers — the one true baseline */
html {
  font-size: 16px;
  height: 100%;
  scrollbar-width: thin;
  scrollbar-color: #ffa5a3 #000000;
}

body {
  min-height: 100%;
  margin: 0;
  font-size: 15px;
  font-family: monospace;
  background-color: #000000;
  color: #ffa5a3;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
  overflow-y: scroll;
  background-attachment: fixed;
  /* background transitions handled by overlay layers */
  scrollbar-width: thin;
  scrollbar-color: #ffa5a3 #000000;
}

/* The app root must stretch so the terminal canvas fills the void */
#app {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #000000;
}

::-webkit-scrollbar-thumb {
  background: #ffa5a3;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #ff8583;
}

/* ===== KEYFRAME ANIMATIONS ===== */
/* Because if it doesn't blink, does it even exist? */

@keyframes animate {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes moveRainbow {
  from {
    background-position: -25% 0;
  }
  to {
    background-position: 0% 0;
  }
}

/* ===== SHARED COMPONENT CLASSES ===== */
/* Used across multiple components — kept global to avoid duplication */

.blink {
  color: #ff0000;
  animation: animate 1s ease-in-out infinite alternate;
}

.red-text {
  color: #ff0000;
}

/* ===== MOBILE RESPONSIVE ===== */
/* Shrink the madness to fit your pocket rectangle */

@media only screen and (max-width: 900px) {
  body {
    font-size: 9px;
  }

  .hide-on-mobile {
    display: none !important;
  }
}

/* ===== ACCESSIBILITY ===== */
/* Respect the user's motion preferences — kill the strobe, keep the soul */

@media (prefers-reduced-motion: reduce) {
  .blink {
    animation: none;
  }

  .space-banner {
    animation: none;
  }
}
</style>
