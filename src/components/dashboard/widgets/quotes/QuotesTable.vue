<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef } from "vue";
import { useQuotesStore } from "@stores/quotes/quotes";
import router, { DashboardRouteNames } from "@router";
import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";
import type { Header, Item } from "vue3-easy-data-table";
import DataTable from "@dashboard/ui/DataTable.vue";
import { storeToRefs } from "pinia";
import { useLoading, useModal } from "@hooks";
import Button from "primevue/button";
import QuoteConfirmDeleteDialog from "@dashboard-views/quotes/components/QuoteConfirmDeleteDialog.vue";

const quoteStore = useQuotesStore();
const { quotes } = storeToRefs(quoteStore);
const { quote } = storeToRefs(quoteStore);
const { getAllQuotes, getQuote } = quoteStore;

onMounted(() => {
  getAllQuotes();
});

const headers: Header[] = [
  { text: "ID", value: "quote_id" },
  { text: "Name", value: "quote_name", sortable: true },
  { text: "Job", value: "job_title", sortable: true },
  { text: "Customer", value: "client_name", sortable: true },
  { text: "Location", value: "location", sortable: true },
  { text: "Status", value: "quote_status" },
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
const actions = [
  { icon: "pi pi-eye", tooltip: "Check Quote", emit: "check" },
  { icon: "pi pi-pencil", tooltip: "Edit Quote", emit: "edit" },
  { icon: "pi pi-trash", tooltip: "Delete Quote", emit: "delete" },
];

const selectedItem = ref();

const [isLoading, setLoading] = useLoading();
const [isDeleteModalOpen, deleteDialog] = useModal();

const openConfirmDeleteDialog = async (quoteId: number) => {
  await getQuote(quoteId);
  selectedItem.value = { ...quote };
  if (selectedItem.value) {
    deleteDialog.open();
  }
};

const reloadHandler = async () => {
  setLoading.start();
  await getAllQuotes();
  setLoading.stop();
};

const editQuoteHandler = (quoteId: number) => {
  router.push({
    name: DashboardRouteNames.editQuote,
    params: { id: quoteId },
    query: { tab: 0 },
  });
};

const checkQuoteHandler = (quoteId: number) => {
  router.push({
    name: DashboardRouteNames.checkQuote,
    params: { id: quoteId },
  });
};

const searchQuery = ref("");
</script>

<template>
  <PortalWidget>
    <div class="flex justify-between mb-7">
      <div class="">
        <WidgetTypography variant="title" class="mb-1">
          Quotes Information
        </WidgetTypography>
      </div>
      <div class="flex gap-x-2">
        <RouterLink :to="{ name: DashboardRouteNames.newQuote }">
          <Button
            icon="pi pi-plus"
            class="p-button-rounded p-button-success"
            v-tooltip.left="'Create New Quote'"
          />
        </RouterLink>
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
      @edit="editQuoteHandler"
      @check="checkQuoteHandler"
      @delete="openConfirmDeleteDialog"
      :hideFooter="false"
      :searchValue="searchQuery"
      buttonsPagination
    />
  </PortalWidget>
  <QuoteConfirmDeleteDialog
    :isOpen="isDeleteModalOpen"
    :selectedItem="quote"
    @close="deleteDialog.close"
  />
</template>

<style lang="scss" scoped></style>
