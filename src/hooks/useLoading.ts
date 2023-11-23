import { readonly, ref, type Ref } from "vue";

/**
 * Custom hook-like function to abstract away boolean loading logic.
 *
 * @param {boolean} [isLoadingByDefault=false]
 *
 * @return {*} [`boolean`, `setBoolean`]
 *
 */
function useLoading(isLoadingByDefault: boolean = false): [
  Readonly<Ref<boolean>>,
  {
    start: () => boolean;
    stop: () => boolean;
    toggle: () => boolean;
  }
] {
  const isLoading = ref(isLoadingByDefault);

  const stop = () => (isLoading.value = false);
  const start = () => (isLoading.value = true);
  const toggle = () => (isLoading.value = !isLoading.value);

  const setLoading = {
    start,
    stop,
    toggle,
  };

  return [readonly(isLoading), setLoading];
}

export default useLoading;
