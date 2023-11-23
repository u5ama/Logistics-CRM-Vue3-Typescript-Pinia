<script setup lang="ts">
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import { FontSize } from "@/types/styles";
import Button from "primevue/button";
import { useDropzone } from "vue3-dropzone";
import { useField } from "vee-validate";
import { ref } from "vue";

const files = [
  // {
  //   id: 1,
  //   label: "Company Information Sheet",
  //   name: "company_info_sheet",
  // },
  // {
  //   id: 2,
  //   label: "Company Checklist",
  //   name: "company_checklist",
  // },
  // {
  //   id: 3,
  //   label: "Equipment Detail",
  //   name: "equipment_details",
  // },
  {
    id: 4,
    label: "OHS Induction Card (Colour Copy, front and Back)",
    name: "ohs_induction_card",
  },
  {
    id: 5,
    label:
      'Driver’s License (Colour Copy, front and Back) <span class="star"\'>*</span>',
    name: "driver_license",
  },
  {
    id: 6,
    label: "Operator’s Ticket/s (Colour Copy, front and Back)",
    name: "operator_ticket",
  },
  {
    id: 7,
    label:
      'Certificate of Incorporation or Business Name Registration <span class="star">*</span>',
    name: "certificate_of_business",
  },
  // {
  //   id: 8,
  //   label:
  //     'Copy of Public Liability Certificate of Currency <span class="star">*</span>',
  //   name: "public_liability_certificate",
  // },
  // {
  //   id: 9,
  //   label: "Copy of Equipment Insurance Certificate of Currency",
  //   name: "insurance_certificate_currency",
  // },
  // {
  //   id: 10,
  //   label:
  //     'Copy of WorkCover Certificate of Currency <span class="star">*</span>',
  //   name: "worker_certificate_currency",
  // },
  {
    id: 11,
    label:
      'Copy of VicRoads Vehicle Registration Report <span class="star">*</span>',
    name: "vehicle_registration_report",
  },
  {
    id: 12,
    label: "GST Registration Letter",
    name: "gst_registration_letter",
  },
  {
    id: 13,
    label:
      'Copy of Hazard Risk Assessment/s (all pages) <span class="star">*</span>',
    name: "hazard_risk_assessment",
  },
  {
    id: 14,
    label: "Photos of Plant / Equipment",
    name: "photos_of_plant",
  },
  {
    id: 15,
    label: "Copy of EPA Permit/s & License/s (where applicable)",
    name: "epa_permits",
  },
  {
    id: 16,
    label: "Copy of PBS Permit/s & Design Approval/s (where applicable)",
    name: "pbs_permits",
  },
];
const uploadedFiles = ref<{ label: string; key: string; file: File }[]>([]);
const fileKey = ref();

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop: (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const existingFile = uploadedFiles.value.find(
        (f) => f.file.name === file.name
      );
      if (!existingFile) {
        const fileObject = files.find((f) => f.id === fileKey.value);
        if (fileObject) {
          uploadedFiles.value.push({
            label: fileObject.label,
            key: fileObject.name,
            file: file,
          });
        }
      }
    });
  },
  multiple: false,
});

const {
  value: selectedFile,
  errorMessage: fileSelectError,
  resetField: clearSelectedFile,
} = useField<File>("upload_file");

const removeSelectedFile = () => {
  clearSelectedFile();
};

const removeFileHandler = (uploadedFile: {
  id: number;
  label: string;
  key: string;
  file: File;
}) => {
  // Remove the selected file from the uploadedFiles array
  const index = uploadedFiles.value.findIndex(
    (f) => f.file.name === uploadedFile.file.name
  );
  if (index !== -1) {
    uploadedFiles.value.splice(index, 1);
  }
  passFilesToParent(uploadedFile.id);
};

const emit = defineEmits(["pass-files"]);
const handleChange = (id: number) => {
  passFilesToParent(id);
};
const passFilesToParent = (key: number) => {
  console.log(key);
  fileKey.value = key;
  console.log(fileKey.value);
  // Emit an event to the parent component with the uploadedFiles array
  emit("pass-files", uploadedFiles);
};
</script>
<template>
  <div>
    <div class="">
      <div class="mx-auto mt-20">
        <div class="mt-8">
          <WidgetTypography
            variant="title"
            class="mb-1 bg-brand text-white text-center py-4 rounded-xl"
          >
            DOCUMENTS
          </WidgetTypography>
        </div>
        <div class="mt-3">
          <WidgetTypography variant="title" class="mb-1" :size="FontSize.xs">
            The below documents must be provided along with your registration
            pack. Please ensure you only provide copies of original document.
            <br /><span class="star">*</span> for required documents.
          </WidgetTypography>
        </div>
        <table>
          <tbody>
            <tr v-for="(uploadedFile, index) in uploadedFiles" :key="index">
                <td>
                  <p class="text-gray-800 text-xl mr-3">{{ uploadedFile.label }}:</p>
                </td>
              <td>
                <p class="text-gray-800 text-xl mr-3">
                  {{ uploadedFile.file.name }}
                </p>
              </td>
              <td>
                <Button
                  icon="pi pi-times"
                  class="p-button-rounded p-button-danger scale-75 -mb-1"
                  @click="removeFileHandler(uploadedFile.file.id)"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="mt-8 flex flex-col gap-y-3">
          <div class="grid lg:grid-cols-3 sm:grid-cols-1 gap-2 mb-4">
            <div v-for="(f, index) in files" :key="index" class="col-span-1">
              <div class="flex items-center mb-4" v-if="selectedFile">
                <p class="text-gray-800 text-xl mr-3">
                  {{ selectedFile.name }}
                </p>
                <Button
                  icon="pi pi-times"
                  class="p-button-rounded p-button-danger scale-75 -mb-1"
                  @click="removeSelectedFile"
                />
              </div>
              <label
                :for="f.name + '_' + index"
                class="text-slate-500 text-sm -mb-2"
                v-html="f.label"
              >
              </label>
              <div
                v-bind="getRootProps()"
                class="h-28 w-full bg-brand-100 rounded-md border border-brand-300 border-dashed grid place-content-center"
                :class="{
                  'border-red-500': fileSelectError,
                  'text-red-500': fileSelectError,
                  'text-slate-700': !fileSelectError,
                }"
              >
                <input
                  :id="f.name + '_' + index"
                  v-bind="getInputProps()"
                  @change="() => handleChange(f.id)"
                />
                <p v-if="isDragActive">Drop the file here ...</p>
                <p v-else>
                  Drag 'n' Drop a file here, or click to select a file
                </p>
              </div>
              <small
                class="p-error -mt-2"
                :class="{ invisible: !fileSelectError }"
              >
                {{ fileSelectError }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.star {
  color: red;
  font-size: 24px;
  position: relative;
  top: 8px;
}
</style>