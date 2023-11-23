<script setup lang="ts">
import { useForm } from "vee-validate";
import Button from "primevue/button";
import { useQuotesStore } from "@stores/quotes/quotes";
import { computed, onMounted, ref } from "vue";
import { useToast } from "vue-toastification";
import { storeToRefs } from "pinia";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useRoute } from "vue-router";
import { useLoading, useModal, useMultiSelect } from "@hooks";
import type { IQuoteItems, IQuote } from "@/types/quotes";
import { useClientsStore } from "@stores/clients/clients";
import InvoiceFormDropdown from "@dashboard-views/invoicing/InvoiceFormDropdown.vue";
import QuoteFormExt from "@dashboard-views/quotes/quoteFormExt.vue";
import { quoteFormSchema } from "@utils/schemas";
import { useJobsStore } from "@stores/jobs/jobs";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import UserProfileFormDropdown from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormDropdown.vue";
import { useTermsConditionsStore } from "@stores/quotes/termsConditions";
import { useQuoteFooterStore } from "@stores/quotes/footer";
import { useResourceAssetsStore } from "@stores/resources/assets";
import MultiSelectDropdown from "@components/form/MultiSelectDropdown.vue";
import QuoteEditor from "@dashboard/widgets/quotes/quoteEditor.vue";
import QuoteEmailModal from "@dashboard/widgets/quotes/QuoteEmailModal.vue";
import { quoteBanner, QuotePicOne, QuoteSign, starbuckLogoBlackPNG } from "@images";
import CreatePDF from "@dashboard-views/quotes/edit-quote/CreatePDF.vue";

let quoteData: IQuoteItems[] = [
  {
    id: 0,
    created_at: "",
    updated_at: "",
    quote_price: "",
    description: "",
    title: "",
    quote_id: "",
    quote_file: "",
    quote_price_key_name: "quote_price",
    description_key_name: "description",
    title_key_name: "title",
  },
];
const quoteStore = useQuotesStore();
const { quote } = storeToRefs(quoteStore);
const { sales } = storeToRefs(quoteStore);
const { addQuote, getQuote, updateQuote, getAllSales, acceptQuoteJob } =
  quoteStore;

const resourceAssetsStore = useResourceAssetsStore();
const { assets } = storeToRefs(resourceAssetsStore);
const { getAllAssets } = resourceAssetsStore;

const quoteId = parseInt(useRoute().params.id as string);
const isEditing = !!quoteId;

const [isQuoteLoading, setQuoteLoading] = useLoading(isEditing);
const [isOptionsLoading, setOptionsLoading] = useLoading();

const clientsStore = useClientsStore();
const { clients } = storeToRefs(clientsStore);
const { getAllClients } = clientsStore;

const jobsStore = useJobsStore();
const { jobs } = storeToRefs(jobsStore);
const { getAllJobs } = jobsStore;

const termsConditionsStore = useTermsConditionsStore();
const { termsConditions, termsCondition } = storeToRefs(termsConditionsStore);
const { getAllTermsConditions, getTermsCondition } = termsConditionsStore;

const quoteFooterStore = useQuoteFooterStore();
const { quoteFooters, quoteFooter } = storeToRefs(quoteFooterStore);
const { getAllQuoteFooters, getQuoteFooter } = quoteFooterStore;

onMounted(async () => {
  setOptionsLoading.start();
  await getAllClients();
  await getAllAssets();
  await getAllJobs();
  await getAllSales();
  await getAllTermsConditions();
  await getAllQuoteFooters();
  setOptionsLoading.stop();
  if (isEditing) {
    await getQuote(quoteId);
    updateFormValues();
  }
});

const handleTermsChange = async (selectedValue: any) => {
  await getTermsCondition(selectedValue.value);
};

const handleFooterChange = async (selectedValue: any) => {
  await getQuoteFooter(selectedValue.value);
};

const computedQuoteFooter = ref<any | undefined>(undefined);
const computedTermsConditions = ref<any | undefined>(undefined);

computedQuoteFooter.value = computed(() => quoteFooter.value?.description);
computedTermsConditions.value = computed(
  () => termsCondition.value?.terms_conditions
);

const address = ref("");
const hidePdf = ref(false);
const setPlace = (e: any) => {
  address.value = e.formatted_address;
};
const updateFormValues = () => {
  if (quote.value) {
    quoteData = quote?.value.items;
    const { assets, ...fields } = quote.value;
    const toIds = (items: any[]) => items.map((i) => i.id);
    const toIdsString = (items: any[]) => toIds(items).join(",");
    setValues({ ...fields, assets: toIdsString(assets) });
    selectedAssets.value = toIds(assets);
    address.value = quote.value.location;

    computedTermsConditions.value =
      quote.value.terms_condition_text ||
      termsCondition.value?.terms_conditions;
    computedQuoteFooter.value =
      quote.value.quote_footer_text || quoteFooter.value?.description;

    setQuoteLoading.stop();
  }
};
const [selectedAssets, assetsChangeHandler, resetAssets] = useMultiSelect();
const entities = [
  { name: "Starbuck Excavation", value: "Starbuck Excavations" },
  { name: "Starbuck Plant Hire", value: "Starbuck Hire" },
];

const materials = [
  { name: "WET", value: "wet" },
  { name: "DRY", value: "dry" },
];
const addHandler = async (quote: IQuote) => {
  // await addQuote(quote);
  useToast().success("Quote added successfully");
};

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: quoteFormSchema,
  validateOnMount: false,
});

const submitHandler = handleSubmit(
  async (values) => {
    const quoteInfo = quoteData;
    const locationAddress = address.value;
    const quote = values as IQuote;
    quote.location = locationAddress;
    quote.items = quoteInfo;
    if (isEditing) await updateHandler(quote);
    else {
      await addHandler(quote);
      resetFormHandler();
    }
  },
  ({ errors }) => console.log(errors)
);

const updateHandler = async (quote: IQuote) => {
  await updateQuote(quoteId, quote);
  useToast().success("Quote updated successfully");
  setQuoteLoading.start();
  await getQuote(quoteId);
  updateFormValues();
};
const resetFormHandler = () => {
  resetForm();
  resetAssets();
};

const acceptQuote = async () => {
  await acceptQuoteJob(quoteId);
  useToast().success("Quote Accepted successfully");
};
const exportToPdf = () => {

};

const [isModalOpen, setModal] = useModal();
const sendEmail = () => {
  setModal.open();
};

const addedHandler = () => {
  useToast().success("Email Sent Successfully!");
};

const successHandler = () => {
  setModal.close();
};

const sendForSign = async () => {
  await myChild.value.sendForSign();
};
const myChild = ref();
const createPdf = () => {
  myChild.value.downloadPDF();
};
</script>

<template>
  <PortalWidget class="mt-2">
    <div v-show="hidePdf">
      <CreatePDF
        @send="sendEmail"
        :starbuckLogoBlack="starbuckLogoBlackPNG"
        :quoteBanner="quoteBanner"
        :QuotePicOne="QuotePicOne"
        :QuoteSign="QuoteSign"
        :quote="quote"
        ref="myChild"
      />
    </div>
    <QuoteEmailModal
      v-if="isModalOpen"
      :open="isModalOpen"
      :selectedQuote="quote"
      @close="setModal.close"
      @success="successHandler"
      @added="addedHandler"
    />
    <button class="p-button p-button-primary mb-5" @click="sendEmail">
      Send to customer
    </button>
    <button class="p-button p-button-primary mb-5 ml-3" @click="createPdf">
       Export to PDF
    </button>
    <button class="p-button p-button-primary mb-5 ml-3" @click="sendForSign">
      Send Docusign Document
    </button>
    <button
      v-show="quote?.quote_status === 'Not Accepted'"
      class="p-button p-button-success mb-5 ml-3"
      @click="acceptQuote"
    >
      Accept Quote
    </button>
    <WidgetTypography variant="title" class="mb-2">
      {{ isEditing ? "Edit" : "Create" }} Quote
    </WidgetTypography>
    <div
      class="mt-8 flex flex-col gap-y-3"
      :class="{ 'loading-faded': isQuoteLoading }"
    >
      <div class="grid grid-cols-12 gap-3">
        <UserProfileFormTextField
          label="Quote Name"
          name="quote_name"
          class="col-span-3 mt-7"
        />
        <div class="col-span-3">
          <label
            for="location"
            class="inline-block lg:text-xs sm:text-lg text-slate-500 ml-3 mb-2"
            >Current Location: {{ quote?.location }}</label
          >
          <GMapAutocomplete
            placeholder="Update Location"
            @place_changed="setPlace"
            name="location"
            :data-value="address"
            class="p-inputtext p-component w-full"
            :options="{
              componentRestrictions: {
                country: ['au'],
              },
            }"
          >
          </GMapAutocomplete>
        </div>
        <UserProfileFormDropdown
          class="col-span-3"
          label="Choose Entity *"
          name="quote_entity"
          :options="entities"
          :loading="isOptionsLoading"
        />
        <InvoiceFormDropdown
          class="col-span-3"
          label="Choose Client *"
          name="client_id"
          :options="clients"
          :loading="isOptionsLoading"
        />
        <InvoiceFormDropdown
          class="col-span-4"
          label="Choose Sales Person"
          name="representative_id"
          :options="sales"
          :loading="isOptionsLoading"
        />
        <MultiSelectDropdown
          label="Assets"
          name="assets"
          class="col-span-4 mt-7"
          :items="assets"
          :selectedItems="selectedAssets"
          @change="assetsChangeHandler"
          :loading="isOptionsLoading"
        />
        <UserProfileFormDropdown
          class="col-span-4"
          label="Choose Material Type"
          name="material_type"
          :options="materials"
          :loading="isOptionsLoading"
        />
        <InvoiceFormDropdown
          class="col-span-6"
          label="Choose Terms Conditions"
          name="terms_condition_id"
          :options="termsConditions"
          @change="handleTermsChange"
          :loading="isOptionsLoading"
        />
        <InvoiceFormDropdown
          class="col-span-6"
          label="Choose Footer"
          name="quote_footer_id"
          :options="quoteFooters"
          @change="handleFooterChange"
          :loading="isOptionsLoading"
        />
        <QuoteEditor
          class="col-span-6"
          name="terms_condition_text"
          :value="computedTermsConditions?.value"
        />
        <QuoteEditor
          name="quote_footer_text"
          class="col-span-6"
          :value="computedQuoteFooter?.value"
        />
      </div>
      <WidgetTypography variant="title" class="mb-2">
        {{ isEditing ? "Edit" : "Create" }} Quote Items
      </WidgetTypography>
      <QuoteFormExt
        :loading="isOptionsLoading"
        :quoteData="quoteData"
        :quoteVal="quote?.items"
      />
    </div>
    <div class="flex justify-end">
      <Button
        :label="isEditing ? 'Update Quote' : 'Save Quote'"
        icon="pi pi-save"
        class="p-button p-button-primary"
        :loading="isSubmitting"
        :disabled="isQuoteLoading"
        @click="submitHandler"
      />
    </div>
  </PortalWidget>
</template>

<style lang="scss" scoped></style>