<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { DotsVerticalIcon } from 'vue-tabler-icons'
import { useElementEdges } from '@/composables/useElementEdges'

interface MenuItem {
  label: string
  onClick: () => void
  condition?: boolean | { value: boolean }
  disabled?: boolean
  href?: string
}

interface Props {
  menuItems?: MenuItem[]
}

const props = withDefaults(defineProps<Props>(), {
  menuItems: () => []
})

const isExpanded = ref<boolean>(false)
const dropdownMenuRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const dropdownLayerRef = ref<HTMLElement | null>(null)

function toggle(e: Event): void {
  e.stopPropagation()
  positionLayer()
  isExpanded.value = !isExpanded.value
}

function positionLayer(): void {
  if (!dropdownLayerRef.value) return

  const layerRect = dropdownLayerRef.value.getBoundingClientRect()
  const bodyRect = document.body.getBoundingClientRect()

  const triggerEdges = useElementEdges(triggerRef.value)

  const fitsLeft = triggerEdges.top.right.x - layerRect.width > 0
  const fitsRight = bodyRect.width - triggerEdges.top.right.x - layerRect.width > 0

  let x: number;
  let y: number = triggerEdges.bottom.left.y

  if (fitsRight) {
    x = triggerEdges.top.left.x
  } else if (fitsLeft) {
    x = triggerEdges.top.right.x - layerRect.width
  } else {
    x = triggerEdges.bottom.left.x - (triggerEdges.bottom.left.x + layerRect.width - bodyRect.width)
  }

  dropdownLayerRef.value.style.left = `${x}px`
  dropdownLayerRef.value.style.top = `${y}px`
}

function onClickOutside(e) {
  if (!dropdownMenuRef.value) return
  const clickedOutsideDropownMenu =
    !e.target.isEqualNode(dropdownMenuRef.value) && !dropdownMenuRef.value.contains(e.target)

  if (isExpanded.value && clickedOutsideDropownMenu) {
    isExpanded.value = false
  }
}

onMounted(() => {
  document.documentElement.addEventListener('click', onClickOutside)
  window.addEventListener('scroll', positionLayer)
  window.addEventListener('resize', positionLayer)
  window.addEventListener('orientationchange', positionLayer)
})

onUnmounted(() => {
  document.body.removeEventListener('click', onClickOutside)
  window.removeEventListener('resize', positionLayer)
  window.removeEventListener('scroll', positionLayer)
  window.removeEventListener('orientationchange', positionLayer)
})
</script>

<template>
  <div class="dropdown-menu" ref="dropdownMenuRef">
    <a @click="toggle" ref="triggerRef" class="dropdown-trigger">
      <slot><DotsVerticalIcon /></slot>
    </a>

    <Teleport to="body">
      <div :class="{ expanded: isExpanded }" class="dropdown-layer" ref="dropdownLayerRef">
        <slot name="menu"></slot>
        <ul v-if="menuItems.length">
          <template v-for="(menuItem, index) in menuItems" :key="index">
            <li v-if="menuItem.condition !== false">
              <a
                :href="menuItem.disabled ? undefined : menuItem.href"
                :class="{ disabled: menuItem.disabled === true }"
                @click="!menuItem.disabled ? menuItem.onClick() : null"
                >{{ menuItem.label }}</a
              >
            </li>
          </template>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables';
@use '@/assets/styles/mixins';

.dropdown-menu {
  display: inline-block;
}

.dropdown-trigger {
  display: block;
}

.dropdown-layer {
  position: absolute;
  background-color: white;
  opacity: 0;
  visibility: hidden;
  z-index: -10;
  border-radius: 0.25rem;
  filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));

  &.expanded {
    opacity: 1;
    visibility: visible;
    z-index: 10;
  }
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  padding: 0.25rem 0.75rem;
}
</style>
