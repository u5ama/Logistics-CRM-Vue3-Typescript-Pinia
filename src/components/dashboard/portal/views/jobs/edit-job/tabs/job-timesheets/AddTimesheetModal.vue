<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { addTimeSheetFormSchema } from "@utils/schemas";
import Button from "primevue/button";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import { useToast } from "vue-toastification";
import { inject, onMounted } from "vue";
import { editJobInjectionKey } from "@utils/injectionKeys";
import { useJobTimeSheetStore } from "@stores/jobs/timesheets";
import InvoiceFormDropdown from "@dashboard-views/invoicing/InvoiceFormDropdown.vue";
import { useLoading } from "@hooks";
import { storeToRefs } from "pinia";
import Timeinput from "@components/form/Timeinput.vue";
import FileUpload, { type FileUploadSelectEvent } from "primevue/fileupload";
import { useJobDriversStore } from "@stores/jobs/drivers";

interface Props {
  open: boolean;
}

const emit = defineEmits(["close", "success"]);

defineProps<Props>();
const { jobId } = inject(editJobInjectionKey)!;
const isEditing = !!jobId;
const timeSheetStore = useJobTimeSheetStore();
const { allDrivers } = storeToRefs(timeSheetStore);
const { addTimeSheet, allDriversList } = timeSheetStore;
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: addTimeSheetFormSchema,
  validateOnMount: false,
});
const driversStore = useJobDriversStore();
const { jobAssets } = storeToRefs(driversStore);
const { getAllJobAssets } = driversStore;

const [isJobLoading, setJobLoading] = useLoading(isEditing);

onMounted(async () => {
  setJobLoading.start();
  await allDriversList();
  await getAllJobAssets(jobId);
  setJobLoading.stop();
});
const onSubmit = handleSubmit(
  async (values) => {
    const { user_id, startTime, endTime, is_confirmed, asset_id } = values;
    const success = await addTimeSheet(
      jobId,
      user_id,
      startTime,
      endTime,
      asset_id,
      uploadedFile.value
    );

    if (!success) return;
    useToast().success("Job TimeSheet added Successfully!");
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

          <StyledHeading class="mb-12"> Create New TimeSheet </StyledHeading>

          <form
            class="flex flex-col gap-y-4 px-2 mx-auto"
            autocomplete="off"
            @submit.prevent="onSubmit"
          >
            <InvoiceFormDropdown
              class="col-span-6"
              label="Choose User"
              name="user_id"
              :options="allDrivers"
              :loading="isJobLoading"
            />
            <InvoiceFormDropdown
              class="col-span-6"
              label="Choose Asset"
              name="asset_id"
              :options="jobAssets"
              :loading="isJobLoading"
            />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Timeinput label="Choose Start Time" name="startTime" />
              <Timeinput label="Choose End Time" name="endTime" />
            </div>

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
              label="Allocate"
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
