<!--
  ContactLinks.vue — Three neon pills floating in the void.

  Each render rolls the dice on a fresh neon color per button,
  because consistency is the hobgoblin of boring websites.
  Colors are pulled from a curated palette of retina-scorching neons.
-->

<script setup lang="ts">
/**
 * NEON_PALETTE — a hand-picked arsenal of colors that would make
 * a Tokyo sign maker weep with professional envy.
 * We shuffle and assign one per link on every mount.
 */
const NEON_PALETTE: string[] = [
  '#ff0000', // red — 0° — the universal sign of something important or broken
  '#ff8800', // orange — 45° — hazard tape energy
  '#ccff00', // chartreuse — 90° — radioactive highlighter
  '#00ff44', // green — 135° — the terminal approves
  '#00ffff', // cyan — 180° — cold as liquid nitrogen
  '#0055ff', // blue — 225° — deep electric ocean
  '#aa00ff', // violet — 270° — the ultraviolet edge of sanity
  '#ff00aa', // pink — 315° — neon bubblegum from hell
]

interface ContactLink {
  label: string
  external: boolean
  href?: string
  encodedHref?: string
  download?: string
}

/**
 * The sacred trinity of reaching a human through the wire.
 * GitHub and email are base64-encoded so web-crawling parasites
 * can't slurp them out of the page source. Decoded only on click,
 * when a real human with real intent pulls the trigger.
 */
const LINKS: ContactLink[] = [
  { encodedHref: 'aHR0cHM6Ly9naXRodWIuY29tL2ZvcnJpYTY0', label: 'GITHUB', external: true },
  { href: '/public_key', label: 'SSH-KEY', download: 'public_key', external: false },
  { encodedHref: 'bWFpbHRvOmZvcnJpYUBmb3JyaWE2NC5zcGFjZQ==', label: 'E-MAIL', external: true },
]

/**
 * revealHref — the magician's reveal.
 * On hover or focus, decode the base64 and inject the real URL
 * into the anchor's href so the browser status bar shows
 * the actual destination. Humans see truth; bots see nothing.
 */
function revealHref(event: Event, link: ContactLink): void {
  if (link.encodedHref) {
    const anchor = event.currentTarget as HTMLAnchorElement
    anchor.href = atob(link.encodedHref)
    if (link.external) {
      anchor.target = '_blank'
    }
  }
}

/**
 * concealHref — back behind the curtain.
 * On mouseleave or blur, wipe the decoded URL from the DOM.
 * The fewer milliseconds that real URL lives in the markup, the better.
 */
function concealHref(event: Event, link: ContactLink): void {
  if (link.encodedHref) {
    const anchor = event.currentTarget as HTMLAnchorElement
    anchor.removeAttribute('href')
    anchor.removeAttribute('target')
  }
}

/**
 * Fisher-Yates shuffle — the only honest way to randomize an array.
 * Returns a new array so we don't mutate the palette like barbarians.
 */
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
  }
  return shuffled
}

/** Roll the neon dice — one color per button, no repeats */
const assignedColors = shuffleArray(NEON_PALETTE).slice(0, LINKS.length)
</script>

<template>
  <span class="button-row">
    <template v-for="(link, idx) in LINKS" :key="link.label">
      <a
        :href="link.encodedHref ? undefined : link.href"
        :target="!link.encodedHref && link.external ? '_blank' : undefined"
        :rel="link.external ? 'noopener noreferrer nofollow' : 'nofollow'"
        :download="link.download || undefined"
        class="button-link"
        @mouseenter="(e: Event) => revealHref(e, link)"
        @mouseleave="(e: Event) => concealHref(e, link)"
        @focus="(e: Event) => revealHref(e, link)"
        @blur="(e: Event) => concealHref(e, link)"
      >
        <span
          class="contact"
          :style="{
            color: assignedColors[idx],
            borderColor: assignedColors[idx],
          }"
          >{{ link.label }}</span
        > </a
      >{{ ' ' }}
    </template>
  </span>
</template>

<style scoped>
/* The button row — centered, equal breathing room above and below */
.button-row {
  display: block;
  text-align: center;
  margin-top: 2em;
  margin-bottom: 1em;
}

/* Each pill — oversized, loud, unapologetic */
.contact {
  border: 2px solid;
  padding: 4px 12px;
  font-size: 1.1em;
  font-weight: bold;
  transition:
    text-shadow 0.4s ease,
    box-shadow 0.4s ease,
    filter 0.4s ease;
}

/* Hover ignites the neon — only on devices with a real pointer */
@media (hover: hover) {
  .contact:hover {
    text-shadow:
      0 0 6px currentColor,
      0 0 14px currentColor,
      0 0 30px currentColor;
    box-shadow:
      0 0 6px currentColor,
      0 0 14px currentColor,
      0 0 30px currentColor,
      inset 0 0 8px currentColor;
    filter: brightness(1.2);
  }
}

.button-link {
  text-decoration: none;
  cursor: pointer;
}

/* Tighter pills on small screens — less padding so they don't crowd each other */
@media only screen and (max-width: 900px) {
  .contact {
    padding: 2px 6px;
    font-size: 1em;
  }
}
</style>
