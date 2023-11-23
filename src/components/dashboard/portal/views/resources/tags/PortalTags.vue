<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import Button from "primevue/button";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useLoading, useModal } from "@hooks";
import { useResourceTagsStore } from "@stores/resources/tags";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import AddNewTagModal from "./AddNewTagModal.vue";
import { ResourceTagType } from "@app-types/resources";
import TagsWrapper from "./TagsWrapper.vue";

const tagsStore = useResourceTagsStore();
const { assetTags, attachmentTags, competencyTags, resourceTags } =
  storeToRefs(tagsStore);
const { getAllTags } = tagsStore;

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  setLoading.start();
  await getAllTags(ResourceTagType.Asset);
  await getAllTags(ResourceTagType.Attachment);
  await getAllTags(ResourceTagType.Competency);
  await getAllTags(ResourceTagType.Resource);
  setLoading.stop();
};

const [isLoading, setLoading] = useLoading();
const [isAddModalOpen, addModal] = useModal();
</script>

<template>
  <PortalWidget class="widget">
    <div class="flex justify-between items-center mb-7">
      <div class="">
        <WidgetTypography variant="title" class="mb-1">
          Resources Tags
        </WidgetTypography>
      </div>
      <div class="flex gap-x-2">
        <Button
          icon="pi pi-plus"
          class="p-button-rounded p-button-success mr-1"
          @click="addModal.open"
          v-tooltip.left="'Add new Tag'"
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
      <TagsWrapper title="Attachment Tags" :tags="attachmentTags" />
      <TagsWrapper title="Asset Tags" :tags="assetTags" />
      <TagsWrapper title="Competency Tags" :tags="competencyTags" />
      <TagsWrapper title="Resource Tags" :tags="resourceTags" />
    </div>
  </PortalWidget>

  <AddNewTagModal :isOpen="isAddModalOpen" @close="addModal.close" />
</template>

<style lang="scss" scoped>
.widget {
  min-height: 500px;
}
</style>
