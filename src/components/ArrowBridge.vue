<!--
  ArrowBridge.vue — Semicolon waterfall bridge.

  A shorter version of ArrowDivider that fills the space between
  the content area and the arcade zone. Same cascading semicolons
  and arrow-tip pattern, same gradient animation. No click handler
  since there's nothing to scroll to — it's pure decoration.
-->

<script setup lang="ts">
import { computed } from 'vue'

const ARROW_LINE  = ';;;;;  ;;;;;  ;;;;;  ;;;;;  ;;;;;  ;;;;;'
const ARROW_TIP_1 = '..;;;;;..;;;;;..;;;;;..;;;;;..;;;;;..;;;;;..'
const ARROW_TIP_2 = " ':::'  ':::'  ':::'  ':::'  ':::'  ':::'"
const ARROW_TIP_3 = "  ':`    ':`    ':`    ':`    ':`    ':`"

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

@media (max-width: 900px) {
  .arrow-bridge {
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
    max-width: 100%;
    overflow-x: auto;
  }
}

@media (max-width: 680px) {
  .arrow-bridge {
    line-height: 1;
    font-size: 7px;
  }
}
</style>
