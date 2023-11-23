<script setup lang="ts">
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import { FontSize } from "@/types/styles";
</script>
<template>
  <div class="text-center" style="height: 100vh">
    <div class="mx-auto mt-20">
      <div class="">
        <WidgetTypography variant="title" class="mb-1"
        style="color: #DD9933"
        >
          Starbuck Plant Hire Pty Ltd
        </WidgetTypography>
      </div>
      <div class="mt-4">
        <WidgetTypography variant="title" class="mb-1"
        :size="FontSize.xl4"
        >
          INDEPENDENT CONTRACTOR
        </WidgetTypography>
      </div>
      <div class="mt-6">
        <WidgetTypography variant="title" class="mb-1"
        :size="FontSize.xl4"
        >
          REGISTRATION PACK
        </WidgetTypography>
      </div>
      <div class="mt-3">
        <WidgetTypography variant="title" class="mb-1"
        :size="FontSize.xs"
        >
          Note: To be eligible to register with Starbuck Plant Hire you must be a registered company or trust with a corporate trustee. Due to Starbuck Plant Hire’s Policy, we do not accept Sole
          Traders or Partnerships.
        </WidgetTypography>
      </div>
<!--      <div class="mt-3">
        <WidgetTypography variant="title" class="mb-1"
                          :size="FontSize.base"
        >
          ALL COMPLETED INDEPENDENT CONTRACTOR REGISTRATION PACKS MUST BE EITHER:
        </WidgetTypography>
      </div>
      <div class="mt-6">
        <WidgetTypography variant="title" class="mb-1"
                          :size="FontSize.sm"
        >
          POSTED OR DELIVERED TO OUR OFFICE: 15/882-900 Cooper Street, Somerton VIC 3062
        </WidgetTypography>
      </div>-->
<!--      <div class="mt-6">
        <WidgetTypography variant="title" class="mb-1"
                          :size="FontSize.sm"
        >
          EMAILED TO: register@starbuckgroup.com.au
        </WidgetTypography>
      </div>-->
      <div class="mt-6">
        <WidgetTypography variant="title" class="mb-1"
                          :size="FontSize.sm"
        >
          For any queries, please email <a class="emailLink" href="mailto:register@starbuckgroup.com.au">register@starbuckgroup.com.au</a>
          or call us on 03 8535 307
        </WidgetTypography>
      </div>
      <div class="mt-6">
        <WidgetTypography variant="title" class="mb-1"
                          :size="FontSize.xs"
        >
          All company and personal information is held and handled in the strictest confidence and
          will not be divulged to any parties without your prior approval
        </WidgetTypography>
      </div>
    </div>
  </div>
</template>

<style scoped>
.emailLink{
  color: blue;
  text-decoration: underline;
}
</style>