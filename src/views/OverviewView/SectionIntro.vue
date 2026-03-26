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
      <Headerline>Was ist das hier?</Headerline>
      <p>
        BillBird ist ein privates Vue3-Testprojekt zum Verwalten meiner eigenen Finanzen. Es ist
        Programmierspielwiese und nützliches Tool gleichermaßen, ausschließlich für den
        Eigengebrauch gedacht und wird nebenbei als Showcase für Bewerbungen genutzt.
      </p>

      <p>
        Das Tool soll mir einen besseren Überblick über meine Ersparnisse geben und dabei helfen,
        monatlich die nötigen Beträge für Jahres- oder Quartalsrechnungen zurückzulegen.
      </p>

      <p>Das Projekt befindet sich noch im Aufbau. Aktuell stelle ich das Projekt schrittweise auf TypeScript um, 
        behebe diverse Fehlerchen und strukturiere die Komponenten neu. Eine ewige Baustelle. :-)</p>

      <br>
      <br>
      
      <div class="text-center">
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