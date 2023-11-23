<script setup lang="ts">
import { computed, provide } from "vue";
import { useDriversStore } from "@stores/drivers/drivers";
import TabView, { type TabViewClickEvent } from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import router, { DashboardRouteNames } from "@router";
import { editDriverInjectionKey } from "@utils/injectionKeys";
import DriverJobDocuments from "@dashboard-views/admin_drivers/edit-drivers/tabs/view-documents/DriverJobDocuments.vue";
import AllJobs from "@dashboard-views/admin_drivers/edit-drivers/tabs/view-job/AllJobs.vue";

const driversStore = useDriversStore();
const { driver } = storeToRefs(driversStore);
const driverId = parseInt(useRoute().params.id as string);
const tabQuery = useRoute().query["tab"]?.toString();
const activeTab = computed(() => (tabQuery ? parseInt(tabQuery) : 0));

provide(editDriverInjectionKey, { driver, driverId });

const onTabChange = (e: TabViewClickEvent) => {
  router.replace({
    name: DashboardRouteNames.editDriver,
    params: { id: driverId },
    query: { tab: e.index },
  });
};
</script>

<template>
  <RouterLink
    class="hover:underline text-sm"
    :to="{ name: DashboardRouteNames.allDrivers }"
  >
    <i class="pi pi-arrow-left text-xs mr-1"></i> Back to All Drivers
  </RouterLink>
  <section class="mt-8">
    <div class="wrapper">
      <TabView
        class="my-4"
        @tab-change="onTabChange"
        :activeIndex="activeTab"
        lazy
      >
        <TabPanel header="Jobs"><AllJobs /></TabPanel>
        <TabPanel header="Documents"><DriverJobDocuments /></TabPanel>
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
