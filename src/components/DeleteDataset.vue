<script setup lang="ts">
import { useStore } from '@/stores/store'
import type { Dataset } from '@/types/index.d'

const store = useStore()

interface Props {
  dataset: Dataset
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

function deleteDataset(): void {
  if (props.dataset.id !== null) {
    store.deleteDataset(props.dataset)
    emit('close')
  }
}
</script>

<template>
  <div>
    <div class="modal-head text-center">Datensatz wirklich löschen?</div>
    <div class="buttons">
      <button @click="$emit('close')" class="button alert large hollow">Abbrechen</button>
      <button @click="deleteDataset" class="delete-button button alert large">Löschen</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.modal-head {
  text-align: center;
}

.buttons {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}
</style>
