<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import type { IProducts } from "@app-types/products";
import { useProductsStore } from "@stores/products";
import { useToast } from "vue-toastification";
import { useLoading } from "@hooks";
interface Props {
  selectedItem: IProducts;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["close"]);
const productsStore = useProductsStore();
const { deleteProduct } = productsStore;
const [isDeleting, setDeleting] = useLoading();
const deleteProducts = async () => {
  setDeleting.start();
  await deleteProduct(props.selectedItem.id);

  useToast().success("Product removed successfully");
  setDeleting.stop();

  emit("close");
};
</script>

<template>
  <Dialog
    :visible="isOpen"
    :style="{ width: '450px' }"
    header="Confirm Deletion"
    :modal="true"
    :closable="false"
  >
    <div class="confirmation-content flex items-center">
      <i class="pi pi-exclamation-triangle mr-4 text-5xl text-red-600" />
      <span v-if="selectedItem">
        Are you sure you want to delete <b>{{ selectedItem.name }}</b
        >?
      </span>
    </div>
    <template #footer>
      <Button
        label="No"
        class="p-button-outlined p-button-secondary"
        :disabled="isDeleting"
        @click="$emit('close')"
      />
      <Button
        label="Delete"
        icon="pi pi-trash"
        class="p-button p-button-danger"
        :loading="isDeleting"
        @click="deleteProducts"
      />
    </template>
  </Dialog>
</template>

<style lang="scss" scoped></style>
