<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useLoading } from "@hooks";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import router, { DashboardRouteNames } from "@router";
import Button from "primevue/button";
import { useSafetyDashboardStore } from "@stores/dashboard/safetyDashboard";
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import Panel from "primevue/panel";

const safetyDashboardStore = useSafetyDashboardStore();
const { dashboardSafety } = storeToRefs(safetyDashboardStore);
const { getAllSafetyOfficerData } = safetyDashboardStore;

const [isLoading, setLoading] = useLoading();

const fetchAllocations = async () => {
  setLoading.start();
  await getAllSafetyOfficerData();
  setLoading.stop();
};

onMounted(async () => {
  if (!dashboardSafety.value?.checklists) await fetchAllocations();
});

const driverRows = computed(() =>
  dashboardSafety.value?.checklists.map((doc) => ({
    id: doc.id,
    driver_name: doc.driver_name,
    job_name: doc.job_name,
    checklist_name: doc.checklist_name,
    checklist_id: doc.checklist_id,
    date: new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(doc.created_at)),
  }))
);

const editDriverHandler = (checklistId: number) => {
  router.push({
    name: DashboardRouteNames.viewChecklist,
    params: { id: checklistId },
  });
};
</script>

<template>
  <Panel>
    <template #header>
      <div class="mb-7">
        <WidgetTypography variant="title" class="mb-1">
          Driver Checklists
        </WidgetTypography>
        <WidgetTypography variant="subtitle" class="">
          Recent Driver Checklists
        </WidgetTypography>
      </div>
    </template>
    <template #icons>
      <Button
        icon="pi pi-replay"
        class="p-button-rounded p-button-secondary -rotate-45"
        @click="fetchAllocations"
        v-tooltip.top="'Reload Data'"
        :loading="isLoading"
      />
    </template>
    <SimpleLoader v-if="isLoading" />
    <div
      class="flex flex-col gap-y-6"
      v-else-if="dashboardSafety?.checklists.length"
    >
      <DataTable :value="driverRows" stripedRows responsiveLayout="scroll">
        <Column field="driver_name" header="Driver Name"></Column>
        <Column field="job_name" header="Job Name"></Column>
        <Column field="checklist_name" header="Checklist Name"></Column>

        <Column field="date" header="Created At"></Column>
        <Column header="Actions">
          <template #body="{ data }">
            <Button
              icon="pi pi-eye"
              class="p-button-danger p-button-rounded p-button-text"
              v-tooltip.right="'View Checklist'"
              @click="editDriverHandler(data.checklist_id)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <p class="text-center mt-4" v-else>No Records Found</p>
  </Panel>
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
