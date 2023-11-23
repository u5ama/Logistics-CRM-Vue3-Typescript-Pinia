<script setup lang="ts">
import { computed, inject, onMounted } from "vue";
import Panel from "primevue/panel";
import Button from "primevue/button";
import { storeToRefs } from "pinia";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import AddDocumentModal from "./AddDocumentModal.vue";
import { useAttachmentDocumentsStore } from "@stores/resources/attachmentDocuments";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { API_BASE_URL } from "@utils/constants";
import { useToast } from "vue-toastification";
import { editAttachmentInjectionKey } from "@utils/injectionKeys";
import { useLoading, useModal } from "@hooks";

const assetStore = useAttachmentDocumentsStore();
const { documents } = storeToRefs(assetStore);
const { getAllDocuments, deleteDocument } = assetStore;

const [isLoading, setLoading] = useLoading();
const [isModalOpen, setModal] = useModal();

const { attachmentId } = inject(editAttachmentInjectionKey)!;

const fetchDocuments = async () => {
  setLoading.start();
  await getAllDocuments(attachmentId);
  setLoading.stop();
};

onMounted(async () => {
  if (!documents.value.length) await fetchDocuments();
});

const documentRows = computed(() =>
  documents.value.map((doc) => ({
    id: doc.id,
    name: doc.title,
    expiry: doc.expiry,
    alert: doc.alert,
    date: new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(doc.created_at)),
    download: `${API_BASE_URL}${doc.file}`,
  }))
);

const [isDeleting, setDeleting] = useLoading();

const deleteDocHandler = async (docId: number) => {
  setDeleting.start();
  await deleteDocument(docId);

  useToast().success("Attachment Document deleted Successfully!");
  setDeleting.stop();
};
</script>

<template>
  <div class="wrapper max-w-6xl mt-6 mx-auto">
    <AddDocumentModal
      v-if="isModalOpen"
      :open="isModalOpen"
      @close="setModal.close"
    />

    <Panel>
      <template #header>
        <StyledHeading level="h3">Attachment Documents</StyledHeading>
      </template>

      <template #icons>
        <Button
          icon="pi pi-plus"
          class="p-button-rounded p-button-success mr-1"
          v-tooltip.top="'Upload Document'"
          @click="setModal.open"
        />
        <Button
          icon="pi pi-replay"
          class="p-button-rounded p-button-secondary -rotate-45"
          @click="fetchDocuments"
          v-tooltip.top="'Reload Data'"
        />
      </template>

      <SimpleLoader v-if="isLoading" />

      <div class="flex flex-col gap-y-6" v-else-if="documents.length">
        <DataTable :value="documentRows" stripedRows responsiveLayout="scroll">
          <Column field="name" header="Name"></Column>
          <Column field="expiry" header="Expiry Date"></Column>
          <Column field="alert" header="Alert Date"></Column>
          <Column field="date" header="Upload Date"></Column>
          <Column header="Actions">
            <template #body="{ data }">
              <a :href="data.download" target="_blank">
                <Button
                  icon="pi pi-download"
                  class="p-button-rounded p-button-text"
                  v-tooltip.left="'Download File'"
                />
              </a>
              <Button
                :disabled="isDeleting"
                icon="pi pi-trash"
                class="p-button-danger p-button-rounded p-button-text"
                v-tooltip.right="'Delete Asset Document'"
                @click="deleteDocHandler(data.id)"
              />
            </template>
          </Column>
        </DataTable>
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
