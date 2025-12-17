<script setup lang="ts">
import { reactive, ref } from 'vue'

interface Props {
  show?: boolean
  maxWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  maxWidth: '600px'
})

const emit = defineEmits(['afterLeave', 'close'])
const outerModal = ref<HTMLElement | null>(null)

const styles = reactive({
  'max-width': props.maxWidth
})

function onAfterLeave(el: Element) {
  emit('afterLeave')
}

function onclickOutside(e: MouseEvent) {
  if (e.target === outerModal.value) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal" @after-leave="onAfterLeave">
      <div class="modal" v-show="show" @mousedown="onclickOutside">
        <div class="modal-outer" ref="outerModal">
          <div class="modal-inner" :style="styles">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.25);
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}

.modal-outer {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
}

.modal-inner {
  width: 100%;
  max-width: 32rem;
  margin: 1rem;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 0.25rem;
}

.modal-enter-active,
.modal-leave-active {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke,
    opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;

  .modal-inner {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke,
      opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-inner {
    opacity: 0;
  }
}
</style>
