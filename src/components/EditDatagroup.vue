<script setup>
import { reactive, toRaw, watch } from 'vue'
import { useStore } from '@/stores/store'

const store = useStore()
const props = defineProps(['datagroup'])
const emit = defineEmits(['close'])

let data = Object.assign({}, toRaw(props.datagroup))
let state = reactive({
  datagroup: data,
  errors: []
})

watch(
  () => props.datagroup,
  (newData, oldData) => {
    data = Object.assign({}, toRaw(newData))
    state.datagroup = data
    state.errors = []
  }
)

function validate() {
  state.errors = []

  if (!state.datagroup.title) state.errors.push('title')

  return state.errors.length === 0
}

function save() {
  const isValid = validate()

  if (!isValid) return

  if (state.datagroup.id === null) {
    state.datagroup.id = store.nextDatagroupId
    store.addDatagroup(state.datagroup)
  } else {
    store.replaceDatagroup(state.datagroup)
  }

  emit('close')
}
</script>

<template>
  <div>
    <div class="modal-head">
      <span v-if="state.datagroup.id">Datengruppe bearbeiten</span>
      <span v-else>Datengruppe erstellen</span>
    </div>

    <div v-if="state.errors.length" class="errors">
      Ups! Ihre Eingaben sind unvollständig oder fehlerhaft. Bitte überprüfen Sie Ihre Eingaben.
    </div>

    <div>
      <label for="ds-new-title">Titel</label>
      <input type="text" id="ds-new-title" v-model="state.datagroup.title" />
    </div>

    <div class="buttons">
      <button @click="$emit('close')" class="button hollow">Schließen</button>
      <button @click="save" class="button">Speichern</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.errors {
  margin-bottom: 1rem;
  padding: 1.25rem;
  color: $red-700;
  border: 1px solid $red-700;
  background-color: $red-100;
}

.buttons {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}
</style>
