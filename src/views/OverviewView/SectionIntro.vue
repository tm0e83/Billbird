<script setup lang="ts">
import { useStore } from '@/stores/store'
import router from '@/router/index'
import Headerline from '@/views/OverviewView/SectionHeadline.vue'
import { ChevronRightIcon } from 'vue-tabler-icons'

const store = useStore()

function loginAsGuest(): void {
  store.uid = 'testuser'
  router.push('/data')
}
</script>

<template>
  <section class="intro text-xl">
    <div class="inner">
      <Headerline>Über BillBird</Headerline>
      <p>
        BillBird ist mein privates Finanztool, gebaut mit Vue 3, TypeScript, Pinia und Firebase.
        Entstanden ist es, weil ich einen besseren Überblick über meine Ersparnisse wollte und
        monatlich Rücklagen für Jahres- und Quartalsrechnungen planen muss.
      </p>

      <p>
        Gleichzeitig ist es mein Spielfeld zum Lernen: Ich baue das Projekt aktiv um, migriere
        schrittweise auf TypeScript und probiere neue Patterns aus. Entsprechend dient es auch als
        Showcase für Bewerbungen – mit allen Ecken und Kanten eines Projekts, das sich ständig
        weiterentwickelt.
      </p>

      <br>
      <br>

      <div class="d-flex justify-center">
        <button @click="loginAsGuest" class="button large d-flex">
          <span>Als Gast fortfahren</span>
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables';
@use '@/assets/styles/mixins';

.intro {
  margin: auto;
  padding: 7.5rem 0.75rem;
  text-align: center;
  max-width: 56rem;
}
</style>