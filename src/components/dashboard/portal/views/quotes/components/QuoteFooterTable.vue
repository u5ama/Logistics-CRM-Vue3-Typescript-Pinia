<script setup lang="ts">
import DataTable, { type DataTableFilterMeta } from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { DashboardRouteNames } from "@router";
import type { IQuoteFooter } from "@/types/quotes";

interface Props {
  attachments: IQuoteFooter[];
  filters: DataTableFilterMeta;
}

interface Emits {
  (e: "edit", item: IQuoteFooter): void;
  (e: "delete", item: IQuoteFooter): void;
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
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Quote Footer"
    responsiveLayout="scroll"
  >
    <Column field="id" header="ID" :sortable="true"></Column>
    <Column field="name" header="Title" :sortable="true"></Column>
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
    <Column>
      <template #body="{ data }">
        <RouterLink
          :to="{
            name: DashboardRouteNames.editQuoteFooter,
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
