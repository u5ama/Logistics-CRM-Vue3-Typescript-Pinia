<script setup lang="ts">
import { computed, provide } from "vue";
import { useChecklistsStore } from "@stores/checklists/checklists";
import TabView, { type TabViewClickEvent } from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import router, { DashboardRouteNames } from "@router";
import { editChecklistInjectionKey } from "@utils/injectionKeys";
import ChecklistForm from "@dashboard-views/checklists/ChecklistForm.vue";

const checklistsStore = useChecklistsStore();
const { checklist } = storeToRefs(checklistsStore);
const checklistId = parseInt(useRoute().params.id as string);
const tabQuery = useRoute().query["tab"]?.toString();
const activeTab = computed(() => (tabQuery ? parseInt(tabQuery) : 0));

provide(editChecklistInjectionKey, { checklist, checklistId });

const onTabChange = (e: TabViewClickEvent) => {
  router.replace({
    name: DashboardRouteNames.editChecklist,
    params: { id: checklistId },
    query: { tab: e.index },
  });
};
</script>

<template>
  <RouterLink
    class="hover:underline text-sm"
    :to="{ name: DashboardRouteNames.allChecklists }"
  >
    <i class="pi pi-arrow-left text-xs mr-1"></i> Back to All Checklists
  </RouterLink>

  <section class="mt-8">
    <div class="wrapper">
      <TabView
        class="my-4"
        @tab-change="onTabChange"
        :activeIndex="activeTab"
        lazy
      >
        <TabPanel header="Update Checklist"> <ChecklistForm /></TabPanel>
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
