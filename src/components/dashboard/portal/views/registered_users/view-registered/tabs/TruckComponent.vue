<script setup lang="ts">
import { watchEffect, ref } from "vue";
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import Dropdown from "primevue/dropdown";
import { useLoading } from "@hooks";
import { FontSize } from "@/types/styles";
import RadioButton from 'primevue/radiobutton';
import InputText from "primevue/inputtext";

const truckRec = ref([
  {
    truck_type: "",
    truck_make: "",
    truck_model: "",
    truck_year: "",
    truck_body_type: "",
    truck_truck_reg: "",
    truck_trailer_reg: "",
    truck_capacity: "",
    truck_tare_gross: "",
    truck_suspension: "",
    truck_style: "",
    truck_selectedChecklist: [],

    truck_type_name: "truck_type",
    truck_make_name: "truck_make",
    truck_model_name: "truck_model",
    truck_year_name: "truck_year",
    truck_body_type_name: "truck_body_type",
    truck_truck_reg_name: "truck_truck_reg",
    truck_trailer_reg_name: "truck_trailer_reg",
    truck_capacity_name: "truck_capacity",
    truck_tare_gross_name: "truck_tare_gross",
    truck_suspension_name: "truck_suspension",
    truck_style_name: "truck_style",
  },
]);
const emit = defineEmits(["selected-truck"]);
const emitSelectedArray = () => {
  emit('selected-truck', truckRec.value);
}
const deleteRow = (index: number) => {
  truckRec.value.splice(index, 1);
};

const props = defineProps(["truckDetails"]);
watchEffect(() => {
  if (props.truckDetails) {
    console.log(props.truckDetails);
    truckRec.value = [...props.truckDetails];
  }
});
  const addRow = () => {
  truckRec.value.push({
    truck_type: "",
    truck_make: "",
    truck_model: "",
    truck_year: "",
    truck_body_type: "",
    truck_truck_reg: "",
    truck_trailer_reg: "",
    truck_capacity: "",
    truck_tare_gross: "",
    truck_suspension: "",
    truck_style: "",
    truck_selectedChecklist: [],

    truck_type_name: "truck_type",
    truck_make_name: "truck_make",
    truck_model_name: "truck_model",
    truck_year_name: "truck_year",
    truck_body_type_name: "truck_body_type",
    truck_truck_reg_name: "truck_truck_reg",
    truck_trailer_reg_name: "truck_trailer_reg",
    truck_capacity_name: "truck_capacity",
    truck_tare_gross_name: "truck_tare_gross",
    truck_suspension_name: "truck_suspension",
    truck_style_name: "truck_style",
  });
};
const [isOptionsLoading, setOptionsLoading] = useLoading();
const types = [
  { name: "TWIN STEER", value: "twin_steer" },
  { name: "TANDEM", value: "tandem" },
  { name: "TRUCK & TRAILER", value: "truck_trailer" },
  { name: "TRUCK & QUAD", value: "truck_quad" },
  { name: "SEMI", value: "semi" },
  { name: "FLOAT ONLY", value: "float_only" },
  { name: "OTHER", value: "other" },
];
const bodyTypes = [
  { name: "ALLOY", value: "alloy" },
  { name: "STEEL", value: "steel" },
];
const suspensions = [
  { name: "AIRBAG", value: "airbag" },
  { name: "SPRING", value: "spring" },
];
const styles = [
  { name: "CAB OVER", value: "cab_over" },
  { name: "BONNET", value: "bonnet" },
];
const trucksQuestions = [
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
    "question" : "DIFF LOCKS ",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "EPA",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "PBS PERMITTED",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "REVERSE CAMERAS",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "SCALES",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "TARPS",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "REVERSE SQUAWKER",
    "options" : [{"option_name": "Yes", "id": "yes"}, {"option_name": "No", "id": "no"}]
  },
  {
    "question" : "FLASHING LIGHT",
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
        v-for="(t, index) in truckRec"
        :key="index"
      >
        <div class="lg:col-span-2 sm:col-span-1">
          <div class="mx-auto mt-19">
            <div class="">
              <WidgetTypography variant="title" class="mb-1">
                EQUIPMENT DETAILS - TRUCKS
              </WidgetTypography>
            </div>

            <div class="mt-8 flex flex-col gap-y-2">
              <div class="grid grid-cols-2 gap-2">
                <div class="col-span-1">
                  <label
                    :for="t.truck_type_name"
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
                    v-model="t.truck_type"
                    :name="t.truck_type_name"
                    :id="t.truck_type_name"
                    :loading="isOptionsLoading"
                  />
                </div>
                <div class="col-span-1">
                  <label
                    :for="t.truck_make_name"
                    class="inline-block text-xs text-slate-500 ml-3 mb-2"
                  >
                    MAKE
                  </label>
                  <br />
                  <InputText
                    style="width: 100%"
                    v-model="t.truck_make"
                    :name="t.truck_make_name"
                    :id="t.truck_make_name"
                  />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="col-span-1">
                  <label
                    :for="t.truck_model_name"
                    class="inline-block text-xs text-slate-500 ml-3 mb-2"
                  >
                    MODEL
                  </label>
                  <br />
                  <InputText
                    style="width: 100%"
                    v-model="t.truck_model"
                    :name="t.truck_model_name"
                    :id="t.truck_model_name"
                  />
                </div>
                <div class="col-span-1">
                  <label
                    :for="t.truck_year_name"
                    class="inline-block text-xs text-slate-500 ml-3 mb-2"
                  >
                    YEAR
                  </label>
                  <br />
                  <InputText
                    style="width: 100%"
                    v-model="t.truck_year"
                    :name="t.truck_year_name"
                    :id="t.truck_year_name"
                  />
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <div class="col-span-1">
                  <label
                    :for="t.truck_body_type_name"
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
                    v-model="t.truck_body_type"
                    :name="t.truck_body_type_name"
                    :id="t.truck_body_type_name"
                    :loading="isOptionsLoading"
                  />
                </div>
                <div class="col-span-1">
                  <label
                    :for="t.truck_truck_reg_name"
                    class="inline-block text-xs text-slate-500 ml-3 mb-2"
                  >
                    TRUCK REG
                  </label>
                  <br />
                  <InputText
                    style="width: 100%"
                    v-model="t.truck_truck_reg"
                    :name="t.truck_truck_reg_name"
                    :id="t.truck_truck_reg_name"
                  />
                </div>
                <div class="col-span-1">
                  <label
                    :for="t.truck_trailer_reg_name"
                    class="inline-block text-xs text-slate-500 ml-3 mb-2"
                  >
                    TRAILER REG
                  </label>
                  <br />
                  <InputText
                    style="width: 100%"
                    v-model="t.truck_trailer_reg"
                    :name="t.truck_trailer_reg_name"
                    :id="t.truck_trailer_reg_name"
                  />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="col-span-1">
                  <label
                    :for="t.truck_capacity_name"
                    class="inline-block text-xs text-slate-500 ml-3 mb-2"
                  >
                    CAPACITY
                  </label>
                  <br />
                  <InputText
                    style="width: 100%"
                    v-model="t.truck_capacity"
                    :name="t.truck_capacity_name"
                    :id="t.truck_capacity_name"
                  />
                </div>
                <div class="col-span-1">
                  <label
                    :for="t.truck_tare_gross"
                    class="inline-block text-xs text-slate-500 ml-3 mb-2"
                  >
                    TARE/GROSS
                  </label>
                  <br />
                  <InputText
                    style="width: 100%"
                    v-model="t.truck_tare_gross"
                    :name="t.truck_tare_gross_name"
                    :id="t.truck_tare_gross_name"
                  />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="col-span-1">
                  <label
                    :for="t.truck_suspension_name"
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
                    v-model="t.truck_suspension"
                    :name="t.truck_suspension_name"
                    :id="t.truck_suspension_name"
                    :loading="isOptionsLoading"
                  />
                </div>
                <div class="col-span-1">
                  <label
                    :for="t.truck_style_name"
                    class="inline-block text-xs text-slate-500 ml-3 mb-2"
                  >
                    STYLE
                  </label>
                  <Dropdown
                    class="w-full"
                    filter
                    :options="styles"
                    optionLabel="name"
                    optionValue="value"
                    v-model="t.truck_style"
                    :name="t.truck_style_name"
                    :id="t.truck_style_name"
                    :loading="isOptionsLoading"
                  />
                </div>
              </div>
              <div>
                <div
                  v-for="(truck, index) of trucksQuestions"
                  :key="index"
                  class="mb-5 mr-12 mt-5"
                  style="display: inline;
                  float: left;"
                >
                  <WidgetTypography
                    :size="FontSize.base"
                    variant="subtitle2"
                    style="color: black"
                  >
                    <span>{{ truck?.question }}</span>
                  </WidgetTypography>
                  <div class="mt-2">
                    <div
                      v-for="(option, optionIndex) of truck?.options"
                      :key="optionIndex"
                    >
                      <RadioButton
                        v-model="t.truck_selectedChecklist[index]"
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