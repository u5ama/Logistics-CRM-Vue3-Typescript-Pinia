<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { addAllocatedInvoiceSchema } from "@utils/schemas";
import Button from "primevue/button";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import FileUpload, { type FileUploadSelectEvent } from "primevue/fileupload";
import { useToast } from "vue-toastification";
import { inject, onMounted } from "vue";
import { editInvoiceInjectionKey } from "@utils/injectionKeys";
import { useAllocatedInvoiceStore } from "@stores/invoicing/allocatedInvoices";
import { useLoading } from "@hooks";
import { storeToRefs } from "pinia";
import { useSubcontractorsStore } from "@stores/subcontractors/subcontractors";
import InvoiceFormDropdown from "@dashboard-views/invoicing/InvoiceFormDropdown.vue";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";

interface Props {
  open: boolean;
}

const emit = defineEmits(["close", "success"]);
const [isOptionsLoading, setOptionsLoading] = useLoading();

const subcontractorsStore = useSubcontractorsStore();
const { subcontractors } = storeToRefs(subcontractorsStore);
const { getAllSubcontractors } = subcontractorsStore;

defineProps<Props>();
const { invoiceId } = inject(editInvoiceInjectionKey)!;
const allocatedInvoiceStore = useAllocatedInvoiceStore();
const { addAllocatedInvoice } = allocatedInvoiceStore;
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: addAllocatedInvoiceSchema,
  validateOnMount: false,
});

onMounted(async () => {
  setOptionsLoading.start();
  await getAllSubcontractors();
  setOptionsLoading.stop();
});

const onSubmit = handleSubmit(
  async (values) => {
    const { subcontractor_id, amount } = values;
    const success = await addAllocatedInvoice(
      invoiceId,
      subcontractor_id,
      amount,
      uploadedFile.value
    );

    if (!success) return;
    useToast().success("Invoice Allocated to Subcontractor Successfully!");
    emit("close");
  },
  (data) => console.log(data.errors)
);

const {
  value: uploadedFile,
  errorMessage: uploadedFileError,
  setValue: setUploadedFile,
  resetField: clearUploadedFile,
} = useField<File>("upload_file");

const fileChooseHandler = (event: FileUploadSelectEvent) => {
  const file = event.files[0];
  setUploadedFile(file);
};

const removeFileHandler = () => {
  clearUploadedFile();
};
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

          <StyledHeading class="mb-12"> Allocate Invoice </StyledHeading>

          <form
            class="flex flex-col gap-y-4 px-2 mx-auto"
            autocomplete="off"
            @submit.prevent="onSubmit"
          >
            <UserProfileFormTextField name="amount" label="Invoice Amount" />
            <InvoiceFormDropdown
              class="col-span-6"
              label="Choose Subcontractor"
              name="subcontractor_id"
              :options="subcontractors"
              :loading="isOptionsLoading"
            />
            <label for="upload_file" class="text-slate-500 text-sm -mb-2"
              >Upload Invoice</label
            >
            <FileUpload
              id="upload_file"
              mode="basic"
              name="upload_file"
              chooseIcon="pi pi-times"
              :customUpload="true"
              @uploader="removeFileHandler"
              @select="fileChooseHandler"
            />
            <small
              class="p-error -mt-2"
              :class="{ invisible: !uploadedFileError }"
            >
              {{ uploadedFileError }}
            </small>
            <Button
              :loading="isSubmitting"
              label="Allocate Invoice"
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
.modal-mask {
  position: fixed;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
  display: grid;
  place-items: center;
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
