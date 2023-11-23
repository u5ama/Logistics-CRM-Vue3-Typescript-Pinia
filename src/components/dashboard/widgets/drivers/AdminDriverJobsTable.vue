<script setup lang="ts">
import { computed, onMounted, type ComputedRef } from "vue";
import { useDriverJobsStore } from "@stores/driver-jobs/jobs";
import { DashboardRouteNames } from "@router";
import type { Item } from "vue3-easy-data-table";
import { storeToRefs } from "pinia";
import Button from "primevue/button";
import DataTable, { type DataTableFilterMeta } from "primevue/datatable";
import Column from "primevue/column";
import type { IAllocatedJob } from "@/types/jobs";

const driverJobsStore = useDriverJobsStore();
const { jobs } = storeToRefs(driverJobsStore);
const { getAllJobs } = driverJobsStore;

onMounted(() => {
  getAllJobs();
});

interface Props {
  filters: DataTableFilterMeta;
  jobs: IAllocatedJob[];
  driverId: number;
}

interface Emits {
  (e: "edit", item: IAllocatedJob): void;
  (e: "delete", item: IAllocatedJob): void;
}
defineEmits<Emits>();
defineProps<Props>();

const parsedItems = computed(() =>
  [...jobs.value]
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .map((job) => ({
      date_added: new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(job.created_at)),
      ...job,
    }))
);

const items: ComputedRef<Item[]> = parsedItems;
</script>

<template>
  <DataTable
    :value="items"
    stripedRows
    :paginator="true"
    :rows="10"
    :filters="filters"
    class="p-datatable-lg"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[10, 25, 50]"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} jobs"
    responsiveLayout="scroll"
  >
    <Column field="id" header="ID" :sortable="true"></Column>
    <Column field="job_title" header="Title" :sortable="true">
      <template #body="{ data }">
        <RouterLink
          :to="{
            name: DashboardRouteNames.viewJob,
            params: { id: data.id, driver: driverId },
          }"
        >
          <span style="color: blue; text-decoration: underline">{{
            data.job_title
          }}</span>
        </RouterLink>
      </template>
    </Column>
    <Column field="job_address" header="Address" :sortable="true"></Column>
    <Column
      field="job_description"
      header="Description"
      :sortable="true"
    ></Column>
    <Column field="created_at" header="Created At" :sortable="true">
      <template #body="{ data }">
        {{
          new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(data.created_at))
        }}
      </template>
    </Column>
    <Column header="View">
      <template #body="{ data }">
        <RouterLink
          :to="{
            name: DashboardRouteNames.viewJob,
            params: { id: data.id, driver: driverId },
          }"
        >
          <Button
            icon="pi pi-eye"
            class="p-button-rounded p-button-secondary p-button-outlined mr-2"
            v-tooltip.left="'View Job'"
          />
        </RouterLink>
      </template>
    </Column>
  </DataTable>
</template>

<style lang="scss" scoped></style>
