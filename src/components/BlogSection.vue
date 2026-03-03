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
import { ref, onMounted, nextTick } from 'vue'

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

onMounted(() => fetchPosts())

/**
 * Reach into the void and pull back transmissions.
 * The PocketBase JS SDK (v0.26) doesn't speak the same dialect
 * as PocketBase server v0.36 — so we bypass the interpreter
 * and talk to the API directly with raw fetch, like animals.
 * Client-side filter for published status because the server's
 * filter syntax is equally uncooperative.
 */
async function fetchPosts(): Promise<void> {
  try {
    const url = `${API_BASE}/api/collections/posts/records?perPage=200&sort=-created`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data: PBListResponse = await res.json()
    posts.value = data.items.filter((p) => p.published)
    await nextTick()
    scrollToHashTarget()
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[BlogSection] fetch failed:', e)
    error.value = msg
  } finally {
    loading.value = false
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
        <pre class="post-meta">
<span class="red-text">{{ post.title.toUpperCase() }}</span>
<span class="post-date">{{ formatDate(post.created) }}</span>
<span class="blink">~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</span></pre>
        <pre class="post-content">{{ post.content }}</pre>
        <pre class="post-end"><span class="blink"><br>~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</span></pre>
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

/* Timestamps — present but not screaming for attention */
.post-date {
  opacity: 0.6;
  font-size: 0.9em;
}

/* The body text — wraps like a civilized paragraph, not a scroll */
.post-content {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* The tilde divider at the end — barely visible, like a sigh */
.post-end {
  margin: 0;
}
</style>
