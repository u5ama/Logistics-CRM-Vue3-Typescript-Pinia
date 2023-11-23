<script setup lang="ts">
import { onMounted, provide, ref } from "vue";
import { useInvoicesStore } from "@stores/invoicing/invoices";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { editInvoiceInjectionKey } from "@utils/injectionKeys";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import InvoiceFormDropdown from "@dashboard-views/invoicing/InvoiceFormDropdown.vue";
import ProductFormEdit from "@dashboard-views/invoicing/productFormEdit.vue";
import { useLoading } from "@hooks";
import { useClientsStore } from "@stores/clients/clients";
import { useProductsStore } from "@stores/products";
import { useForm } from "vee-validate";
import { invoiceFormSchema } from "@utils/schemas";
import type { IInvoice, IInvoiceProducts } from "@/types/invoices";
import { useToast } from "vue-toastification";
import Button from "primevue/button";
import { useJobsStore } from "@stores/jobs/jobs";
import InvoiceFormJobDropdown from "@dashboard-views/invoicing/InvoiceFormJobDropdown.vue";
import UserProfileFormDropdown from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormDropdown.vue";
import { starbuckLogoBlackPNG } from "@images";
import CreatePDF from "@dashboard-views/invoicing/edit-invoice/CreatePDF.vue";

let productData: IInvoiceProducts[] = [
  {
    id: 0,
    created_at: "",
    updated_at: "",
    product_id: 0,
    product_key_name: "product_id",
    quantity: 0,
    quantity_key_name: "quantity",
    price: "",
    rate_key_name: "rate",
    epa_number: "",
    epa_number_key_name: "epa_number",
  },
];
const invoicesStore = useInvoicesStore();
const { invoice } = storeToRefs(invoicesStore);
const { sales } = storeToRefs(invoicesStore);
const { getInvoice, updateInvoice, getAllSales } = invoicesStore;

const invoiceId = parseInt(useRoute().params.id as string);
const isEditing = !!invoiceId;

const [isInvoiceLoading, setInvoiceLoading] = useLoading(isEditing);
const [isOptionsLoading, setOptionsLoading] = useLoading();

const clientsStore = useClientsStore();
const { clients } = storeToRefs(clientsStore);
const { getAllClients } = clientsStore;

const productsStore = useProductsStore();
const { products } = storeToRefs(productsStore);
const { getAllProducts } = productsStore;

const jobsStore = useJobsStore();
const { jobs } = storeToRefs(jobsStore);
const { getAllJobs } = jobsStore;

onMounted(async () => {
  setOptionsLoading.start();
  await getAllProducts();
  await getAllClients();
  await getAllJobs();
  await getAllSales();
  setOptionsLoading.stop();

  if (isEditing) {
    await getInvoice(invoiceId);
    updateFormValues();
  }
});
const updateFormValues = () => {
  if (invoice.value) {
    if (invoice?.value.products.length > 0){
      productData = invoice?.value.products;
    }
    const { ...fields } = invoice.value;
    setValues({ ...fields });
    setInvoiceLoading.stop();
  }
};

const { handleSubmit, isSubmitting, setValues } = useForm({
  validationSchema: invoiceFormSchema,
  validateOnMount: false,
});

const submitHandler = handleSubmit(
  async (values) => {
    const invoiceInfo = productData;
    const invoice = values as IInvoice;
    invoice.products = invoiceInfo;
    if (isEditing) await updateHandler(invoice);
  },
  ({ errors }) => console.log(errors)
);
const updateHandler = async (invoice: IInvoice) => {
  await updateInvoice(invoiceId, invoice);
  useToast().success("Invoice updated successfully");
  setInvoiceLoading.start();
  await getInvoice(invoiceId);
  updateFormValues();
};
const entities = [
  { name: "Starbuck Excavation", value: "Starbuck Excavations" },
  { name: "Starbuck Plant Hire", value: "Starbuck Hire" },
];
const invoice_status = [
  { name: "DRAFT", value: "DRAFT" },
  { name: "SENT", value: "SENT" },
  { name: "PAID", value: "PAID" },
];
provide(editInvoiceInjectionKey, { invoice, invoiceId });

const myChild = ref();
const hidePdf = ref(false);
const createPdf = () => {
  myChild.value.exportToPDF();
};
const sendEmail = async (invoiceId: number) => {
};
</script>

<template>
  <PortalWidget class="mt-6">
    <div v-show="hidePdf">
      <CreatePDF
        @send="sendEmail"
        :starbuckLogoBlack="starbuckLogoBlackPNG"
        :invoice="invoice"
        ref="myChild"
      />
    </div>

    <button class="p-button p-button-primary mb-5" @click="createPdf">
      Export to PDF
    </button>
    <WidgetTypography variant="title" class="mb-2">
      {{ isEditing ? "Edit" : "Create" }} Invoice
    </WidgetTypography>
    <div
      class="mt-8 flex flex-col columns-3 gap-y-3"
      :class="{ 'loading-faded': isInvoiceLoading }"
    >
      <div class="grid grid-cols-12 gap-3">
      <UserProfileFormTextField label="Invoice Name" name="invoice_name" class="col-span-6 mt-7" />

      <UserProfileFormDropdown
          class="col-span-6"
          label="Choose Entity"
          name="invoice_entity"
          :options="entities"
          :loading="isOptionsLoading"
      />
      <InvoiceFormDropdown
          class="col-span-6"
        label="Choose Client"
        name="client_id"
        :options="clients"
        :loading="isOptionsLoading"
      />
      <InvoiceFormJobDropdown
        class="col-span-6"
        label="Choose Job"
        name="job_id"
        :options="jobs"
        :loading="isOptionsLoading"
      />
      <InvoiceFormDropdown
        class="col-span-6"
        label="Choose Sales Person"
        name="representative_id"
        :options="sales"
        :loading="isOptionsLoading"
      />
      <UserProfileFormDropdown
        class="col-span-6"
        label="Choose Invoice Status"
        name="invoice_status"
        :options="invoice_status"
        :loading="isOptionsLoading"
      />
      </div>
      <ProductFormEdit
        :loading="isOptionsLoading"
        :allProducts="products"
        :productData="productData"
        :invoiceProd="invoice?.products"
      />
    </div>
    <div class="grid grid-cols-12 gap-3" v-if="invoice?.items?.length > 0">
      <UserProfileFormTextField label="Asset Name" name="asset_name" class="col-span-4 mt-7" />
      <UserProfileFormTextField label="Per Hour Price" name="invoice_price" class="col-span-4 mt-7" />
      <UserProfileFormTextField label="Calculated Total Hours" name="total_hours" class="col-span-4 mt-7" />
    </div>
    <div class="flex justify-end">
      <Button
        :label="isEditing ? 'Update Invoice' : 'Save Invoice'"
        icon="pi pi-save"
        class="p-button p-button-primary"
        :loading="isSubmitting"
        :disabled="isInvoiceLoading"
        @click="submitHandler"
      />
    </div>
  </PortalWidget>
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
