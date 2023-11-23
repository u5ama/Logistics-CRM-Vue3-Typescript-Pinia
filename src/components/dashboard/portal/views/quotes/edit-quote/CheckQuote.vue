<script setup lang="ts">
import { onMounted, provide } from "vue";
import { useQuotesStore } from "@stores/quotes/quotes";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { DashboardRouteNames } from "@router";
import { editQuoteInjectionKey } from "@utils/injectionKeys";
import { starbuckLogoBlackPNG } from "@images";
import { quoteBanner } from "@images";
import { QuotePicOne } from "@images";
import { QuoteSign } from "@images";
import CreatePDF from "./CreatePDF.vue";
import { useModal } from "@hooks";
import QuoteEmailModal from "@dashboard/widgets/quotes/QuoteEmailModal.vue";
import { useToast } from "vue-toastification";

const quotesStore = useQuotesStore();
const { quote } = storeToRefs(quotesStore);
const { getQuote } = quotesStore;
const quoteId = parseInt(useRoute().params.id as string);

onMounted(() => {
  fetchData();
});
const fetchData = async () => {
  await getQuote(quoteId);
};

const [isModalOpen, setModal] = useModal();

const sendEmail = () => {
  setModal.open();
};

const addedHandler = () => {
  useToast().success("Settings added Successfully!");
};

const successHandler = () => {
  setModal.close();
  fetchData();
};

provide(editQuoteInjectionKey, { quote, quoteId });
</script>

<template>
  <RouterLink
    class="hover:underline text-sm"
    :to="{ name: DashboardRouteNames.allQuotes }"
  >
    <i class="pi pi-arrow-left text-xs mr-1"></i> Back to All Quotes
  </RouterLink>
  <br />
  <br />
  <CreatePDF
    @send="sendEmail"
    :starbuckLogoBlack="starbuckLogoBlackPNG"
    :quoteBanner="quoteBanner"
    :QuotePicOne="QuotePicOne"
    :QuoteSign="QuoteSign"
    :quote="quote"
  />
  <QuoteEmailModal
    v-if="isModalOpen"
    :open="isModalOpen"
    :selectedQuote="quote"
    @close="setModal.close"
    @success="successHandler"
    @added="addedHandler"
  />
</template>

<style lang="css" scoped></style>
