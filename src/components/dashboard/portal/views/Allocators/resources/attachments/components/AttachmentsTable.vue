<script setup lang="ts">
import DataTable, { type DataTableFilterMeta } from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Chip from "primevue/chip";
import type { IAssetAttachment } from "@app-types/resources";
import { DashboardRouteNames } from "@router";

interface Props {
  attachments: IAssetAttachment[];
  filters: DataTableFilterMeta;
}

interface Emits {
  (e: "edit", item: IAssetAttachment): void;
  (e: "delete", item: IAssetAttachment): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
  <DataTable
    :value="attachments"
    stripedRows
    :paginator="true"
    :rows="10"
    :filters="filters"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[10, 25, 50]"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} attachments"
    responsiveLayout="scroll"
  >
    <Column field="id" header="ID" :sortable="true"></Column>
    <Column field="name" header="Name" :sortable="true"></Column>
    <Column field="description" header="Description" :sortable="true"></Column>
    <Column field="year" header="Year" :sortable="true"></Column>
    <Column field="make" header="Make" :sortable="true"></Column>
    <Column field="model" header="Model" :sortable="true"></Column>
    <Column field="tags" header="Tags">
      <template #body="{ data }">
        <Chip v-for="tag in data.tags" :key="tag.id" :label="tag.name" />
      </template>
    </Column>
    <Column>
      <template #body="{ data }">
        <RouterLink
          :to="{
            name: DashboardRouteNames.resourceEditAttachment,
            params: { id: data.id },
          }"
        >
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-secondary p-button-outlined mr-2"
            v-tooltip.left="'Edit Values'"
          />
        </RouterLink>
        <Button
          icon="pi pi-trash"
          class="p-button-rounded p-button-danger p-button-outlined"
          v-tooltip.right="'Delete Item'"
          @click="$emit('delete', data)"
        />
      </template>
    </Column>
  </DataTable>
</template>

<style lang="scss" scoped>
:deep(.p-chip) {
  @apply font-semibold text-sm px-3 mr-1;
}
</style>
