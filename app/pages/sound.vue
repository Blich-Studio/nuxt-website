<script setup lang="ts">
const machines = ['analog synths', 'drum machines', 'field noise', 'tribal loops', 'analog techno', 'sound design']
</script>

<template>
  <ChannelProjectList
    channel="sound"
    eyebrow="SOUND / LIVE SIGNAL"
    title="Machines, repetition, body pressure."
    description="Tracks, analog sessions, live set recordings, raw jams, and sound design released through SoundCloud, YouTube, mirrors, and free-leaning archives."
    :tags="machines"
    stream-copy="Prepared for embedded live audio or video: Owncast, Icecast, AzuraCast, YouTube Live, Twitch, or a direct stream endpoint can sit here when the room is active."
  />
</template>
