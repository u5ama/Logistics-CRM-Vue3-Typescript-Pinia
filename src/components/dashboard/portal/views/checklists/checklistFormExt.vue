<script>
import { defineComponent, reactive } from "vue";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";

export default defineComponent({
  components: { InputText, Dropdown },
  props: ["checklistData", "checklistVal"],
  data() {
    return {
      optionBox: [],
      checklistValRec: [],
      types: [
        { name: "Text", value: "text" },
        { name: "Checkbox", value: "checkbox" },
        { name: "Radio", value: "radio" },
        { name: "Select", value: "select" },
      ],
      checklistRec: reactive([]),
    };
  },
  mounted() {
    this.checklistRec = this.checklistData;
  },
  updated() {
    if (this.checklistData) {
      this.checklistValRec = this.checklistData;
      this.checklistRec = this.checklistValRec;
    }
  },
  methods: {
    checkType(check, index) {
      this.optionBox[index] = check.value !== "text";
    },
    deleteRow(index) {
      this.checklistRec.splice(index, 1);
      this.optionBox.splice(index, 1);
    },
    deleteOptionRow(item, i) {
      item.checkListOptions.splice(i, 1);
    },
    addRow() {
      this.checklistRec.push({
        checkbox_question: "",
        checkbox_question_key_name: "Checklist Question",
        checkListOptions: [
          {
            name: "",
            option_question_key_name: "Option",
          },
        ],
      });
      this.optionBox.push(false);
    },
    addOptionRow(item) {
      item.checkListOptions.push({
        name: "",
        option_question_key_name: "Option",
      });
    },
  },
});
</script>

<template>
  <div>
    <div
      class="grid grid-rows-3 grid-flow-col gap-3 mb-8"
      v-for="(p, index) in checklistRec"
      :key="index"
    >
      <div class="col-span-2">
        <div class="flex">
          <div class="flex-auto mt-7 mr-2">
            <Dropdown
              v-model="p.selectedOption"
              :options="types"
              optionLabel="name"
              placeholder="Select an Input Type"
              class="w-full"
              @change="checkType(p.selectedOption, index)"
            />
          </div>
          <div class="flex-auto">
            <label
              :for="p.checkbox_question_key_name"
              class="inline-block text-xs text-slate-500 ml-3 mb-2"
            >
              {{ p.checkbox_question_key_name }}
            </label>
            <br />
            <InputText
              style="width: 100%"
              v-model="p.checkbox_question"
              :name="p.checkbox_question_key_name"
              :id="p.checkbox_question_key_name"
            />
          </div>
        </div>
      </div>
      <div class="row-span-2 col-span-2" v-show="optionBox[index]">
        <div class="flex" v-for="(q, i) in p.checkListOptions" :key="i">
          <div class="flex-auto">
            <label
              :for="q.option_question_key_name"
              class="inline-block text-xs text-slate-500 ml-3 mb-2"
            >
              {{ q.option_question_key_name }}
            </label>
            <br />
            <InputText
              style="width: 100%"
              v-model="q.name"
              :name="q.option_question_key_name"
              :id="q.option_question_key_name"
            />
          </div>
          <div class="flex-auto mt-8 ml-2">
            <button
              class="p-button p-button-primary"
              style="border-radius: 50%"
              @click="addOptionRow(p)"
              type="button"
            >
              <i class="pi pi-plus"></i>
            </button>
            <button
              v-if="i !== 0"
              style="border-radius: 30%"
              class="p-button p-button-danger ml-2"
              @click="deleteOptionRow(p, i)"
              type="button"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="row-span-3">
        <div class="mt-8">
          <button
            class="p-button p-button-primary"
            @click="addRow()"
            type="button"
          >
            <i class="pi pi-plus"></i>
          </button>
          <button
            v-if="index !== 0"
            class="p-button p-button-danger ml-2"
            @click="deleteRow(index)"
            type="button"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<style scoped></style>
