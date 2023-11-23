<script setup lang="ts">
import { useForm } from "vee-validate";
import { signupFormSchema } from "@utils/schemas";
import ButtonVue from "@components/UI/ButtonVue.vue";
import { useAuthStore } from "@stores/auth";
import RegisterLayout from "@layouts/RegisterLayout.vue";
import { starbuckLogoBlack } from "@images";
import ComponentOne from "@views/Register/StepOne/ComponentOne.vue";
import ComponentThree from "@views/Register/StepOne/ComponentThree.vue";
import ComponentFour from "@views/Register/StepOne/ComponentFour.vue";
import ComponentFive from "@views/Register/StepOne/ComponentFive.vue";
import ComponentSix from "@views/Register/StepOne/ComponentSix.vue";
import { ref, type Ref } from "vue";
import TruckComponent from "@views/Register/StepTwo/TruckComponent.vue";
import TrailerComponent from "@views/Register/StepTwo/TrailerComponent.vue";
import PlantComponent from "@views/Register/StepTwo/PlantComponent.vue";
import type { IUserData } from "@app-types/user";
import TestComponent from "@views/Register/StepOne/testComponent.vue";
import { useToast } from "vue-toastification";

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: signupFormSchema,
});

const onSubmit = handleSubmit(async (values) => {
  const user = values as IUserData;
  user.TaxCheck = selectedTaxCheck.value;
  user.infoCheck = selectedInfoCheck.value;

  user.operatorDetails = operatorData.value;
  user.complianceChecklist = selectedChecklistData.value;
  user.equipmentChecklist = equipmentChecklistData.value;
  user.requirementChecklist = requirementChecklistData.value;
  user.hireChecklist = hireChecklistData.value;

  user.truckDetails = truckData.value;
  user.trailerDetails = trailerData.value;
  user.plantDetails = plantData.value;

  user.checklistFiles = checklistFiles.value;
  // await signup(username, email, password);
  await registerUser(user, insuranceFiles.value, checklistFiles.value);
  useToast().success("Form submitted successfully! Admin will contact soon.");
});

const authStore = useAuthStore();
const { registerUser } = authStore;

const backButton = ref(false);
const nextButton = ref(true);

const stepNext = () => {
  nextButton.value = false;
  backButton.value = true;
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
const stepBack = () => {
  nextButton.value = true;
  backButton.value = false;
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

interface  InsuranceFileType extends File {
  key: string; // Add a key property to identify the file
  file: File;
};
const selectedTaxCheck = ref("");
const selectedInfoCheck = ref("");
const workFile: Ref<File | null> = ref(null);
const publicFile: Ref<File | null> = ref(null);
const equipmentFile: Ref<File | null> = ref(null);
const selectedChecklistData = ref([]);
const equipmentChecklistData = ref([]);
const requirementChecklistData = ref([]);
const hireChecklistData = ref([]);
const truckData = ref([]);
const trailerData = ref([]);
const plantData = ref([]);
const operatorData = ref([]);
const checklistFiles = ref([]);
const insuranceFiles: Ref<InsuranceFileType[]> = ref([]);

const handleSelectedTaxCheck = (data: string) => {
  selectedTaxCheck.value = data;
};
const handleSelectedInfoCheck = (data: string) => {
  selectedInfoCheck.value = data;
};
const handleSelectedChecklist = (data: never[]) => {
  selectedChecklistData.value = data;
};
const equHandleSelectedChecklist = (data: never[]) => {
  equipmentChecklistData.value = data;
};
const reqHandleSelectedChecklist = (data: never[]) => {
  requirementChecklistData.value = data;
};
const hireHandleSelectedChecklist = (data: never[]) => {
  hireChecklistData.value = data;
};
const hireHandleSelectedTruck = (data: never[]) => {
  truckData.value = data;
};
const hireHandleSelectedTrailer = (data: never[]) => {
  trailerData.value = data;
};
const hireHandleSelectedPlant = (data: never[]) => {
  plantData.value = data;
};
const handleSelectedOperator = (data: never[]) => {
  operatorData.value = data;
};
const handleFilesData = (data: never[]) => {
  checklistFiles.value = data.value;
};
const handleSelectedWorkFile = (data: File) => {
  workFile.value = data;
  const key = 'work_cover_file';
  const blobUrl = URL.createObjectURL(data); // Get the Blob URL
  const blobFile = new File([data], data.name, { type: data.type }); // Create a Blob File
  const insuranceFile: InsuranceFileType = { key, file: blobFile };
  insuranceFiles.value.push(insuranceFile);
};

const handleSelectedPublicFile = (data: File) => {
  publicFile.value = data;
  const key = 'public_policy_file';
  const blobUrl = URL.createObjectURL(data);
  const blobFile = new File([data], data.name, { type: data.type });
  const insuranceFile: InsuranceFileType = { key, file: blobFile };
  insuranceFiles.value.push(insuranceFile);
};

const handleSelectedEquipmentFile = (data: File) => {
  equipmentFile.value = data;
  const key = 'equipment_policy_file';
  const blobUrl = URL.createObjectURL(data);
  const blobFile = new File([data], data.name, { type: data.type });
  const insuranceFile: InsuranceFileType = { key, file: blobFile };
  insuranceFiles.value.push(insuranceFile);
};
</script>

<template>
  <RegisterLayout>
    <main>
      <div class="flex max-w-sm">
        <RouterLink to="/">
          <img class="w-52" :src="starbuckLogoBlack" alt="starbuck logo" />
        </RouterLink>
      </div>
      <form
        class="flex flex-col gap-y-4 px-40 mb-10"
        action="#"
        autocomplete="off"
        @submit.prevent="onSubmit"
      >
        <div class="stepOne" v-show="nextButton">
          <ComponentOne />
          <ComponentThree />
          <ComponentFour
            @selected-operator="handleSelectedOperator"
            @work-file="handleSelectedWorkFile"
            @public-file="handleSelectedPublicFile"
            @equipment-file="handleSelectedEquipmentFile"
          />
          <ComponentFive
            @selected-checklist="handleSelectedChecklist"
            @equ-selected-checklist="equHandleSelectedChecklist"
            @req-selected-checklist="reqHandleSelectedChecklist"
            @hire-selected-checklist="hireHandleSelectedChecklist"
          />
          <ComponentSix
            @selected-taxCheck="handleSelectedTaxCheck"
            @selected-infoCheck="handleSelectedInfoCheck"
          />

<!--          <ComponentTwo @pass-files="handleFilesData" />-->
          <testComponent @all-files="handleFilesData"/>
          <ButtonVue class="ml-auto mt-5 w-full" type="button" @click="stepNext"
            >Next</ButtonVue
          >
        </div>
        <div class="stepTwo" v-show="backButton">
          <TruckComponent @selected-truck="hireHandleSelectedTruck" />
          <TrailerComponent @selected-trailer="hireHandleSelectedTrailer" />
          <PlantComponent @selected-plant="hireHandleSelectedPlant" />
          <ButtonVue class="ml-auto mt-5 w-full" type="button" @click="stepBack"
            >Back</ButtonVue
          >
        </div>
        <ButtonVue class="ml-auto w-full" type="submit" :disabled="isSubmitting"
          >Signup</ButtonVue
        >
        <p class="text-gray-600 text-sm text-center">
          Already have an account?
          <RouterLink class="font-semibold underline" to="/login"
            >Login Here</RouterLink
          >
        </p>
      </form>
    </main>
  </RegisterLayout>
</template>