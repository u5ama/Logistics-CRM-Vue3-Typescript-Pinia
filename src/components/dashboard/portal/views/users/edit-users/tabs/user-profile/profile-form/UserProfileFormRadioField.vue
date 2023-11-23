<script setup lang="ts">
import { computed, toRef } from "vue";
import { useField } from "vee-validate";
import RadioButton from "primevue/radiobutton";

interface Props {
  label: string;
  name: string;
  value?: string;
}

const props = defineProps<Props>();
const name = toRef(props, "name");
const { value, errorMessage, meta } = useField(name, undefined, {
  initialValue: props.value,
  validateOnValueUpdate: false,
});

const hasError = computed(() => !!errorMessage && meta.touched);
</script>

<template>
  <div>
    <span class="p-float-label">
      <RadioButton
        class="w-full"
        :class="{ 'p-invalid': errorMessage }"
        :name="name"
        :id="label"
        v-model="value"
      />
      <label class="ml-5" :for="label">{{ label }}</label>
    </span>
    <small class="p-error" :class="{ invisible: !hasError }">
      {{ errorMessage || "&nbsp;" }}
    </small>
  </div>
</template>
