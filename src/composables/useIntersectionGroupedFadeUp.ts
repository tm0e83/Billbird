import { onMounted, onBeforeUnmount } from 'vue';
import type { Ref } from 'vue';

interface Options {
  threshold?: number;
  rootMargin?: string;
  stagger?: number;      // ms zwischen gleichzeitig sichtbaren Elementen
  initialDelay?: number; // ms vor der allerersten Animation
}

export function useIntersectionGroupedFadeUp(
  elements: Ref<HTMLElement[]>,
  options: Options = {}
) {
  const {
    threshold = 0.2,
    rootMargin = '0px',
    stagger = 150,
    initialDelay = 0
  } = options;

  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    if (!elements.value.length) return;

    let initialDelayApplied = false;

    observer = new IntersectionObserver(
      (entries) => {
        // Nur Elemente, die jetzt sichtbar werden und noch nicht animiert sind
        const entering = entries
          .filter(
            (e) => e.isIntersecting && !e.target.classList.contains('is-visible')
          )
          // optional: nach Position sortieren für natürliche Reihenfolge
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top
          );

        entering.forEach((entry, index) => {
          // Nur beim allerersten Reveal initialDelay anwenden
          const delay =
            !initialDelayApplied && initialDelay > 0
              ? initialDelay + (entering.length > 1 ? index * stagger : 0)
              : entering.length > 1
              ? index * stagger
              : 0;

          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
        });

        if (!initialDelayApplied) initialDelayApplied = true;

        // Observer entfernen
        entering.forEach((entry) => observer?.unobserve(entry.target));
      },
      { threshold, rootMargin }
    );

    elements.value.forEach((el) => observer!.observe(el));
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
  });
}
