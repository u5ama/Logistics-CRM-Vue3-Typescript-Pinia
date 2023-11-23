<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import type { ISupplierItems } from "@app-types/supplier";
import { useSupplierItemsStore } from "@stores/suppliers/items";
import { useToast } from "vue-toastification";
import { useLoading } from "@hooks";

interface Props {
  selectedItem: ISupplierItems;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["close"]);

const itemsStore = useSupplierItemsStore();
const { deleteItem } = itemsStore;
const [isDeleting, setDeleting] = useLoading();

const deleteItems = async () => {
  setDeleting.start();
  await deleteItem(props.selectedItem.id);

  useToast().success("Supplier Item removed successfully");
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
        Are you sure you want to delete <b>{{ selectedItem.item_code }}</b
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
        @click="deleteItems"
      />
    </template>
  </Dialog>
</template>

<style lang="scss" scoped></style>
