<script setup lang="ts">
import { computed, type ComputedRef, inject, onMounted, ref } from "vue";
import Button from "primevue/button";
import { storeToRefs } from "pinia";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useClientInvoicesStore } from "@stores/clients/clientInvoices";
import type { Header, Item } from "vue3-easy-data-table";
import DataTable from "@dashboard/ui/DataTable.vue";
import { editClientInjectionKey } from "@utils/injectionKeys";
import { useLoading } from "@hooks";
import router, { DashboardRouteNames } from "@router";

const invoicesStore = useClientInvoicesStore();
const { invoices } = storeToRefs(invoicesStore);
const { getAllInvoices } = invoicesStore;
const [isLoading, setLoading] = useLoading();
const { clientId } = inject(editClientInjectionKey)!;

const fetchDocuments = async () => {
  setLoading.start();
  await getAllInvoices(clientId);
  setLoading.stop();
};

onMounted(async () => {
  await fetchDocuments();
});

const headers: Header[] = [
  { text: "ID", value: "id" },
  { text: "Name", value: "invoice_name", sortable: true },
  { text: "Customer", value: "client_name", sortable: true },
  { text: "Job", value: "job_title", sortable: true },
  { text: "Created At", value: "date_added" },
  { text: "Actions", value: "actions" },
];

const parsedItems = computed(() =>
  [...invoices.value]
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .map((invoice) => ({
      date_added: new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(invoice.created_at)),
      ...invoice,
    }))
);

const items: ComputedRef<Item[]> = parsedItems;
const actions = [
  { icon: "pi pi-eye", tooltip: "Check Invoice", emit: "check" },
  { icon: "pi pi-pencil", tooltip: "Edit Invoice", emit: "edit" },
];

const reloadHandler = async () => {
  setLoading.start();
  await getAllInvoices(clientId);
  setLoading.stop();
};

const editInvoiceHandler = (invoiceId: number) => {
  router.push({
    name: DashboardRouteNames.editInvoice,
    params: { id: invoiceId },
    query: { tab: 0 },
  });
};

const checkInvoiceHandler = (invoiceId: number) => {
  router.push({
    name: DashboardRouteNames.checkInvoice,
    params: { id: invoiceId },
  });
};

const searchQuery = ref("");
</script>

<template>
  <PortalWidget>
    <div class="flex justify-between mb-7">
      <div class="">
        <WidgetTypography variant="title" class="mb-1">
          Invoices
        </WidgetTypography>
      </div>
      <div class="flex gap-x-2">
        <RouterLink :to="{ name: DashboardRouteNames.newInvoice }">
          <Button
            icon="pi pi-plus"
            class="p-button-rounded p-button-success"
            v-tooltip.left="'Create New Invoice'"
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
        <label class="font-medium" for="searchQuery">Search Invoice</label>
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
      @edit="editInvoiceHandler"
      @check="checkInvoiceHandler"
      :hideFooter="false"
      :searchValue="searchQuery"
      buttonsPagination
    />
  </PortalWidget>
  <!--  <InvoiceConfirmDeleteDialog-->
  <!--    :isOpen="isDeleteModalOpen"-->
  <!--    :selectedItem="invoice"-->
  <!--    @close="deleteDialog.close"-->
  <!--  />-->
</template>

<style lang="scss" scoped></style>
