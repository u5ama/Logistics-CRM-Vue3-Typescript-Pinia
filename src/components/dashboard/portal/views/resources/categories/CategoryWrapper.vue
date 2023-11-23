<script setup lang="ts">
import Chip from "primevue/chip";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useLoading } from "@hooks";
import type { IResourceCategory } from "@app-types/resources";
import { useToast } from "vue-toastification";
import { useResourceCategoriesStore } from "@stores/resources/categories";
interface Props {
  title: string;
  categories: IResourceCategory[];
}

const categoriesStore = useResourceCategoriesStore();
const { deleteCategory } = categoriesStore;

defineProps<Props>();

const [isLoading, setLoading] = useLoading();
const categoryRemoveHandler = async (id: number) => {
  setLoading.start();
  await deleteCategory(id);
  setLoading.stop();
  useToast().success("Tag Category deleted successfully");
};
</script>

<template>
  <div :class="{ 'loading-faded': isLoading }">
    <WidgetTypography variant="title" class="mb-2">
      {{ title }}
    </WidgetTypography>

    <p v-if="!categories.length" class="text-gray-600">
      No Category added yet.
    </p>

    <div class="flex gap-x-2 gap-y-3 mx-2 skills mt-4" v-else>
      <Chip
        v-for="category in categories"
        :key="category.id"
        :label="category.name"
        @remove="() => categoryRemoveHandler(category.id)"
        removable
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.skills) .p-chip {
  @apply font-semibold px-3;
  &-remove-icon {
    @apply ml-3;

    &:hover {
      @apply text-red-600;
    }
  }
}
</style>
