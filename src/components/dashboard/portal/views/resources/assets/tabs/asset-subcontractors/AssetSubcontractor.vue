<script setup lang="ts">
import { computed, inject, onMounted, ref } from "vue";
import Panel from "primevue/panel";
import Button from "primevue/button";
import { storeToRefs } from "pinia";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import AddSubcontractorModal from "./AddSubcontractorModal.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useToast } from "vue-toastification";
import { editAssetInjectionKey } from "@utils/injectionKeys";
import { useLoading, useModal } from "@hooks";
import { useAssetSubcontractorStore } from "@stores/resources/assetSubcontractor";
import type { IAssetSubcontractors } from "@/types/resources";

const subcontractorStore = useAssetSubcontractorStore();
const { subcontractors } = storeToRefs(subcontractorStore);
const { getAllSubcontractors, deleteSubcontractor } = subcontractorStore;
const [isLoading, setLoading] = useLoading();
const [isModalOpen, setModal] = useModal();
const { assetId } = inject(editAssetInjectionKey)!;

const fetchSubcontractor = async () => {
  setLoading.start();
  await getAllSubcontractors(assetId);
  setLoading.stop();
};

onMounted(async () => {
  if (!subcontractors.value.length) await fetchSubcontractor();
});

const documentRows = computed(() =>
  subcontractors.value.map((doc) => ({
    id: doc.id,
    subcontractor_id: doc.subcontractor_id,
    name: doc.name,
    phone: doc.phone,
    charge_type: doc.charge_type,
    charge_unit: doc.charge_unit,
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
  await deleteSubcontractor(docId);

  useToast().success("Asset Subcontractor deleted Successfully!");
  setDeleting.stop();
};
const selectedItem = ref();
const openEditModal = (item: IAssetSubcontractors) => {
  selectedItem.value = { ...item };
  setModal.open();
};
interface Emits {
  (e: "edit", item: IAssetSubcontractors): void;
}

defineEmits<Emits>();
</script>

<template>
  <div class="wrapper max-w-6xl mt-6 mx-auto">
    <AddSubcontractorModal
      v-if="isModalOpen"
      :open="isModalOpen"
      :selectedItem="selectedItem"
      @close="setModal.close"
    />

    <Panel>
      <template #header>
        <StyledHeading level="h3">Asset Subcontractors</StyledHeading>
      </template>
      <template #icons>
        <Button
          icon="pi pi-plus"
          class="p-button-rounded p-button-success mr-1"
          v-tooltip.top="'Add Subcontractor'"
          @click="setModal.open"
        />
        <Button
          icon="pi pi-replay"
          class="p-button-rounded p-button-secondary -rotate-45"
          @click="fetchSubcontractor"
          v-tooltip.top="'Reload Data'"
        />
      </template>

      <SimpleLoader v-if="isLoading" />

      <div class="flex flex-col gap-y-6" v-else-if="subcontractors.length">
        <DataTable :value="documentRows" stripedRows responsiveLayout="scroll">
          <Column field="name" header="Name"></Column>
          <Column field="phone" header="Phone"></Column>
          <Column field="charge_type" header="Charge Type">
            <template #body="{ data }">
              <span v-if="data.charge_type === 'per_hour'">{{ "Per Hour" }}</span>
              <span v-if="data.charge_type === 'per_trip'">{{ "Per Trip" }}</span>
              <span v-if="data.charge_type === 'per_m3'">{{ "Per M3" }}</span>
            </template>
          </Column>
          <Column field="charge_unit" header="Charge Unit"></Column>
          <Column header="Actions">
            <template #body="{ data }">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-secondary p-button-text"
                v-tooltip.left="'Edit Asset Subcontractor'"
                @click="openEditModal(data)"
              />
              <Button
                :disabled="isDeleting"
                icon="pi pi-trash"
                class="p-button-danger p-button-rounded p-button-text"
                v-tooltip.right="'Delete Asset Subcontractor'"
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
