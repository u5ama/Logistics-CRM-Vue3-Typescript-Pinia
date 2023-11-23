<script setup lang="ts">
import Fieldset from "primevue/fieldset";
import Button from "primevue/button";
import type { IUserNote } from "@app-types/user";
import { useUserNotesStore } from "@stores/users/notes";
import { useLoading } from "@hooks";
import { useToast } from "vue-toastification";

interface Props {
  note: IUserNote;
}

const props = defineProps<Props>();
const notesStore = useUserNotesStore();
const { deleteNote } = notesStore;
const [isDeleting, setDeleting] = useLoading();
const deleteNoteHandler = async () => {
  setDeleting.start();
  await deleteNote(props.note.id);
  useToast().success("Note deleted successfully");
  setDeleting.stop();
};
</script>

<template>
  <Fieldset :legend="note.title" :toggleable="true" :collapsed="true">
    <div class="py-4">
      {{ note.description }}
    </div>
    <div class="flex items-center justify-end">
      <Button
        class="p-button-danger"
        :label="isDeleting ? 'Deleting' : 'Delete Note'"
        :icon="isDeleting ? 'pi pi-spin pi-spinner' : 'pi pi-trash'"
        :disabled="isDeleting"
        @click="deleteNoteHandler"
      />
    </div>
  </Fieldset>
</template>

<style lang="scss" scoped></style>
