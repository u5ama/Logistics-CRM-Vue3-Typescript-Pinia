<script setup lang="ts">
import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";
import { FontWeight } from "@app-types/styles";
import type { Item } from "vue3-easy-data-table";
import { onMounted, computed, type ComputedRef } from "vue";
import { useDashboardStore } from "@stores/dashboard/allocatorDashboard";
import { storeToRefs } from "pinia";
import DataTable, { type DataTableFilterMeta } from "primevue/datatable";
import Column from "primevue/column";
import { useLoading } from "@hooks";
import SimpleLoader from "@components/UI/SimpleLoader.vue";

const dashboardStore = useDashboardStore();
const { dashboardAssets } = storeToRefs(dashboardStore);
const { getAllDashboardAssets } = dashboardStore;
const [isLoading, setLoading] = useLoading();

onMounted(async () => {
  setLoading.start();
  await getAllDashboardAssets();
  setLoading.stop();
});
interface Props {
  filters: DataTableFilterMeta;
}
defineProps<Props>();
const parsedItems = computed(() =>
  [...dashboardAssets.value]
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
          Open Jobs That Have Assets
        </WidgetTypography>
      </div>
      <SimpleLoader v-if="isLoading" />
      <div class="flex flex-col gap-y-6" v-else-if="dashboardAssets.length">
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
          <Column
            field="job_title"
            header="Job Title"
            :sortable="true"
          ></Column>
          <Column
            field="startDate"
            header="Start Date"
            :sortable="true"
          ></Column>
          <Column field="endDate" header="End Date" :sortable="true"></Column>
          <Column
            field="asset_count"
            header="Asset Count"
            :sortable="true"
          ></Column>
        </DataTable>
      </div>
      <p class="text-center mt-4" v-else>No Records Found</p>
    </div>
  </PortalWidget>
</template>
