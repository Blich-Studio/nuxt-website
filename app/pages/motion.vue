<script setup lang="ts">
const forms = ['hand-drawn', 'stop motion', 'loops', 'scans', 'cut-outs', 'frame tests']
</script>

<template>
  <ChannelProjectList
    channel="motion"
    eyebrow="MOTION / FRAME TABLE"
    title="Drawn, filmed, assembled by hand."
    description="Hand-drawn loops, stop motion tests, scans, frame damage, and small moving things made for screens, rooms, and games."
    :tags="forms"
  />
</template>
