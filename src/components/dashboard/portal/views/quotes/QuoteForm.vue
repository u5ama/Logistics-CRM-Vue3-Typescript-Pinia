<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useField, useForm } from "vee-validate";
import Button from "primevue/button";
import { useQuotesStore } from "@stores/quotes/quotes";
import { useToast } from "vue-toastification";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import { storeToRefs } from "pinia";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useRoute } from "vue-router";
import { useLoading, useMultiSelect } from "@hooks";
import type { IQuote, IQuoteItems } from "@/types/quotes";
import { useClientsStore } from "@stores/clients/clients";
import InvoiceFormDropdown from "@dashboard-views/invoicing/InvoiceFormDropdown.vue";
import QuoteFormExt from "@dashboard-views/quotes/quoteFormExt.vue";
import { quoteFormSchema } from "@utils/schemas";
import { useJobsStore } from "@stores/jobs/jobs";
import QuoteFormJobDropdown from "@dashboard-views/quotes/quoteFormDropdown.vue";
import UserProfileFormDropdown from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormDropdown.vue";
import { useTermsConditionsStore } from "@stores/quotes/termsConditions";
import { useQuoteFooterStore } from "@stores/quotes/footer";
import MultiSelectDropdown from "@components/form/MultiSelectDropdown.vue";
import { useResourceAssetsStore } from "@stores/resources/assets";
import QuoteEditor from "@dashboard/widgets/quotes/quoteEditor.vue";

import { useDropzone } from "vue3-dropzone";

const quoteData: IQuoteItems[] = [
  {
    id: 0,
    created_at: "",
    updated_at: "",
    quote_price: "",
    quote_price_key_name: "total_price",
    description: "",
    description_key_name: "description",
    title: "",
    title_key_name: "title",
    quote_id: "",
    quote_file: "",
  },
];
const quoteStore = useQuotesStore();
const { quote } = storeToRefs(quoteStore);
const { sales } = storeToRefs(quoteStore);
const { addQuote, getQuote, updateQuote, getAllSales } = quoteStore;

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

const address = ref("");
onMounted(async () => {
  setOptionsLoading.start();
  await getAllAssets();
  await getAllClients();
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

const updateFormValues = () => {
  if (quote.value) {
    const { assets, ...fields } = quote.value;
    const toIds = (items: any[]) => items.map((i) => i.id);
    const toIdsString = (items: any[]) => toIds(items).join(",");
    setValues({ ...fields, assets: toIdsString(assets) });
    selectedAssets.value = toIds(assets);
    setQuoteLoading.stop();
  }
};

const handleTermsChange = async (selectedValue: any) => {
  await getTermsCondition(selectedValue.value);
};

const handleFooterChange = async (selectedValue: any) => {
  await getQuoteFooter(selectedValue.value);
};

const computedQuoteFooter = computed(() => quoteFooter.value?.description);
const computedTermsConditions = computed(
  () => termsCondition.value?.terms_conditions
);

const addHandler = async (quote: IQuote) => {
  await addQuote(quote);
  useToast().success("Quote added successfully");
};

const setPlace = (e: any) => {
  address.value = e.formatted_address;
};

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: quoteFormSchema,
  validateOnMount: false,
});

const entities = [
  { name: "Starbuck Excavation", value: "Starbuck Excavations" },
  { name: "Starbuck Plant Hire", value: "Starbuck Hire" },
];

const materials = [
  { name: "WET", value: "wet" },
  { name: "DRY", value: "dry" },
];

const [selectedAssets, assetsChangeHandler, resetAssets] = useMultiSelect();

const submitHandler = handleSubmit(
  async (values) => {
    const quoteInfo = quoteData;
    const locationAddress = address.value;
    const quote = values as IQuote;
    quote.location = locationAddress;
    quote.items = quoteInfo;

    // Create an array of File objects from selectedFiles
    const selectedFileObjects = selectedFiles.map(
      (file) => new File([file], file.name)
    );

    // Update the quote with the selected files
    quote.files = selectedFiles.map(
      (file) => new File([file], file.name)
    );

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

const {
  value: selectedFilesRef,
  errorMessage: fileSelectError,
  setValue: setSelectedFiles,
  resetField: clearSelectedFiles,
} = useField<File[]>("upload_files");

let selectedFiles: File[] = [];
const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop: (uploadedFiles) => {
    selectedFiles = [...selectedFiles, ...uploadedFiles];
    setSelectedFiles(selectedFiles); // Update the value in the useField
  },
  multiple: true,
});

const removeFileHandler = (indexToRemove: number) => {
  selectedFiles.splice(indexToRemove, 1); // Remove the file at the specified index
  setSelectedFiles([...selectedFiles]); // Update the value in the useField
};
</script>

<template>
  <PortalWidget class="mt-6">
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
            >Location *</label
          >
          <GMapAutocomplete
            placeholder="Location"
            @place_changed="setPlace"
            name="location"
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
          label="Choose Entity"
          name="quote_entity"
          :options="entities"
          :loading="isOptionsLoading"
        />
        <InvoiceFormDropdown
          class="col-span-3"
          label="Choose Client"
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
          class="col-span-4 mt-6"
          label="Assets"
          name="assets"
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
        <QuoteFormJobDropdown
          class="col-span-6"
          label="Choose Terms Conditions"
          name="terms_condition_id"
          :options="termsConditions"
          @change="handleTermsChange"
          :loading="isOptionsLoading"
        />
        <QuoteFormJobDropdown
          class="col-span-6"
          label="Choose Footer"
          name="quote_footer_id"
          :options="quoteFooters"
          @change="handleFooterChange"
          :loading="isOptionsLoading"
        />
        <QuoteEditor
          class="col-span-6"
          v-if="termsCondition"
          name="terms_condition_text"
          :value="computedTermsConditions"
        />
        <QuoteEditor
          class="col-span-6"
          v-if="quoteFooter"
          name="quote_footer_text"
          :value="computedQuoteFooter"
        />
        <div class="col-span-12">
          <div class="flex items-center mb-4" v-if="selectedFiles?.length > 0">
            <ul>
              <li v-for="(file, index) in selectedFiles" :key="index">
                {{ file.name }}
                <Button
                  icon="pi pi-times"
                  class="p-button-rounded p-button-danger scale-75 -mb-1"
                  @click="removeFileHandler(index)"
                />
              </li>
            </ul>
          </div>
          <label for="upload_file" class="text-slate-500 text-sm -mb-2">
            Upload Attachments
          </label>
          <div
            v-bind="getRootProps()"
            class="h-28 w-full bg-gray-50 rounded-md border border-gray-500 border-dashed grid place-content-center"
            :class="{
              'border-red-500': fileSelectError,
              'text-red-500': fileSelectError,
              'text-slate-700': !fileSelectError,
            }"
          >
            <input
              v-bind="getInputProps()"
              id="upload_files"
              type="file"
              multiple
            />
            <p v-if="isDragActive">Drop files here ...</p>
            <p v-else>Drag 'n' Drop files here, or click to select files</p>
          </div>
          <small class="p-error -mt-2" :class="{ invisible: !fileSelectError }">
            {{ fileSelectError }}
          </small>
        </div>
      </div>
      <WidgetTypography variant="title" class="mb-2">
        {{ isEditing ? "Edit" : "Create" }} Quote Items
      </WidgetTypography>
      <QuoteFormExt :loading="isOptionsLoading" :quoteData="quoteData" />
    </div>
    <div class="flex lg:justify-end">
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