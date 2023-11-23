import { ref, type Ref } from "vue";

/**
 * Composable function to abstract away custom multi select logic.
 *
 * @return {*} [`items[]`, `itemsChangeHandler`, `resetItems`]
 */
function useMultiSelect(): [Ref<any[]>, (items: any[]) => void, () => void] {
  const selectedItems = ref<any[]>([]);

  const itemsChangeHandler = (items: any[]) => {
    selectedItems.value = [...items];
  };

  const resetItems = () => {
    selectedItems.value = [];
  };

  return [selectedItems, itemsChangeHandler, resetItems];
}

export default useMultiSelect;
