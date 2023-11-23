<script setup lang="ts">
import { computed, inject, onMounted } from "vue";
import Panel from "primevue/panel";
import Button from "primevue/button";
import { storeToRefs } from "pinia";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { API_BASE_URL } from "@utils/constants";
import { useToast } from "vue-toastification";
import { useLoading } from "@hooks";
import { useJobDocumentsStore } from "@stores/driver-jobs/documents";
import { editDriverInjectionKey } from "@utils/injectionKeys";

const jobDocumentsStore = useJobDocumentsStore();
const { documents } = storeToRefs(jobDocumentsStore);
const { DriverAllDocuments, deleteDocument } = jobDocumentsStore;
const [isLoading, setLoading] = useLoading();
const { driverId } = inject(editDriverInjectionKey)!;

const fetchDocuments = async () => {
  setLoading.start();
  await DriverAllDocuments(driverId);
  setLoading.stop();
};

onMounted(async () => {
  if (!documents.value.length) await fetchDocuments();
});

const documentRows = computed(() =>
  documents.value.map((doc) => ({
    id: doc.id,
    name: doc.title,
    hire_docket: doc.hire_docket,
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
  useToast().success("Job Document deleted Successfully!");
  setDeleting.stop();
};
</script>

<template>
  <div class="wrapper max-w-6xl mt-6 mx-auto">
    <Panel>
      <template #header>
        <StyledHeading level="h3">Driver Job Documents</StyledHeading>
      </template>
      <template #icons>
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
          <Column field="hire_docket" header="Is Hire Docket?"></Column>
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
</style>
