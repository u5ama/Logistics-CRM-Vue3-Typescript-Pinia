<script setup lang="ts">
import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";
import { FontWeight } from "@app-types/styles";
import DataTable, { type DataTableFilterMeta } from "primevue/datatable";
import type { Item } from "vue3-easy-data-table";
import { useDriverDashboardStore } from "@stores/dashboard/driverDashboard";
import { storeToRefs } from "pinia";
import { computed, type ComputedRef, onMounted } from "vue";
import Column from "primevue/column";
import { DashboardRouteNames } from "@router";

const driverDashboardStore = useDriverDashboardStore();
const { allocatedJobs } = storeToRefs(driverDashboardStore);
const { getAllDashboardDriverJobs } = driverDashboardStore;
import { useLoading } from "@hooks";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
const [isLoading, setLoading] = useLoading();

onMounted(async () => {
  setLoading.start();
  await getAllDashboardDriverJobs();
  setLoading.stop();
});
interface Props {
  filters: DataTableFilterMeta;
}
defineProps<Props>();
const parsedItems = computed(() =>
  [...allocatedJobs.value]
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .map((dashboardAsset) => ({
      startDate: new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(dashboardAsset.start_date)),
      ...dashboardAsset,
    }))
    .map((dashboardAsset) => ({
      endDate: new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(dashboardAsset.end_date)),
      ...dashboardAsset,
    }))
);
const items: ComputedRef<Item[]> = parsedItems;
</script>
<template>
  <PortalWidget>
    <div class="flex flex-col h-full">
      <div class="mb-5">
        <WidgetTypography variant="title" :weight="FontWeight.bold">
          Fieldworker Allocated Jobs
        </WidgetTypography>
      </div>
      <SimpleLoader v-if="isLoading" />
      <div class="flex flex-col gap-y-6" v-else-if="allocatedJobs.length">
        <DataTable
          :value="items"
          stripedRows
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[10, 25, 50]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} jobs"
          responsiveLayout="scroll"
        >
          <Column field="job_title" header="Job Title" :sortable="true">
            <template #body="{ data }">
              <RouterLink
                :to="{
                  name: DashboardRouteNames.editDriverJob,
                  params: { id: data.id },
                }"
              >
                <span style="color: blue; text-decoration: underline">{{
                  data.job_title
                }}</span>
              </RouterLink>
            </template>
          </Column>
          <Column
            field="startDate"
            header="Start Date"
            :sortable="true"
          ></Column>
          <Column field="endDate" header="End Date" :sortable="true"></Column>
        </DataTable>
      </div>
      <p class="text-center mt-4" v-else>No Records Found</p>
    </div>
  </PortalWidget>
</template>
