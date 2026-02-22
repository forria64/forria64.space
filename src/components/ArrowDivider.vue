<!--
  ArrowDivider.vue — The cascading semicolon waterfall.
  
  A visual separator made entirely of semicolons and colons,
  because why use an <hr> when you can build a 
  typographic curtain that looks like rain in the Matrix?
  
  Row count is dynamically calculated so the arrow tips
  always kiss the bottom of the viewport. Adapts on resize.
  The gradient animation gives it a living, breathing pulse.
-->

<script setup lang="ts">
/**
 * Dynamic arrow divider — calculates how many rows to render
 * so the tip pattern lands exactly at the viewport floor.
 * One version for all screen sizes. The void fills itself.
 */
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const ARROW_LINE = '     ;;;;;      ;;;;;     ;;;;;     ;;;;;     ;;;;;     ;;;;;'
const ARROW_TIP_1 = '   ..;;;;;..  ..;;;;;.. ..;;;;;.. ..;;;;;.. ..;;;;;.. ..;;;;;..'
const ARROW_TIP_2 = "    ':::::'    ':::::'   ':::::'   ':::::'   ':::::'   ':::::'"
const ARROW_TIP_3 = "      ':`        ':`       ':`       ':`       ':`       ':`"

/** How many tip lines eat into the available space */
const TIP_LINE_COUNT = 4

/** Minimum rows so it never collapses into nothing on tiny viewports */
const MIN_ROWS = 5

const arrowContainer = ref<HTMLPreElement | null>(null)
const rowCount = ref(MIN_ROWS)

/**
 * Measure the actual rendered height of the <pre> (which accounts
 * for text wrapping on mobile), then calculate how many arrow rows
 * we need to fill from the element's position down to the viewport floor.
 *
 * We use a two-step approach: render with a known row count first,
 * measure the real per-row pixel height (wrapping included),
 * then adjust to fill the viewport exactly.
 */
function calculateRows(): void {
  const el = arrowContainer.value
  if (!el) return

  /** How many logical lines are currently rendered (arrow rows + tip lines) */
  const currentLogicalLines = rowCount.value + TIP_LINE_COUNT

  /**
   * Actual rendered height divided by logical line count gives us
   * the TRUE per-line pixel cost — wrapping, line-height, the whole deal.
   */
  const renderedHeight = el.scrollHeight
  const perLineHeight = renderedHeight / currentLogicalLines

  /** Guard against division-by-zero or insane measurements */
  if (perLineHeight <= 0) return

  const rect = el.getBoundingClientRect()
  const topOffset = rect.top > 0 ? rect.top : 0

  const availableHeight = window.innerHeight - topOffset
  const totalLines = Math.floor(availableHeight / perLineHeight)
  const arrowRows = totalLines - TIP_LINE_COUNT

  rowCount.value = Math.max(arrowRows, MIN_ROWS)
}

/** Debounce resize to avoid thrashing the DOM like a cornered animal */
let resizeTimer: ReturnType<typeof setTimeout> | null = null
function onResize(): void {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(calculateRows, 100)
}

onMounted(async () => {
  await nextTick()
  calculateRows()
  /** Second pass — first calculation changed rowCount, which changed the
   *  rendered height. Remeasure with the new geometry for accuracy. */
  await nextTick()
  calculateRows()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  if (resizeTimer) clearTimeout(resizeTimer)
})

/**
 * scrollToCreed — the arrows point down for a reason.
 * Clicking anywhere on this waterfall of semicolons
 * sends you hurtling toward the creed like a man
 * who just realized he left the oven on.
 */
function scrollToCreed(): void {
  const target = document.getElementById('techies_creed')
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <pre ref="arrowContainer" class="arrows" role="button" tabindex="0" aria-label="Scroll to Techie's Creed" @click="scrollToCreed" @keydown.enter="scrollToCreed"><template v-for="n in rowCount" :key="n">{{ ARROW_LINE }}
</template>{{ ARROW_TIP_1 }}
{{ ARROW_TIP_2 }}
{{ ARROW_TIP_3 }}</pre>
</template>

<style scoped>
/* The gradient text treatment — blood and void, animated */
.arrows {
  display: flex;
  margin: 0;
  cursor: pointer;
  background: linear-gradient(150deg, red, black, #ffa5a3);
  background-size: 500% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: moveRainbow 2s linear infinite alternate;
}

/* Respect the user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  .arrows {
    animation: none;
  }
}
</style>
