<script setup lang="ts">
import { useStore } from '@/stores/store'
import type { Datagroup } from '@/types/index.d'

const store = useStore()

interface Props {
  datagroup: Datagroup
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

function deleteDatagroup(): void {
  if (props.datagroup.id !== null) {
    store.deleteDatagroup(props.datagroup.id)
  }
  emit('close')
}
</script>

<template>
  <div>
    <div class="modal-head">Datengruppe wirklich löschen?</div>
    <div class="buttons">
      <button @click="$emit('close')" class="button alert large hollow">Abbrechen</button>
      <button @click="deleteDatagroup" class="button alert large">Löschen</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables';
@use '@/assets/styles/mixins';

.modal-head {
  text-align: center;
}

.buttons {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}
</style>
