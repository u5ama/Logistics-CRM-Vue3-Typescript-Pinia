<script setup lang="ts">
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import PortalWidget from "@dashboard/widgets/PortalWidget.vue";
import { useDriversChecklistsStore } from "@stores/checklists/drivers_checklist";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useLoading } from "@hooks";
import { onMounted, ref } from "vue";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import { FontSize, FontWeight } from "@/types/styles";
import RadioButton from "primevue/radiobutton";
import Dropdown from "primevue/dropdown";

const selectedChecklist = ref([]);
const inputTextChecklist = ref([]);

const driversChecklistsStore = useDriversChecklistsStore();
const { checklist } = storeToRefs(driversChecklistsStore);
const { singleChecklist } = storeToRefs(driversChecklistsStore);
const { getDriverChecklistDetail, getDriverSingleChecklist } =
  driversChecklistsStore;
const checklistId = parseInt(useRoute().params.id as string);
const isEditing = !!checklistId;
const [isJobLoading, setJobLoading] = useLoading(isEditing);

onMounted(async () => {
  await getDriverChecklistDetail(checklistId);
  await getDriverSingleChecklist(checklistId);
  updateChecklistValues();
  setJobLoading.stop();
});

const updateChecklistValues = () => {
  if (singleChecklist.value) {
    singleChecklist.value.selected_checklist.checklists.map(
      (checklist: any, index: number) => {
        if (checklist.select_type === "text") {
          inputTextChecklist.value[index] = checklist.answer;
        } else {
          selectedChecklist.value[index] = checklist.options;
        }
      }
    );
  }
};
</script>

<template>
  <PortalWidget class="mt-6">
    <WidgetTypography variant="title" class="mb-2">
      {{ checklist?.name }}
    </WidgetTypography>
    <div
      class="mt-8 flex flex-col gap-y-4"
      :class="{ 'loading-faded': isJobLoading }"
    >
      <div class="card justify-content-center">
        <div class="flex flex-col gap-5">
          <div
            v-for="(check, index) of checklist?.checklists"
            :key="index"
            class=""
          >
            <WidgetTypography
              :size="FontSize.lg"
              :weight="FontWeight.bold"
              variant="subtitle2"
              style="color: black"
            >
              <span>Q{{ index + 1 }}: {{ check?.checklist_question }}</span>
            </WidgetTypography>
            <div class="mt-2" v-if="check?.select_type === 'checkbox'">
              <div
                v-for="(option, optionIndex) of check?.options"
                :key="optionIndex"
              >
                <Checkbox
                  v-model="selectedChecklist[index]"
                  :inputId="option?.option_name"
                  :name="'checklists.' + index + '.' + optionIndex"
                  :value="option?.id"
                  class="mr-3"
                  disabled
                />
                <label :for="option?.option_name">{{
                  option?.option_name
                }}</label>
              </div>
            </div>
            <div class="mt-2" v-else-if="check?.select_type === 'radio'">
              <div
                v-for="(option, optionIndex) of check?.options"
                :key="optionIndex"
              >
                <RadioButton
                  v-model="selectedChecklist[index]"
                  :inputId="option?.option_name"
                  :name="'checklists.' + index + '.' + optionIndex"
                  :value="option?.id"
                  class="mr-3"
                />
                <label :for="option?.option_name">{{
                  option?.option_name
                }}</label>
              </div>
            </div>
            <div class="mt-2" v-else-if="check?.select_type === 'select'">
              <div class="flex-auto mt-7 mr-2">
                <Dropdown
                  v-model="selectedChecklist[index]"
                  :options="check?.options"
                  :name="'checklists.' + index"
                  optionLabel="option_name"
                  placeholder="Choose Option"
                  class="w-full"
                />
              </div>
            </div>
            <div class="mt-2" v-else>
              <InputText
                class="w-full"
                :name="'checklists.' + index"
                :id="check?.checklist_question"
                v-model="inputTextChecklist[index]"
                autocomplete="off"
                readonly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </PortalWidget>
</template>
