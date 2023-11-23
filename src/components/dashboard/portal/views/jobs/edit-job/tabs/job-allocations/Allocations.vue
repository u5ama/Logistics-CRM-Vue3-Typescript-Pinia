<script setup lang="ts">
import { computed, inject, onMounted } from "vue";
import Panel from "primevue/panel";
import { storeToRefs } from "pinia";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { editJobInjectionKey } from "@utils/injectionKeys";
import { useLoading, useModal } from "@hooks";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import { useJobDriversStore } from "@stores/jobs/drivers";
import AddAllocationModal from "@dashboard-views/jobs/edit-job/tabs/job-allocations/AddAllocationModal.vue";
import Button from "primevue/button";
import { useToast } from "vue-toastification";

const jobDriversStore = useJobDriversStore();
const { drivers } = storeToRefs(jobDriversStore);
const { getAllDrivers, deleteDriver } = jobDriversStore;
const { jobId } = inject(editJobInjectionKey)!;
const [isLoading, setLoading] = useLoading();
const [isModalOpen, setModal] = useModal();

const fetchAllocations = async () => {
  setLoading.start();
  await getAllDrivers(jobId);
  setLoading.stop();
};

onMounted(async () => {
  if (!drivers.value.length) await fetchAllocations();
});

const driverRows = computed(() =>
  drivers.value.map((doc) => ({
    id: doc.id,
    name: doc.name,
    phone: doc.phone,
    user_id: doc.user_id,
    asset_name: doc.asset_name,
    date: new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(doc.created_at)),
  }))
);

const [isDeleting, setDeleting] = useLoading();

const deleteDocHandler = async (driver_id: string) => {
  setDeleting.start();
  const success = await deleteDriver(jobId, driver_id);

  if (!success) return;
  useToast().success("Driver removed Successfully!");
  setDeleting.stop();
};
</script>

<template>
  <div class="wrapper max-w-6xl mt-6 mx-auto">
    <AddAllocationModal
      v-if="isModalOpen"
      :open="isModalOpen"
      @close="setModal.close"
    />
    <Panel>
      <template #header>
        <StyledHeading level="h3">Field Staff</StyledHeading>
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
          @click="fetchAllocations"
          v-tooltip.top="'Reload Data'"
        />
      </template>
      <SimpleLoader v-if="isLoading" />
      <div class="flex flex-col gap-y-6" v-else-if="drivers.length">
        <DataTable :value="driverRows" stripedRows responsiveLayout="scroll">
          <Column field="name" header="User"></Column>
          <Column field="phone" header="Phone"></Column>
          <Column field="asset_name" header="Allocated Asset"></Column>
          <Column field="date" header="Created At"></Column>
          <Column header="Actions">
            <template #body="{ data }">
              <Button
                :disabled="isDeleting"
                icon="pi pi-trash"
                class="p-button-danger p-button-rounded p-button-text"
                v-tooltip.right="'Delete Driver'"
                @click="deleteDocHandler(data.user_id)"
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
