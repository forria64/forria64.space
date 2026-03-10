<!--
  ArcadeGame.vue — kernel.panic

  An arcade game rendered on a <canvas>.
  Rogue processes are crashing through the stack —
  shoot them down before they reach the kernel.

  Fits the monospace terminal aesthetic with its own CRT scanline
  overlay and dotted border. Wider-than-tall aspect ratio.
-->

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

/* ── constants ─────────────────────────────────────────────── */
let CANVAS_W = 640
let CANVAS_H = 400
let FONT_SIZE = 16
const FONT_FAMILY = "'NK57 Monospace', monospace"
let FONT = `${FONT_SIZE}px ${FONT_FAMILY}`

let PLAYER_Y_OFFSET = 30          // px from bottom
const PLAYER_SPEED = 5              // px per frame
const BULLET_SPEED = 6
let ENEMY_DROP = FONT_SIZE + 4    // px per row step
const ENEMY_CHARS = ['©', '®', '☢', '☠', '⚠', '⚑']
let ENEMY_COLS = 10
const ENEMY_ROWS = 4
let ENEMY_H_GAP = 48
let ENEMY_V_GAP = 28
let ENEMY_START_X = 40
let ENEMY_START_Y = 40

/* ── types ─────────────────────────────────────────────────── */
interface Bullet { x: number; y: number }
interface Enemy  { x: number; y: number; ch: string; alive: boolean }
interface Particle { x: number; y: number; ch: string; vx: number; vy: number; life: number }

/* ── reactive state ────────────────────────────────────────── */
const canvasRef = ref<HTMLCanvasElement | null>(null)
const gameState = ref<'idle' | 'playing' | 'gameover'>('idle')
const score = ref(0)
const hiScore = ref(parseInt(localStorage.getItem('kernelPanic_hi') || '0', 10))
const isMobile = ref(false)

/* ── game state (non-reactive for perf) ────────────────────── */
let ctx: CanvasRenderingContext2D | null = null
let animFrame = 0
let playerX = CANVAS_W / 2
let bullets: Bullet[] = []
let enemies: Enemy[] = []
let particles: Particle[] = []
let enemyDir = 1            // 1 = right, -1 = left
let enemySpeed = 0.4
let enemyMoveTimer = 0
let shootCooldown = 0
let wave = 1
let deathFrame = 0          // counts up during game-over animation
let deathAnimFrame = 0      // rAF handle for death animation
let idleAnimFrame = 0       // rAF handle for idle screen animation
let idleFrame = 0           // frame counter for idle blink

/** Random ASCII chars for the static/glitch effect */
const GLITCH_CHARS = '!@#$%^&*<>{}[]|/\\~`░▒▓█▀▄▌▐'

const keys: Record<string, boolean> = {}

/* ── enemy wave builder ────────────────────────────────────── */
function spawnWave(): void {
  enemies = []
  for (let r = 0; r < ENEMY_ROWS; r++) {
    for (let c = 0; c < ENEMY_COLS; c++) {
      enemies.push({
        x: ENEMY_START_X + c * ENEMY_H_GAP,
        y: ENEMY_START_Y + r * ENEMY_V_GAP,
        ch: ENEMY_CHARS[(r + wave) % ENEMY_CHARS.length]!,
        alive: true,
      })
    }
  }
  enemyDir = 1
  const baseSpeed = isMobile.value ? 0.08 : 0.25
  const waveScale = isMobile.value ? 0.03 : 0.1
  enemySpeed = baseSpeed + wave * waveScale
  enemyMoveTimer = 0
}

/* ── explosion particles ───────────────────────────────────── */
function explode(x: number, y: number, ch: string): void {
  const bits = ch.split('')
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6
    particles.push({
      x, y,
      ch: bits[0] || '*',
      vx: Math.cos(angle) * (1 + Math.random() * 2),
      vy: Math.sin(angle) * (1 + Math.random() * 2),
      life: 20 + Math.random() * 15,
    })
  }
}

/* ── game loop ─────────────────────────────────────────────── */
function update(): void {
  if (!ctx) return

  // ── input ──
  if (keys['ArrowLeft'] || keys['a'] || keys['A'])  playerX -= PLAYER_SPEED
  if (keys['ArrowRight'] || keys['d'] || keys['D']) playerX += PLAYER_SPEED
  playerX = Math.max(10, Math.min(CANVAS_W - 10, playerX))

  if ((keys[' '] || keys['ArrowUp'] || keys['w'] || keys['W']) && shootCooldown <= 0) {
    bullets.push({ x: playerX, y: CANVAS_H - PLAYER_Y_OFFSET - FONT_SIZE })
    shootCooldown = 12
  }
  if (shootCooldown > 0) shootCooldown--

  // ── bullets ──
  for (const b of bullets) b.y -= BULLET_SPEED
  bullets = bullets.filter((b) => b.y > 0)

  // ── enemy movement ──
  enemyMoveTimer += enemySpeed
  if (enemyMoveTimer >= 1) {
    enemyMoveTimer = 0

    const alive = enemies.filter((e) => e.alive)
    let edgeHit = false
    for (const e of alive) {
      if ((e.x > CANVAS_W - 40 && enemyDir > 0) || (e.x < 20 && enemyDir < 0)) {
        edgeHit = true
        break
      }
    }
    if (edgeHit) {
      enemyDir *= -1
      for (const e of alive) e.y += ENEMY_DROP
    } else {
      for (const e of alive) e.x += enemyDir * 12
    }
  }

  // ── game over check (every frame, not just on move ticks) ──
  for (const e of enemies) {
    if (!e.alive) continue
    if (e.y >= CANVAS_H - PLAYER_Y_OFFSET - 10) {
      if (score.value > hiScore.value) {
        hiScore.value = score.value
        localStorage.setItem('kernelPanic_hi', String(score.value))
      }
      triggerDeath()
      return
    }
  }

  // ── collision ──
  for (const b of bullets) {
    for (const e of enemies) {
      if (!e.alive) continue
      if (Math.abs(b.x - e.x) < 14 && Math.abs(b.y - e.y) < 12) {
        e.alive = false
        b.y = -100 // mark for removal
        score.value += 10 * wave
        explode(e.x, e.y, e.ch)
      }
    }
  }
  bullets = bullets.filter((b) => b.y > 0)

  // ── particles ──
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    p.life--
  }
  particles = particles.filter((p) => p.life > 0)

  // ── wave cleared? ──
  if (enemies.every((e) => !e.alive)) {
    wave++
    spawnWave()
  }

  draw()
  animFrame = requestAnimationFrame(update)
}

/* ── renderer ──────────────────────────────────────────────── */
function draw(): void {
  if (!ctx) return

  // clear
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
  ctx.font = FONT

  // enemies
  ctx.fillStyle = '#ffa5a3'
  for (const e of enemies) {
    if (!e.alive) continue
    ctx.fillText(e.ch, e.x, e.y)
  }

  // bullets
  ctx.fillStyle = '#ff6b6b'
  for (const b of bullets) {
    ctx.fillText('·', b.x, b.y)
  }

  // player
  ctx.fillStyle = '#ffa5a3'
  ctx.fillText('/▲\\', playerX - 12, CANVAS_H - PLAYER_Y_OFFSET)

  // explosion particles
  for (const p of particles) {
    const alpha = Math.min(1, p.life / 15)
    ctx.fillStyle = `rgba(255, 107, 107, ${alpha})`
    ctx.fillText(p.ch, p.x, p.y)
  }

  // HUD
  ctx.fillStyle = '#ffa5a3'
  ctx.font = `${FONT_SIZE - 2}px ${FONT_FAMILY}`
  ctx.textAlign = 'center'
  ctx.fillText(`SCORE: ${score.value}   WAVE: ${wave}   HI: ${hiScore.value}`, CANVAS_W / 2, CANVAS_H - 6)
  ctx.textAlign = 'start'
  ctx.font = FONT
}

/* ── draw screens ──────────────────────────────────────────── */
function idleLoop(): void {
  if (!ctx || gameState.value !== 'idle') return
  idleFrame++

  // ── player movement on idle screen ──
  if (keys['ArrowLeft'] || keys['a'] || keys['A'])  playerX -= PLAYER_SPEED
  if (keys['ArrowRight'] || keys['d'] || keys['D']) playerX += PLAYER_SPEED
  playerX = Math.max(10, Math.min(CANVAS_W - 10, playerX))

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
  ctx.textAlign = 'center'

  // Title
  ctx.fillStyle = '#ffa5a3'
  ctx.font = `${FONT_SIZE + 4}px ${FONT_FAMILY}`
  ctx.fillText('k e r n e l . p a n i c', CANVAS_W / 2, CANVAS_H / 2 - 70)

  // Subtitle
  ctx.fillStyle = '#ffa5a3'
  ctx.font = `${FONT_SIZE - 2}px ${FONT_FAMILY}`
  ctx.fillText('[ rogue processes descending ]', CANVAS_W / 2, CANVAS_H / 2 - 35)

  // Controls
  ctx.font = FONT
  ctx.fillStyle = '#c48483'
  if (isMobile.value) {
    ctx.fillText('drag to evade   hold to kill -9', CANVAS_W / 2, CANVAS_H / 2 + 10)
  } else {
    ctx.fillText('◄ ► or A/D to evade   SPACE to kill -9', CANVAS_W / 2, CANVAS_H / 2 + 10)
  }

  // Blinking start prompt
  if (Math.floor(idleFrame / 30) % 2 === 0) {
    ctx.fillStyle = '#ffa5a3'
    if (isMobile.value) {
      ctx.fillText('[ TAP TO ENGAGE ]', CANVAS_W / 2, CANVAS_H / 2 + 50)
    } else {
      ctx.fillText('[ PRESS SPACE TO ENGAGE ]', CANVAS_W / 2, CANVAS_H / 2 + 50)
    }
  }

  // Player ship at game position
  ctx.textAlign = 'start'
  ctx.fillStyle = '#ffa5a3'
  ctx.font = FONT
  ctx.fillText('/▲\\', playerX - 12, CANVAS_H - PLAYER_Y_OFFSET)
  ctx.textAlign = 'center'

  // Enemy parade
  ctx.fillStyle = '#ffa5a3'
  ctx.fillText('©  ®  ☢  ☠  ⚠  ⚑    ©  ®  ☢  ☠  ⚠  ⚑', CANVAS_W / 2, CANVAS_H / 2 - 100)

  // HUD
  ctx.fillStyle = '#ffa5a3'
  ctx.font = `${FONT_SIZE - 2}px ${FONT_FAMILY}`
  ctx.textAlign = 'center'
  ctx.fillText(`SCORE: ${score.value}   WAVE: ${wave}   HI: ${hiScore.value}`, CANVAS_W / 2, CANVAS_H - 6)
  ctx.textAlign = 'start'
  ctx.font = FONT

  idleAnimFrame = requestAnimationFrame(idleLoop)
}

/* ── animated death sequence ───────────────────────────────── */
function triggerDeath(): void {
  cancelAnimationFrame(animFrame)
  gameState.value = 'gameover'
  deathFrame = 0
  // Explode all remaining enemies + the player
  for (const e of enemies) {
    if (e.alive) explode(e.x, e.y, e.ch)
  }
  explode(playerX, CANVAS_H - PLAYER_Y_OFFSET, '▲')
  explode(playerX - 10, CANVAS_H - PLAYER_Y_OFFSET, '/')
  explode(playerX + 10, CANVAS_H - PLAYER_Y_OFFSET, '\\')
  deathAnimFrame = requestAnimationFrame(deathLoop)
}

function deathLoop(): void {
  if (!ctx) return
  deathFrame++

  // Phase 1 (0-60): screen shakes + explosions settle
  // Phase 2 (60-120): static noise fills screen
  // Phase 3 (120+): GAME OVER text with glitch + blink

  // ── shake offset ──
  const shakeIntensity = Math.max(0, 1 - deathFrame / 60)
  const shakeX = (Math.random() - 0.5) * 12 * shakeIntensity
  const shakeY = (Math.random() - 0.5) * 8 * shakeIntensity

  ctx.save()
  ctx.translate(shakeX, shakeY)

  // ── darken ──
  const darkness = Math.min(0.85, deathFrame / 80)
  ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`
  ctx.fillRect(-10, -10, CANVAS_W + 20, CANVAS_H + 20)

  // ── particles still animate ──
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.05 // gravity
    p.life--
  }
  particles = particles.filter((p) => p.life > 0)

  for (const p of particles) {
    const alpha = Math.min(1, p.life / 15)
    ctx.fillStyle = `rgba(255, 107, 107, ${alpha})`
    ctx.font = FONT
    ctx.fillText(p.ch, p.x, p.y)
  }

  // ── static noise phase ──
  if (deathFrame > 30 && deathFrame < 120) {
    const noiseAlpha = Math.min(0.6, (deathFrame - 30) / 60)
    ctx.font = `${FONT_SIZE - 4}px ${FONT_FAMILY}`
    const cols = Math.floor(CANVAS_W / 8)
    const rows = Math.floor(CANVAS_H / 10)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.92) {
          const ch = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]!
          const brightness = Math.floor(80 + Math.random() * 100)
          ctx.fillStyle = `rgba(${brightness}, ${Math.floor(brightness * 0.6)}, ${Math.floor(brightness * 0.6)}, ${noiseAlpha})`
          ctx.fillText(ch, c * 8, r * 10)
        }
      }
    }
    ctx.font = FONT
  }

  // ── GAME OVER text ──
  if (deathFrame > 60) {
    const textAlpha = Math.min(1, (deathFrame - 60) / 30)
    const glitchOffset = deathFrame < 90 ? (Math.random() - 0.5) * 8 : 0

    ctx.textAlign = 'center'

    // Glitch shadow
    if (deathFrame < 100 && Math.random() > 0.5) {
      ctx.fillStyle = `rgba(0, 255, 255, ${textAlpha * 0.5})`
      ctx.font = `${FONT_SIZE + 6}px ${FONT_FAMILY}`
      ctx.fillText('K E R N E L   P A N I C', CANVAS_W / 2 + glitchOffset - 2, CANVAS_H / 2 - 28)
    }

    // Main text
    ctx.fillStyle = `rgba(255, 165, 163, ${textAlpha})`
    ctx.font = `${FONT_SIZE + 6}px ${FONT_FAMILY}`
    ctx.fillText('K E R N E L   P A N I C', CANVAS_W / 2 + glitchOffset, CANVAS_H / 2 - 30)

    ctx.font = FONT
    ctx.fillStyle = `rgba(255, 165, 163, ${textAlpha})`
    ctx.fillText(`SCORE: ${score.value}   HI: ${hiScore.value}`, CANVAS_W / 2, CANVAS_H / 2 + 10)

    // Blinking retry prompt
    if (deathFrame > 120 && Math.floor(deathFrame / 20) % 2 === 0) {
      ctx.fillStyle = `rgba(255, 165, 163, ${textAlpha})`
      ctx.fillText('[ REBOOT? ]', CANVAS_W / 2, CANVAS_H / 2 + 50)
    }

    ctx.textAlign = 'start'
  }

  ctx.restore()

  // Keep animating until player restarts
  if (gameState.value === 'gameover') {
    deathAnimFrame = requestAnimationFrame(deathLoop)
  }
}

/* ── start / restart ───────────────────────────────────────── */
function startGame(): void {
  cancelAnimationFrame(deathAnimFrame)
  cancelAnimationFrame(idleAnimFrame)
  score.value = 0
  wave = 1
  playerX = CANVAS_W / 2
  bullets = []
  particles = []
  shootCooldown = 0
  deathFrame = 0
  spawnWave()
  gameState.value = 'playing'
  animFrame = requestAnimationFrame(update)
}

/* ── input handlers ────────────────────────────────────────── */
function onKeyDown(e: KeyboardEvent): void {
  keys[e.key] = true

  if (e.key === ' ') {
    e.preventDefault()
    if (gameState.value === 'idle') {
      startGame()
    } else if (gameState.value === 'gameover' && deathFrame > 120) {
      startGame()
    }
  }
}

function onKeyUp(e: KeyboardEvent): void {
  keys[e.key] = false
}

/* ── touch controls for mobile ─────────────────────────────── */
let touchStartX = 0
let touchActive = false
let autoFireInterval = 0

function onTouchStart(e: TouchEvent): void {
  isMobile.value = true
  const touch = e.touches[0]
  if (!touch) return
  touchStartX = touch.clientX
  touchActive = true

  if (gameState.value === 'idle' || (gameState.value === 'gameover' && deathFrame > 120)) {
    startGame()
    return
  }
  // Start auto-fire while touching
  keys[' '] = true
  if (!autoFireInterval) {
    autoFireInterval = window.setInterval(() => { keys[' '] = true }, 80)
  }
}

function onTouchMove(e: TouchEvent): void {
  if (!touchActive) return
  const touch = e.touches[0]
  if (!touch) return
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return
  // Scale touch delta to canvas coordinates
  const scale = CANVAS_W / rect.width
  const dx = (touch.clientX - touchStartX) * scale
  touchStartX = touch.clientX
  playerX += dx
  playerX = Math.max(10, Math.min(CANVAS_W - 10, playerX))
}

function onTouchEnd(): void {
  touchActive = false
  keys[' '] = false
  if (autoFireInterval) {
    clearInterval(autoFireInterval)
    autoFireInterval = 0
  }
}

/* ── lifecycle ─────────────────────────────────────────────── */
onMounted(() => {
  // Detect touch device
  isMobile.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  // On mobile, resize canvas to fill the viewport
  if (isMobile.value) {
    const pad = 24 // horizontal padding + border
    const titleH = 80 // room for title box above
    const marginTB = 80 // breathing room top + bottom
    CANVAS_W = Math.floor(Math.min(640, window.innerWidth - pad))
    CANVAS_H = Math.floor(window.innerHeight - titleH - marginTB)

    // Scale down font, grid, and spacing for mobile
    FONT_SIZE = 12
    FONT = `${FONT_SIZE}px ${FONT_FAMILY}`
    PLAYER_Y_OFFSET = 24
    ENEMY_DROP = FONT_SIZE + 3
    ENEMY_COLS = Math.min(8, Math.floor((CANVAS_W - 40) / 36))
    ENEMY_H_GAP = Math.floor((CANVAS_W - 60) / ENEMY_COLS)
    ENEMY_V_GAP = 22
    ENEMY_START_X = Math.floor((CANVAS_W - ENEMY_COLS * ENEMY_H_GAP) / 2) + 10
    ENEMY_START_Y = 30

    playerX = CANVAS_W / 2
  }

  nextTick(() => {
    const c = canvasRef.value
    if (!c) return
    c.width = CANVAS_W
    c.height = CANVAS_H
    ctx = c.getContext('2d')
    idleFrame = 0
    idleLoop()
  })
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
})

onUnmounted(() => {
  cancelAnimationFrame(animFrame)
  cancelAnimationFrame(deathAnimFrame)
  cancelAnimationFrame(idleAnimFrame)
  if (autoFireInterval) clearInterval(autoFireInterval)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
})
</script>

<template>
  <section class="arcade-section">
    <pre class="arcade-title">
╔══════════════════════════════════════════════════╗
║             k e r n e l . p a n i c              ║
╚══════════════════════════════════════════════════╝</pre>
    <div class="arcade-cabinet">
      <canvas
        ref="canvasRef"
        :width="CANVAS_W"
        :height="CANVAS_H"
        class="arcade-canvas"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend="onTouchEnd"
      />
      <!-- CRT scanline overlay -->
      <div class="crt-overlay" aria-hidden="true" />
    </div>
  </section>
</template>

<style scoped>
.arcade-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px 10px 300px;
}

.arcade-title {
  color: #ffa5a3;
  font-family: 'NK57 Monospace', monospace;
  font-size: 14px;
  text-align: center;
  margin: 0 0 20px;
  line-height: 1.3;
}

.arcade-cabinet {
  position: relative;
  border: 2px dotted #ffa5a3;
  padding: 6px;
  background: #000;
  /* subtle outer glow */
  box-shadow: 0 0 30px rgba(255, 165, 163, 0.12);
}

.arcade-canvas {
  display: block;
  width: 100%;
  max-width: 640px;
  height: auto;
  image-rendering: pixelated;
  background: #000;
  touch-action: none;
}

/* CRT scanlines on the game screen */
.crt-overlay {
  position: absolute;
  inset: 6px;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.25) 2px,
    rgba(0, 0, 0, 0.25) 4px
  );
  mix-blend-mode: multiply;
  z-index: 1;
}

/* responsive: keep it usable on small screens */
@media (max-width: 680px) {
  .arcade-section {
    min-height: 100dvh;
    padding: 0px 6px 0px;
    justify-content: flex-start;
  }
  .arcade-cabinet {
    max-width: calc(100vw - 20px);
  }
  .arcade-canvas {
    height: auto;
  }
  .arcade-title {
    font-size: 12px;
    margin: 10px 0 30px;
  }
}
</style>
