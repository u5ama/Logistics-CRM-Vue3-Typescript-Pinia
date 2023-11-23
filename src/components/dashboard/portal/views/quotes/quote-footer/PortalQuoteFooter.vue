<script setup lang="ts">
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useLoading, useModal } from "@hooks";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import { storeToRefs } from "pinia";
import { useQuoteFooterStore } from "@stores/quotes/footer";
import { onMounted, ref } from "vue";
import { FilterMatchMode } from "primevue/api";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import { DashboardRouteNames } from "@router";
import TermsConditionsConfirmDeleteDialog from "@dashboard-views/quotes/components/TermsConditionsConfirmDeleteDialog.vue";
import type { IQuoteFooter } from "@/types/quotes";
import QuoteFooterTable from "@dashboard-views/quotes/components/QuoteFooterTable.vue";

const quoteFooterStore = useQuoteFooterStore();
const { quoteFooters } = storeToRefs(quoteFooterStore);
const { getAllQuoteFooters } = quoteFooterStore;

onMounted(() => {
  fetchData();
});
const fetchData = async () => {
  setLoading.start();
  await getAllQuoteFooters();
  setLoading.stop();
};

const [isLoading, setLoading] = useLoading();
const [isDeleteModalOpen, deleteDialog] = useModal();

const selectedItem = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const openConfirmDeleteDialog = (item: IQuoteFooter) => {
  selectedItem.value = { ...item };
  deleteDialog.open();
};
</script>

<template>
  <section class="widgets">
    <PortalWidget class="widget">
      <div class="flex justify-between items-center mb-7">
        <div class="">
          <WidgetTypography variant="title" class="mb-1">
            Quote Footer
          </WidgetTypography>
        </div>
        <div class="flex gap-x-2">
          <RouterLink :to="{ name: DashboardRouteNames.newQuoteFooter }">
            <Button
              icon="pi pi-plus"
              class="p-button-rounded p-button-success"
              v-tooltip.left="'Add New Footer'"
            />
          </RouterLink>
          <Button
            icon="pi pi-replay"
            class="p-button-rounded p-button-secondary -rotate-45"
            @click="fetchData"
            v-tooltip.top="'Reload Data'"
            :loading="isLoading"
          />
        </div>
      </div>

      <SimpleLoader class="mt-20" v-if="isLoading" />

      <div class="" v-else>
        <div class="flex mb-3 justify-end">
          <span class="p-input-icon-left searchSize">
            <i class="pi pi-search" />
            <InputText
              class="searchSize"
              v-model="filters['global'].value"
              placeholder="Search Footer"
            />
          </span>
        </div>
        <QuoteFooterTable
          :filters="filters"
          :attachments="quoteFooters"
          @delete="openConfirmDeleteDialog"
        />
      </div>
    </PortalWidget>
    <TermsConditionsConfirmDeleteDialog
      :isOpen="isDeleteModalOpen"
      :selectedItem="selectedItem"
      @close="deleteDialog.close"
    />
  </section>
</template>

<style lang="scss" scoped>
.widget {
  min-height: 500px;
}
.widgets {
  @apply grid gap-8;
  .invoices {
    min-height: 400px;
  }
}
</style>
<style scoped>
@media only screen and (max-width: 600px) {
  .searchSize {
    width: 100% !important;
  }
}
</style>
