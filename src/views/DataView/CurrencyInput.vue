<script setup lang="ts">
import { watch, ref } from 'vue'
import { useCurrencyInput } from 'vue-currency-input'
import type { CurrencyInputOptions } from 'vue-currency-input'

interface Props {
  modelValue?: number | null
  options?: Partial<CurrencyInputOptions>
  classes?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  options: () => ({}),
  classes: ''
})

const { inputRef, setValue } = useCurrencyInput(props.options as CurrencyInputOptions)

watch(
  () => props.modelValue,
  (value: number | null | undefined) => setValue(value ?? 0)
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
    :class="[classes, props.modelValue && props.modelValue < 0 ? 'negative' : '']"
  />
</template>
