<script setup lang="ts">
import DataTable, { type DataTableFilterMeta } from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import type { ISubcontractor } from "@app-types/subcontractor";
import Chip from "primevue/chip";

interface Props {
  subcontractors: ISubcontractor[];
  filters: DataTableFilterMeta;
}

interface Emits {
  (e: "edit", item: ISubcontractor): void;
  (e: "delete", item: ISubcontractor): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
  <DataTable
    :value="subcontractors"
    stripedRows
    :paginator="true"
    :rows="10"
    :filters="filters"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[10, 25, 50]"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} subcontractors"
    responsiveLayout="scroll"
  >
    <Column field="id" header="ID" :sortable="true"></Column>
    <Column field="name" header="Full Name" :sortable="true"></Column>
    <Column field="email" header="Email"></Column>
    <Column field="phone" header="Phone Number"></Column>
    <Column field="abn" header="ABN"></Column>
    <Column field="tags" header="Tags">
      <template #body="{ data }">
        {{ data }}
        <Chip v-for="tag in data.tags" :key="tag" :label="tag" />
      </template>
    </Column>
    <Column field="created_at" header="Joined At" :sortable="true">
      <template #body="{ data }">
        {{
          new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(data.created_at))
        }}
      </template>
    </Column>
    <Column>
      <template #body="{ data }">
        <Button
          icon="pi pi-pencil"
          class="p-button-rounded p-button-secondary p-button-outlined mr-2"
          v-tooltip.left="'Edit Values'"
          @click="$emit('edit', data)"
        />
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

<style lang="scss" scoped></style>
