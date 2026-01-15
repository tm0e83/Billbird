import { reactive } from 'vue'

interface ElementEdges {
  top: {
    left: { x: number; y: number }
    right: { x: number; y: number }
  }
  bottom: {
    left: { x: number; y: number }
    right: { x: number; y: number }
  }
}

/**
 * Calculates the viewport-relative edges (top, bottom, left, right) of an element
 */
export function useElementEdges(element: HTMLElement | null): ElementEdges {
  if (!element) {
    return reactive({
      top: {
        left: { x: 0, y: 0 },
        right: { x: 0, y: 0 }
      },
      bottom: {
        left: { x: 0, y: 0 },
        right: { x: 0, y: 0 }
      }
    })
  }

  const elementRect = element.getBoundingClientRect()
  const scrollX = window.scrollX
  const scrollY = window.scrollY
  const { x, y, width, height } = elementRect

  const edges = reactive({
    top: {
      left: {
        x: scrollX + x,
        y: scrollY + y
      },
      right: {
        x: scrollX + x + width,
        y: scrollY + y
      }
    },
    bottom: {
      left: {
        x: scrollX + x,
        y: scrollY + y + height
      },
      right: {
        x: scrollX + x + width,
        y: scrollY + y + height
      }
    }
  })

  return edges
}