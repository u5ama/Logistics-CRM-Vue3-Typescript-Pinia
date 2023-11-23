<script lang="ts">
import { defineComponent, ref } from "vue";
import Vue3EasyDataTable from "vue3-easy-data-table";
import type { Item } from "vue3-easy-data-table";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import "vue3-easy-data-table/dist/style.css";
import Button from "primevue/button";

export default defineComponent({
  components: {
    Button,
    EasyDataTable: Vue3EasyDataTable,
    WidgetTypography,
  },
  emits: ["status-change"],
  props: ["headers", "items", "actions", "sortBy", "loading"],
  setup() {
    const itemsSelected = ref<Item[]>([]);
    return {
      itemsSelected,
    };
  },
});
</script>

<template>
  <EasyDataTable
    themeColor="#DD9933"
    tableClassName="data-table"
    hideFooter
    v-model:itemsSelected="itemsSelected"
    :class="{ 'loading-faded': loading }"
    :headers="headers"
    :items="items"
    :sort-by="sortBy"
  >
    <template #header-actions="{ text }">
      <div class="text-right w-full pr-16">{{ text }}</div>
    </template>
    <template #item-status="item">
      <span
        class="status"
        :class="item.status"
        @click="$emit('status-change', item)"
        v-tooltip="'Toggle status'"
      >
        {{ item.status }}
      </span>
    </template>
    <template #item-actions="item">
      <WidgetTypography
        variant="subtitle2"
        class="flex gap-x-2 justify-end pr-16"
      >
        <Button
          v-for="action in actions"
          :key="action.icon"
          :icon="action.icon"
          class="p-button-rounded cursor-pointer p-button-secondary p-button-outlined"
          v-tooltip.top="action.tooltip"
          @click="$emit(action.emit, item.id)"
        />
      </WidgetTypography>
    </template>
  </EasyDataTable>
</template>

<style lang="scss" scoped>
.status {
  @apply inline-block text-center text-sm rounded-full px-3 py-2 w-auto leading-none cursor-pointer;

  &.Active {
    @apply font-medium text-green-600 bg-green-100;
  }
  &.Inactive {
    @apply text-red-600  bg-red-100;
  }
  &.Invoiced {
    @apply font-medium text-green-600 bg-green-100;
  }
  &.NotInvoiced {
    @apply text-red-600  bg-red-100;
  }
}

.data-table {
  --easy-table-body-row-hover-background-color: #fff;

  @apply border-0;

  :deep(table) {
    border-collapse: separate;

    td,
    th {
      @apply py-7 text-base font-normal text-black border-0 border-solid border-b border-grey-300;

      &:not(td) {
        @apply py-4 text-grey-250 border-grey-200;
      }

      &:first-of-type {
        @apply px-1 w-11;

        .easy-checkbox {
          input.allSelected,
          input.partSelected,
          input:checked {
            & + label::before {
              @apply bg-brand;
            }

            & + label::after {
              transform: translate(4px, 8px);
            }

            &:not(.partSelected) + label::after {
              height: 5px;
              width: 9px;
              transform: translate(4.5px, 4.5px) rotate(-45deg);
            }
          }

          label {
            &::before {
              @apply w-[18px] h-[18px] rounded bg-grey-230 border-0;
            }
          }
        }
      }
    }
  }
}
</style>