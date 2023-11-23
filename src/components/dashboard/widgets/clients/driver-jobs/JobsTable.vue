<script setup lang="ts">
import { computed, onMounted, type ComputedRef } from "vue";
import { useJobsStore } from "@stores/jobs/jobs";
import { DashboardRouteNames } from "@router";
import type { Item } from "vue3-easy-data-table";
import { storeToRefs } from "pinia";
import Button from "primevue/button";
import DataTable, { type DataTableFilterMeta } from "primevue/datatable";
import Column from "primevue/column";
import type { IJob } from "@/types/jobs";
import Chip from "primevue/chip";

const jobsStore = useJobsStore();
const { jobs } = storeToRefs(jobsStore);
const { getAllJobs } = jobsStore;

onMounted(() => {
  getAllJobs();
});

interface Props {
  filters: DataTableFilterMeta;
  jobs: IJob[];
}

interface Emits {
  (e: "edit", item: IJob): void;
  (e: "delete", item: IJob): void;
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
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[10, 25, 50]"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} jobs"
    responsiveLayout="scroll"
  >
    <Column field="id" header="ID" :sortable="true"></Column>
    <Column field="job_title" header="Title" :sortable="true"></Column>
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
    <Column field="assets" header="Assets">
      <template #body="{ data }">
        <Chip
          v-for="asset in data.assets"
          :key="asset.id"
          :label="asset.name"
        />
      </template>
    </Column>
    <Column>
      <template #body="{ data }">
        <RouterLink
          :to="{
            name: DashboardRouteNames.editJob,
            params: { id: data.id },
          }"
        >
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-secondary p-button-outlined mr-2"
            v-tooltip.left="'Edit Job'"
          />
        </RouterLink>

        <Button
          icon="pi pi-trash"
          class="p-button-rounded p-button-danger p-button-outlined"
          v-tooltip.right="'Delete Job'"
          @click="$emit('delete', data)"
        />
      </template>
    </Column>
  </DataTable>
</template>

<style lang="scss" scoped></style>
