<script setup lang="ts">
import router, { DashboardRouteNames } from "@router";
import { useRoute } from "vue-router";
import { computed, provide } from "vue";
import TabView, { type TabViewClickEvent } from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import SubcontractorDocuments from "@dashboard-views/subcontractors/edit-subcontractor/tabs/subcontractor-documents/SubcontractorDocuments.vue";
import { editSubcontractorInjectionKey } from "@utils/injectionKeys";
import { storeToRefs } from "pinia";
import { useSubcontractorsStore } from "@stores/subcontractors/subcontractors";
import EditSubcontractorForm from "@dashboard-views/subcontractors/edit-subcontractor/tabs/edit-profile/EditSubcontractorForm.vue";
import SubcontractorDriver from "@dashboard-views/subcontractors/edit-subcontractor/tabs/subcontractor-driver/SubcontractorDriver.vue";
const subcontractorsStore = useSubcontractorsStore();
const { subcontractor } = storeToRefs(subcontractorsStore);
const subcontractorId = parseInt(useRoute().params.id as string);
const tabQuery = useRoute().query["tab"]?.toString();
const activeTab = computed(() => (tabQuery ? parseInt(tabQuery) : 0));

provide(editSubcontractorInjectionKey, { subcontractor, subcontractorId });
const onTabChange = (e: TabViewClickEvent) => {
  router.replace({
    name: DashboardRouteNames.editSubcontractor,
    params: { id: subcontractorId },
    query: { tab: e.index },
  });
};
</script>

<template>
  <RouterLink
    class="hover:underline text-sm"
    :to="{ name: DashboardRouteNames.subcontractors }"
  >
    <i class="pi pi-arrow-left text-xs mr-1"></i> Back to All Subcontractors
  </RouterLink>

  <section class="mt-8">
    <div class="wrapper">
      <TabView
        class="my-4"
        @tab-change="onTabChange"
        :activeIndex="activeTab"
        lazy
      >
        <TabPanel header="Edit Profile"> <EditSubcontractorForm /></TabPanel>
        <TabPanel header="Drivers"> <SubcontractorDriver /> </TabPanel>
        <TabPanel header="Documents"> <SubcontractorDocuments /> </TabPanel>
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
