<script setup lang="ts">
import { defineProps, ref } from "vue";
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import { useLoading } from "@hooks";
import { FontSize } from "@/types/styles";
import RadioButton from 'primevue/radiobutton';
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";

const props = defineProps(["loading"]);
const trailerRec = ref([
  {
    trailer_manufacturer: "",
    trailer_year: "",
    trailer_body_type: "",
    trailer_capacity: "",
    trailer_tare_gross: "",
    trailer_suspension: "",
    trailer_selectedChecklist: [],

    trailer_manufacturer_name: "trailer_manufacturer",
    trailer_year_name: "trailer_year",
    trailer_body_type_name: "trailer_body_type",
    trailer_capacity_name: "trailer_capacity",
    trailer_suspension_name: "trailer_suspension",
  },
]);

const emit = defineEmits(["selected-trailer"]);
const emitSelectedArray = () => {
  emit('selected-trailer', trailerRec.value);
}
const deleteRow = (index: number) => {
  trailerRec.value.splice(index, 1);
};

const addRow = () => {
  trailerRec.value.push({
    trailer_manufacturer: "",
    trailer_year: "",
    trailer_body_type: "",
    trailer_capacity: "",
    trailer_tare_gross: "",
    trailer_suspension: "",
    trailer_selectedChecklist: [],

    trailer_manufacturer_name: "trailer_manufacturer",
    trailer_year_name: "trailer_year",
    trailer_body_type_name: "trailer_body_type",
    trailer_capacity_name: "trailer_capacity",
    trailer_suspension_name: "trailer_suspension",
  });
};
const [isOptionsLoading, setOptionsLoading] = useLoading();
const bodyTypes = [
  { name: "ALLOY", value: "alloy" },
  { name: "STEEL", value: "steel" },
];
const suspensions = [
  { name: "AIRBAG", value: "airbag" },
  { name: "SPRING", value: "spring" },
];
const trailerQuestions = [
  {
    "question" : "2-WAY TAILGATE",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "ASPHALT GATES",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "ROCK BODY",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "TARPS",
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
        v-for="(p, index) in trailerRec"
        :key="index"
      >
        <div class="lg:col-span-2 sm:col-span-1">
          <div class="mx-auto mt-19">
            <div class="">
              <WidgetTypography variant="title" class="mb-1">
                TRAILER
              </WidgetTypography>
            </div>

            <div class="mt-8 flex flex-col gap-y-2">
              <div class="grid grid-cols-2 gap-2">
                <div class="col-span-1">
                  <label
                      :for="p.trailer_manufacturer_name"
                      class="inline-block text-xs text-slate-500 ml-3 mb-2"
                  >
                    MANUFACTURER
                  </label>
                  <br />
                  <InputText
                      style="width: 100%"
                      v-model="p.trailer_manufacturer"
                      :name="p.trailer_manufacturer_name"
                      :id="p.trailer_manufacturer_name"
                  />
                </div>
                  <div class="col-span-1">
                    <label
                        :for="p.trailer_year_name"
                        class="inline-block text-xs text-slate-500 ml-3 mb-2"
                    >
                      YEAR
                    </label>
                    <br />
                    <InputText
                        style="width: 100%"
                        v-model="p.trailer_year"
                        :name="p.trailer_year_name"
                        :id="p.trailer_year_name"
                    />
                  </div>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <div class="col-span-1">
                  <label
                      :for="p.trailer_body_type_name"
                      class="inline-block text-xs text-slate-500 ml-3 mb-2"
                  >
                    BODY TYPE
                  </label>
                  <Dropdown
                      class="w-full"
                      filter
                      :options="bodyTypes"
                      optionLabel="name"
                      optionValue="value"
                      v-model="p.trailer_body_type"
                      :name="p.trailer_body_type_name"
                      :id="p.trailer_body_type_name"
                      :loading="isOptionsLoading"
                  />
                </div>
                <div class="col-span-1">
                  <label
                      :for="p.trailer_capacity_name"
                      class="inline-block text-xs text-slate-500 ml-3 mb-2"
                  >
                    CAPACITY
                  </label>
                  <br />
                  <InputText
                      style="width: 100%"
                      v-model="p.trailer_capacity"
                      :name="p.trailer_capacity_name"
                      :id="p.trailer_capacity_name"
                  />
                </div>
                <div class="col-span-1">
                  <label
                      :for="p.trailer_suspension_name"
                      class="inline-block text-xs text-slate-500 ml-3 mb-2"
                  >
                    SUSPENSION
                  </label>
                  <Dropdown
                      class="w-full"
                      filter
                      :options="suspensions"
                      optionLabel="name"
                      optionValue="value"
                      v-model="p.trailer_suspension"
                      :name="p.trailer_suspension_name"
                      :id="p.trailer_suspension_name"
                      :loading="isOptionsLoading"
                  />
                </div>
              </div>
              <div>
                <div
                  v-for="(trailer, index) of trailerQuestions"
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
                    <span>{{ trailer?.question }}</span>
                  </WidgetTypography>
                  <div class="mt-2">
                    <div
                      v-for="(option, optionIndex) of trailer?.options"
                      :key="optionIndex"
                    >
                      <RadioButton
                        v-model="p.trailer_selectedChecklist[index]"
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