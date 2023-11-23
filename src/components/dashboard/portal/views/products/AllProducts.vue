<script setup lang="ts">
import { onMounted, ref } from "vue";
import { FilterMatchMode } from "primevue/api";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useLoading, useModal } from "@hooks";
import { useProductsStore } from "@stores/products";
import { storeToRefs } from "pinia";
import type { IProducts } from "@app-types/products";
import ProductsTable from "./components/ProductsTable.vue";
import ProductFormModal from "./components/ProductFormModal.vue";
import ProductConfirmDeleteDialog from "./components/ProductConfirmDeleteDialog.vue";
import SimpleLoader from "@components/UI/SimpleLoader.vue";

const productsStore = useProductsStore();
const { products } = storeToRefs(productsStore);
const { getAllProducts } = productsStore;

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  setLoading.start();
  await getAllProducts();
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

const openEditModal = (item: IProducts) => {
  selectedItem.value = { ...item };
  formModal.open();
};

const openConfirmDeleteDialog = (item: IProducts) => {
  selectedItem.value = { ...item };
  deleteDialog.open();
};
</script>

<template>
  <section class="widgets">
    <PortalWidget class="widget">
      <div class="flex justify-between items-center mb-7">
        <div class="">
          <WidgetTypography variant="title" class="mb-1">
            All Products
          </WidgetTypography>
        </div>
        <div class="flex gap-x-2">
          <Button
            icon="pi pi-plus"
            class="p-button-rounded p-button-success"
            @click="openAddNewModal"
            v-tooltip.left="'Add new product'"
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
          <span class="p-input-icon-left searchSize">
            <i class="pi pi-search" />
            <InputText
              class="searchSize"
              v-model="filters['global'].value"
              placeholder="Search Products"
            />
          </span>
        </div>
        <ProductsTable
          :filters="filters"
          :products="products"
          @edit="openEditModal"
          @delete="openConfirmDeleteDialog"
        />
      </div>
    </PortalWidget>
    <ProductFormModal
      :isOpen="isFormModalOpen"
      :selectedItem="selectedItem"
      @close="formModal.close"
    />
    <ProductConfirmDeleteDialog
      :isOpen="isDeleteModalOpen"
      :selectedItem="selectedItem"
      @close="deleteDialog.close"
    />
  </section>
</template>

<style lang="scss" scoped>
.widgets {
  @apply grid gap-8;
  .invoices {
    min-height: 400px;
  }
}
</style>
<style scoped>
@media only screen and (max-width: 600px) {
    .searchSize {
        width: 100% !important;
    }
}
</style>
