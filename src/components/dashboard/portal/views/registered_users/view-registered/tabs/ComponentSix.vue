<script setup lang="ts">
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import { FontSize, FontWeight } from "@/types/styles";
import UserProfileFormTextArea
  from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileTextArea.vue";

import Checkbox from 'primevue/checkbox';
import { ref, watchEffect } from "vue";
import { TaxInvoicePDF } from "@files";

const taxInvoiceCheck = ref('');
const allInfoCheck = ref('');

const emit = defineEmits(["selected-taxCheck"]);
const emitSelectedTaxChecklist = () => {
  // Emit an event to send the selectedChecklist data to the parent component
  emit('selected-taxCheck', taxInvoiceCheck.value);
}
const props = defineProps(["taxCheck","infoCheck"]);
watchEffect(() => {
  if (props.taxCheck) {
    taxInvoiceCheck.value = [...props.taxCheck];
  }
  if (props.infoCheck) {
    allInfoCheck.value = [...props.infoCheck];
  }
});
</script>
<template>
  <div>
    <div class="">
      <div class="mx-auto mt-10">
        <div class="">
          <div class="flex align-items-center">
            <Checkbox v-model="taxInvoiceCheck" inputId="ingredient1" name="taxInvoiceCheck" value="checked" @change="emitSelectedTaxChecklist"/>
            <label for="ingredient1" class="ml-2"> Acknowledge if you read and understand our Tax Invoice Information Sheet.
              <a :href="TaxInvoicePDF" target="_blank" style="color:dodgerblue; text-decoration: underline;">View</a> </label>
          </div>
        </div>
        <div class="mt-10">
          <WidgetTypography variant="title" class="mb-1" :size="FontSize.xl2">
            HOW DID YOU HEAR ABOUT US?
          </WidgetTypography>
        </div>
        <div class="">
          <WidgetTypography variant="title" class="mb-1" :size="FontSize.sm"  :weight="FontWeight.normal">
            Briefly state how you heard about Starbuck Plant Hire
          </WidgetTypography>
        </div>
        <div class="">
          <UserProfileFormTextArea label="" name="about_us" />
        </div>
        <div class="">
          <WidgetTypography variant="title" class="mb-1" :size="FontSize.sm"  :weight="FontWeight.normal">
            Starbuck Plant Hire assumes the responsibility to ensure that all contractors comply with safety, regulatory and industry requirements. To achieve this, we must hold copies of all relevant and
            current information for you, your operator/s and your equipment. All company and personal information is held and handled in confidence and is used for the purpose of which it was
            collected. Where permitted by law, Starbuck Plant Hire may share information provided on this form to third parties to comply with legal or regulatory requirements.
          </WidgetTypography>
        </div>
        <div class="mt-5">
          <Checkbox v-model="allInfoCheck" inputId="ingredient1" name="allInfoCheck" value="checked" @change="emitSelectedInfoChecklist"/>
          <label for="ingredient1" class="ml-2">  I hereby acknowledge that the information provided in the Independent Contractor Registration Pack is true and accurate to the best of my knowledge.
          </label>
        </div>
      </div>
    </div>
  </div>
</template>