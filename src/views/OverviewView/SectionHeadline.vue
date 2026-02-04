<script setup lang="ts">
</script>

<template>
  <div class="headline"><slot /></div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables';
@use '@/assets/styles/mixins';

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
</style>
