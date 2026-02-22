<!--
  AsciiHeader.vue — The towering monolith of monospace madness.
  
  Two ASCII art blocks rendered in raw <pre> glory:
  1. "FORRIA" banner
  2. "THE SPACE" banner (blinking, because subtlety is dead)
  
  This component is pure visual spectacle — minimal logic,
  just characters arranged with the precision of a fever dream.
-->

<template>
  <pre class="ascii-block"><span> ________    ______     _______     _______     ______     ______  
|        \  /      \   |       \   |       \   |      \   /      \ 
| ########    ######\    #######\    #######\   \######     ######\
| ##__     | ##  | ##    ##__| ##    ##__| ##    | ##    | ##__| ##
| ##  \    | ##  | ##    ##    ##    ##    ##    | ##    | ##    ##
| #####    | ##  | ##    #######\    #######\    | ##    | ########
| ##       | ##__/ ##    ##  | ##    ##  | ##   _| ##_   | ##  | ##
| ##        \##    ##    ##  | ##    ##  | ##  \   ##    \ ##  | ##
 \##         \######    \##   \##   \##   \##   \######   \##   \##</span>
<span>  ______  __    __</span><span class="space-banner">     ______  _______   ______   ______  ________ </span>
<span> /      \|  \  |  \</span><span class="space-banner">   /      \|       \ /      \ /      \|        \</span>
<span>|  ######\ ##  | ##</span><span class="space-banner">  |  ######\ #######\  ######\  ######\ ########</span>
<span>| ##___\## ##__| ##</span><span class="space-banner">  | ##___\## ##__/ ## ##__| ## ##   \## ##__    </span>
<span>| ##    \| ##    ##</span><span class="space-banner">   \##    \| ##    ## ##    ## ##     | ##  \   </span>
<span>| #######\\########</span><span class="space-banner">   _\######\ #######| ######## ##   __| #####   </span>
<span>| ##__/ ##     | ##</span><span class="space-banner">  | \__| ## ##      | ##  | ## ##__/  \ ##_____ </span>
<span> \##    ##     | ##</span><span class="space-banner">  \##    ## ##      | ##  | ##\##    ## ##     \</span>
<span>  \######       \##</span><span class="space-banner"> # \###### \##       \##   \## \###### \########</span></pre>
</template>

<style scoped>
/* The ASCII banner itself — a monument to monospace alignment */
.ascii-block {
  margin: 0;
  line-height: 1.2;
}

/* "THE SPACE" blinks because we live on the edge */
.space-banner {
  color: #ff0000;
  animation: animate 1s ease-in-out infinite alternate;
}
</style>
