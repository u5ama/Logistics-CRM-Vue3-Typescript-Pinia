<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { addDocumentFormSchema } from "@utils/schemas";
import Button from "primevue/button";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import UserProfileFormTextField from "@dashboard/portal/views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import FileUpload, { type FileUploadSelectEvent } from "primevue/fileupload";
import { useToast } from "vue-toastification";
import { inject } from "vue";
import { editJobInjectionKey } from "@utils/injectionKeys";
import { useJobDocumentsStore } from "@stores/jobs/documents";

interface Props {
  open: boolean;
}

const emit = defineEmits(["close", "success"]);

defineProps<Props>();
const { jobId } = inject(editJobInjectionKey)!;
const documentsStore = useJobDocumentsStore();
const { addDocument } = documentsStore;
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: addDocumentFormSchema,
  validateOnMount: false,
});

const onSubmit = handleSubmit(
  async (values) => {
    const { title, document_type } = values;
    const success = await addDocument(
      jobId,
      title,
      document_type,
      uploadedFile.value
    );

    if (!success) return;
    useToast().success("Job Document uploaded Successfully!");
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

          <StyledHeading class="mb-12"> Add New Job Document </StyledHeading>

          <form
            class="flex flex-col gap-y-4 px-2 mx-auto"
            autocomplete="off"
            @submit.prevent="onSubmit"
          >
            <UserProfileFormTextField name="title" label="Document Name" />
            <UserProfileFormTextField
              name="document_type"
              label="Document Type"
            />
            <label for="upload_file" class="text-slate-500 text-sm -mb-2"
              >Upload File</label
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
              label="Upload Document"
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
  z-index: 9998;
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
