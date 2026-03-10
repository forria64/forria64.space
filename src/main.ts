/**
 * main.ts — The ignition switch.
 *
 * Boots the Vue app and mounts the whole apparatus to the DOM.
 */

import { createApp } from 'vue'

import App from './App.vue'

createApp(App).mount('#app')

/* ── console easter egg ────────────────────────────────────── */
;(() => {
  const style =
    "color:#ff0000;background:#0a0a0a;font-family:'NK57 Monospace',monospace;font-size:12px;line-height:1.5;padding:2px 6px"

  /* Replace the browser's default self-XSS warning.
     1st trigger → scolding.  2nd trigger → fun tutorial. */
  const _warn = console.warn.bind(console)
  let pasteCount = 0

  const trapMsg =
    ' ┌─────────────────────────────────────────────────────────┐\n' +
    ' │                                                         │\n' +
    ' │    NICE TRY, SCRIPT KIDDIE                              │\n' +
    ' │                                                         │\n' +
    ' │  Pasting code you don\'t understand into a console       │\n' +
    ' │  is how you get owned.                                  │\n' +
    ' │                                                         │\n' +
    ' │  Read it first. Understand it. Then run it.             │\n' +
    ' │  This is rule #4 of the Creed. You did read it, right?  │\n' +
    ' │                                                         │\n' +
    ' └─────────────────────────────────────────────────────────┘'

  const tutorialMsg =
    ' ┌─────────────────────────────────────────────────────────┐\n' +
    ' │                                                         │\n' +
    ' │    OK, YOU PASSED THE VIBE CHECK                        │\n' +
    ' │                                                         │\n' +
    ' │    I\'ll teach you something fun.                        │\n' +
    ' │    Type these lines one by one.                         │\n' +
    ' │                                                         │\n' +
    ' │  ────────────────────────────────────────────────────── │\n' +
    ' │                                                         │\n' +
    ' │  1> let s="https://media.tenor.com/8lR3_1m-i94AAAAj"    │\n' +
    ' │     +"/cat.gif"                                         │\n' +
    ' │                                                         │\n' +
    ' │  2> let n=()=>{let i=new Image;i.src=s;                 │\n' +
    ' │     i.style.cssText="position:fixed;z-index:99999;"     │\n' +
    ' │     +"width:100px;pointer-events:none";                 │\n' +
    ' │     document.body.appendChild(i);let x=Math.random()    │\n' +
    ' │     *(innerWidth-100),y=Math.random()*(innerHeight      │\n' +
    ' │     -60),dx=(2+Math.random()*3)*(Math.random()>.5?      │\n' +
    ' │     1:-1),dy=(2+Math.random()*3)*(Math.random()>.5?     │\n' +
    ' │     1:-1);i.style.transform=dx<0?"scaleX(-1)":"";       │\n' +
    ' │     setInterval(()=>{x+=dx;y+=dy;if(x+100>innerWidth    │\n' +
    ' │     ||x<0){dx=-dx;i.style.transform=dx<0?               │\n' +
    ' │     "scaleX(-1)":""}if(y+60>innerHeight||y<0)dy=-dy;    │\n' +
    ' │     i.style.left=x+"px";i.style.top=y+"px"},16)};       │\n' +
    ' │     for(let j=0;j<20;j++)setTimeout(n,j*200)            │\n' +
    ' │                                                         │\n' +
    ' │  3> let f=document.createElement("iframe");             │\n' +
    ' │     f.src="https://www.youtube.com/embed/2yJgwwDcgV8"   │\n' +
    ' │     +"?autoplay=1&loop=1&playlist=2yJgwwDcgV8";         │\n' +
    ' │     f.allow="autoplay";f.style.display="none";          │\n' +
    ' │     document.body.appendChild(f)                        │\n' +
    ' │                                                         │\n' +
    ' │─────────────────────────────────────────────────────────│\n' +
    ' │                                                         │\n' +
    ' │  This is safe. Read it. It spawns 20 Nyan Cats that     │\n' +
    ' │  bounce around the page and plays the theme on loop.    │\n' +
    ' │  They even flip when they change direction.             │\n' +
    ' │  Refresh to undo. You\'re welcome.                       │\n' +
    ' │                                                         │\n' +
    ' └─────────────────────────────────────────────────────────┘'

  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      /self.xss|paste.*code|warning.*console/i.test(args[0])
    ) {
      pasteCount++
      console.log(pasteCount === 1 ? trapMsg : tutorialMsg)
      return
    }
    _warn(...args)
  }

  /* The main message — visible the moment DevTools opens. */
  const box =
`%c                                                          
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ░▒▓ SIGNAL INTERCEPTED ▓▒░                             │
│                                                         │
│  Welly, welly, well. You opened the console.            │
│  Most visitors never leave the GUI.                     │
│  You are not most visitors.                             │
│                                                         │
│─────────────────────────────────────────────────────────│
│                                                         │
│  "Any sufficiently advanced technology is               │
│   indistinguishable from a rigged demo."                │
│                          — a techie, probably           │
│                                                         │
│  ───────────────────────────────────────────────────────│
│                                                         │
│  Now close this tab and go outside. The sun is nice.    │
│  ...just kidding. Stay. Hack the planet.                │
│                                                         │
└─────────────────────────────────────────────────────────┘
                                                          `

  console.log(box, style)
})()
