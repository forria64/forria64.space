<!--
  BlogSection.vue — The living archive, etched in terminal red.

  Reaches into PocketBase's `posts` collection and pulls back
  every published transmission, rendering them inline like
  intercepted radio chatter from a parallel dimension.

  Newest dispatches sit closest to the creed — the deeper
  you scroll, the older the signal. An archaeological dig
  through someone's digital nervous system.
-->

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  published: boolean
  created: string
}

interface PBListResponse {
  items: BlogPost[]
  page: number
  perPage: number
  totalItems: number
  totalPages: number
}

/**
 * The PocketBase API endpoint — our direct line to the database.
 * In dev, Vite intercepts /api and funnels it to localhost:8090.
 * In prod, PocketBase serves everything from one origin,
 * like a well-adjusted monolith should.
 */
const API_BASE = import.meta.env.DEV ? '' : window.location.origin

const posts = ref<BlogPost[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

/** The slug of the currently expanded post, or null when all collapsed. */
const expandedSlug = ref<string | null>(null)

/** Refs to each post's collapsible body element, keyed by slug. */
const bodyRefs: Record<string, HTMLElement | null> = {}
/** Cached scrollHeights so the CSS transition has a target value. */
const heights = reactive<Record<string, number>>({})

function setBodyRef(slug: string, el: HTMLElement | null): void {
  bodyRefs[slug] = el
}

/** Accordion toggle — opening one post closes the previous. */
function togglePost(slug: string): void {
  // Measure the natural height before toggling so CSS can transition to it.
  const el = bodyRefs[slug]
  if (el) heights[slug] = el.scrollHeight
  const opening = expandedSlug.value !== slug
  expandedSlug.value = opening ? slug : null
  if (opening) {
    // Scroll the article into view and update the URL hash.
    nextTick(() => {
      const article = document.getElementById(`post-${slug}`)
      if (article) article.scrollIntoView({ behavior: 'smooth' })
    })
    history.replaceState(null, '', `#${slug}`)
  } else {
    history.replaceState(null, '', window.location.pathname)
  }
}

/** Return inline style for the collapsible body. */
function bodyStyle(slug: string): Record<string, string> {
  const isOpen = expandedSlug.value === slug
  return {
    maxHeight: isOpen ? `${heights[slug] ?? 0}px` : '0',
  }
}

/**
 * Dummy transmissions for offline development.
 * When PocketBase isn't running, these synthetic dispatches
 * fill the void so you can tweak layout without a live backend.
 */
const DUMMY_POSTS: BlogPost[] = [
  {
    id: 'dummy-1',
    title: 'First Dispatch from the Wire',
    slug: 'first-dispatch',
    content:
      'The static clears. A signal emerges.\n' +
      'We are broadcasting from coordinates unknown.\n' +
      'The infrastructure is held together with duct tape and defiance.\n' +
      'But it works. It works because we refuse to let it not work.\n' +
      'End of line.',
    published: true,
    created: '2026-03-01T10:30:00.000Z',
  },
  {
    id: 'dummy-2',
    title: 'On the Merits of Staying Up Too Late',
    slug: 'staying-up-late',
    content:
      '03:47 UTC — the hour when bad ideas feel like genius.\n' +
      'The system agrees with you at this hour. It has no choice.\n' +
      'You are the only consciousness left to argue with.\n' +
      'Tomorrow you will read this diff and weep.\n' +
      'But tonight, tonight you are infinite.',
    published: true,
    created: '2026-02-20T03:47:00.000Z',
  },
  {
    id: 'dummy-3',
    title: 'A Short Note',
    slug: 'short-note',
    content: 'This post has only one line and should not be truncated.',
    published: true,
    created: '2026-02-10T12:00:00.000Z',
  },
]

/** Collapse all articles when clicking outside title/timestamp areas and expanded content. */
function onDocumentClick(e: MouseEvent): void {
  const target = e.target as HTMLElement | null
  if (target && !target.closest('.post-toggle') && !target.closest('.post-body')) {
    expandedSlug.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  fetchPosts()
})
onUnmounted(() => document.removeEventListener('click', onDocumentClick))

/**
 * Reach into the void and pull back transmissions.
 * The PocketBase JS SDK (v0.26) doesn't speak the same dialect
 * as PocketBase server v0.36 — so we bypass the interpreter
 * and talk to the API directly with raw fetch, like animals.
 * Client-side filter for published status because the server's
 * filter syntax is equally uncooperative.
 *
 * Falls back to dummy posts when running in dev without PocketBase.
 */
async function fetchPosts(): Promise<void> {
  try {
    const url = `${API_BASE}/api/collections/posts/records?perPage=200&sort=-created`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data: PBListResponse = await res.json()
    posts.value = data.items.filter((p) => p.published)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[BlogSection] fetch failed:', e)
    if (import.meta.env.DEV) {
      console.warn('[BlogSection] using dummy posts for local dev')
      posts.value = DUMMY_POSTS
      error.value = null
    } else {
      error.value = msg
    }
  } finally {
    loading.value = false
    await nextTick()
    scrollToHashTarget()
  }
}

/**
 * Deep-link teleporter — if the URL has a hash fragment
 * matching a post slug, catapult the viewport straight to it.
 * e.g. forria64.space/#hello-world
 *
 * The 300ms delay is a gentleman's agreement with ArrowDivider,
 * whose dynamic height calculation needs a moment to finish
 * rearranging the furniture before we can aim accurately.
 */
function scrollToHashTarget(): void {
  const hash = window.location.hash.slice(1)
  if (!hash) return
  // Auto-expand the targeted post so its content is visible.
  const el = bodyRefs[hash]
  if (el) heights[hash] = el.scrollHeight
  expandedSlug.value = hash
  setTimeout(() => {
    const el = document.getElementById(`post-${hash}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }, 300)
}

/**
 * Stamp each transmission with a military-broadcast dateline.
 * Because if your timestamps don't look like intercepted
 * satellite telemetry, are you even trying?
 *
 * Returns: "SAT 01 MAR 2026 // 14:30:05 UTC"
 */
function formatDate(iso: string): string {
  const d = new Date(iso)
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const pad = (n: number) => String(n).padStart(2, '0')
  const day = days[d.getUTCDay()]
  const mon = months[d.getUTCMonth()]
  return `${day} ${pad(d.getUTCDate())} ${mon} ${d.getUTCFullYear()} // ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`
}
</script>

<template>
  <section id="blog_section" class="blog-section" aria-label="Blog posts">
    <pre class="blog-header"><span class="blink">^V^V^V^V^V^V^^V^V^V^V^V^V^^V^V^V^V^V^V^^V^V^V^V^V^V^^V^V^V^V^V^V^V^</span>
::::::::: SAMIZDAT — OPEN AS IN SOURCE, FREE AS IN SPEECH :::::::::
<span class="blink">^V^V^V^V^V^V^^V^V^V^V^V^V^^V^V^V^V^V^V^^V^V^V^V^V^V^^V^V^V^V^V^V^V^</span>
<br></pre>

    <div v-if="loading" class="blog-status">
      <pre>[ THE WIRE IS HOT... STAND BY ]</pre>
    </div>

    <div v-else-if="error" class="blog-status">
      <pre>[ THE WIRE GOT FUBAR — BUY THE TICKET, TAKE THE 500 ]</pre>
    </div>

    <div v-else-if="posts.length === 0" class="blog-status">
      <pre>[ DEAD AIR — THE GOOD DOCTOR IS ARMED AND PROCRASTINATING ]</pre>
    </div>

    <template v-else>
      <article
        v-for="post in posts"
        :key="post.id"
        :id="`post-${post.slug}`"
        class="blog-post"
      >
        <pre
          class="post-meta post-toggle"
          :class="{ 'is-expanded': expandedSlug === post.slug }"
          role="button"
          tabindex="0"
          :aria-expanded="expandedSlug === post.slug"
          @click="togglePost(post.slug)"
          @keydown.enter.prevent="togglePost(post.slug)"
          @keydown.space.prevent="togglePost(post.slug)"
        >
<span class="red-text">{{ expandedSlug === post.slug ? '[-] ' : '[+] ' }}{{ post.title.toUpperCase() }}</span>
<span class="post-date">{{ formatDate(post.created) }}</span></pre>
        <pre class="post-divider"><span class="blink">~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</span></pre>
        <div
          class="post-body"
          :ref="(el) => setBodyRef(post.slug, el as HTMLElement | null)"
          :style="bodyStyle(post.slug)"
        >
          <pre class="post-content">{{ post.content }}</pre>
          <pre class="post-spacer">&nbsp;</pre>
        </div>
      </article>
    </template>
  </section>
</template>

<style scoped>
/* The archive entrance — flush with its surroundings */
.blog-section {
  margin-top: 0;
}

/* Header banner — centered like a broadcast station identifier */
.blog-header {
  margin: 0;
  text-align: center;
}

/* Status messages — dimmed so they don't steal the show */
.blog-status {
  text-align: center;
  opacity: 0.6;
}

.blog-status pre {
  margin: 1em 0;
}

/* Each post — zero breathing room, they stack like log entries */
.blog-post {
  margin: 0;
}

/* The title block — flush, no margins, pure information density */
.post-meta {
  margin: 0;
}

/* Clickable title — cursor hint and red tinge on hover/active */
.post-toggle {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

@media (hover: hover) {
  .post-toggle:hover {
    background-color: rgba(255, 0, 0, 0.08);
  }
}

.post-toggle.is-expanded {
  background-color: rgba(255, 0, 0, 0.12);
}
/* Timestamps — present but not screaming for attention */
.post-date {
  opacity: 0.6;
  font-size: 0.9em;
}

/* Tilde divider between title area and content */
.post-divider {
  margin: 0;
}

/* Collapsible body wrapper — smooth reveal via max-height */
.post-body {
  overflow: hidden;
  transition: max-height 0.35s ease;
}

/* The body text — wraps like a civilized paragraph, not a scroll */
.post-content {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.post-spacer {
  margin: 0;
}
</style>
