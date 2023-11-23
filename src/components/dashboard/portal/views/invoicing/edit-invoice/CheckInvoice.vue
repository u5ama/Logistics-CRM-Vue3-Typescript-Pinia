<script setup lang="ts">
import { onMounted, provide } from "vue";
import { useInvoicesStore } from "@stores/invoicing/invoices";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { DashboardRouteNames } from "@router";
import { editInvoiceInjectionKey } from "@utils/injectionKeys";
import { starbuckLogoBlackPNG } from "@images";
import CreatePDF from "@dashboard-views/invoicing/edit-invoice/CreatePDF.vue";

const invoicesStore = useInvoicesStore();
const { invoice } = storeToRefs(invoicesStore);
const { getInvoice, sendInvoiceEmail } = invoicesStore;
const invoiceId = parseInt(useRoute().params.id as string);

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  await getInvoice(invoiceId);
};

const sendEmail = async (invoiceId: number) => {
  await sendInvoiceEmail(invoiceId);
};

provide(editInvoiceInjectionKey, { invoice, invoiceId });
</script>

<template>
  <RouterLink
    class="hover:underline text-sm"
    :to="{ name: DashboardRouteNames.allInvoices }"
  >
    <i class="pi pi-arrow-left text-xs mr-1"></i> Back to All Invoices
  </RouterLink>
  <br />
  <br />
  <CreatePDF
    @send="sendEmail"
    :starbuckLogoBlack="starbuckLogoBlackPNG"
    :invoice="invoice"
  />
</template>
