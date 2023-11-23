<script setup lang="ts">
import { computed, toRef } from "vue";
import { useField } from "vee-validate";
import InputText from "primevue/inputtext";

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
      <InputText
        class="w-full"
        :class="{ 'p-invalid': errorMessage }"
        :name="name"
        :id="name"
        v-model="value"
        autocomplete="off"
      />
      <label :for="name">{{ label }}<span class="star_new">*</span></label>
    </span>
    <small class="p-error" :class="{ invisible: !hasError }">
      {{ errorMessage || "&nbsp;" }}
    </small>
  </div>
</template>
<style>
.star_new {
  color: red;
}
</style>