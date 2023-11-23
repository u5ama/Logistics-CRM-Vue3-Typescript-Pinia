import { readonly, ref, type Ref } from "vue";

/**
 * Custom hook-like function to abstract away modal toggle logic.
 *
 * @param {boolean} [isOpenByDefault=false]
 *
 * @return {*} [`boolean`, `setBoolean`]
 *
 */
function useModal(isOpenByDefault: boolean = false): [
  Readonly<Ref<boolean>>,
  {
    open: () => boolean;
    close: () => boolean;
    toggle: () => boolean;
  }
] {
  const isModalOpen = ref(isOpenByDefault);

  const closeModal = () => (isModalOpen.value = false);
  const openModal = () => (isModalOpen.value = true);
  const toggleModal = () => (isModalOpen.value = !isModalOpen.value);

  const setModal = {
    open: openModal,
    close: closeModal,
    toggle: toggleModal,
  };

  return [readonly(isModalOpen), setModal];
}

export default useModal;
