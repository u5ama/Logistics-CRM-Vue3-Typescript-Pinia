<script setup lang="ts">
import { computed, provide } from "vue";
import TabView, { type TabViewClickEvent } from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import router, { DashboardRouteNames } from "@router";
import { editAttachmentInjectionKey } from "@utils/injectionKeys";
import { useAttachmentsStore } from "@stores/resources/attachments";
import AttachmentForm from "@dashboard-views/resources/attachments/AttachmentForm.vue";
import AttachmentDocuments from "@dashboard-views/resources/attachments/tabs/attachment-documents/AttachmentDocuments.vue";

const attachmentStore = useAttachmentsStore();
const { attachment } = storeToRefs(attachmentStore);
const attachmentId = parseInt(useRoute().params.id as string);
const tabQuery = useRoute().query["tab"]?.toString();
const activeTab = computed(() => (tabQuery ? parseInt(tabQuery) : 0));

provide(editAttachmentInjectionKey, { attachment, attachmentId });
const onTabChange = (e: TabViewClickEvent) => {
  router.replace({
    name: DashboardRouteNames.editAttachment,
    params: { id: attachmentId },
    query: { tab: e.index },
  });
};
</script>

<template>
  <RouterLink
    class="hover:underline text-sm"
    :to="{ name: DashboardRouteNames.allAttachments }"
  >
    <i class="pi pi-arrow-left text-xs mr-1"></i> Back to All Attachments
  </RouterLink>

  <section class="mt-8">
    <div class="wrapper">
      <TabView
        class="my-4"
        @tab-change="onTabChange"
        :activeIndex="activeTab"
        lazy
      >
        <TabPanel header="Attachment"><AttachmentForm /></TabPanel>
        <TabPanel header="Documents"><AttachmentDocuments /></TabPanel>
      </TabView>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.wrapper :deep(*) {
  &.p-tabview {
    @apply rounded overflow-hidden;

    &-nav {
      @apply bg-transparent justify-center;

      &-link {
        @apply grid place-content-center;
      }
    }
    &-header {
      min-width: 144px;
    }

    &-panels {
      @apply bg-transparent;
    }
  }
}
</style>
