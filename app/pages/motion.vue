<script setup lang="ts">
const forms = ['hand-drawn', 'stop motion', 'loops', 'scans', 'cut-outs', 'frame tests']
</script>

<template>
  <ChannelProjectList
    channel="motion"
    eyebrow="MOTION / FRAME TABLE"
    title="Drawn, filmed, assembled by hand."
    description="Animation pieces, loops, stop motion studies, rough animatics, scans, and handmade motion work collected from video platforms and mirrors."
    :tags="forms"
  />
</template>
