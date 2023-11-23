<script setup lang="ts">
import { computed, inject, onMounted } from "vue";
import Panel from "primevue/panel";
import Button from "primevue/button";
import { storeToRefs } from "pinia";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import AddDocumentModal from "./AddDriverModal.vue";

import { useSubcontractorDriversStore } from "@stores/subcontractors/subcontractorsDrivers";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useToast } from "vue-toastification";
import { editSubcontractorInjectionKey } from "@utils/injectionKeys";
import { useLoading, useModal } from "@hooks";

const driversStore = useSubcontractorDriversStore();
const { drivers } = storeToRefs(driversStore);
const { getAllDrivers, deleteDriver } = driversStore;

const [isLoading, setLoading] = useLoading();
const [isModalOpen, setModal] = useModal();
const { subcontractorId } = inject(editSubcontractorInjectionKey)!;

const fetchDocuments = async () => {
  setLoading.start();
  await getAllDrivers(subcontractorId);
  setLoading.stop();
};

onMounted(async () => {
  if (!drivers.value.length) await fetchDocuments();
});

const documentRows = computed(() =>
  drivers.value.map((doc) => ({
    id: doc.id,
    name: doc.name,
    email: doc.email,
    date: new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(doc.created_at)),
  }))
);

const [isDeleting, setDeleting] = useLoading();

const deleteDocHandler = async (docId: number) => {
  setDeleting.start();
  await deleteDriver(docId);

  useToast().success("Driver removed Successfully!");
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
        <StyledHeading level="h3">Subcontractor Drivers</StyledHeading>
      </template>
      <template #icons>
        <Button
          icon="pi pi-plus"
          class="p-button-rounded p-button-success mr-1"
          v-tooltip.top="'Add Driver'"
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

      <div class="flex flex-col gap-y-6" v-else-if="drivers.length">
        <DataTable :value="documentRows" stripedRows responsiveLayout="scroll">
          <Column field="name" header="Name"></Column>
          <Column field="email" header="Email"></Column>
          <Column header="Actions">
            <template #body="{ data }">
              <Button
                :disabled="isDeleting"
                icon="pi pi-trash"
                class="p-button-danger p-button-rounded p-button-text"
                v-tooltip.right="'Delete Driver'"
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
