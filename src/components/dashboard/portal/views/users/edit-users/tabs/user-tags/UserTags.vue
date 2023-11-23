<script setup lang="ts">
import { inject, onMounted } from "vue";
import { storeToRefs } from "pinia";
import Button from "primevue/button";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useLoading, useModal } from "@hooks";
import AddNewTagModal from "./AddTagModal.vue";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import TagsWrapper from "./TagsWrapper.vue";
import { UserTagType } from "@/types/user";
import { useUserTagsStore } from "@stores/users/tags";
import { editUserInjectionKey } from "@utils/injectionKeys";

const userTagsStore = useUserTagsStore();
const { tags, competencyTags } = storeToRefs(userTagsStore);
const { getAllUserTags } = userTagsStore;

onMounted(() => {
  fetchData();
});
const { userId } = inject(editUserInjectionKey)!;

const fetchData = async () => {
  setLoading.start();
  await getAllUserTags(userId, UserTagType.UserTag);
  await getAllUserTags(userId, UserTagType.Competency);
  setLoading.stop();
};

const [isLoading, setLoading] = useLoading();
const [isAddModalOpen, addModal] = useModal();
</script>

<template>
  <PortalWidget class="widget">
    <div class="flex justify-between items-center mb-7">
      <div class="">
        <WidgetTypography variant="title" class="mb-1"> Tags </WidgetTypography>
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
      <TagsWrapper title="User Tags" :tags="tags" />
      <TagsWrapper title="Competency Tags" :tags="competencyTags" />
    </div>
  </PortalWidget>

  <AddNewTagModal :isOpen="isAddModalOpen" @close="addModal.close" />
</template>

<style lang="scss" scoped>
.widget {
  min-height: 500px;
}
</style>
