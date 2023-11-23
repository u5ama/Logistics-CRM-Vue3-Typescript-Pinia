<script setup lang="ts">
import { computed, toRef } from "vue";
import { useField } from "vee-validate";
import Checkbox from "primevue/checkbox";

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
    <div class="flex align-items-center">
      <Checkbox
        :class="{ 'p-invalid': errorMessage }"
        :name="name"
        :inputId="name"
        v-model="value"
        autocomplete="off"
      />
      <label :for="name">{{ label }}</label>
    </div>
    <small class="p-error" :class="{ invisible: !hasError }">
      {{ errorMessage || "&nbsp;" }}
    </small>
  </div>
</template>
