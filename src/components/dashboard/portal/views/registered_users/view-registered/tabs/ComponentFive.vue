<script setup lang="ts">
import { FontSize } from "@/types/styles";
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import RadioButton from "primevue/radiobutton";
import { watchEffect, ref, type Ref } from "vue";

interface Question {
  question: string;
  options: { option_name: string; id: string }[];
}

const complianceSelectedChecklist: Ref<number[][]> = ref([]);
const equipmentSelectedChecklist: Ref<number[][]> = ref([]);
const requirementSelectedChecklist: Ref<number[][]> = ref([]);
const hireSelectedChecklist: Ref<number[][]> = ref([]);
const compliances: Question[] = [
  {
    question:
      "All drivers/operators hold a valid construction induction card (red/white card)",
    options: [
      { option_name: "Yes", id: "yes" },
      { option_name: "No", id: "no" },
    ],
  },
  {
    question:
      "All operators of your equipment have been suitably trained and are competent to carry out the work",
    options: [
      { option_name: "Yes", id: "yes" },
      { option_name: "No", id: "no" },
    ],
  },
  {
    question:
      "All operators understand that they are required to attend work on time and be fit for duty",
    options: [
      { option_name: "Yes", id: "yes" },
      { option_name: "No", id: "no" },
    ],
  },
  {
    question:
      "Drivers have been informed of their responsibility in Fatigue laws, work and rest hours",
    options: [
      { option_name: "Yes", id: "yes" },
      { option_name: "No", id: "no" },
    ],
  },
  {
    question:
      "Drivers are aware they must wear appropriate PPE whilst subcontracting to Starbuck Plant Hire, including but not limited to steel capped safety \n" +
      "boots, high visibility shirt or vest & hard hat when applicable",
    options: [
      { option_name: "Yes", id: "yes" },
      { option_name: "No", id: "no" },
    ],
  },
];

const equipments: Question[] = [
  {
    question:
      "All vehicles/equipment hold a valid risk assessment carried out by a certified independent assessor (risk assessment valid for 12 months from the \n" +
      "date of assessment)",
    options: [
      { option_name: "Yes", id: "yes" },
      { option_name: "No", id: "no" },
    ],
  },
  {
    question:
      "Pre-start daily checklists are carried out on all equipment prior to commencement or work and records maintained",
    options: [
      { option_name: "Yes", id: "yes" },
      { option_name: "No", id: "no" },
    ],
  },
  {
    question:
      "Regular maintenance is performed on your equipment in accordance with the manufacturers recommendations to ensure its safe operation",
    options: [
      { option_name: "Yes", id: "yes" },
      { option_name: "No", id: "no" },
    ],
  },
  {
    question:
      "All maintenance will be documented, and records kept up to date for each piece of equipment",
    options: [
      { option_name: "Yes", id: "yes" },
      { option_name: "No", id: "no" },
    ],
  },
  {
    question:
      "All equipment has an operational flashing beacon and reversing beeper/squawker",
    options: [
      { option_name: "Yes", id: "yes" },
      { option_name: "No", id: "no" },
    ],
  },
];

const requirements: Question[] = [
  {
    question:
      "Insurances are kept up to date and all renewed certificates of currency provided to Starbuck Plant Hire",
    options: [
      { option_name: "Yes", id: "yes" },
      { option_name: "No", id: "no" },
    ],
  },
  {
    question:
      "All documentation such as risk assessments, licenses, permits etc. that have an expiry must be kept up to date and maintained with Starbuck Plant \n" +
      "Hire",
    options: [
      { option_name: "Yes", id: "yes" },
      { option_name: "No", id: "no" },
    ],
  },
  {
    question:
      "Starbuck Plant Hire to be provided with the licenses and cards for all new operators/drivers of your equipment",
    options: [
      { option_name: "Yes", id: "yes" },
      { option_name: "No", id: "no" },
    ],
  },
  {
    question:
      "Starbuck Plant Hire to be notified should you sell or purchase equipment in order to keep your account up to date",
    options: [
      { option_name: "Yes", id: "yes" },
      { option_name: "No", id: "no" },
    ],
  },
  {
    question:
      "You understand that some jobs require a SWMS (Safe Work Methods Statement) and agree to provide this upon request",
    options: [
      { option_name: "Yes", id: "yes" },
      { option_name: "No", id: "no" },
    ],
  },
];

const dockets: Question[] = [
  {
    question:
      "You understand when subcontracting to Starbuck Plant Hire, a Starbuck Plant Hire Docket will be correctly completed for works performed in line \n" +
      "with Starbuck Plant Hire’s requirements. The hire docket must be authorised by the customer and must not be altered once authorised.",
    options: [
      { option_name: "Yes", id: "yes" },
      { option_name: "No", id: "no" },
    ],
  },
  {
    question:
      "You understand that Hire Dockets are to be submitted to the office within 7 days of completion of works",
    options: [
      { option_name: "Yes", id: "yes" },
      { option_name: "No", id: "no" },
    ],
  },
];

const emit = defineEmits([
  "selected-checklist",
  "equ-selected-checklist",
  "req-selected-checklist",
  "hire-selected-checklist",
]);
const emitSelectedChecklist = () => {
  // Emit an event to send the selectedChecklist data to the parent component
  emit("selected-checklist", complianceSelectedChecklist.value);
  emit("equ-selected-checklist", equipmentSelectedChecklist.value);
  emit("req-selected-checklist", requirementSelectedChecklist.value);
  emit("hire-selected-checklist", hireSelectedChecklist.value);
};

const props = defineProps(["compliance", "equipment", "requirement", "hire"]);

watchEffect(() => {
  if (props.compliance) {
    complianceSelectedChecklist.value = [...props.compliance];
  }
  if (props.equipment) {
    equipmentSelectedChecklist.value = [...props.equipment];
  }
  if (props.requirement) {
    requirementSelectedChecklist.value = [...props.requirement];
  }
  if (props.hire) {
    hireSelectedChecklist.value = [...props.hire];
  }
});
</script>
<template>
  <div>
    <div class="">
      <div class="mx-auto mt-19">
        <div class="mt-8 flex flex-col gap-y-2">
          <div class="text-center">
            <WidgetTypography
              variant="title"
              class="mb-1 bg-brand text-white text-center py-4 rounded-xl"
            >
              COMPANY CHECKLIST
            </WidgetTypography>
          </div>

          <div class="">
            <WidgetTypography
              variant="title"
              class="mt-4 mb-1"
              :size="FontSize.lg"
            >
              Driver / Operator Compliance
            </WidgetTypography>
          </div>
          <div class="flex flex-col gap-5">
            <div
              v-for="(compliance, index) of compliances"
              :key="index"
              class=""
            >
              <WidgetTypography
                :size="FontSize.base"
                variant="subtitle2"
                style="color: black"
              >
                <span>Q{{ index + 1 }}: {{ compliance?.question }}</span>
              </WidgetTypography>
              <div class="mt-2">
                <div
                  v-for="(option, optionIndex) of compliance?.options"
                  :key="optionIndex"
                >
                  <RadioButton
                    v-model="complianceSelectedChecklist[index]"
                    :inputId="option?.option_name"
                    :name="'compliance.' + index + '.' + optionIndex"
                    :value="option?.id"
                    class="mr-3"
                    @change="emitSelectedChecklist"
                  />
                  <label :for="option?.option_name">{{
                    option?.option_name
                  }}</label>
                </div>
              </div>
            </div>
          </div>

          <div class="">
            <WidgetTypography variant="title" class="mt-4" :size="FontSize.lg">
              Equipment
            </WidgetTypography>
          </div>
          <div class="flex flex-col gap-5">
            <div v-for="(equipment, index) of equipments" :key="index" class="">
              <WidgetTypography
                :size="FontSize.base"
                variant="subtitle2"
                style="color: black"
              >
                <span>Q{{ index + 1 }}: {{ equipment?.question }}</span>
              </WidgetTypography>
              <div class="mt-2">
                <div
                  v-for="(option, optionIndex) of equipment?.options"
                  :key="optionIndex"
                >
                  <RadioButton
                    v-model="equipmentSelectedChecklist[index]"
                    :inputId="option?.option_name"
                    :name="'equipment.' + index + '.' + optionIndex"
                    :value="option?.id"
                    class="mr-3"
                    @change="emitSelectedChecklist"
                  />
                  <label :for="option?.option_name">{{
                    option?.option_name
                  }}</label>
                </div>
              </div>
            </div>
          </div>

          <div class="">
            <WidgetTypography variant="title" class="mt-4" :size="FontSize.lg">
              Requirements
            </WidgetTypography>
          </div>
          <div class="flex flex-col gap-5">
            <div
              v-for="(requirement, index) of requirements"
              :key="index"
              class=""
            >
              <WidgetTypography
                :size="FontSize.base"
                variant="subtitle2"
                style="color: black"
              >
                <span>Q{{ index + 1 }}: {{ requirement?.question }}</span>
              </WidgetTypography>
              <div class="mt-2">
                <div
                  v-for="(option, optionIndex) of requirement?.options"
                  :key="optionIndex"
                >
                  <RadioButton
                    v-model="requirementSelectedChecklist[index]"
                    :inputId="option?.option_name"
                    :name="'requirement.' + index + '.' + optionIndex"
                    :value="option?.id"
                    class="mr-3"
                    @change="emitSelectedChecklist"
                  />
                  <label :for="option?.option_name">{{
                    option?.option_name
                  }}</label>
                </div>
              </div>
            </div>
          </div>

          <div class="">
            <WidgetTypography variant="title" class="mt-4" :size="FontSize.lg">
              Hire Dockets
            </WidgetTypography>
          </div>
          <div class="flex flex-col gap-5">
            <div v-for="(docket, index) of dockets" :key="index" class="">
              <WidgetTypography
                :size="FontSize.base"
                variant="subtitle2"
                style="color: black"
              >
                <span>Q{{ index + 1 }}: {{ docket?.question }}</span>
              </WidgetTypography>
              <div class="mt-2">
                <div
                  v-for="(option, optionIndex) of docket?.options"
                  :key="optionIndex"
                >
                  <RadioButton
                    v-model="hireSelectedChecklist[index]"
                    :inputId="option?.option_name"
                    :name="'docket.' + index + '.' + optionIndex"
                    :value="option?.id"
                    class="mr-3"
                    @change="emitSelectedChecklist"
                  />
                  <label :for="option?.option_name">{{
                    option?.option_name
                  }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>