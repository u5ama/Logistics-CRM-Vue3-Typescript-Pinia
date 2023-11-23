<script setup lang="ts">
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import PortalWidget from "@dashboard/widgets/PortalWidget.vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { useForm } from "vee-validate";
import { useToast } from "vue-toastification";
import { useCompleteChecklistsStore } from "@stores/checklists/complete_checklist";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useLoading } from "@hooks";
import { onMounted, ref, type Ref } from "vue";
import Checkbox from "primevue/checkbox";
import type { ICompleteChecklist } from "@/types/completeChecklist";
import { FontSize, FontWeight } from "@/types/styles";
import RadioButton from "primevue/radiobutton";
import Dropdown from "primevue/dropdown";

const checklistsStore = useCompleteChecklistsStore();
const { checklist } = storeToRefs(checklistsStore);
const { addChecklist } = checklistsStore;

const checklistId = parseInt(useRoute().params.id as string);
const assetId = parseInt(useRoute().params.asset as string);

const isEditing = !!checklistId;

const [isJobLoading, setJobLoading] = useLoading(isEditing);

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validateOnMount: false,
});

const selectedChecklist: Ref<number[][]> = ref([]);
const inputTextChecklist = ref([]);

onMounted(async () => {
  await checklistsStore.getDriverChecklist(checklistId);
  setJobLoading.stop();

  selectedChecklist.value = Array(checklist.value?.checklists.length).fill([]);
});

const submitHandler = handleSubmit(async () => {
  if (checklist.value) {
    const compChecklist = {
      checklists: checklist.value.checklists.map(
        (check: any, index: number) => {
          if (check.select_type === "text") {
            return {
              question_id: check.id,
              select_type: check.select_type,
              checklist_question: check.checklist_question,
              answer: inputTextChecklist.value[index],
            };
          } else {
            return {
              question_id: check.id,
              select_type: check.select_type,
              checklist_question: check.checklist_question,
              options: selectedChecklist.value[index],
            };
          }
        }
      ),
    };

    await addHandler(compChecklist);
    resetFormHandler();
  }
});

const addHandler = async (check: ICompleteChecklist) => {
  const checklistId = checklist.value?.id;

  for (const checklistItem of check.checklists) {
    if (checklistItem.select_type === "text") {
      checklistItem.answer =
        inputTextChecklist.value[check.checklists.indexOf(checklistItem)];
    } else {
      checklistItem.options = checklistItem.options.filter(
        (option: any) =>
          selectedChecklist.value[check.checklists.indexOf(checklistItem)]
      );
    }
  }
  let isAllowed = await addChecklist(check, checklistId, assetId);
  if (!isAllowed) {
    useToast().success("Checklist completed successfully");
  }
};
const resetFormHandler = () => {
  resetForm();
};
</script>

<template>
  <section class="widgets">
    <PortalWidget class="mt-6">
      <WidgetTypography variant="title" class="mb-2">
        Complete Checklist: {{ checklist?.name }}
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
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex lg:justify-end mt-10">
        <Button
          :label="'Complete Checklist'"
          icon="pi pi-save"
          class="p-button p-button-primary"
          :loading="isSubmitting"
          :disabled="isJobLoading"
          @click="submitHandler"
        />
      </div>
    </PortalWidget>
  </section>
</template>
