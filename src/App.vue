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
 * Wire up the scroll-background hallucination engine
 * and assemble the component choir.
 */
import { useScrollBackground } from '@/composables/useScrollBackground'
import AsciiHeader from '@/components/AsciiHeader.vue'
import ContactLinks from '@/components/ContactLinks.vue'
import ArrowDivider from '@/components/ArrowDivider.vue'
import TechiesCreed from '@/components/TechiesCreed.vue'

useScrollBackground()
</script>

<template>
  <main class="terminal-wrapper">
    <div class="content-container">
      <AsciiHeader />
      <ContactLinks />
      <pre
        class="section-divider"
      >~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
<span class="blink">V^V^V^V^V^V^V <em>PROUD STACK STUMBLER &amp; BYTE MANGLER</em> V^V^V^V^V^V^V</span>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</pre>
      <ArrowDivider />
      <TechiesCreed />
    </div>
  </main>
</template>

<style scoped>
/* The main wrapper must grow to fill the flex parent */
.terminal-wrapper {
  display: flex;
  flex: 1;
  justify-content: center;
  font-weight: bold;
}

/* The terminal window — dashed borders, fixed width, fills the viewport */
.content-container {
  width: 600px;
  border-left: 2px dashed #ffa5a3;
  border-right: 2px dashed #ffa5a3;
  padding: 0 10px 10px;
  backdrop-filter: blur(10px);
  font-family: monospace;
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
  transition:
    background-image 3s ease,
    background-color 3s ease;
  scrollbar-width: none;
}

/* The app root must stretch so the terminal canvas fills the void */
#app {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
}

::-webkit-scrollbar {
  display: none;
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
