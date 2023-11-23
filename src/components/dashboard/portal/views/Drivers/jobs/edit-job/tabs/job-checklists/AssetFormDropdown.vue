<script setup lang="ts">
import { computed, toRef } from "vue";
import { useField } from "vee-validate";
import Dropdown from "primevue/dropdown";

interface Props {
  label: string;
  name: string;
  value?: string;
  loading?: boolean;
  options: {
    name: string;
    id: string;
  }[];
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const name = toRef(props, "name");

const { value, errorMessage, meta } = useField(name, undefined, {
  initialValue: props.value,
  validateOnValueUpdate: false,
});

const hasError = computed(() => !!errorMessage && meta.touched);

// Define the custom "change" event
const emit = defineEmits(["change"]);
// Emit the "change" event with the selected asset_id
const emitChange = (selectedAssetId: string) => {
  emit("change", selectedAssetId);
};
</script>

<template>
  <div>
    <span class="">
      <label :for="name" class="inline-block text-xs text-slate-500 ml-3 mb-2">
        {{ label }}
      </label>
      <Dropdown
        class="w-full"
        filter
        :class="{ 'p-invalid': errorMessage }"
        :options="options"
        optionLabel="name"
        optionValue="id"
        v-model="value"
        :name="name"
        :id="name"
        :loading="loading"
        @change="emitChange(value)"
      />
    </span>
    <small class="p-error" :class="{ invisible: !hasError }">
      {{ errorMessage || "&nbsp;" }}
    </small>
  </div>
</template>