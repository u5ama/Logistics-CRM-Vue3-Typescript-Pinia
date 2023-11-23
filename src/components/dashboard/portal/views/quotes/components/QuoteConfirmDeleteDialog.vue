<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useQuotesStore } from "@stores/quotes/quotes";
import { useToast } from "vue-toastification";
import { useLoading } from "@hooks";
import type { IQuote } from "@/types/quotes";

interface Props {
  selectedItem: IQuote;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["close"]);

const quotesStore = useQuotesStore();
const { deleteQuote } = quotesStore;
const [isDeleting, setDeleting] = useLoading();

const deleteHandler = async () => {
  setDeleting.start();
  await deleteQuote(props.selectedItem.id);;

  useToast().success("Quote removed successfully");
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
        Are you sure you want to delete <b>{{ selectedItem.quote_name }}</b
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
        @click="deleteHandler"
      />
    </template>
  </Dialog>
</template>

<style lang="css" scoped>
.p-dialog-mask.p-component-overlay.p-component-overlay-enter {
  z-index: 9 !important;
}
</style>
