<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUsersStore } from "@stores/users/users";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import ButtonVue from "@components/UI/ButtonVue.vue";
import ComponentThree from "@dashboard-views/registered_users/view-registered/tabs/ComponentThree.vue";
import ComponentFour from "@dashboard-views/registered_users/view-registered/tabs/ComponentFour.vue";
import ComponentFive from "@dashboard-views/registered_users/view-registered/tabs/ComponentFive.vue";
import ComponentSix from "@dashboard-views/registered_users/view-registered/tabs/ComponentSix.vue";
import TruckComponent from "@dashboard-views/registered_users/view-registered/tabs/TruckComponent.vue";
import TrailerComponent from "@dashboard-views/registered_users/view-registered/tabs/TrailerComponent.vue";
import PlantComponent from "@dashboard-views/registered_users/view-registered/tabs/PlantComponent.vue";
import { useForm } from "vee-validate";
import ComponentTwo from "@dashboard-views/registered_users/view-registered/tabs/ComponentTwo.vue";
import { type IUserData } from "@/types/user";
import { useToast } from "vue-toastification";

const usersStore = useUsersStore();
const { newUser } = storeToRefs(usersStore);
const { getNewUser } = usersStore;
const userId = parseInt(useRoute().params.id as string);

onMounted(async () => {
  await getNewUser(userId);
  updateFormValues();
});

const complianceCheck = ref([] as any[]);
const equipmentChecklist = ref([] as any[]);
const requirementChecklist = ref([] as any[]);
const hireChecklist = ref([] as any[]);
const truckDetailsList = ref([] as any[]);
const trailerDetailsList = ref([] as any[]);
const plantDetailsList = ref([] as any[]);
const operatorsDetailsList = ref([] as any[]);
const checklistFiles = ref([] as any[]);
const workFile = ref('');
const equipFile = ref('');
const publicFile = ref('');
const TaxCheck = ref('');
const InfoCheck = ref('');

const updateFormValues = () => {
  if (newUser.value) {
    const { ...fields } = newUser.value;
    setValues({ ...fields });
    complianceCheck.value = newUser.value.complianceChecklist;
    equipmentChecklist.value = newUser.value.equipmentChecklist;
    requirementChecklist.value = newUser.value.requirementChecklist;
    hireChecklist.value = newUser.value.hireChecklist;
    TaxCheck.value = newUser.value.TaxCheck;
    InfoCheck.value = newUser.value.infoCheck;
    truckDetailsList.value = newUser.value.truckDetails;
    trailerDetailsList.value = newUser.value.trailerDetails;
    plantDetailsList.value = newUser.value.plantDetails;
    operatorsDetailsList.value = newUser.value.operatorDetails;
    checklistFiles.value = newUser.value.checklistFiles;
    workFile.value = newUser.value.work_cover_file;
    equipFile.value = newUser.value.equipment_policy_file;
    publicFile.value = newUser.value.public_policy_file;
  }
};

const { handleSubmit, isSubmitting, setValues } = useForm({
  // validationSchema: clientFormSchema,
  // validateOnMount: false,
});

const onSubmit = handleSubmit(async (values) => {
  const user = values as IUserData;

  user.operatorDetails = operatorData.value;
  user.complianceChecklist = selectedChecklistData.value;
  user.equipmentChecklist = equipmentChecklistData.value;
  user.requirementChecklist = requirementChecklistData.value;
  user.hireChecklist = hireChecklistData.value;

  user.truckDetails = truckData.value;
  user.trailerDetails = trailerData.value;
  user.plantDetails = plantData.value;

  // await signup(username, email, password);
  await updateNewUser(userId, user);
  useToast().success("Form updated successfully");
});

const { updateNewUser } = usersStore;

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

const selectedChecklistData = ref([]);
const equipmentChecklistData = ref([]);
const requirementChecklistData = ref([]);
const hireChecklistData = ref([]);
const truckData = ref([]);
const trailerData = ref([]);
const plantData = ref([]);
const operatorData = ref([]);
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
</script>


<template>
    <main>
      <div class="flex max-w-sm">
      </div>
      <form
        class="flex flex-col gap-y-4 px-20 mb-10"
        action="#"
        autocomplete="off"
        @submit.prevent="onSubmit"
      >
        <div class="stepOne" v-show="nextButton">
          <ComponentThree />
          <ComponentFour
            @selected-operator="handleSelectedOperator"
            :fileOne="workFile"
            :fileTwo="equipFile"
            :fileThree="publicFile"
            :operators="operatorsDetailsList"
          />
          <ComponentFive
            @selected-checklist="handleSelectedChecklist"
            @equ-selected-checklist="equHandleSelectedChecklist"
            @req-selected-checklist="reqHandleSelectedChecklist"
            @hire-selected-checklist="hireHandleSelectedChecklist"
            :compliance="complianceCheck"
            :equipment="equipmentChecklist"
            :requirement="requirementChecklist"
            :hire="hireChecklist"
          />
          <ComponentSix
            :taxCheck="TaxCheck"
            :infoCheck="InfoCheck"
          />

          <ComponentTwo :checklistFiles="checklistFiles"/>
          <ButtonVue class="ml-auto mt-5 w-full" type="button" @click="stepNext"
          >Next</ButtonVue
          >
        </div>
        <div class="stepTwo" v-show="backButton">
          <TruckComponent
            @selected-truck="hireHandleSelectedTruck"
            :truckDetails="truckDetailsList"
          />
          <TrailerComponent
            @selected-trailer="hireHandleSelectedTrailer"
            :trailerDetails="trailerDetailsList"
          />
          <PlantComponent
            @selected-plant="hireHandleSelectedPlant"
            :plantDetails="plantDetailsList"
          />
          <ButtonVue class="ml-auto mt-5 w-full" type="button" @click="stepBack"
          >Back</ButtonVue
          >
        </div>

        <ButtonVue class="ml-auto w-full" type="submit" :disabled="isSubmitting"
        >Update</ButtonVue
        >
      </form>
    </main>
</template>
<style lang="scss" scoped></style>
