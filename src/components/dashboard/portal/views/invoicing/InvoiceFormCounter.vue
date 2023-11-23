<script setup lang="ts">
import { computed, toRef } from "vue";
import { useField } from "vee-validate";
import InputNumber from "primevue/inputnumber";
interface Props {
  label: string;
  name: string;
  value?: string;
  loading?: boolean;
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
</script>

<template>
  <div>
    <span class="">
      <label :for="name" class="inline-block text-xs text-slate-500 ml-3 mb-2">
        {{ label }}
      </label>
      <br />
      <InputNumber
        v-model="value"
        :name="name"
        :id="name"
        mode="decimal"
        :class="{ 'p-invalid': errorMessage }"
        showButtons
        buttonLayout="horizontal"
        decrementButtonClass="p-button-secondary"
        incrementButtonClass="p-button-secondary"
        incrementButtonIcon="pi pi-plus"
        decrementButtonIcon="pi pi-minus"
      />
    </span>
    <small class="p-error" :class="{ invisible: !hasError }">
      {{ errorMessage || "&nbsp;" }}
    </small>
  </div>
</template>
