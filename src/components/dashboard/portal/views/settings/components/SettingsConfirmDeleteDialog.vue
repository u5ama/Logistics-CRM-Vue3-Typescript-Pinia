<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import type { ISettings } from "@app-types/settings";
import { useToast } from "vue-toastification";
import { useLoading } from "@hooks";
import { useSettingStore } from "@stores/settings";

interface Props {
  selectedItem: ISettings;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["close"]);
const settingStore = useSettingStore();
const { deleteSettings } = settingStore;
const [isDeleting, setDeleting] = useLoading();

const deleteSetting = async () => {
  setDeleting.start();
  await deleteSettings();

  useToast().success("MYOB Disconnected successfully");
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
        Are you sure you want to disconnect <b>MYOB</b>?
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
        label="Disconnect"
        icon="pi pi-times"
        class="p-button p-button-danger"
        :loading="isDeleting"
        @click="deleteSetting"
      />
    </template>
  </Dialog>
</template>

<style lang="scss" scoped></style>
