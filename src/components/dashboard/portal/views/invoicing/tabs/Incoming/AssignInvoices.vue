<script setup lang="ts">
import { computed, inject, onMounted } from "vue";
import Panel from "primevue/panel";
import Button from "primevue/button";
import { storeToRefs } from "pinia";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import AddDocumentModal from "./AllocateInvoiceModal.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { API_BASE_URL } from "@utils/constants";
import { useToast } from "vue-toastification";
import { editInvoiceInjectionKey } from "@utils/injectionKeys";
import { useLoading, useModal } from "@hooks";
import { useAllocatedInvoiceStore } from "@stores/invoicing/allocatedInvoices";

const allocatedInvoiceStore = useAllocatedInvoiceStore();
const { documents } = storeToRefs(allocatedInvoiceStore);
const { getAllAllocatedInvoices, deleteDocument } = allocatedInvoiceStore;
const [isLoading, setLoading] = useLoading();
const [isModalOpen, setModal] = useModal();
const { invoiceId } = inject(editInvoiceInjectionKey)!;

const fetchDocuments = async () => {
  setLoading.start();
  await getAllAllocatedInvoices(invoiceId);
  setLoading.stop();
};

onMounted(async () => {
  if (!documents.value.length) await fetchDocuments();
});

const documentRows = computed(() =>
  documents.value.map((doc) => ({
    id: doc.id,
    subcontractor_name: doc.subcontractor_name,
    amount: doc.amount,
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
  useToast().success("Invoice Allocated deleted Successfully!");
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
        <StyledHeading level="h3">Allocated Invoices</StyledHeading>
      </template>

      <template #icons>
        <Button
          icon="pi pi-plus"
          class="p-button-rounded p-button-success mr-1"
          v-tooltip.top="'Upload Invoice'"
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
          <Column
            field="subcontractor_name"
            header="Subcontractor Name"
          ></Column>
          <Column field="amount" header="Amount"></Column>
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
                v-tooltip.right="'Delete Invoice'"
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
