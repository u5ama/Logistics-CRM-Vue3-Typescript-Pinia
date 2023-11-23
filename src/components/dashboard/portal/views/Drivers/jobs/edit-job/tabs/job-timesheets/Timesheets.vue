<script setup lang="ts">
import { computed, inject, onMounted } from "vue";
import Panel from "primevue/panel";
import Button from "primevue/button";
import { storeToRefs } from "pinia";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useToast } from "vue-toastification";
import { editJobInjectionKey } from "@utils/injectionKeys";
import { useLoading, useModal } from "@hooks";
import { useJobTimeSheetDriverStore } from "@stores/driver-jobs/timesheets";
import { API_BASE_URL } from "@utils/constants";
import AddDriverTimesheetModal from "@dashboard-views/Drivers/jobs/edit-job/tabs/job-timesheets/AddDriverTimesheetModal.vue";

const jobTimeSheetDriverStore = useJobTimeSheetDriverStore();
const { timesheets } = storeToRefs(jobTimeSheetDriverStore);
const { getAllTimeSheets, deleteTimeSheet } = jobTimeSheetDriverStore;
const [isLoading, setLoading] = useLoading();
const [isModalOpen, setModal] = useModal();
const { jobId } = inject(editJobInjectionKey)!;

const fetchAllocations = async () => {
  setLoading.start();
  await getAllTimeSheets(jobId);
  setLoading.stop();
};

onMounted(async () => {
  if (!timesheets.value.length) await fetchAllocations();
});

const timesheetRows = computed(() =>
  timesheets.value.map((doc) => ({
    date: new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(doc.created_at)),
    id: doc.id,
    asset_name: doc.asset_name,
    startTime: doc.start_time,
    endTime: doc.end_time,
    download: `${API_BASE_URL}${doc.file}`,
  }))
);

const [isDeleting, setDeleting] = useLoading();

const deleteDocHandler = async (docId: number) => {
  setDeleting.start();
  await deleteTimeSheet(docId);
  useToast().success("TimeSheet removed Successfully!");
  setDeleting.stop();
};
</script>

<template>
  <div class="wrapper max-w-6xl mt-6 mx-auto">
    <AddDriverTimesheetModal
      v-if="isModalOpen"
      :open="isModalOpen"
      @close="setModal.close"
    />
    <Panel>
      <template #header>
        <StyledHeading level="h3">Timesheets</StyledHeading>
      </template>
      <template #icons>
        <Button
          icon="pi pi-plus"
          class="p-button-rounded p-button-success mr-1"
          v-tooltip.top="'Add Allocation'"
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
      <div class="flex flex-col gap-y-6" v-else-if="timesheets.length">
        <DataTable :value="timesheetRows" stripedRows responsiveLayout="scroll">
          <Column field="date" header="Timesheet Date"></Column>
          <Column field="asset_name" header="Asset"></Column>
          <Column field="startTime" header="Start Time"></Column>
          <Column field="endTime" header="End Time"></Column>
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
                v-tooltip.right="'Delete TimeSheet'"
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
