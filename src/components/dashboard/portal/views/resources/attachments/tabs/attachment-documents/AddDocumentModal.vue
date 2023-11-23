<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { addAttachmentDocumentFormSchema } from "@utils/schemas";
import Button from "primevue/button";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import { useAttachmentDocumentsStore } from "@stores/resources/attachmentDocuments";
import { useToast } from "vue-toastification";
import { inject } from "vue";
import { editAttachmentInjectionKey } from "@utils/injectionKeys";
import { useDropzone } from "vue3-dropzone";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import DateInput from "@components/form/DateInput.vue";

interface Props {
  open: boolean;
}

const emit = defineEmits(["close", "success"]);
defineProps<Props>();
const { attachmentId } = inject(editAttachmentInjectionKey)!;
const documentsStore = useAttachmentDocumentsStore();
const { addDocument } = documentsStore;

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: addAttachmentDocumentFormSchema,
  validateOnMount: false,
});

const onSubmit = handleSubmit(
  async (values) => {
    const { title, expiry, alert } = values;
    const success = await addDocument(
      attachmentId,
      title,
      expiry,
      alert,
      selectedFile.value
    );

    if (!success) return;

    useToast().success("Document uploaded Successfully!");

    emit("close");
  },
  (data) => console.log(data.errors)
);

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop: (files) => {
    setSelectedFile(files[0]);
  },
  multiple: false,
});

const {
  value: selectedFile,
  errorMessage: fileSelectError,
  setValue: setSelectedFile,
  resetField: clearSelectedFile,
} = useField<File>("upload_file");

const removeFileHandler = () => {
  clearSelectedFile();
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

          <StyledHeading class="mb-12"> Add Attachment Document </StyledHeading>

          <form
            class="flex flex-col gap-y-4 px-2 mx-auto"
            autocomplete="off"
            @submit.prevent="onSubmit"
          >
            <UserProfileFormTextField
              name="title"
              label="Attachment Document Name"
            />

            <DateInput name="expiry" label="Expiry Date" />

            <DateInput name="alert" label="Alert Date" />

            <div class="flex items-center mb-4" v-if="selectedFile">
              <p class="text-gray-800 text-xl mr-3">{{ selectedFile.name }}</p>
              <Button
                icon="pi pi-times"
                class="p-button-rounded p-button-danger scale-75 -mb-1"
                @click="removeFileHandler"
              />
            </div>
            <label for="upload_file" class="text-slate-500 text-sm -mb-2">
              Upload File
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
              <input v-bind="getInputProps()" />
              <p v-if="isDragActive">Drop the file here ...</p>
              <p v-else>Drag 'n' Drop a file here, or click to select a file</p>
            </div>
            <small
              class="p-error -mt-2"
              :class="{ invisible: !fileSelectError }"
            >
              {{ fileSelectError }}
            </small>
            <Button
              :loading="isSubmitting"
              label="Upload Document"
              type="submit"
              class="p-button p-button-primary w-full"
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
  z-index: 10;
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
