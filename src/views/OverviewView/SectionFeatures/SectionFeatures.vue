<script setup lang="ts">
  import Headerline from '@/views/OverviewView/SectionHeadline.vue'
  import invoiceBill from '@/assets/images/invoice-bill.svg'
  import piggyBank from '@/assets/images/piggy-bank.svg'
  import barChart from '@/assets/images/bar-chart.svg'

  import FeatureItem from '@/views/OverviewView/SectionFeatures/FeatureItem.vue'
</script>

<template>
  <section class="features">
    <div class="inner">
      <Headerline>Features</Headerline>
      <div class="content">

        <FeatureItem
          class="item-1"
          :image="invoiceBill"
          alt="Rechnung auf Computerbildung"
          headline="Rechnung"
          description="Wiederkehrende Rechnungen mit einem Intervall anlegen und monatlichen Sparbetrag
            berechnen lassen."
        />

        <FeatureItem
          class="item-2"
          :image="piggyBank"
          alt="Sparschwein"
          headline="Sparplan"
          description="Mit einem Sparplan können feste Sparziele verfolgt und festgelegte Beträge gespart
            werden."
        />

        <FeatureItem
          class="item-3"
          :image="barChart"
          alt="Bar Chart"
          headline="Wertpapier"
          description="Wertpapiere wie Aktien oder ETF können angelegt werden. Die Börsendaten werden
            automatisch abgefragt und verrechnet."
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables';
@use '@/assets/styles/mixins';

.features {
  padding: 7.5rem 0.75rem;
  background-color: variables.$slate-300;
  .inner {
    margin: auto;
    max-width: 64rem; /* 1024px */
  }

  .item-headline {
    font-weight: 900;
    margin-bottom: 1rem;
  }

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
</style>