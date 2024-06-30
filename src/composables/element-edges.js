import { reactive } from 'vue';

export function useElementEdges(element) {
  const elementRect = element.getBoundingClientRect();

  const edges = reactive({
    top: {
      left: {
        x: window.scrollX + elementRect.x,
        y: window.scrollY + elementRect.y
      },
      right: {
        x: window.scrollX + elementRect.x + elementRect.width,
        y: window.scrollY + elementRect.y + elementRect.height
      }
    },
    bottom: {
      left: {
        x: window.scrollX + elementRect.x,
        y: window.scrollY + elementRect.y + elementRect.height
      },
      right: {
        x: window.scrollX + elementRect.x + elementRect.width + elementRect.width,
        y: window.scrollY + elementRect.y + elementRect.height + elementRect.height
      }
    }
  });

  return edges;
}