<script setup lang="ts">
import { computed, provide } from "vue";
import { useClientsStore } from "@stores/clients/clients";
import TabView, { type TabViewClickEvent } from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import router, { DashboardRouteNames } from "@router";
import { editClientInjectionKey } from "@utils/injectionKeys";
import ClientForm from "@dashboard-views/clients/ClientForm.vue";
import ClientDocuments from "@dashboard-views/clients/edit-client/tabs/client-documents/ClientDocuments.vue";
import ClientInvoices from "@dashboard-views/clients/edit-client/tabs/client-invoices/ClientInvoices.vue";
import ClientContacts from "@dashboard-views/clients/edit-client/tabs/client-contacts/ClientContacts.vue";

const clientsStore = useClientsStore();
const { client } = storeToRefs(clientsStore);
const clientId = parseInt(useRoute().params.id as string);
const tabQuery = useRoute().query["tab"]?.toString();
const activeTab = computed(() => (tabQuery ? parseInt(tabQuery) : 0));

provide(editClientInjectionKey, { client, clientId });

const onTabChange = (e: TabViewClickEvent) => {
  router.replace({
    name: DashboardRouteNames.editClient,
    params: { id: clientId },
    query: { tab: e.index },
  });
};
</script>

<template>
  <RouterLink
    class="hover:underline text-sm"
    :to="{ name: DashboardRouteNames.allClients }"
  >
    <i class="pi pi-arrow-left text-xs mr-1"></i> Back to All Customers
  </RouterLink>

  <section class="mt-8">
    <div class="wrapper">
      <TabView
        class="my-4"
        @tab-change="onTabChange"
        :activeIndex="activeTab"
        lazy
      >
        <TabPanel header="Profile"> <ClientForm /></TabPanel>
        <TabPanel header="Contacts"><ClientContacts /> </TabPanel>
        <TabPanel header="Documents"><ClientDocuments /> </TabPanel>
        <TabPanel header="Invoices"><ClientInvoices /> </TabPanel>
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
