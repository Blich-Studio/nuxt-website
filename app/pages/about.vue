<script setup lang="ts">
// About page - static content

const teamMembers = [
  {
    name: 'Filip Černý',
    role: 'Founder & Creative Director',
    bio: 'With over 10 years in web and software development, Filip founded Blich Studio to bring handcrafted artistry to life. He loves drawing, painting and finding new creative way to express himself, if not found behind the desk you can find him on hikes, mountaineering or playing chess',
    avatar: '/team/filip.jpg',
  },
  {
    name: 'Bedřich Černý',
    role: 'Happiness Officer',
    bio: 'Bedřich specializes in stress relief and maintaining a positive atmosphere within the studio. And he loves to chew on cables and hide Filip\'s headphones. His passion for food and belly rubs is unmatched.',
    avatar: '/team/bedrich.jpg',
  },
]
</script>

<template>
  <div :class="$style.page">
    <div :class="$style.container">
      <h1 :class="$style.title">About Blich Studio</h1>
      <div :class="$style.content">
        <p>
          We're a passionate indie studio specializing in stop motion animations and games with handmade animations.
          Every frame is crafted with care, bringing tactile, authentic art to life.
        </p>
        <p>
          Founded in 2020, Blich Studio brings together talented artists, animators, and developers who share a love
          for the meticulous craft of stop motion and handcrafted animation.
        </p>
        <p>
          Our mission is to create animations and games that celebrate the beauty of analog techniques in the digital
          age, inspiring audiences with every carefully placed frame.
        </p>
      </div>

      <!-- Team Section -->
      <section :class="$style.teamSection">
        <h2 :class="$style.sectionTitle">Meet the Team</h2>
        <p :class="$style.sectionDescription">
          The talented people behind the magic, crafting every frame with passion and precision.
        </p>
        
        <div :class="$style.teamGrid">
          <div v-for="member in teamMembers" :key="member.name" :class="$style.teamCard">
            <div :class="$style.avatarWrapper">
              <div :class="$style.avatarPlaceholder">
                <Icon name="lucide:user" :class="$style.avatarIcon" />
              </div>
            </div>
            <div :class="$style.memberInfo">
              <h3 :class="$style.memberName">{{ member.name }}</h3>
              <span :class="$style.memberRole">{{ member.role }}</span>
              <p :class="$style.memberBio">{{ member.bio }}</p>
            </div>
          </div>
        </div>

        <!-- Join Us Card -->
        <div :class="$style.joinUsSection">
          <div :class="$style.joinUsCard">
            <div :class="$style.joinUsAvatar">
              <Icon name="lucide:plus" :class="$style.joinUsIcon" />
            </div>
            <div :class="$style.joinUsContent">
              <h3 :class="$style.joinUsTitle">Maybe You?</h3>
              <p :class="$style.joinUsText">
                We're always looking for passionate creators who share our love for handcrafted animation. 
                If you think we'd be a great match, let's talk!
              </p>
              <div :class="$style.joinUsLinks">
                <a href="mailto:filip@blichstudio.com" :class="$style.joinUsLink">
                  <Icon name="lucide:mail" :class="$style.linkIcon" />
                  filip@blichstudio.com
                </a>
                <a href="https://discord.gg/blichstudio" target="_blank" :class="$style.joinUsLink">
                  <Icon name="simple-icons:discord" :class="$style.linkIcon" />
                  Join our Discord
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" module>
@use '../assets/styles/variables' as *;

.page {
  min-height: 100vh;
  padding: 5rem 1rem;
}

.container {
  max-width: 56rem;
  margin: 0 auto;
}

.title {
  font-family: $font-display;
  font-size: $text-5xl;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: $color-muted-foreground;
  font-size: $text-lg;
  line-height: 1.7;
}

.teamSection {
  margin-top: 4rem;
  padding-top: 4rem;
  border-top: 1px solid var(--border);
}

.sectionTitle {
  font-family: $font-display;
  font-size: $text-3xl;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.sectionDescription {
  color: $color-muted-foreground;
  font-size: $text-lg;
  margin-bottom: 2.5rem;
}

.teamGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: $breakpoint-md) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.teamCard {
  display: flex;
  gap: 1.25rem;
  padding: 1.5rem;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 1rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--clay-orange);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
}

.avatarWrapper {
  flex-shrink: 0;
}

.avatarPlaceholder {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: oklch(0.68 0.14 45 / 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatarIcon {
  width: 2rem;
  height: 2rem;
  color: var(--clay-orange);
}

.memberInfo {
  display: flex;
  flex-direction: column;
}

.memberName {
  font-family: $font-display;
  font-size: $text-lg;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.memberRole {
  font-size: $text-sm;
  color: var(--clay-orange);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.memberBio {
  font-size: $text-sm;
  color: $color-muted-foreground;
  line-height: 1.6;
}

.joinUsSection {
  margin-top: 3rem;
}

.joinUsCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, oklch(0.68 0.14 45 / 0.08), oklch(0.55 0.15 35 / 0.08));
  border: 2px dashed var(--clay-orange);
  border-radius: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-style: solid;
    background: linear-gradient(135deg, oklch(0.68 0.14 45 / 0.12), oklch(0.55 0.15 35 / 0.12));
  }

  @media (min-width: $breakpoint-md) {
    flex-direction: row;
    text-align: left;
    padding: 2.5rem;
    gap: 2rem;
  }
}

.joinUsAvatar {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background-color: oklch(0.68 0.14 45 / 0.2);
  border: 2px dashed var(--clay-orange);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-bottom: 1.5rem;

  @media (min-width: $breakpoint-md) {
    margin-bottom: 0;
  }
}

.joinUsIcon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--clay-orange);
}

.joinUsContent {
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: $breakpoint-md) {
    align-items: flex-start;
  }
}

.joinUsTitle {
  font-family: $font-display;
  font-size: $text-2xl;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--clay-orange);
}

.joinUsText {
  font-size: $text-base;
  color: $color-muted-foreground;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 32rem;
}

.joinUsLinks {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: $breakpoint-sm) {
    flex-direction: row;
    gap: 1.5rem;
  }
}

.joinUsLink {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: $text-sm;
  font-weight: 500;
  color: var(--foreground);
  transition: color 0.2s ease;

  &:hover {
    color: var(--clay-orange);
  }
}

.linkIcon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
