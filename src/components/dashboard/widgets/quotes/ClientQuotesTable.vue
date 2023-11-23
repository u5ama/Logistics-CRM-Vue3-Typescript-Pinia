<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef } from "vue";
import { useClientQuotesStore } from "@stores/client-quotes/client-quotes";
import router, { DashboardRouteNames } from "@router";
import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";
import type { Header, Item } from "vue3-easy-data-table";
import DataTable from "@dashboard/ui/DataTable.vue";
import { storeToRefs } from "pinia";
import { useLoading } from "@hooks";
import Button from "primevue/button";

const clientQuotesStore = useClientQuotesStore();
const { quotes } = storeToRefs(clientQuotesStore);
const { getAllClientQuotes } = clientQuotesStore;

onMounted(() => {
  getAllClientQuotes();
});

const headers: Header[] = [
  { text: "ID", value: "id" },
  { text: "Name", value: "quote_name", sortable: true },
  { text: "Job", value: "job_title", sortable: true },
  { text: "Location", value: "location", sortable: true },
  { text: "Price", value: "total_price", sortable: true },
  { text: "Status", value: "status", sortable: true },
  { text: "Created At", value: "date_added" },
  { text: "Actions", value: "actions" },
];

const parsedItems = computed(() =>
  [...quotes.value]
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .map((quote) => ({
      date_added: new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(quote.created_at)),
      ...quote,
    }))
);

const items: ComputedRef<Item[]> = parsedItems;
const actions = [{ icon: "pi pi-eye", tooltip: "Check Quote", emit: "check" }];

const [isLoading, setLoading] = useLoading();

const reloadHandler = async () => {
  setLoading.start();
  await getAllClientQuotes();
  setLoading.stop();
};

const checkQuoteHandler = (quoteId: number) => {
  router.push({
    name: DashboardRouteNames.checkClientQuote,
    params: { id: quoteId },
    query: { tab: 0 },
  });
};
const searchQuery = ref("");
</script>

<template>
  <PortalWidget>
    <div class="flex justify-between mb-7">
      <div class="">
        <WidgetTypography variant="title" class="mb-1">
          User Quotes Information
        </WidgetTypography>
      </div>
      <div class="flex gap-x-2">
        <Button
          icon="pi pi-replay"
          class="p-button-rounded p-button-secondary -rotate-45"
          @click="reloadHandler"
          v-tooltip.top="'Reload Data'"
          :loading="isLoading"
        />
      </div>
    </div>
    <div class="flex mb-2 justify-end">
      <div class="flex gap-2 items-center">
        <label class="font-medium" for="searchQuery">Search Quote</label>
        <input
          class="rounded border border-gray-500 py-2 px-4"
          id="searchQuery"
          v-model="searchQuery"
        />
      </div>
    </div>
    <DataTable
      :loading="isLoading"
      :headers="headers"
      :items="items"
      :actions="actions"
      sort-by="date_added"
      @check="checkQuoteHandler"
      :hideFooter="false"
      :searchValue="searchQuery"
      buttonsPagination
    />
  </PortalWidget>
</template>

<style lang="scss" scoped></style>
