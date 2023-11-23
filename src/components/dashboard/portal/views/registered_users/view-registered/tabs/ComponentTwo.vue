<script setup lang="ts">
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import { FontSize } from "@/types/styles";
import { defineProps, ref, watchEffect } from "vue";
import { API_BASE_URL } from "@utils/constants";

const files = [
  {
    id: 1,
    label: "Company Information Sheet",
    name: "company_info_sheet",
  },
  {
    id: 2,
    label: "Company Checklist",
    name: "company_checklist",
  },
  {
    id: 3,
    label: "Equipment Detail",
    name: "equipment_details",
  },
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
  {
    id: 8,
    label:
      'Copy of Public Liability Certificate of Currency <span class="star">*</span>',
    name: "public_liability_certificate",
  },
  {
    id: 9,
    label: "Copy of Equipment Insurance Certificate of Currency",
    name: "insurance_certificate_currency",
  },
  {
    id: 10,
    label:
      'Copy of WorkCover Certificate of Currency <span class="star">*</span>',
    name: "worker_certificate_currency",
  },
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

const uploadedFiles = ref<{ label: string; key: string; file: string }[]>([]);
const props = defineProps(["checklistFiles"]);
watchEffect(() => {
  if (props.checklistFiles.length > 0) {
    props.checklistFiles.forEach((uploadFile: { file_key: any; }, index: any) => {
      const fileObject = files.find((f) => f.name === uploadFile?.file_key);
      console.log(fileObject);
      if (fileObject) {
        uploadedFiles.value.push({
          label: fileObject.label,
          key: fileObject.name,
          file: `${API_BASE_URL}${uploadFile?.file_path}`,
        });
      }
    });
  }
});
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
            pack.
          </WidgetTypography>
        </div>
        <table class="table-auto w-full border border-collapse">
          <thead>
            <tr>
              <th class="px-4 py-2 border">File Name</th>
              <th class="px-4 py-2 border">File URL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(uploadedFile, index) in uploadedFiles" :key="index">
              <td>
                <p class="text-gray-800 text-xl mr-3" v-html="uploadedFile.label">
                </p>
              </td>
              <td>
                <p class="text-gray-800 text-xl mr-3">
                  <a
                    :href="uploadedFile.file"
                    target="_blank"
                    style="color: dodgerblue; text-decoration: underline"
                    >View / Download</a
                  >
                </p>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
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