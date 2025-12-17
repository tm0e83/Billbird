import { ref, watch, type Ref } from 'vue'
import { useStore } from '@/stores/store'

export interface UseAuthReturn {
  isLoggedIn: Ref<boolean>
}

export function useAuth(): UseAuthReturn {
  const store = useStore();
  const isLoggedIn = ref<boolean>(false);

  watch(
    () => store.uid,
    () => (isLoggedIn.value = !!store.uid)
  );

  return { isLoggedIn };
}
