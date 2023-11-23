<script setup lang="ts">
import DataTable, { type DataTableFilterMeta } from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import type { IProducts } from "@app-types/products";
interface Props {
  products: IProducts[];
  filters: DataTableFilterMeta;
}
interface Emits {
  (e: "edit", item: IProducts): void;
  (e: "delete", item: IProducts): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
  <DataTable
    :value="products"
    stripedRows
    :paginator="true"
    :rows="10"
    :filters="filters"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[10, 25, 50]"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
    responsiveLayout="scroll"
  >
    <Column field="id" header="ID" :sortable="true"></Column>
    <Column field="name" header="Name" :sortable="true"></Column>
    <Column field="description" header="Description"></Column>
    <Column field="docket" header="Docket #"></Column>
    <Column field="epa_number" header="EPA Docket #"></Column>
    <Column field="price" header="Price $"></Column>
    <Column field="gst_check" header="GST Check">
      <template #body="{ data }">
        <span v-if="data.gst_check === true">{{ "Active" }}</span>
        <span v-else>{{ "Not Active" }}</span>
      </template>
    </Column>
    <Column field="gst" header="GST $"></Column>
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
          v-tooltip.right="'Delete Product'"
          @click="$emit('delete', data)"
        />
      </template>
    </Column>
  </DataTable>
</template>

<style lang="scss" scoped></style>
