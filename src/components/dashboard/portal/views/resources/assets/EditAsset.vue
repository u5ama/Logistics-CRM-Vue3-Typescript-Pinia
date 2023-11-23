<script setup lang="ts">
import { computed, provide } from "vue";
import TabView, { type TabViewClickEvent } from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import router, { DashboardRouteNames } from "@router";
import { editAssetInjectionKey } from "@utils/injectionKeys";
import { useResourceAssetsStore } from "@stores/resources/assets";
import AssetsForm from "@dashboard-views/resources/assets/AssetsForm.vue";
import AssetDocuments from "@dashboard-views/resources/assets/tabs/asset-documents/AssetDocuments.vue";
import AssetSubcontractor from "@dashboard-views/resources/assets/tabs/asset-subcontractors/AssetSubcontractor.vue";
import AssetCommunication from "@dashboard-views/resources/assets/tabs/asset-communication/AssetCommunication.vue";

const assetStore = useResourceAssetsStore();
const { asset } = storeToRefs(assetStore);
const assetId = parseInt(useRoute().params.id as string);
const tabQuery = useRoute().query["tab"]?.toString();
const activeTab = computed(() => (tabQuery ? parseInt(tabQuery) : 0));

provide(editAssetInjectionKey, { asset, assetId });
const onTabChange = (e: TabViewClickEvent) => {
  router.replace({
    name: DashboardRouteNames.editAsset,
    params: { id: assetId },
    query: { tab: e.index },
  });
};
</script>

<template>
  <RouterLink
    class="hover:underline text-sm"
    :to="{ name: DashboardRouteNames.allAssets }"
  >
    <i class="pi pi-arrow-left text-xs mr-1"></i> Back to All Assets
  </RouterLink>

  <section class="mt-8">
    <div class="wrapper">
      <TabView
        class="my-4"
        @tab-change="onTabChange"
        :activeIndex="activeTab"
        lazy
      >
        <TabPanel header="Assets"><AssetsForm /></TabPanel>
        <TabPanel header="Documents"><AssetDocuments /></TabPanel>
        <TabPanel header="Subcontractors"><AssetSubcontractor /></TabPanel>
        <TabPanel header="Communication"><AssetCommunication /></TabPanel>
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
