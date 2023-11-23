<script setup lang="ts">
import Chip from "primevue/chip";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useLoading } from "@hooks";
import { useResourceTagsStore } from "@stores/resources/tags";
import type { IResourceTag } from "@app-types/resources";
import { useToast } from "vue-toastification";

interface Props {
  title: string;
  tags: IResourceTag[];
}

const tagsStore = useResourceTagsStore();
const { deleteTag } = tagsStore;

defineProps<Props>();

const [isLoading, setLoading] = useLoading();

const tagRemoveHandler = async (id: number) => {
  setLoading.start();
  await deleteTag(id);
  setLoading.stop();
  useToast().success("Tag deleted successfully");
};
</script>

<template>
  <div :class="{ 'loading-faded': isLoading }">
    <WidgetTypography variant="title" class="mb-2">
      {{ title }}
    </WidgetTypography>

    <p v-if="!tags.length" class="text-gray-600">No Tags added yet.</p>

    <div class="flex gap-x-2 gap-y-3 mx-2 tags" v-else>
      <Chip
        v-for="tag in tags"
        :key="tag.id"
        :label="tag.name"
        @remove="() => tagRemoveHandler(tag.id)"
        removable
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.tags) .p-chip {
  @apply font-semibold px-3;

  &-remove-icon {
    @apply ml-3;

    &:hover {
      @apply text-red-600;
    }
  }
}
</style>
