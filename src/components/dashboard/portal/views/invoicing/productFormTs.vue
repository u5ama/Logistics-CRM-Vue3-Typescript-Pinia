<script setup lang="ts">
import { toRef } from "vue";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";

interface Props {
  name?: string;
  value?: string;
  loading?: boolean;
  allProducts: any[];
  productData: any[];
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const products = toRef(props, "productData");

const addRow = () => {
  products.value.push({
    product_id: "",
    quantity: 0,
    rate: 0,
    epa_number: "",
    rate_key_name: "rate",
    epa_number_key_name: "epa_number",
    product_key_name: "product_id",
    quantity_key_name: "quantity",
  });
};
const deleteRow = (index: number) => {
  products.value.splice(index, 1);
};
</script>
<template>
  <div>
    <div
      class="grid grid-cols-7 gap-3 mb-8"
      v-for="(product, index) in products"
      :key="index"
    >
      <div class="col-span-2">
        <label
          :for="product.product_key_name"
          class="inline-block text-xs text-slate-500 ml-3 mb-2"
        >
          Choose Product
        </label>
        <Dropdown
          class="w-full"
          :options="allProducts"
          optionLabel="name"
          optionValue="id"
          v-model="product.product_id"
          :name="product.product_key_name"
          :id="product.product_key_name"
          :loading="loading"
        />
      </div>
      <div class="col-span-1">
        <label
          :for="product.quantity_key_name"
          class="inline-block text-xs text-slate-500 ml-3 mb-2"
        >
          Choose Quantity
        </label>
        <br />
        <InputNumber
          v-model="product.quantity"
          :name="product.quantity_key_name"
          :id="product.quantity_key_name"
          mode="decimal"
          inputStyle="width:20%"
          showButtons
          buttonLayout="horizontal"
          decrementButtonClass="p-button-secondary"
          incrementButtonClass="p-button-secondary"
          incrementButtonIcon="pi pi-plus"
          decrementButtonIcon="pi pi-minus"
        />
      </div>
      <div class="col-span-1">
        <label
          :for="product.rate_key_name"
          class="inline-block text-xs text-slate-500 ml-3 mb-2"
        >
          Rate
        </label>
        <br />
        <InputNumber
          mode="decimal"
          inputStyle="width:20%"
          v-model="product.rate"
          :name="product.rate_key_name"
          :id="product.rate_key_name"
        />
      </div>
      <div class="col-span-2">
        <label
          :for="product.epa_number_key_name"
          class="inline-block text-xs text-slate-500 ml-3 mb-2"
        >
          EPA Docket
        </label>
        <br />
        <InputText
          style="width: 100%"
          v-model="product.epa_number"
          :name="product.epa_number_key_name"
          :id="product.epa_number_key_name"
        />
      </div>
      <div class="mt-8">
        <button
          class="p-button p-button-primary"
          v-on:click="addRow()"
          type="button"
        >
          <i class="pi pi-plus"></i>
        </button>
        <button
          class="p-button p-button-danger ml-2"
          v-on:click="deleteRow(index)"
          type="button"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inputPeso input {
  width: 20% !important;
}
</style>
