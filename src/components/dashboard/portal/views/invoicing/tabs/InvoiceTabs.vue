<script setup lang="ts">
import { useRoute } from "vue-router";
import router, { DashboardRouteNames } from "@router";
import { computed, provide } from "vue";
import { editInvoiceInjectionKey } from "@utils/injectionKeys";
import TabView, { type TabViewClickEvent } from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { storeToRefs } from "pinia";
import EditInvoice from "@dashboard-views/invoicing/edit-invoice/EditInvoice.vue";
import { useInvoicesStore } from "@stores/invoicing/invoices";
import AssignInvoices from "@dashboard-views/invoicing/tabs/Incoming/AssignInvoices.vue";

const invoicesStore = useInvoicesStore();
const { invoice } = storeToRefs(invoicesStore);
const invoiceId = parseInt(useRoute().params.id as string);
// const isEditing = !!invoiceId;

const tabQuery = useRoute().query["tab"]?.toString();
const activeTab = computed(() => (tabQuery ? parseInt(tabQuery) : 0));

provide(editInvoiceInjectionKey, { invoice, invoiceId });

const onTabChange = (e: TabViewClickEvent) => {
  router.replace({
    name: DashboardRouteNames.editInvoice,
    params: { id: invoiceId },
    query: { tab: e.index },
  });
};
</script>

<template>
  <RouterLink
    class="hover:underline text-sm"
    :to="{ name: DashboardRouteNames.allInvoices }"
  >
    <i class="pi pi-arrow-left text-xs mr-1"></i> Back to All Invoices
  </RouterLink>
  <section class="mt-8">
    <div class="wrapper">
      <TabView
        class="my-4"
        @tab-change="onTabChange"
        :activeIndex="activeTab"
        lazy
      >
        <TabPanel header="Edit Invoice"><EditInvoice /></TabPanel>
        <TabPanel header="Incoming Invoices"><AssignInvoices /></TabPanel>
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
