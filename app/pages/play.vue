<script setup lang="ts">
const modes = ['indie games', 'weird systems', 'prototypes', 'interactive art', 'tools', 'world fragments']
</script>

<template>
  <ChannelProjectList
    channel="play"
    eyebrow="PLAY / GAME OBJECTS"
    title="Playable art with rough edges intact."
    description="Games, prototypes, visual toys, broken systems, and interactive releases with the sketch still visible."
    :tags="modes"
  />
</template>
