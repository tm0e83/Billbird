<script setup>
import { watch } from 'vue'
import { useCurrencyInput } from 'vue-currency-input'

const props = defineProps(['modelValue', 'options', 'classes'])
const { inputRef, setValue } = useCurrencyInput(props.options)

watch(
  () => props.modelValue,
  (value) => setValue(value)
)

defineExpose({
  inputRef
})
</script>

<template>
  <input
    ref="inputRef"
    type="text"
    placeholder="0,00 €"
    :class="[classes, modelValue < 0 ? 'negative' : '']"
  />
</template>
