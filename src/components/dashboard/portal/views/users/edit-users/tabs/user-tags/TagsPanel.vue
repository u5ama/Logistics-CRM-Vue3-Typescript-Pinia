<script setup lang="ts">
import Fieldset from "primevue/fieldset";
import Button from "primevue/button";
import type { IUserTags } from "@app-types/user";
import { useLoading } from "@hooks";
import { useToast } from "vue-toastification";
import { useUserTagsStore } from "@stores/users/tags";

interface Props {
  tag: IUserTags;
}

const props = defineProps<Props>();
const notesStore = useUserTagsStore();
const { deleteTag } = notesStore;
const [isDeleting, setDeleting] = useLoading();
const deleteNoteHandler = async () => {
  setDeleting.start();
  await deleteTag(props.tag.id);
  useToast().success("Tag deleted successfully");
  setDeleting.stop();
};
</script>

<template>
  <Fieldset :legend="tag.name" :toggleable="true" :collapsed="true">
    <div class="flex items-center justify-end">
      <Button
        class="p-button-danger"
        :label="isDeleting ? 'Deleting' : 'Delete Tag'"
        :icon="isDeleting ? 'pi pi-spin pi-spinner' : 'pi pi-trash'"
        :disabled="isDeleting"
        @click="deleteNoteHandler"
      />
    </div>
  </Fieldset>
</template>

<style lang="scss" scoped></style>
