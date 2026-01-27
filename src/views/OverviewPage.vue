<script setup lang="ts">
import { computed, ref } from 'vue'
import eslintLogo from '@/assets/images/eslint-logo.svg'
import typescriptLogo from '@/assets/images/typescript-logo.svg'
import vuejsLogo from '@/assets/images/vuejs-logo.svg'
import vitejsLogo from '@/assets/images/vitejs-logo.svg'
import vitestLogo from '@/assets/images/vitest-logo.svg'
import firebaseLogo from '@/assets/images/firebase-logo.svg'
import piniaLogo from '@/assets/images/pinia-logo.svg'
import prettierLogo from '@/assets/images/prettier-logo.svg'
import invoiceBill from '@/assets/images/invoice-bill.svg'
import piggyBank from '@/assets/images/piggy-bank.svg'
import barChart from '@/assets/images/bar-chart.svg'
import { useIntersectionGroupedFadeUp } from '@/composables/useIntersectionGroupedFadeUp'

const intro = ref<HTMLElement | null>(null)
const features = ref<HTMLElement | null>(null)
const tech = ref<HTMLElement | null>(null)

const sections = computed(() =>
  [intro.value, features.value, tech.value].filter(Boolean) as HTMLElement[]
)

useIntersectionGroupedFadeUp(sections, {
  stagger: 300,
  initialDelay: 100
});
</script>

<template>
  <div>
    <div class="intro text-xl">
      <div class="inner fade-up" ref="intro">
        <div class="headline">Was ist das hier?</div>
        <p>
          BillBird ist ein privates Vue3-Testprojekt zum Verwalten meiner eigenen Finanzen. Es ist
          Programmierspielwiese und nützliches Tool gleichermaßen und ausschließlich für den
          Eigengebrauch und als Showcase für Bewerbungen gedacht.
        </p>

        <p>
          Das Tool soll mir einen besseren Überblick über meine Ersparnisse geben und dabei helfen,
          monatlich die nötigen Beträge für Jahres- oder Quartalsrechnungen zurückzulegen.
        </p>

        <p>Das Projekt befindet sich noch im Aufbau. Aktuell stelle ich das Projekt schrittweise auf TypeScript um.</p>
      </div>
    </div>

    <div class="features">
      <div class="inner fade-up" ref="features">
        <div class="headline">Features</div>
        <div class="content">
          <div class="item item-1">
            <div class="item-image">
              <img :src="invoiceBill" alt="Rechnung auf Computerbildung" />
            </div>
            <div class="item-headline text-xl">Rechnung</div>
            <p class="item-description">
              Wiederkehrende Rechnungen mit einem Intervall anlegen und monatlichen Sparbetrag
              berechnen lassen.
            </p>
          </div>
          <div class="item item-2">
            <div class="item-image"><img :src="piggyBank" alt="Sparschwein" /></div>
            <div class="item-headline text-xl">Sparplan</div>
            <p class="item-description">
              Mit einem Sparplan können feste Sparziele verfolgt und festgelegte Beträge gespart
              werden.
            </p>
          </div>
          <div class="item item-3">
            <div class="item-image">
              <img :src="barChart" alt="Bar Chart" />
              <div class="hint">Bald verfügbar</div>
            </div>
            <div class="item-headline text-xl">Wertpapier</div>
            <p class="item-description">
              Wertpapiere wie Aktien oder ETF können angelegt werden. Die Börsendaten werden
              automatisch abgefragt und verrechnet.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="tech-stack">
      <div class="inner fade-up" ref="tech">
        <div class="headline">Technologie-Stack</div>
        <ul class="content">
          <li>
            <a href="https://vuejs.org/" title="Vue.js">
              <img :src="vuejsLogo" alt="Logo" />
              <div>Vue.js</div>
            </a>
          </li>
          <li>
            <a href="https://vitejs.dev/" title="Vite">
              <img :src="vitejsLogo" alt="Logo" />
              <div>Vite</div>
            </a>
          </li>
          <li>
            <a href="https://vitest.dev/" title="Vitest">
              <img :src="vitestLogo" alt="Logo" />
              <div>Vitest</div>
            </a>
          </li>
          <li>
            <a href="https://pinia.vuejs.org/" title="Pinia">
              <img :src="piniaLogo" alt="Logo" />
              <div>Pinia</div>
            </a>
          </li>
          <li>
            <a href="https://www.typescriptlang.org/" title="TypeScript">
              <img :src="typescriptLogo" alt="Logo" />
              <div>TypeScript</div>
            </a>
          </li>
          <li>
            <a href="https://firebase.google.com/firebase" title="Firebase">
              <img :src="firebaseLogo" alt="Logo" />
              <div>Firebase</div>
            </a>
          </li>
          <li>
            <a href="https://eslint.org/" title="ESLint">
              <img :src="eslintLogo" alt="Logo" />
              <div>ESLint</div>
            </a>
          </li>
          <li>
            <a href="https://prettier.io/" title="Prettier">
              <img :src="prettierLogo" alt="Logo" />
              <div>Prettier</div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables';
@use '@/assets/styles/mixins';

.fade-up {
  opacity: 0;
  transform: translateY(50px);

  transition:
    opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1),
    transform 1.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.fade-up.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .fade-up {
    opacity: 1;
    transform: translateY(0);
    transition: none;
  }
}

.intro {
  margin: auto;
  padding: 7.5rem 0.75rem;
  text-align: center;
  max-width: 56rem /* 896px */;
}

.headline {
  width: 100%;
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 900;
  margin-bottom: 3.5rem;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 3.75rem;
    line-height: 1;
  }
}

.features,
.tech-stack {
  padding: 7.5rem 0.75rem;

  .inner {
    margin: auto;
    max-width: 64rem; /* 1024px */
  }

  .item-headline {
    font-weight: 900;
    margin-bottom: 1rem;
  }
}

.features {
  background-color: variables.$slate-300;

  .content {
    @media (min-width: 640px) {
      display: flex;
      justify-content: center;
      gap: 3rem /* 48px */;
    }
  }

  .item {
    text-align: center;
    flex: 1;
  }

  .item-image {
    position: relative;
  }

  .item-1,
  .item-2 {
    margin-bottom: 3rem;

    @media (min-width: 640px) {
      margin-bottom: 0;
    }
  }

  .item-3 {
    filter: grayscale(100%);

    img {
      opacity: 0.25;
    }

    .item-headline,
    p {
      opacity: 0.5;
    }

    .hint {
      color: #fff;
      background: #000;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%);
      padding: 0.25rem 0.5rem;
    }
  }

  img {
    max-width: 175px;
    max-height: 175px;
    width: 100%;
    height: 100%;
    margin: auto;
    margin-bottom: 1rem;
  }
}

.tech-stack {
  background-color: variables.$slate-800;

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

    li {
      height: 100%;
      display: flex;
    }

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  a {
    text-decoration: none;
    display: block;
    position: relative;
    flex: 1;

    &>div {
      margin-top: 0.5rem;
      text-align: center;
      color: #fff;
      font-weight: 600;
      background-color: black;
      padding: 0.25rem 0.5rem;
      position: absolute;
      width: 100%;
      left: 0;
      bottom: -2.5rem;
      border-radius: 2px;
    }
  }

  img {
    max-width: 140px;
    max-height: 140px;
    width: 100%;
    height: 100%;
    margin: auto;
  }
}
</style>
