<script setup lang="ts">
import { computed, provide } from "vue";
import { useSuppliersStore } from "@stores/suppliers/suppliers";
import TabView, { type TabViewClickEvent } from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import router, { DashboardRouteNames } from "@router";
import { editSupplierInjectionKey } from "@utils/injectionKeys";
import SupplierForm from "@dashboard-views/suppliers/SupplierForm.vue";
import SupplierDocuments from "@dashboard-views/suppliers/edit-supplier/tabs/supplier-documents/SupplierDocuments.vue";
import SupplierContacts from "@dashboard-views/suppliers/edit-supplier/tabs/supplier-contacts/SupplierContacts.vue";
import SupplierItems from "@dashboard-views/suppliers/edit-supplier/tabs/supplier-items/SupplierItems.vue";

const suppliersStore = useSuppliersStore();
const { supplier } = storeToRefs(suppliersStore);
const supplierId = parseInt(useRoute().params.id as string);
const tabQuery = useRoute().query["tab"]?.toString();
const activeTab = computed(() => (tabQuery ? parseInt(tabQuery) : 0));

provide(editSupplierInjectionKey, { supplier, supplierId });

const onTabChange = (e: TabViewClickEvent) => {
  router.replace({
    name: DashboardRouteNames.editSupplier,
    params: { id: supplierId },
    query: { tab: e.index },
  });
};
</script>

<template>
  <RouterLink
    class="hover:underline text-sm"
    :to="{ name: DashboardRouteNames.allSuppliers }"
  >
    <i class="pi pi-arrow-left lg:text-xs sm:text-lg mr-1"></i> Back to All
    Suppliers
  </RouterLink>

  <section class="mt-8">
    <div class="wrapper">
      <TabView
        class="my-4"
        @tab-change="onTabChange"
        :activeIndex="activeTab"
        lazy
      >
        <TabPanel header="Profile"> <SupplierForm /></TabPanel>
        <TabPanel header="Contacts"> <SupplierContacts /> </TabPanel>
        <TabPanel header="Items"> <SupplierItems /> </TabPanel>
        <TabPanel header="Documents"><SupplierDocuments /> </TabPanel>
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
