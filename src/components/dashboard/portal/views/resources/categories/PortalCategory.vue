<script setup lang="ts">
import { onMounted } from "vue";
import Button from "primevue/button";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useLoading, useModal } from "@hooks";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import { storeToRefs } from "pinia";
import { useResourceCategoriesStore } from "@stores/resources/categories";
import CategoryWrapper from "@dashboard-views/resources/categories/CategoryWrapper.vue";
import AddNewCategoryModal from "@dashboard-views/resources/categories/AddNewCategoryModal.vue";

const categoriesStore = useResourceCategoriesStore();
const { categories } = storeToRefs(categoriesStore);
const { getAllCategories } = categoriesStore;

onMounted(() => {
  fetchData();
});
const fetchData = async () => {
  setLoading.start();
  await getAllCategories();
  setLoading.stop();
};

const [isLoading, setLoading] = useLoading();
const [isAddCategoryModalOpen, addCategoryModal] = useModal();
</script>

<template>
  <PortalWidget class="widget">
    <div class="flex justify-between items-center mb-7">
      <div class="">
        <WidgetTypography variant="title" class="mb-1">
          Tag Categories
        </WidgetTypography>
      </div>
      <div class="flex gap-x-2">
        <Button
          icon="pi pi-plus"
          class="p-button-rounded p-button-success mr-1"
          @click="addCategoryModal.open"
          v-tooltip.left="'Add new Category'"
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

    <div class="flex flex-col gap-y-8" v-else>
      <CategoryWrapper title="All Categories" :categories="categories" />
    </div>
  </PortalWidget>
  <AddNewCategoryModal
    :isOpen="isAddCategoryModalOpen"
    @close="addCategoryModal.close"
  />
</template>

<style lang="scss" scoped>
.widget {
  min-height: 500px;
}
</style>
