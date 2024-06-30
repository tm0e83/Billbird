<script setup>
import eslintLogo from '@/assets/images/eslint-logo.svg'
import tailwindcssLogo from '@/assets/images/tailwindcss-logo.svg'
import vuejsLogo from '@/assets/images/vuejs-logo.svg'
import vitejsLogo from '@/assets/images/vitejs-logo.svg'
import vitestLogo from '@/assets/images/vitest-logo.svg'
import firebaseLogo from '@/assets/images/firebase-logo.svg'
import piniaLogo from '@/assets/images/pinia-logo.svg'
import prettierLogo from '@/assets/images/prettier-logo.svg'
import invoiceBill from '@/assets/images/invoice-bill.svg'
import piggyBank from '@/assets/images/piggy-bank.svg'
import barChart from '@/assets/images/bar-chart.svg'
</script>

<template>
  <div>
    <div class="intro text-xl">
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

      <p>Das Projekt befindet sich noch im Aufbau.</p>
    </div>

    <div class="features">
      <div class="inner">
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
      <div class="inner">
        <div class="headline">Technologie-Stack</div>
        <ul class="content">
          <li>
            <a href="https://eslint.org/" title="ESLint">
              <img :src="eslintLogo" alt="Logo" />
            </a>
          </li>
          <li>
            <a href="https://tailwindcss.com/" title="Tailwind CSS">
              <img :src="tailwindcssLogo" alt="Logo" />
            </a>
          </li>
          <li>
            <a href="https://vuejs.org/" title="Vue.js">
              <img :src="vuejsLogo" alt="Logo" />
            </a>
          </li>
          <li>
            <a href="https://vitejs.dev/" title="Vite">
              <img :src="vitejsLogo" alt="Logo" />
            </a>
          </li>
          <li>
            <a href="https://vitest.dev/" title="Vitest">
              <img :src="vitestLogo" alt="Logo" />
            </a>
          </li>
          <li>
            <a href="https://firebase.google.com/firebase" title="Firebase">
              <img :src="firebaseLogo" alt="Logo" />
            </a>
          </li>
          <li>
            <a href="https://pinia.vuejs.org/" title="Pinia">
              <img :src="piniaLogo" alt="Logo" />
            </a>
          </li>
          <li>
            <a href="https://prettier.io/" title="Prettier">
              <img :src="prettierLogo" alt="Logo" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

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
  background-color: $slate-300;

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

  .item-1 {
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
    max-width: 150px;
    max-height: 150px;
    width: 100%;
    height: 100%;
    margin: auto;
    margin-bottom: 1rem;
  }
}

.tech-stack {
  background-color: $slate-800;

  .headline {
    color: #fff;
  }

  .content {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 5rem /* 80px */;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: center;

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  img {
    max-width: 120px;
    max-height: 120px;
    width: 100%;
    height: 100%;
    margin: auto;
  }
}
</style>
