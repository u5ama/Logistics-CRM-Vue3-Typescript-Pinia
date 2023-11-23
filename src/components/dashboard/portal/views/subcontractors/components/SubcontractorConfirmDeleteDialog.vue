<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import type { ISubcontractor } from "@app-types/subcontractor";
import { useSubcontractorsStore } from "@stores/subcontractors/subcontractors";
import { useToast } from "vue-toastification";
import { useLoading } from "@hooks";

interface Props {
  selectedItem: ISubcontractor;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["close"]);
const subcontractorsStore = useSubcontractorsStore();
const { deleteSubcontractor } = subcontractorsStore;
const [isDeleting, setDeleting] = useLoading();
const deleteContractor = async () => {
  setDeleting.start();
  await deleteSubcontractor(props.selectedItem.id);
  useToast().success("Subcontractor removed successfully");
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
        @click="deleteContractor"
      />
    </template>
  </Dialog>
</template>

<style lang="scss" scoped></style>
