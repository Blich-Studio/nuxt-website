<script setup lang="ts">
const modes = ['indie games', 'weird systems', 'prototypes', 'interactive art', 'tools', 'world fragments']
</script>

<template>
  <ChannelProjectList
    channel="play"
    eyebrow="PLAY / GAME OBJECTS"
    title="Playable art with rough edges intact."
    description="Games, prototypes, visual toys, mechanics, tools, and interactive fragments linked to itch.io, Steam, code mirrors, and free release pages."
    :tags="modes"
  />
</template>
