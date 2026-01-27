<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
const { isLoggedIn } = useAuth();
</script>

<template>
  <nav class="nav-main">
    <!--
      <RouterLink v-if="!isLoggedIn" to="/overview">Übersicht</RouterLink>
      <RouterLink v-if="isLoggedIn" to="/data">Daten</RouterLink>
      <RouterLink to="/faq">FAQ</RouterLink>
    -->
  </nav>
</template>

<style lang="scss">
@use '@/assets/styles/variables';
@use '@/assets/styles/mixins';

.nav-main {
  flex-grow: 1;
  display: flex;
  column-gap: 3rem;

  a {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke,
      opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
    color: variables.$gray-400;

    &.router-link-active {
      color: #000;
      cursor: default;
    }

    &:hover {
      color: #000;
    }
  }

  @media (min-width: 640px) {
    margin-left: 5rem;
  }
}
</style>
