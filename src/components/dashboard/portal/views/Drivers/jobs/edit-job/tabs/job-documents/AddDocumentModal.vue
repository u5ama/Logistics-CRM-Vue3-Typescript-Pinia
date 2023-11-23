<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { addJobDocumentFormSchema } from "@utils/schemas";
import Button from "primevue/button";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import UserProfileFormTextField from "@dashboard/portal/views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import FileUpload, { type FileUploadSelectEvent } from "primevue/fileupload";
import { useToast } from "vue-toastification";
import { inject, onBeforeUnmount, onMounted, ref } from "vue";
import { editJobInjectionKey } from "@utils/injectionKeys";
import { useJobDocumentsStore } from "@stores/driver-jobs/documents";
import UserProfileFormDropdown from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormDropdown.vue";
import { useLoading } from "@hooks";

interface Props {
  open: boolean;
}

const emit = defineEmits(["close", "success"]);

defineProps<Props>();
const { jobId } = inject(editJobInjectionKey)!;
const isEditing = !!jobId;
const [isJobLoading, setJobLoading] = useLoading(isEditing);

const documentsStore = useJobDocumentsStore();
const { addDocument } = documentsStore;
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: addJobDocumentFormSchema,
  validateOnMount: false,
});

const video = ref(null);
const canvas = ref(null);
let videoStream = null;
let videoTrack: MediaStreamTrack | null = null;
let showCamera = ref(false);
let hideButton = ref(true);
let cameraImage = "";

onMounted(async () => {
  setJobLoading.stop();
});

//manual image through camera
onBeforeUnmount(() => {
  if (videoTrack) {
    videoTrack.stop();
  }
});
const takePhotoActive = () => {
  cameraSetup();
};
const cameraSetup = () => {
  showCamera.value = true;
  hideButton.value = false;
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.value.srcObject = stream;
      videoStream = stream;
      videoTrack = stream.getVideoTracks()[0];
    })
    .catch((error) => {
      console.log(error);
    });
};
const takePhoto = () => {
  const context = canvas.value.getContext("2d");
  canvas.value.width = video.value.videoWidth;
  canvas.value.height = video.value.videoHeight;
  context.drawImage(video.value, 0, 0);
  const image = canvas.value.toDataURL("image/png");
  console.log(image); // you can now do something with the image, like upload it to a server or display it in an image tag
  cameraImage = image;
};
//manual image through camera

const onSubmit = handleSubmit(
  async (values) => {
    const { title, hire_docket } = values;
    const success = await addDocument(
      jobId,
      title,
      hire_docket,
      cameraImage,
      uploadedFile.value
    );

    if (!success) return;
    useToast().success("Job Document uploaded Successfully!");
    emit("close");
  },
  (data) => console.log(data.errors)
);

const docket_status = [
  { name: "Yes", value: "Yes" },
  { name: "No", value: "No" },
];

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
          <StyledHeading class="mb-12"> Add Document </StyledHeading>
          <form
            class="flex flex-col gap-y-3 px-2 mx-auto"
            autocomplete="off"
            @submit.prevent="onSubmit"
          >
            <UserProfileFormTextField name="title" label="Document Name" />
            <UserProfileFormDropdown
              class="col-span-6"
              label="Is hire docket?"
              name="hire_docket"
              :options="docket_status"
              :loading="isJobLoading"
            />
            <label for="upload_file" class="text-slate-500 text-lg"
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
            <hr />
            OR
            <hr />
            <div>
              <button
                v-show="hideButton"
                type="button"
                class="p-button"
                @click="takePhotoActive"
              >
                Take Photo Through Camera
              </button>
              <div v-show="showCamera">
                <video ref="video" autoplay></video>
                <button type="button" class="p-button" @click="takePhoto">
                  Take Photo
                </button>
                <canvas class="mt-3" style="width: 300px" ref="canvas"></canvas>
              </div>
            </div>
            <div class="flex mt-5">
              <Button
                :loading="isSubmitting"
                label="Submit Document"
                type="submit"
                class="p-button p-button-primary w-full"
              />
            </div>
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
  overflow: scroll;
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
.p-button {
  color: #212529;
  margin-top: 10px;
  background: #ffc107;
  border: 1px solid #ffc107;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s,
    box-shadow 0.2s;
  border-radius: 3px;
}
@media only screen and (max-width: 600px) {
  .modal-mask {
    display: block !important;
    top: 50px;
  }
}
</style>
