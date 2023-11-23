<script setup lang="ts">
import { useForm } from "vee-validate";
import Button from "primevue/button";
import { useInvoicesStore } from "@stores/invoicing/invoices";
import { onMounted } from "vue";
import { useToast } from "vue-toastification";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import { storeToRefs } from "pinia";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useRoute } from "vue-router";
import { useLoading } from "@hooks";
import type { IInvoiceProducts, IInvoice } from "@/types/invoices";
import { useClientsStore } from "@stores/clients/clients";
import { useProductsStore } from "@stores/products";
import InvoiceFormDropdown from "@dashboard-views/invoicing/InvoiceFormDropdown.vue";
import ProductForm from "@dashboard-views/invoicing/productForm.vue";
import { invoiceFormSchema } from "@utils/schemas";
import InvoiceFormJobDropdown from "@dashboard-views/invoicing/InvoiceFormJobDropdown.vue";
import { useJobsStore } from "@stores/jobs/jobs";
import UserProfileFormDropdown from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormDropdown.vue";

const productData: IInvoiceProducts[] = [
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
const invoiceStore = useInvoicesStore();
const { invoice } = storeToRefs(invoiceStore);
const { sales } = storeToRefs(invoiceStore);
const { addInvoice, getInvoice, updateInvoice, getAllSales } = invoiceStore;

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
    const { ...fields } = invoice.value;
    setValues({ ...fields });
    setInvoiceLoading.stop();
  }
};

const addHandler = async (invoice: IInvoice) => {
  await addInvoice(invoice);
  useToast().success("Invoice added successfully");
};

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: invoiceFormSchema,
  validateOnMount: false,
});

const submitHandler = handleSubmit(
  async (values) => {
    const invoiceInfo = productData;
    const invoice = values as IInvoice;
    invoice.products = invoiceInfo;
    if (isEditing) await updateHandler(invoice);
    else {
      await addHandler(invoice);
      resetFormHandler();
    }
  },
  ({ errors }) => console.log(errors)
);

const entities = [
  { name: "Starbuck Excavation", value: "Starbuck Excavations" },
  { name: "Starbuck Plant Hire", value: "Starbuck Hire" },
];
const invoice_status = [
  { name: "DRAFT", value: "DRAFT" },
  { name: "SENT", value: "SENT" },
  { name: "PAID", value: "PAID" },
];

const updateHandler = async (invoice: IInvoice) => {
  await updateInvoice(invoiceId, invoice);
  useToast().success("Invoice updated successfully");
  setInvoiceLoading.start();
  await getInvoice(invoiceId);
  updateFormValues();
};
const resetFormHandler = () => {
  resetForm();
};
</script>

<template>
  <PortalWidget class="mt-6">
    <WidgetTypography variant="title" class="mb-2">
      {{ isEditing ? "Edit" : "Create" }} Invoice
    </WidgetTypography>
    <div
      class="mt-8 flex flex-col gap-y-3"
      :class="{ 'loading-faded': isInvoiceLoading }"
    >
      <div class="grid grid-cols-12 gap-3">
      <UserProfileFormTextField label="Invoice Name" class="col-span-6 mt-7" name="invoice_name" />
      <InvoiceFormDropdown
        class="col-span-6 text-red-500"
        label="Choose Client *"
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
      <UserProfileFormDropdown
        class="col-span-6"
        label="Choose Entity *"
        name="invoice_entity"
        :options="entities"
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
        label="Invoice Status"
        name="invoice_status"
        :options="invoice_status"
        :loading="isOptionsLoading"
      />
      </div>
      <ProductForm
        :loading="isOptionsLoading"
        :allProducts="products"
        :productData="productData"
      />
    </div>
    <div class="flex lg:justify-end">
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

<style lang="scss" scoped></style>
