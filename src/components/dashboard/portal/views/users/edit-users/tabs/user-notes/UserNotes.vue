<script setup lang="ts">
import { inject, onMounted } from "vue";
import Panel from "primevue/panel";
import NotesPanel from "./NotesPanel.vue";
import { storeToRefs } from "pinia";
import { useUserNotesStore } from "@stores/users/notes";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import AddNoteModal from "./AddNoteModal.vue";
import { editUserInjectionKey } from "@utils/injectionKeys";
import { useModal, useLoading } from "@hooks";
import Button from "primevue/button";
const notesStore = useUserNotesStore();
const { notes } = storeToRefs(notesStore);
const { getAllNotes } = notesStore;
const { userId } = inject(editUserInjectionKey)!;
const [isModalOpen, setModal] = useModal();
const [isLoading, setLoading] = useLoading();

const fetchNotes = async () => {
  setLoading.start();
  await getAllNotes(userId);
  setLoading.stop();
};

onMounted(async () => {
  if (!notes.value.length) await fetchNotes();
});
</script>

<template>
  <div class="wrapper max-w-6xl mt-6 mx-auto">
    <AddNoteModal
      v-if="isModalOpen"
      :open="isModalOpen"
      @close="setModal.close"
    />
    <Panel>
      <template #header>
        <StyledHeading level="h3">User Notes</StyledHeading>
      </template>

      <template #icons>
        <Button
          icon="pi pi-plus"
          class="p-button-rounded p-button-success mr-1"
          v-tooltip.top="'Add note'"
          @click="setModal.open"
        />
        <Button
          icon="pi pi-replay"
          class="p-button-rounded p-button-secondary -rotate-45"
          @click="fetchNotes"
          v-tooltip.top="'Reload Activities'"
        />
      </template>

      <SimpleLoader v-if="isLoading" />

      <div class="flex flex-col gap-y-6" v-else-if="notes.length">
        <NotesPanel :note="note" v-for="note in notes" :key="note.id" />
      </div>
      <p class="text-center mt-4" v-else>No Records Found</p>
    </Panel>
  </div>
</template>

<style lang="scss" scoped>
.wrapper :deep(*) {
  .p-panel-content {
    height: 500px;
    overflow-y: scroll;
  }
}
</style>
