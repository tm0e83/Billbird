<script setup>
import { useStore } from '@/stores/store'

const store = useStore()
const props = defineProps(['dataset'])
const emit = defineEmits(['close'])

function deleteDataset() {
  store.deleteDataset(props.dataset)
  emit('close')
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
