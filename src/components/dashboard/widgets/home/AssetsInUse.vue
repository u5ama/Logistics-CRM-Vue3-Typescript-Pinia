<script setup lang="ts">
import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";
import { FontWeight } from "@app-types/styles";
import DataTable, { type DataTableFilterMeta } from "primevue/datatable";
import type { Item } from "vue3-easy-data-table";
import { useDashboardStore } from "@stores/dashboard/allocatorDashboard";
import { storeToRefs } from "pinia";
import { computed, type ComputedRef, onMounted } from "vue";
import Chip from "primevue/chip";
import Column from "primevue/column";
import { useLoading } from "@hooks";
import SimpleLoader from "@components/UI/SimpleLoader.vue";

const dashboardStore = useDashboardStore();
const { assetsInUse } = storeToRefs(dashboardStore);
const { getAllAssetsInUse } = dashboardStore;
const [isLoading, setLoading] = useLoading();

onMounted(async () => {
  setLoading.start();
  await getAllAssetsInUse();
  setLoading.stop();
});
interface Props {
  filters: DataTableFilterMeta;
}
defineProps<Props>();
const parsedItems = computed(() =>
  [...assetsInUse.value]
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .map((assetsIn) => ({
      startDate: new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(assetsIn.start_date)),
      ...assetsIn,
    }))
    .map((assetsIn) => ({
      endDate: new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(assetsIn.end_date)),
      ...assetsIn,
    }))
);
const items: ComputedRef<Item[]> = parsedItems;
</script>

<template>
  <PortalWidget>
    <div class="flex flex-col h-full">
      <div class="mb-5">
        <WidgetTypography variant="title" :weight="FontWeight.bold">
          Assets In Use
        </WidgetTypography>
      </div>
      <SimpleLoader v-if="isLoading" />
      <div class="flex flex-col gap-y-6" v-else-if="assetsInUse.length">
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
          <Column field="name" header="Asset Name" :sortable="true"></Column>
          <Column
            field="startDate"
            header="Start Date"
            :sortable="true"
          ></Column>
          <Column field="endDate" header="End Date" :sortable="true"></Column>
          <Column field="tags" header="Tags">
            <template #body="{ data }">
              <Chip
                v-for="tag in data.tags"
                :key="tag.id"
                :label="tag.tag_name"
              />
            </template>
          </Column>
        </DataTable>
      </div>
      <p class="text-center mt-4" v-else>No Records Found</p>
    </div>
  </PortalWidget>
</template>
