<script setup lang="ts">

import { defineProps, ref } from "vue";
import UserProfileFormTextField
  from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import { FontSize } from "@/types/styles";

const props = defineProps(["loading"]);
const operatorsRec = ref([
  {
    opt_given_name: "",
    opt_surname: "",
    opt_mobile: "",
    opt_hs_card_number: "",
    opt_hs_issuer: "",
    opt_driver_license: "",
    opt_driver_license_expiry: "",

    opt_given_name_n: "opt_give_name",
    opt_surname_n: "opt_surname",
    opt_mobile_n: "opt_mobile",
    opt_hs_card_number_n: "opt_hs_card_number",
    opt_hs_issuer_n: "opt_hs_issuer",
    opt_driver_license_n: "opt_driver_license",
    opt_driver_license_expiry_n: "opt_driver_license_expiry",
  }
]);

const deleteRow = (index: number) => {
  operatorsRec.value.splice(index, 1);
};

const addRow = () => {
  operatorsRec.value.push({
    opt_given_name: "",
    opt_surname: "",
    opt_mobile: "",
    opt_hs_card_number: "",
    opt_hs_issuer: "",
    opt_driver_license: "",
    opt_driver_license_expiry: "",

    opt_given_name_n: "opt_give_name",
    opt_surname_n: "opt_surname",
    opt_mobile_n: "opt_mobile",
    opt_hs_card_number_n: "opt_hs_card_number",
    opt_hs_issuer_n: "opt_hs_issuer",
    opt_driver_license_n: "opt_driver_license",
    opt_driver_license_expiry_n: "opt_driver_license_expiry",
  })
}
</script>



<template>
  <div>
    <div
      class="mt-8 flex flex-col gap-y-3">
      <div
        class="lg:grid grid-cols-3 sm:grid-cols-1 gap-3 mb-8"
        v-for="(p, index) in operatorsRec"
        :key="index"
      >
        <div class="lg:col-span-2 sm:col-span-1">
          <div class="mx-auto mt-19">
            <div class="grid grid-cols-3 gap-2">
              <UserProfileFormTextField label="Given Name:" :name="p.opt_given_name_n" :value="p.opt_given_name" />
              <UserProfileFormTextField label="Surname" :name="p.opt_surname_n" :value="p.opt_surname" />
              <UserProfileFormTextField label="Mobile" :name="p.opt_mobile_n" :value="p.opt_mobile" />
            </div>
            <WidgetTypography variant="title" class="mb-1" :size="FontSize.base">
              H&S Induction Card:
            </WidgetTypography>
            <div class="grid grid-cols-2 gap-2">
              <UserProfileFormTextField label="Card Number:" :name="p.opt_hs_card_number_n" :value="p.opt_hs_card_number" />
              <UserProfileFormTextField label="Issuer:" :name="p.opt_hs_issuer_n" :value="p.opt_hs_issuer" />
            </div>
            <WidgetTypography variant="title" class="mb-1" :size="FontSize.base">
              Drivers Licence Details:
            </WidgetTypography>
            <div class="grid grid-cols-2 gap-2">
              <UserProfileFormTextField label="Licence No:" :name="p.opt_driver_license_n" :value="p.opt_driver_license" />
              <UserProfileFormTextField label="Expiry:" :name="p.opt_driver_license_expiry_n" :value="p.opt_driver_license_expiry" />
            </div>
          </div>
        </div>
        <div class="lg:col-span-1 sm:col-span-1">
          <div class="mt-8">
            <button
              class="p-button p-button-primary"
              @click="addRow()"
              type="button"
            >
              Add More&nbsp; <i class="pi pi-plus"></i>
            </button>
            <button
              v-if="index !== 0"
              class="p-button p-button-danger ml-2"
              @click="deleteRow(index)"
              type="button"
            >
              Remove&nbsp; <i class="pi pi-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>