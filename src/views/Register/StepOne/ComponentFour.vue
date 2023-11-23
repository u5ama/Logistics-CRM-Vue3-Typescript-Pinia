<script setup lang="ts">
import { FontSize } from "@/types/styles";
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import FileUpload, { type FileUploadSelectEvent } from "primevue/fileupload";
import { useField } from "vee-validate";
import { ref, watchEffect } from "vue";
import DateInput from "@components/form/DateInput.vue";
import InputText from "primevue/inputtext";
import SignUpFormTextField from "@views/Register/Components/SignUpFormTextField.vue";

const emit = defineEmits(["selected-operator","work-file","public-file","equipment-file"]);
//Work File
const {
  value: uploadedWorkFile,
  errorMessage: uploadedWorkFileError,
  setValue: setUploadedWorkFile,
  resetField: clearUploadedWorkFile,
} = useField<File>("work_cover_file");

const fileChooseHandlerWork = (event: FileUploadSelectEvent) => {
  const file = event.files[0];
  setUploadedWorkFile(file);
  emit('work-file', uploadedWorkFile.value);
};
const removeWorkFileHandler = () => {
  clearUploadedWorkFile();
};

//Public File
const {
  value: uploadedPublicFile,
  errorMessage: uploadedPublicFileError,
  setValue: setUploadedPublicFile,
  resetField: clearUploadedPublicFile,
} = useField<File>("public_policy_file");

const fileChooseHandlerPublic = (event: FileUploadSelectEvent) => {
  const file = event.files[0];
  setUploadedPublicFile(file);
  emit('public-file', uploadedPublicFile.value);
};
const removePublicFileHandler = () => {
  clearUploadedPublicFile();
};

//Public File
const {
  value: uploadedEquipmentFile,
  errorMessage: uploadedEquipmentFileError,
  setValue: setUploadedEquipmentFile,
  resetField: clearUploadedEquipmentFile,
} = useField<File>("equipment_policy_file");

const fileChooseHandlerEquipment = (event: FileUploadSelectEvent) => {
  const file = event.files[0];
  setUploadedEquipmentFile(file);
  emit('equipment-file', uploadedEquipmentFile.value);
};
const removeEquipmentFileHandler = () => {
  clearUploadedEquipmentFile();
};
const operatorsRec = ref([
  {
    opt_given_name: "",
    opt_surname: "",
    opt_mobile: "",
    opt_hs_card_number: "",
    opt_hs_issuer: "",
    opt_driver_license: "",
    opt_driver_license_expiry: "",
    opt_ticket_license: "",
    opt_ticket_license_expiry: "",
    opt_other_card: "",
    opt_other_card_number: "",
    opt_other_card_issue_date: "",

    opt_given_name_n: "opt_give_name",
    opt_surname_n: "opt_surname",
    opt_mobile_n: "opt_mobile",
    opt_hs_card_number_n: "opt_hs_card_number",
    opt_hs_issuer_n: "opt_hs_issuer",
    opt_driver_license_n: "opt_driver_license",
    opt_driver_license_expiry_n: "opt_driver_license_expiry",
    opt_ticket_license_n: "opt_ticket_license",
    opt_ticket_license_expiry_n: "opt_ticket_license_expiry",
    opt_other_card_n: "opt_other_card",
    opt_other_card_number_n: "opt_other_card_number",
    opt_other_card_issue_date_n: "opt_other_card_issue_date",
  }
]);

const emitSelectedArray = () => {
  emit('selected-operator', operatorsRec.value);
}

watchEffect(() => {
  emitSelectedArray();
});
const deleteRow = (index: number) => {
  operatorsRec.value.splice(index, 1);
  emitSelectedArray();
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
    opt_ticket_license: "",
    opt_ticket_license_expiry: "",
    opt_other_card: "",
    opt_other_card_number: "",
    opt_other_card_issue_date: "",

    opt_given_name_n: "opt_give_name",
    opt_surname_n: "opt_surname",
    opt_mobile_n: "opt_mobile",
    opt_hs_card_number_n: "opt_hs_card_number",
    opt_hs_issuer_n: "opt_hs_issuer",
    opt_driver_license_n: "opt_driver_license",
    opt_driver_license_expiry_n: "opt_driver_license_expiry",
    opt_ticket_license_n: "opt_ticket_license",
    opt_ticket_license_expiry_n: "opt_ticket_license_expiry",
    opt_other_card_n: "opt_other_card",
    opt_other_card_number_n: "opt_other_card_number",
    opt_other_card_issue_date_n: "opt_other_card_issue_date",
  })
  emitSelectedArray();
}
</script>
<template>
  <div>
    <div class="">
      <div class="mx-auto mt-19">
        <div class="mt-8 flex flex-col gap-y-2">
          <!-- INSURANCES-->
          <div class="">
            <WidgetTypography variant="title" class="mb-1 bg-brand text-white text-center py-4 rounded-xl">
              INSURANCES
            </WidgetTypography>
          </div>
          <div>
            <WidgetTypography variant="title" class="mb-1" :size="FontSize.base">
              WORK COVER
            </WidgetTypography>
            <div class="grid grid-cols-3 gap-2">
              <SignUpFormTextField label="Policy Number:" name="work_policy_number" class="mt-8"/>
              <DateInput label="Expiry Date:" name="work_policy_expiry_date"/>
              <div class="mt-2">
                <label for="work_cover_file" class="text-slate-500 text-sm -mb-2"
                >Upload Work Cover File<span class="star_new"> *</span></label
                >
                <FileUpload
                  id="work_cover_file"
                  mode="basic"
                  name="work_cover_file"
                  chooseIcon="pi pi-times"
                  :customUpload="true"
                  @uploader="removeWorkFileHandler"
                  @select="fileChooseHandlerWork"
                />
                <small
                  class="p-error -mt-2"
                  :class="{ invisible: !uploadedWorkFileError }"
                >
                  {{ uploadedWorkFileError }}
                </small>
              </div>
            </div>
          </div>
          <div>
            <WidgetTypography variant="title" class="mb-1" :size="FontSize.base">
              PUBLIC LIABILITY
            </WidgetTypography>
            <div class="grid grid-cols-3 gap-2">
              <SignUpFormTextField label="Policy Number:" name="public_policy_number" class="mt-8"/>
              <DateInput label="Expiry Date:" name="public_policy_expiry_date"/>
              <div class="mt-2">
                <label for="public_policy_file" class="text-slate-500 text-sm -mb-2"
                >Upload Public Liability File<span class="star_new"> *</span></label
                >
                <FileUpload
                  id="public_policy_file"
                  mode="basic"
                  name="public_policy_file"
                  chooseIcon="pi pi-times"
                  :customUpload="true"
                  @uploader="removePublicFileHandler"
                  @select="fileChooseHandlerPublic"
                />
                <small
                  class="p-error -mt-2"
                  :class="{ invisible: !uploadedPublicFileError }"
                >
                  {{ uploadedPublicFileError }}
                </small>
              </div>
            </div>
          </div>
          <div>
            <WidgetTypography variant="title" class="mb-1" :size="FontSize.base">
              EQUIPMENT INSURANCE
            </WidgetTypography>
            <div class="grid grid-cols-3 gap-2">
              <SignUpFormTextField label="Policy Number:" name="equipment_policy_number" class="mt-8"/>
              <DateInput label="Expiry Date:" name="equipment_policy_expiry_date"/>
              <div class="mt-2">
                <label for="equipment_policy_file" class="text-slate-500 text-sm -mb-2"
                >Upload Equipment Insurance File<span class="star_new"> *</span></label
                >
                <FileUpload
                  id="equipment_policy_file"
                  mode="basic"
                  name="equipment_policy_file"
                  chooseIcon="pi pi-times"
                  :customUpload="true"
                  @uploader="removeEquipmentFileHandler"
                  @select="fileChooseHandlerEquipment"
                />
                <small
                  class="p-error -mt-2"
                  :class="{ invisible: !uploadedEquipmentFileError }"
                >
                  {{ uploadedEquipmentFileError }}
                </small>
              </div>
            </div>
          </div>
          <div class="">
            <WidgetTypography variant="title" class="mb-1" :size="FontSize.xs">
              NOTE: Starbuck Plant Hire require all pages of each policy. Starbuck Plant Hire must receive a copy of the Certificate of Currency for each policy. Tax invoices will not be accepted.
            </WidgetTypography>
          </div>
          <div class="">
            <WidgetTypography variant="title" class="mb-1 bg-brand text-white text-center py-4 rounded-xl">
              OPERATOR RECORD:
            </WidgetTypography>
          </div>
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
                        <div class="col-span-1">
                          <SignUpFormTextField label="Given Name:" :name="p.opt_given_name_n" :value="p.opt_given_name" class="mt-8"/>
<!--                          <label-->
<!--                            :for="p.opt_given_name_n"-->
<!--                            class="inline-block text-xs text-slate-500 ml-3 mb-2"-->
<!--                          >-->
<!--                            Given Name:-->
<!--                          </label>-->
<!--                          <br />-->
<!--                          <InputText-->
<!--                            style="width: 100%"-->
<!--                            v-model="p.opt_given_name"-->
<!--                            :name="p.opt_given_name_n"-->
<!--                            :id="p.opt_given_name_n"-->
<!--                          />-->
                        </div>
                        <div class="col-span-1">
                          <label
                            :for="p.opt_surname_n"
                            class="inline-block text-xs text-slate-500 ml-3 mb-2"
                          >
                            Surname:
                          </label>
                          <br />
                          <InputText
                            style="width: 100%"
                            v-model="p.opt_surname"
                            :name="p.opt_surname_n"
                            :id="p.opt_surname_n"
                          />
                        </div>
                        <div class="col-span-1">
                          <label
                            :for="p.opt_mobile_n"
                            class="inline-block text-xs text-slate-500 ml-3 mb-2"
                          >
                            Mobile:
                          </label>
                          <br />
                          <InputText
                            style="width: 100%"
                            v-model="p.opt_mobile"
                            :name="p.opt_mobile_n"
                            :id="p.opt_mobile_n"
                          />
                        </div>
                      </div>
                      <WidgetTypography variant="title" class="mb-1 mt-5" :size="FontSize.base">
                        OH&S Construction Induction Card:
                      </WidgetTypography>
                      <div class="grid grid-cols-2 gap-2">
                        <div class="col-span-1">
                          <label
                            :for="p.opt_hs_card_number_n"
                            class="inline-block text-xs text-slate-500 ml-3 mb-2"
                          >
                            Card Number:
                          </label>
                          <br />
                          <InputText
                            style="width: 100%"
                            v-model="p.opt_hs_card_number"
                            :name="p.opt_hs_card_number_n"
                            :id="p.opt_hs_card_number_n"
                          />
                        </div>
                        <div class="col-span-1">
                          <label
                            :for="p.opt_hs_issuer_n"
                            class="inline-block text-xs text-slate-500 ml-3 mb-2"
                          >
                            Issuer:
                          </label>
                          <br />
                          <InputText
                            style="width: 100%"
                            v-model="p.opt_hs_issuer"
                            :name="p.opt_hs_issuer_n"
                            :id="p.opt_hs_issuer_n"
                          />
                        </div>
                      </div>
                      <WidgetTypography variant="title" class="mb-1" :size="FontSize.base">
                        Drivers Licence Details:
                      </WidgetTypography>
                      <div class="grid grid-cols-2 gap-2">
                        <div class="col-span-1">
                          <label
                            :for="p.opt_driver_license_n"
                            class="inline-block text-xs text-slate-500 ml-3 mb-2"
                          >
                            Licence No:
                          </label>
                          <br />
                          <InputText
                            style="width: 100%"
                            v-model="p.opt_driver_license"
                            :name="p.opt_driver_license_n"
                            :id="p.opt_driver_license_n"
                          />
                        </div>
                        <div class="col-span-1">
                          <label
                            :for="p.opt_driver_license_expiry_n"
                            class="inline-block text-xs text-slate-500 ml-3 mb-2"
                          >
                            Expiry:
                          </label>
                          <br />
                          <InputText
                            type="date"
                            style="width: 100%"
                            v-model="p.opt_driver_license_expiry"
                            :name="p.opt_driver_license_expiry_n"
                            :id="p.opt_driver_license_expiry_n"
                          />
                        </div>
                      </div>
                      <WidgetTypography variant="title" class="mb-1 mt-5" :size="FontSize.base">
                        Operator’s Tickets/Licenses:
                      </WidgetTypography>
                      <div class="grid grid-cols-2 gap-2">
                        <div class="col-span-1">
                          <label
                            :for="p.opt_ticket_license_n"
                            class="inline-block text-xs text-slate-500 ml-3 mb-2"
                          >
                            Licence No:
                          </label>
                          <br />
                          <InputText
                            style="width: 100%"
                            v-model="p.opt_ticket_license"
                            :name="p.opt_ticket_license_n"
                            :id="p.opt_ticket_license_n"
                          />
                        </div>
                        <div class="col-span-1">
                          <label
                            :for="p.opt_ticket_license_expiry_n"
                            class="inline-block text-xs text-slate-500 ml-3 mb-2"
                          >
                            Expiry:
                          </label>
                          <br />
                          <InputText
                            type="date"
                            style="width: 100%"
                            v-model="p.opt_ticket_license_expiry"
                            :name="p.opt_ticket_license_expiry_n"
                            :id="p.opt_ticket_license_expiry_n"
                          />
                        </div>
                      </div>
                      <WidgetTypography variant="title" class="mb-1 mt-5" :size="FontSize.base">
                        Others:
                      </WidgetTypography>
                      <div class="grid grid-cols-3 gap-2">
                        <div class="col-span-1">
                          <label
                            :for="p.opt_other_card_n"
                            class="inline-block text-xs text-slate-500 ml-3 mb-2"
                          >
                            Description:
                          </label>
                          <br />
                          <InputText
                            style="width: 100%"
                            v-model="p.opt_other_card"
                            :name="p.opt_other_card_n"
                            :id="p.opt_other_card_n"
                          />
                        </div>
                        <div class="col-span-1">
                          <label
                            :for="p.opt_other_card_number_n"
                            class="inline-block text-xs text-slate-500 ml-3 mb-2"
                          >
                            Card No:
                          </label>
                          <br />
                          <InputText
                            style="width: 100%"
                            v-model="p.opt_other_card_number"
                            :name="p.opt_other_card_number_n"
                            :id="p.opt_other_card_number_n"
                          />
                        </div>
                        <div class="col-span-1">
                          <label
                            :for="p.opt_other_card_issue_date_n"
                            class="inline-block text-xs text-slate-500 ml-3 mb-2"
                          >
                            Issue Date:
                          </label>
                          <br />
                          <InputText
                            type="date"
                            style="width: 100%"
                            v-model="p.opt_other_card_issue_date"
                            :name="p.opt_other_card_issue_date_n"
                            :id="p.opt_other_card_issue_date_n"
                          />
                        </div>
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
        </div>
      </div>
    </div>
  </div>
</template>