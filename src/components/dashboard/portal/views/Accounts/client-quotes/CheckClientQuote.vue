<script setup lang="ts">
import { onMounted, provide } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { DashboardRouteNames } from "@router";
import { editQuoteInjectionKey } from "@utils/injectionKeys";
import { starbuckLogoBlackPNG } from "@images";
import { QuotePicOne } from "@images";
import { QuoteSign } from "@images";
import { quoteBanner } from "@images";
import { useClientQuotesStore } from "@stores/client-quotes/client-quotes";
import CreatePDF from "@dashboard-views/Accounts/client-quotes/ClientCreatePDF.vue";
import { useToast } from "vue-toastification";

const clientQuotesStore = useClientQuotesStore();
const { quote } = storeToRefs(clientQuotesStore);
const { getQuote, approveQuote } = clientQuotesStore;
const quoteId = parseInt(useRoute().params.id as string);

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  await getQuote(quoteId);
};
const appQuote = async (quoteId: number) => {
  await approveQuote(quoteId);
  useToast().success("Quote Approved Successfully!");
};
provide(editQuoteInjectionKey, { quote, quoteId });
</script>

<template>
  <RouterLink
    class="hover:underline text-sm"
    :to="{ name: DashboardRouteNames.allClientQuotes }"
  >
    <i class="pi pi-arrow-left text-xs mr-1"></i> Back to All Quotes
  </RouterLink>
  <br />
  <br />
  <CreatePDF
    @send="appQuote"
    :starbuckLogoBlack="starbuckLogoBlackPNG"
    :quoteBanner="quoteBanner"
    :QuotePicOne="QuotePicOne"
    :QuoteSign="QuoteSign"
    :quote="quote"
  />
</template>

<style lang="css" scoped></style>
