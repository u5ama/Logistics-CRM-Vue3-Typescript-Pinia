<script setup lang="ts">
import { useField } from "vee-validate";
import MultiSelect from "primevue/multiselect";
import { toRef } from "vue";

interface Props {
  label: string;
  name: string;
  items: any[];
  loading?: boolean;
  selectedItems: any[];
}

interface Emits {
  (e: "change", items: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const name = toRef(props, "name");
const { errorMessage, setValue } = useField(name);
const changeHandler = (event: any) => {
  emit("change", event.value);
  const selectedItemsIds = [...new Set(event.value)];
  setValue(selectedItemsIds.join(","));
};
</script>

<template>
  <div>
    <span class="p-fluid p-float-label mt-1">
      <label for="representative_id" class="inline-block text-xs text-slate-500 ml-3 mb-2">Choose Sales Person</label>
      <MultiSelect
        filter
        :class="{ 'p-invalid': errorMessage }"
        :modelValue="selectedItems"
        @change="changeHandler"
        :options="items"
        optionLabel="name"
        optionValue="id"
        :name="name"
        :id="name"
        :loading="loading"
        display="chip"
        :resetFilterOnHide="true"
      />
      <label :for="name">{{ label }}</label>
    </span>
    <small class="p-error" :class="{ invisible: !errorMessage }">
      {{ errorMessage || "&nbsp;" }}
    </small>
  </div>
</template>

<style lang="scss" scoped></style>
