<script setup lang="ts">
  const props = defineProps<{
    logo: string
    title: string
    link: string
  }>()
</script>

<template>
  <li>
    <a :href="props.link" :title="props.title">
      <img :src="props.logo" alt="Logo" />
      <div>{{ props.title }}</div>
    </a>
  </li>
  
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables';
@use '@/assets/styles/mixins';

li {
  height: 100%;
  display: flex;
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
    bottom: -3rem;
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
</style>