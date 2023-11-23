<script>
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import { defineComponent } from "vue";

export default defineComponent({
  components: { InputNumber, Dropdown, InputText },
  props: ["allProducts", "loading", "productData", "invoiceProd"],
  data() {
    return {
      invoiceProdRec: [],
      productRec: [],
    };
  },
  watch: {
    productData: {
      immediate: true,
      handler(newData) {
        this.invoiceProdRec = newData;
        this.productRec = newData.length > 0 ? newData : this.getDefaultProduct();
      },
    },
  },
  mounted() {
    this.productRec = this.getDefaultProduct();
  },
  methods: {
    deleteRow(index) {
      this.productRec.splice(index, 1);
      this.updateProductData();
    },
    addRow() {
      this.productRec.push(this.getDefaultProductItem());
      this.updateProductData();
    },
    getDefaultProduct() {
      return this.productData.length > 0 ? this.productData : [this.getDefaultProductItem()];
    },
    getDefaultProductItem() {
      return {
        product_id: 0,
        quantity: 0,
        price: "",
        epa_number: "",
        rate_key_name: "rate",
        epa_number_key_name: "epa_number",
        product_key_name: "product_id",
        quantity_key_name: "quantity",
      };
    },
    updateProductData() {
      this.$emit("update:productData", this.productRec);
    },
  },
});
</script>

<template>
  <div>
    <div
      class="grid lg:grid-cols-7 sm:grid-cols-12 gap-3 mb-8"
      v-for="(p, index) in productRec"
      :key="index"
    >
      <div class="lg:col-span-2 sm:col-span-12">
        <label
          :for="p.product_key_name"
          class="inline-block text-xs text-slate-500 ml-3 mb-2"
        >
          Choose Product
        </label>
        <Dropdown
          class="w-full"
          :options="allProducts"
          optionLabel="name"
          optionValue="id"
          v-model="p.product_id"
          :name="p.product_key_name"
          :id="p.product_key_name"
          :loading="loading"
        />
      </div>
      <div class="lg:col-span-1 sm:col-span-12">
        <label
          :for="p.quantity_key_name"
          class="inline-block text-xs text-slate-500 ml-3 mb-2"
        >
          Choose Quantity
        </label>
        <br />
        <InputNumber
          v-model="p.quantity"
          :name="p.quantity_key_name"
          :id="p.quantity_key_name"
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
      <div class="lg:col-span-1 sm:col-span-12">
        <label
          :for="p.rate_key_name"
          class="inline-block text-xs text-slate-500 ml-3 mb-2"
        >
          Rate
        </label>
        <br />
        <InputText
          style="width: 100%"
          v-model="p.price"
          :name="p.rate_key_name"
          :id="p.rate_key_name"
        />
      </div>
      <div class="lg:col-span-2 sm:col-span-12">
        <label
          :for="p.epa_number_key_name"
          class="inline-block text-xs text-slate-500 ml-3 mb-2"
        >
          EPA Docket
        </label>
        <br />
        <InputText
          style="width: 100%"
          v-model="p.epa_number"
          :name="p.epa_number_key_name"
          :id="p.epa_number_key_name"
        />
      </div>
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
</template>

<style scoped></style>
