<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import Button from "primevue/button";
import { storeToRefs } from "pinia";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import { useLoading, useModal } from "@hooks";
import { useSupplierItemsStore } from "@stores/suppliers/items";
import { FilterMatchMode } from "primevue/api";
import type { ISupplierItems } from "@/types/supplier";
import PortalWidget from "@dashboard/widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import ItemFormModal from "@dashboard-views/suppliers/edit-supplier/tabs/supplier-items/AddItemModal.vue";
import { editSupplierInjectionKey } from "@utils/injectionKeys";
import InputText from "primevue/inputtext";
import ItemsTable from "@dashboard-views/suppliers/edit-supplier/tabs/supplier-items/ItemsTable.vue";
import SupplierItemConfirmDeleteDialog from "@dashboard-views/suppliers/edit-supplier/tabs/supplier-items/SupplierItemConfirmDeleteDialog.vue";

const itemStore = useSupplierItemsStore();
const { items } = storeToRefs(itemStore);
const { getAllItems } = itemStore;
const { supplierId } = inject(editSupplierInjectionKey)!;

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  setLoading.start();
  await getAllItems(supplierId);
  setLoading.stop();
};

const [isLoading, setLoading] = useLoading();

const [isDeleteModalOpen, deleteDialog] = useModal();
const [isFormModalOpen, formModal] = useModal();

const selectedItem = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const openAddNewModal = () => {
  selectedItem.value = {};
  formModal.open();
};

const openEditModal = (item: ISupplierItems) => {
  selectedItem.value = { ...item };
  formModal.open();
};

const openConfirmDeleteDialog = (item: ISupplierItems) => {
  selectedItem.value = { ...item };
  deleteDialog.open();
};
</script>

<template>
  <PortalWidget class="widget">
    <div class="flex justify-between items-center mb-7">
      <div class="">
        <WidgetTypography variant="title" class="mb-1">
          Supplier Items Information
        </WidgetTypography>
      </div>
      <div class="flex gap-x-2">
        <Button
          icon="pi pi-plus"
          class="p-button-rounded p-button-success mr-1"
          @click="openAddNewModal"
          v-tooltip.left="'Add Items'"
        />
        <Button
          icon="pi pi-replay"
          class="p-button-rounded p-button-secondary -rotate-45"
          @click="fetchData"
          v-tooltip.top="'Reload Data'"
          :loading="isLoading"
        />
      </div>
    </div>

    <SimpleLoader class="mt-20" v-if="isLoading" />

    <div class="" v-else>
      <div class="flex mb-3 justify-end">
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="filters['global'].value"
            placeholder="Search Item"
          />
        </span>
      </div>
      <ItemsTable
        :filters="filters"
        :items="items"
        @edit="openEditModal"
        @delete="openConfirmDeleteDialog"
      />
    </div>
  </PortalWidget>
  <ItemFormModal
    :isOpen="isFormModalOpen"
    :selectedItem="selectedItem"
    @close="formModal.close"
  />
  <SupplierItemConfirmDeleteDialog
    :isOpen="isDeleteModalOpen"
    :selectedItem="selectedItem"
    @close="deleteDialog.close"
  />
</template>

<style lang="scss" scoped>
.wrapper :deep(*) {
  .p-panel-content {
    height: 500px;
    overflow-y: scroll;
  }
}
</style>
