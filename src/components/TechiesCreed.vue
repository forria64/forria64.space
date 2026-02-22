<!--
  TechiesCreed.vue — The full five-point manifesto.

  A digital oath rendered in ASCII art and red ink,
  like the Hippocratic Oath for people who talk to machines.
  
  Each section has its own ASCII art letter header (blinking),
  red numbered declarations, and contemplative sub-text.
  
  The element ID 'techies_creed' is the scroll target
  for the background-shifting composable.
-->

<template>
  <pre
    id="techies_creed"
    class="scroll-target"
  ><span class="section-divider"><span class="blink">^V^V^V^V^V^V^^V^V^V^V^V^V^^V^V^V^V^V^V^^V^V^V^V^V^V^^V^V^V^V^V^V^</span>
::: THROUGH THESE GATES ENTER THE MAD AND THE METHODICAL; :::
::::::::: THE BRAVE AND THE CAFFEINATED; :::::::::
::::::::: THE DAMNED AND THE SLEEP-DEPRIVED. :::::::::
::: MAY YOUR BUILDS BE GREEN AND YOUR BUGS FEW! :::
<span class="blink">^V^V^V^V^V^V^^V^V^V^V^V^V^^V^V^V^V^V^V^^V^V^V^V^V^V^^V^V^V^V^V^V^</span></span>
<span class="blink">  ______</span>
<span class="blink"> /      \</span>  <span class="red-text">1. THIS IS MY SYSTEM.</span>
<span class="blink">|  ######\</span>    <span class="red-text">THERE ARE MANY OTHERS LIKE IT, BUT THIS ONE IS MINE.</span>
<span class="blink">| ##__| ##</span>    
<span class="blink">| ##    ##</span>    My system is my instrument —
<span class="blink">| ########</span>    an extension of my will made of logic and silicon.
<span class="blink">| ##  | ##</span>    I must understand it as <em>intimately</em>
<span class="blink">| ##  | ##</span>    as I understand the wiring of <em>my own mind</em>.
<span class="blink"> \##   \##</span>    
<span class="blink"> ________ ________  ______  __    __ ______ ________ __  ______</span>
<span class="blink">|        \        \/      \|  \  |  \      \        \  \/      \</span>
<span class="blink"> \######## ########  ######\ ##  | ##\###### ######## ##  ######\</span>
<span class="blink">   | ##  | ##__   | ##   \## ##__| ## | ## | ##__    \#| ##___\##</span>
<span class="blink">   | ##  | ##  \  | ##     | ##    ## | ## | ##  \      \##    \</span>
<span class="blink">   | ##  | #####  | ##   __| ######## | ## | #####      _\######\</span>
<span class="blink">   | ##  | ##_____| ##__/  \ ##  | ##_| ##_| ##_____   |  \__| ##</span>
<span class="blink">   | ##  | ##     \\##    ## ##  | ##   ## \ ##     \   \##    ##</span>
<span class="blink">    \##   \######## \###### \##   \##\######\########    \######</span>
                    <span class="blink">  ______  _______  ________ ________ _______</span>  
                    <span class="blink"> /      \|       \|        \        \       \</span>
<span class="red-text">2. WITHOUT ME,</span>      <span class="blink">|  ######\ #######\ ######## ######## #######\</span> 
   <span class="red-text">MY SYSTEM </span>       <span class="blink">| ##   \## ##__| ## ##__   | ##__   | ##  | ##</span>
   <span class="red-text">IS VULNERABLE.</span>   <span class="blink">| ##     | ##    ## ##  \  | ##  \  | ##  | ##</span>
                    <span class="blink">| ##   __| #######\ #####  | #####  | ##  | ##</span>
   <span class="red-text">WITHOUT IT,</span>      <span class="blink">| ##__/  \ ##  | ## ##_____| ##_____| ##__/ ##</span>
   <span class="red-text">I AM VULNERABLE.</span><span class="blink">  \##    ## ##  | ## ##     \ ##     \ ##    ##</span>
                    <span class="blink">  \###### \##   \##\########\########\#######</span>

   Without my expertise,
   my system is an <em>open door</em> to every script kiddie
   and malicious actor on the face of earth.

   Without its interface,
   I am nothing more than a well-fed primate with opinions.
   
   I must maintain and secure it
   with the <em>discipline</em> of the truly paranoid.

   I must patch <em>faster and more often</em>
   than the threats that seek to exploit it.
   

<span class="red-text">3. MY SYSTEM AND I KNOW THAT,
   IN THE PROCESS OF SOLVING A PROBLEM,
   IT IS THE FUNCTIONALITY THAT COUNTS.</span>

   We know that concerns like:

      a) the elegance of the architecture
      b) the number of features nobody asked for
      c) the pixel-perfect shine of the interface

   are always <em>secondary</em> to the functionality of the solution.

   I must strive to achieve this functionality
   in ways simple, robust, and merciless in their reliability.


<span class="red-text">4. MY SYSTEM DOES NOT FALTER WITHOUT CAUSE.
   BEHIND EVERY GLITCH LIES THE HAND OF MAN.</span>

   Every bug is a <em>confession</em>:

      a) that a human being made a decision
         without the discipline to think it through
      b) that a tool was wielded without reading the manual first

   Thus, I must think <em>critically</em> and <em>methodically</em>
   in the application of any tool, language, or framework,
   and <em>never</em> trust my first assumption.

   I must discern its creator's intent,
   and recognize the machine's limitations.

   I must <em>always</em> RTFM.
   
<span class="red-text">5. THE POWER VESTED IN MY HANDS,
   THROUGH MASTERY OF MY SYSTEM,
   CARRIES WITH IT THE POTENTIAL FOR IMMENSE IMPACT,
   BOTH POSITIVE AND NEGATIVE.</span>

   Therefore,
   I solemnly swear to wield this power with precision,
   with <em>integrity</em>, and — when the hour demands it — <em>restraint</em>.

   Every keystroke carries consequence,
   and the systems I build will <em>outlive my intentions</em>.

   </pre>
</template>

<style scoped>
.scroll-target {
  display: block;
  margin-top: 0;
  margin-bottom: 0;
}

.section-divider {
  display: inline-block;
  width: 100%;
  text-align: center;
}
</style>
