<!--
  ArrowBridge.vue — Semicolon waterfall bridge.

  A shorter version of ArrowDivider that fills the space between
  the content area and the arcade zone. Same cascading semicolons
  and arrow-tip pattern, same gradient animation. No click handler
  since there's nothing to scroll to — it's pure decoration.
-->

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

const ARROW_LINE_WIDE  = ';;;;;  ;;;;;  ;;;;;  ;;;;;  ;;;;;  ;;;;;'
const ARROW_TIP_1_WIDE = '..;;;;;..;;;;;..;;;;;..;;;;;..;;;;;..;;;;;..'
const ARROW_TIP_2_WIDE = " ':::'  ':::'  ':::'  ':::'  ':::'  ':::'"
const ARROW_TIP_3_WIDE = "  ':`    ':`    ':`    ':`    ':`    ':`"

const ARROW_LINE_NARROW  = ';;;;;  ;;;;;  ;;;;;  ;;;;;'
const ARROW_TIP_1_NARROW = '..;;;;;..;;;;;..;;;;;..;;;;;..'
const ARROW_TIP_2_NARROW = " ':::'  ':::'  ':::'  ':::'"
const ARROW_TIP_3_NARROW = "  ':`    ':`    ':`    ':`"

const windowWidth = ref(window.innerWidth)
function onResize() { windowWidth.value = window.innerWidth }
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))

const isMobile = computed(() => windowWidth.value < 900)

const ARROW_LINE  = computed(() => isMobile.value ? ARROW_LINE_NARROW : ARROW_LINE_WIDE)
const ARROW_TIP_1 = computed(() => isMobile.value ? ARROW_TIP_1_NARROW : ARROW_TIP_1_WIDE)
const ARROW_TIP_2 = computed(() => isMobile.value ? ARROW_TIP_2_NARROW : ARROW_TIP_2_WIDE)
const ARROW_TIP_3 = computed(() => isMobile.value ? ARROW_TIP_3_NARROW : ARROW_TIP_3_WIDE)

const ROW_COUNT = 20

/**
 * Compute letter-spacing per row — widest at top (6px),
 * converging to tightest at bottom (0px). Eased funnel shape.
 */
const rowStyles = computed(() => {
  return Array.from({ length: ROW_COUNT }, (_, i) => {
    const t = i / (ROW_COUNT - 1)
    const spacing = 6 * Math.cos(t * Math.PI * 0.5)
    return { letterSpacing: `${spacing.toFixed(1)}px` }
  })
})
</script>

<template>
  <pre class="arrow-bridge" aria-hidden="true"><template v-for="n in ROW_COUNT" :key="'r'+n"><span class="lens-row" :style="rowStyles[n - 1]">{{ ARROW_LINE }}</span>
</template><span class="lens-row">{{ ARROW_TIP_1 }}</span>
<span class="lens-row">{{ ARROW_TIP_2 }}</span>
<span class="lens-row">{{ ARROW_TIP_3 }}</span></pre>
</template>

<style scoped>
.arrow-bridge {
  display: block;
  margin: 0;
  text-align: center;
  line-height: 0.8;
  background: linear-gradient(
    180deg,
    #ff00ff,
    #00ffff,
    #39ff14,
    #ff6ec7,
    #ffff00,
    #ff3503,
    #00ffff,
    #ff00ff
  );
  background-size: 100% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: rainbowFlow 4s linear infinite;
}

.lens-row {
  display: block;
  white-space: pre;
}

@keyframes rainbowFlow {
  0%   { background-position: 0 200%; }
  100% { background-position: 0 0; }
}

@media (prefers-reduced-motion: reduce) {
  .arrow-bridge {
    animation: none;
  }
}
</style>
