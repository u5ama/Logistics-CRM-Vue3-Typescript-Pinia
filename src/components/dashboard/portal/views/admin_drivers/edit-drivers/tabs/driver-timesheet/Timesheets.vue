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
import { useJobTimeSheetStore } from "@stores/jobs/timesheets";
import AddTimesheetModal from "@dashboard-views/jobs/edit-job/tabs/job-timesheets/AddTimesheetModal.vue";
import { API_BASE_URL } from "@utils/constants";

const timeSheetStore = useJobTimeSheetStore();
const { timesheets } = storeToRefs(timeSheetStore);
const { getAllTimeSheets, deleteTimeSheet } = timeSheetStore;
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
  timesheets.value.map((timesheet) => ({
    date: new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(timesheet.created_at)),
    name: timesheet.name,
    start_time: timesheet.start_time,
    end_time: timesheet.end_time,
    is_confirmed: timesheet.is_confirmed,
    download: `${API_BASE_URL}${timesheet.file}`,
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
    <AddTimesheetModal
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
          <Column field="name" header="User"></Column>
          <Column field="start_time" header="Start Time"></Column>
          <Column field="end_time" header="End Time"></Column>
          <Column field="is_confirmed" header="Status"></Column>
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
