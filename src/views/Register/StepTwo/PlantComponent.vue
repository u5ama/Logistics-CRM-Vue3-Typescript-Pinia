<script setup lang="ts">
import { defineProps, ref } from "vue";
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import { useLoading } from "@hooks";
import { FontSize } from "@/types/styles";
import RadioButton from 'primevue/radiobutton';
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";

const props = defineProps(["loading"]);
const plantRec = ref([
  {
    plant_type: "",
    plant_machine_size: "",
    plant_make: "",
    plant_model: "",
    plant_year: "",
    plant_bucket_types: "",
    plant_selectedChecklist: [],

    plant_type_name: "plant_type",
    plant_machine_size_name: "plant_machine_size",
    plant_make_name: "plant_make",
    plant_model_name: "plant_model",
    plant_year_name: "plant_year",
    plant_bucket_types_name: "plant_bucket_types",
  },
]);

const emit = defineEmits(["selected-plant"]);
const emitSelectedArray = () => {
  emit('selected-plant', plantRec.value);
}
const deleteRow = (index: number) => {
  plantRec.value.splice(index, 1);
};

const addRow = () => {
  plantRec.value.push({
    plant_type: "",
    plant_machine_size: "",
    plant_make: "",
    plant_model: "",
    plant_year: "",
    plant_bucket_types: "",
    plant_selectedChecklist: [],

    plant_type_name: "plant_type",
    plant_machine_size_name: "plant_machine_size",
    plant_make_name: "plant_make",
    plant_model_name: "plant_model",
    plant_year_name: "plant_year",
    plant_bucket_types_name: "plant_bucket_types",
  });
};
const [isOptionsLoading, setOptionsLoading] = useLoading();
const types = [
  { name: "EXCAVATOR", value: "excavator" },
  { name: "POSITRACK / SKID STEER", value: "positrack" },
  { name: "DOZER", value: "dozer" },
  { name: "GRADER", value: "grader" },
  { name: "OTHER", value: "other" },
];
const plantsQuestions = [
  {
    "question" : "AUGERS",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "BURST VALVES",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "CABIN / CANOPY REMOVABLE",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "COMPACTION PLATE ",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "COMPACTION WHEEL",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "CORE BARREL",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "OWN FLOAT",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "FORKS",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "GPS",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "GRABS",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "HANDRAILS",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "HAMMER / BREAKER",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "HARLEY RAKE",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "KNUCKLE BOOM",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "LIFTING POINTS",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "OFFSET BOOM",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "RIPPER",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "ROAD PROFILER",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "RUBBER TRACKS",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "SHAKER BUCKET",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "SMUDGER",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "SWEEPER / BROOM",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "TILT HITCH",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "ZERO SWING",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
]
</script>

<template>
  <div>
    <div
      class="mt-8 flex flex-col gap-y-3">
      <div
        class="lg:grid grid-cols-3 sm:grid-cols-1 gap-3 mb-8"
        v-for="(p, index) in plantRec"
        :key="index"
      >
        <div class="lg:col-span-2 sm:col-span-1">
          <div class="mx-auto mt-19">
            <div class="">
              <WidgetTypography variant="title" class="mb-1">
                PLANT
              </WidgetTypography>
            </div>
            <div class="mt-8 flex flex-col gap-y-2">
              <div class="grid grid-cols-3 gap-2">
                <div class="col-span-1">
                  <label
                    :for="p.plant_type_name"
                    class="inline-block text-xs text-slate-500 ml-3 mb-2"
                  >
                    TYPE
                  </label>
                  <Dropdown
                    class="w-full"
                    filter
                    :options="types"
                    optionLabel="name"
                    optionValue="value"
                    v-model="p.plant_type"
                    :name="p.plant_type_name"
                    :id="p.plant_type_name"
                    :loading="isOptionsLoading"
                  />
                </div>
                <div class="col-span-1">
                  <label
                    :for="p.plant_machine_size_name"
                    class="inline-block text-xs text-slate-500 ml-3 mb-2"
                  >
                    MACHINE SIZE
                  </label>
                  <br />
                  <InputText
                    style="width: 100%"
                    v-model="p.plant_machine_size"
                    :name="p.plant_machine_size_name"
                    :id="p.plant_machine_size_name"
                  />
                </div>
                <div class="col-span-1">
                  <label
                    :for="p.plant_make_name"
                    class="inline-block text-xs text-slate-500 ml-3 mb-2"
                  >
                    MAKE
                  </label>
                  <br />
                  <InputText
                    style="width: 100%"
                    v-model="p.plant_make"
                    :name="p.plant_make_name"
                    :id="p.plant_make_name"
                  />
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <div class="col-span-1">
                  <label
                    :for="p.plant_model_name"
                    class="inline-block text-xs text-slate-500 ml-3 mb-2"
                  >
                    MODEL
                  </label>
                  <br />
                  <InputText
                    style="width: 100%"
                    v-model="p.plant_model"
                    :name="p.plant_model_name"
                    :id="p.plant_model_name"
                  />
                </div>
                <div class="col-span-1">
                  <label
                    :for="p.plant_year_name"
                    class="inline-block text-xs text-slate-500 ml-3 mb-2"
                  >
                    YEAR
                  </label>
                  <br />
                  <InputText
                    style="width: 100%"
                    v-model="p.plant_year"
                    :name="p.plant_year_name"
                    :id="p.plant_year_name"
                  />
                </div>
                <div class="col-span-1">
                  <label
                    :for="p.plant_bucket_types_name"
                    class="inline-block text-xs text-slate-500 ml-3 mb-2"
                  >
                    BUCKET TYPES & SIZES
                  </label>
                  <br />
                  <InputText
                    style="width: 100%"
                    v-model="p.plant_bucket_types"
                    :name="p.plant_bucket_types_name"
                    :id="p.plant_bucket_types_name"
                  />
                </div>
              </div>
              <div>
                <div
                  v-for="(plant, index) of plantsQuestions"
                  :key="index"
                  class="mb-5 mr-12"
                  style="display: inline;
                  float: left;"
                >
                  <WidgetTypography
                    :size="FontSize.base"
                    variant="subtitle2"
                    style="color: black"
                  >
                    <span>{{ plant?.question }}</span>
                  </WidgetTypography>
                  <div class="mt-2">
                    <div
                      v-for="(option, optionIndex) of plant?.options"
                      :key="optionIndex"
                    >
                      <RadioButton
                        v-model="p.plant_selectedChecklist[index]"
                        :inputId="option?.option_name"
                        :name="'truck.' + index + '.' + optionIndex"
                        :value="option?.id"
                        class="mr-3"
                        @change="emitSelectedArray"
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
<style scoped></style>