<script setup lang="ts">
  import Headerline from '@/views/OverviewView/SectionHeadline.vue'
  import TechStackItem from '@/views/OverviewView/SectionTechStack/TechStackItem.vue'
  import typescriptLogo from '@/assets/images/typescript-logo.svg'
  import vuejsLogo from '@/assets/images/vuejs-logo.svg'
  import vitejsLogo from '@/assets/images/vitejs-logo.svg'
  import vitestLogo from '@/assets/images/vitest-logo.svg'
  import firebaseLogo from '@/assets/images/firebase-logo.svg'
  import piniaLogo from '@/assets/images/pinia-logo.svg'

</script>

<template>
  <section class="tech-stack">
    <div class="inner">
      <Headerline>Technologie-Stack</Headerline>
      <ul class="content">
        <TechStackItem
          :logo="vuejsLogo"
          title="Vue.js"  
          link="https://vuejs.org/"
        />
        <TechStackItem
          :logo="vitejsLogo"
          title="Vite"
          link="https://vitejs.dev/"
        />
        <TechStackItem
          :logo="vitestLogo"
          title="Vitest"
          link="https://vitest.dev/"
        />
        <TechStackItem
          :logo="piniaLogo"
          title="Pinia"
          link="https://pinia.vuejs.org/"
        />
        <TechStackItem
          :logo="typescriptLogo"
          title="TypeScript"
          link="https://www.typescriptlang.org/"
        />
        <TechStackItem
          :logo="firebaseLogo"
          title="Firebase"
          link="https://firebase.google.com/firebase"
        />
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables';
@use '@/assets/styles/mixins';

.tech-stack {
  padding: 7.5rem 0.75rem;
  background-color: variables.$slate-800;

  .inner {
    margin: auto;
    max-width: 64rem;
  }

  .item-headline {
    font-weight: 900;
    margin-bottom: 1rem;
  }

  .headline {
    color: #fff;
  }

  .content {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 6.5rem 5rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: center;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}
</style>