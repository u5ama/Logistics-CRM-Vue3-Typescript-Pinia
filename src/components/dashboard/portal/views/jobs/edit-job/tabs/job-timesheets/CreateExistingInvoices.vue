<script setup lang="ts">
import { useForm } from "vee-validate";
import { addExistingInvoiceForm } from "@utils/schemas";
import Button from "primevue/button";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import { useToast } from "vue-toastification";
import { inject, onMounted, ref } from "vue";
import { editJobInjectionKey } from "@utils/injectionKeys";
import { useJobTimeSheetStore } from "@stores/jobs/timesheets";
import InvoiceFormDropdown from "@dashboard-views/invoicing/InvoiceFormDropdown.vue";
import { useLoading } from "@hooks";
import { storeToRefs } from "pinia";

interface Props {
  open: boolean;
  selectedProducts: any[] | undefined;
}

const emit = defineEmits(["close", "success"]);

const { selectedProducts } = defineProps<Props>();

const { jobId } = inject(editJobInjectionKey)!;
const isEditing = !!jobId;

const timeSheetStore = useJobTimeSheetStore();
const { allInvoices } = storeToRefs(timeSheetStore);
const { addExistingInvoiceForMultiple, allInvoicesList } = timeSheetStore;

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: addExistingInvoiceForm,
  validateOnMount: false,
});

const [isJobLoading, setJobLoading] = useLoading(isEditing);

onMounted(async () => {
  setJobLoading.start();
  await allInvoicesList(jobId);
  setJobLoading.stop();
});

const onSubmit = handleSubmit(
  async (values) => {
    const { invoice_id } = values;
    await addExistingInvoiceForMultiple(invoice_id, selectedProducts);
    useToast().success("Sheets Invoiced Successfully!");
    emit("close");
  },
  (data) => console.log(data.errors)
);

</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-mask">
        <div
          class="modal-container relative bg-white w-full max-w-xl py-12 px-16 rounded"
          @click.stop
        >
          <div class="absolute top-3 right-4">
            <i class="pi pi-times cursor-pointer" @click="$emit('close')"></i>
          </div>

          <StyledHeading class="mb-12"> Add to Existing Invoices </StyledHeading>
          <form
            class="flex flex-col gap-y-4 px-2 mx-auto"
            autocomplete="off"
            @submit.prevent="onSubmit"
          >
            <InvoiceFormDropdown
              class="col-span-6"
              label="Choose Invoice"
              name="invoice_id"
              :options="allInvoices"
              :loading="isJobLoading"
            />
            <Button
              :loading="isSubmitting"
              label="Add Invoice"
              type="submit"
              class="ml-auto"
            />
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
#pv_id_11_panel {
  z-index: 9999;
}
.modal-mask {
  position: fixed;
  //z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
  display: grid;
  place-items: center;
  overflow: scroll;
  overflow-x: hidden;
}
.modal-enter-from {
  opacity: 0;
}
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(1.1);
}
</style>
