<script setup lang="ts">
import router, { DashboardRouteNames } from "@router";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { computed, provide } from "vue";
import { editQuoteInjectionKey } from "@utils/injectionKeys";
import TabView, { type TabViewClickEvent } from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { useQuotesStore } from "@stores/quotes/quotes";
import EditQuoteForm from "@dashboard-views/quotes/edit-quote/tabs/quote-edit/EditQuoteForm.vue";
import QuoteDocuments from "@dashboard-views/quotes/edit-quote/tabs/quote-documents/QuoteDocuments.vue";

const quotesStore = useQuotesStore();
const { quote } = storeToRefs(quotesStore);
const quoteId = parseInt(useRoute().params.id as string);
const tabQuery = useRoute().query["tab"]?.toString();
const activeTab = computed(() => (tabQuery ? parseInt(tabQuery) : 0));

provide(editQuoteInjectionKey, { quote, quoteId });

const onTabChange = (e: TabViewClickEvent) => {
  router.replace({
    name: DashboardRouteNames.editQuote,
    params: { id: quoteId },
    query: { tab: e.index },
  });
};
</script>

<template>
  <RouterLink
    class="hover:underline text-sm"
    :to="{ name: DashboardRouteNames.allQuotes }"
  >
    <i class="pi pi-arrow-left text-xs mr-1"></i> Back to All Quotes
  </RouterLink>
  <section class="mt-8">
    <div class="wrapper">
      <TabView
        class="my-4"
        @tab-change="onTabChange"
        :activeIndex="activeTab"
        lazy
      >
        <TabPanel header="Quote"><EditQuoteForm /></TabPanel>
        <TabPanel header="Document"><QuoteDocuments /></TabPanel>
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
