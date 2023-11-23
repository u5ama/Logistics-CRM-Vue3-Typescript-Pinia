<script setup lang="ts">

import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import UserProfileFormDropdown
  from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormDropdown.vue";
import { useLoading } from "@hooks";
import { FontSize } from "@/types/styles";
import UserProfileFormPassword
  from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormPassword.vue";
import SignUpFormTextField from "@views/Register/Components/SignUpFormTextField.vue";

const [isOptionsLoading, setOptionsLoading] = useLoading();
const tradings = [
  { name: "Company", value: "company" },
  { name: "Trust", value: "trust" },
];

</script>

<template>
  <div>
    <div class="">
      <div class="mx-auto">
        <div class="">
          <WidgetTypography variant="title" class="mb-1 bg-brand text-white text-center py-4 rounded-xl">
            COMPANY INFORMATION
          </WidgetTypography>
        </div>

        <div class="mt-8 flex flex-col gap-y-2">
          <SignUpFormTextField label="FULL COMPANY NAME:" name="company_name" />

          <div class="grid grid-cols-2 gap-2">
            <UserProfileFormDropdown
              label="TRADING NAME"
              name="trading_name"
              :options="tradings"
              :loading="isOptionsLoading"
            />
            <SignUpFormTextField label="CORPORATE TRUSTEE:" name="corporate_trustee" class="mt-7"/>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <SignUpFormTextField label="ABN:" name="abn"/>
            <SignUpFormTextField label="ACN:" name="acn"/>
          </div>

          <SignUpFormTextField label="COMPANY DIRECTOR/S:" name="company_director"/>

          <div class="grid grid-cols-2 gap-2">
            <SignUpFormTextField label="MAIN CONTACT PERSON:" name="contact_person"/>
            <SignUpFormTextField label="MOBILE:" name="mobile"/>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <SignUpFormTextField label="PHONE:" name="phone"/>
            <SignUpFormTextField label="E-MAIL ADDRESS:" name="email"/>
            <UserProfileFormPassword label="Password:" name="password"/>
          </div>

          <!-- Business Address-->
          <div class="">
            <WidgetTypography variant="title" class="mb-1" :size="FontSize.sm" style="color: #DD9933">
              BUSINESS ADDRESS:
            </WidgetTypography>
          </div>
          <SignUpFormTextField label="Street:" name="business_number_street"/>
          <div class="grid grid-cols-3 gap-2">
            <SignUpFormTextField label="Suburb:" name="business_suburb"/>
            <SignUpFormTextField label="State:" name="business_state"/>
            <SignUpFormTextField label="Postcode:" name="business_post_code"/>
          </div>

          <!-- Postal Address-->
          <div class="">
            <WidgetTypography variant="title" class="mb-1" :size="FontSize.sm" style="color: #DD9933">
              POSTAL ADDRESS: (If different from above)
            </WidgetTypography>
          </div>
          <SignUpFormTextField label="Street:" name="postal_number_street"/>
          <div class="grid grid-cols-3 gap-2">
            <SignUpFormTextField label="Suburb:" name="postal_suburb"/>
            <SignUpFormTextField label="State:" name="postal_state"/>
            <SignUpFormTextField label="Postcode:" name="postal_post_code"/>
          </div>

          <!-- Banking-->
          <div class="">
            <WidgetTypography variant="title" class="mb-1" :size="FontSize.sm" style="color: #DD9933">
              BANK DETAILS
            </WidgetTypography>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <SignUpFormTextField label="BSB:" name="bsb"/>
            <SignUpFormTextField label="ACCOUNT NO:" name="account_number"/>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <SignUpFormTextField label="ACCOUNT NAME:" name="account_name"/>
            <SignUpFormTextField label="BANKING CORPORATION:" name="banking_corporation"/>
          </div>
          <div class="">
            <WidgetTypography variant="title" class="mb-1"
                              :size="FontSize.xs"
            >
              NOTE: Starbuck Plant Hire require all banking detail changes to be submitted in writing. Please allow up to 10 business days for details to be updated.
            </WidgetTypography>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>