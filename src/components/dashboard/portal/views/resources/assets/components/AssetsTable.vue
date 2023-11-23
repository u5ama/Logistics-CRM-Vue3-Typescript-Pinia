<script setup lang="ts">
import DataTable, { type DataTableFilterMeta } from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Chip from "primevue/chip";
import type { IResourceAsset } from "@app-types/resources";
import { DashboardRouteNames } from "@router";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
interface Props {
  assets: IResourceAsset[];
  filters: DataTableFilterMeta;
}

interface Emits {
  (e: "edit", item: IResourceAsset): void;
  (e: "delete", item: IResourceAsset): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
  <DataTable
    :value="assets"
    stripedRows
    :paginator="true"
    :rows="10"
    :filters="filters"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[10, 25, 50]"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} assets"
    responsiveLayout="scroll"
  >
    <Column field="name" header="Name" :sortable="true">
      <template #body="{ data }">
        <WidgetTypography variant="small_title" class="mb-1">
          {{ data.name }}
        </WidgetTypography>
        <WidgetTypography variant="subtitle" class="">
          {{ data.description }}
        </WidgetTypography>
      </template>
    </Column>
    <!--    <Column field="rego_number" header="Rego Number" :sortable="true"></Column>-->
    <Column field="year" header="Year" :sortable="true"></Column>
    <Column field="make" header="Make" :sortable="true"></Column>
    <Column field="model" header="Model" :sortable="true"></Column>
    <!--    <Column field="updated_at" header="Modified Time" :sortable="true">-->
    <!--      <template #body="{ data }">-->
    <!--        {{-->
    <!--          new Intl.DateTimeFormat("en-US", {-->
    <!--            day: "2-digit",-->
    <!--            month: "short",-->
    <!--            year: "numeric",-->
    <!--            hour12: true,-->
    <!--            hour: "2-digit",-->
    <!--            minute: "2-digit",-->
    <!--          }).format(new Date(data.updated_at))-->
    <!--        }}-->
    <!--      </template>-->
    <!--    </Column>-->
    <Column field="tags" header="Tags">
      <template #body="{ data }">
        <Chip v-for="tag in data.tags" :key="tag.id" :label="tag.name" />
      </template>
    </Column>
    <Column>
      <template #body="{ data }">
        <RouterLink
          :to="{
            name: DashboardRouteNames.editAsset,
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
