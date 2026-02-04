<script setup lang="ts">
  const props = defineProps<{
    image: string
    alt: string
    headline: string
    description: string
  }>()
</script>

<template>
  <div class="item item-1">
    <div class="item-image">
      <img :src="props.image" :alt="props.alt" />
    </div>
    <div class="item-headline text-xl">{{ props.headline }}</div>
    <p class="item-description">
      {{ props.description }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables';
@use '@/assets/styles/mixins';

.features {
  padding: 7.5rem 0.75rem;
  background-color: variables.$slate-300;
  .inner {
    margin: auto;
    max-width: 64rem;
  }

  .item-headline {
    font-weight: 900;
    margin-bottom: 1rem;
  }

  .content {
    @media (min-width: 640px) {
      display: flex;
      justify-content: center;
      gap: 3rem;
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