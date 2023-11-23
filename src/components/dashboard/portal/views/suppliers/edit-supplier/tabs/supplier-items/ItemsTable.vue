<script setup lang="ts">
import DataTable, { type DataTableFilterMeta } from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import type { ISupplierItems } from "@app-types/supplier";

interface Props {
  items: ISupplierItems[];
  filters: DataTableFilterMeta;
}

interface Emits {
  (e: "edit", item: ISupplierItems): void;
  (e: "delete", item: ISupplierItems): void;
}

defineProps<Props>();
defineEmits<Emits>();
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
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
    responsiveLayout="scroll"
  >
    <Column field="id" header="ID" :sortable="true"></Column>
    <Column field="item_code" header="Item Code" :sortable="true"></Column>
    <Column field="item_description" header="Item Description"></Column>
    <Column field="site" header="Site"></Column>
    <Column field="unit_price" header="Unit Price"></Column>
    <Column field="gst_incl" header="GST"></Column>
    <Column field="UOM" header="UOM"></Column>
    <Column field="created_at" header="Created At" :sortable="true">
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
