<script setup lang="ts">
import { defineEmits, ref } from "vue";
import { useDropzone } from "vue3-dropzone";
import { useField } from "vee-validate";
import Button from "primevue/button";
import NewFileUpload from "@views/Register/Components/NewFileUpload.vue"; // adjust the path

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
      console.log(file);
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

const removeFileHandler = (key: string) => {
  const index = uploadedFiles.value.findIndex((f) => f.key === key);

  if (index !== -1) {
    uploadedFiles.value.splice(index, 1);
  }
};

const emit = defineEmits(["all-files"]);
const handleFilesData = (data: never[]) => {
  console.log(data);
  const fileObject = files.find((f) => f.name === data?.key);
  if (fileObject) {
    uploadedFiles.value.push({
      label: fileObject.label,
      key: fileObject.name,
      file: data?.file,
    });
  }
  emit("all-files", uploadedFiles);
};

</script>

<template>
  <div>
    <!-- Loop through uploaded files and display them -->
    <table>
      <tbody>
      <tr v-for="(uploadedFile, index) in uploadedFiles" :key="index">
        <td>
          <p class="text-gray-800 text-xl mr-3">{{ uploadedFile.label }}:</p>
        </td>
        <td>
          <p class="text-gray-800 text-xl mr-3">{{ uploadedFile.file.name }}</p>
        </td>
        <td>
          <Button
            icon="pi pi-times"
            class="p-button-rounded p-button-danger scale-75 -mb-1"
            @click="removeFileHandler(uploadedFile.key)"
          />
        </td>
      </tr>
      </tbody>
    </table>
    <!-- Loop through files and create file upload components -->
    <div class="mt-8 flex flex-col gap-y-3">
      <div class="grid lg:grid-cols-3 sm:grid-cols-1 gap-2 mb-4">
        <div v-for="(f, index) in files" :key="index" class="col-span-1">
          <!-- File upload component for each file -->
          <NewFileUpload :file="f" @pass-files="handleFilesData" />
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
