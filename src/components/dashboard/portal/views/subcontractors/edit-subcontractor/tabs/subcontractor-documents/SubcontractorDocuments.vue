<script setup lang="ts">
import { computed, inject, onMounted } from "vue";
import Panel from "primevue/panel";
import Button from "primevue/button";
import { storeToRefs } from "pinia";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import AddDocumentModal from "./AddDocumentModal.vue";

import { useSubcontractorDocumentsStore } from "@stores/subcontractors/documents";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { API_BASE_URL } from "@utils/constants";
import { useToast } from "vue-toastification";
import { editSubcontractorInjectionKey } from "@utils/injectionKeys";
import { useLoading, useModal } from "@hooks";
import { mapDocumentActiveToString } from "@utils/helpers";
import { DocumentStatus, type ISubcontractorDocument } from "@/types/subcontractor";

const documentsStore = useSubcontractorDocumentsStore();
const { documents } = storeToRefs(documentsStore);
const { getAllDocuments, deleteDocument, changeDocumentStatus } = documentsStore;

const [isLoading, setLoading] = useLoading();
const [isModalOpen, setModal] = useModal();
const { subcontractorId } = inject(editSubcontractorInjectionKey)!;

const fetchDocuments = async () => {
  setLoading.start();
  await getAllDocuments(subcontractorId);
  setLoading.stop();
};

onMounted(async () => {
  if (!documents.value.length) await fetchDocuments();
});

const documentRows = computed(() =>
  documents.value.map((doc) => ({
    id: doc.id,
    name: doc.title,
    reminder: doc.reminder,
    status: mapDocumentActiveToString(doc.status),
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

  useToast().success("Document deleted Successfully!");
  setDeleting.stop();
};

const statusChangeHandler = async (document: ISubcontractorDocument) => {
  const newStatus =
    document.status === DocumentStatus.Approved
      ? DocumentStatus.NotApproved
      : DocumentStatus.Approved;

  await changeDocumentStatus(document.id, newStatus);
  await fetchDocuments();
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
        <StyledHeading level="h3">Subcontractor Documents</StyledHeading>
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
          <Column field="reminder" header="Reminder Date"></Column>
          <Column field="date" header="Upload Date"></Column>
          <Column field="status" header="Status">
            <template #body="{ data }">
              <span
                class="status"
                :class="data.status"
                @click="statusChangeHandler(data)"
                v-tooltip="'Toggle status'"
              >
                {{ data.status }}
              </span>
            </template>
          </Column>
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
                v-tooltip.right="'Delete Document'"
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

  .p-tag {
    @apply bg-slate-200 px-4;
  }

  .tag {
    @apply bg-slate-200 rounded-full px-2 py-1 font-semibold;
  }
}
 .status {
   @apply inline-block text-center text-sm rounded-full px-3 py-2 w-auto leading-none cursor-pointer;

   &.Approved {
     @apply font-medium text-green-600 bg-green-100;
   }
   &.NotApproved {
     @apply text-red-600  bg-red-100;
   }
 }
</style>
