<script>
import { defineComponent } from "vue";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";

export default defineComponent({
  components: { Dropdown, InputText },
  props: ["loading", "assets", "jobAssets"],
  data() {
    return {
      assetValRec: [],
      assetRec: [
        {
          asset_id: 0,
          start_date: "",
          end_date: "",
        },
      ],
    };
  },
  mounted() {
    this.assetRec = this.jobAssets;
  },
  updated() {
    if (this.jobAssets) {
      this.assetValRec = this.jobAssets;
      this.assetRec = this.assetValRec;
    }
  },
  methods: {
    deleteRow(index) {
      this.assetRec.splice(index, 1);
    },
    addRow() {
      this.assetRec.push({
        asset_id: 0,
        start_date: "",
        end_date: "",
      });
    },
  },
});
</script>

<template>
  <div>
    <div
      class="lg:grid grid-cols-8 sm:grid-cols-12 gap-3 mb-8"
      v-for="(p, index) in assetRec"
      :key="index"
    >
      <div class="col-span-2">
        <label
          for="asset_id"
          class="inline-block text-xs text-slate-500 ml-3 mb-2"
        >
          Choose Asset
        </label>
        <Dropdown
          class="w-full"
          filter
          :options="assets"
          optionLabel="name"
          optionValue="id"
          v-model="p.asset_id"
          name="asset_id"
          id="asset_id"
          :loading="loading"
        />
      </div>
      <div class="col-span-2">
        <label
          for="start_date"
          class="inline-block text-xs text-slate-500 ml-3 mb-2"
        >
          Start Date
        </label>
        <br />
        <InputText
          style="width: 100%"
          class="rounded border border-gray-500 py-2 px-4"
          type="date"
          v-model="p.start_date"
          name="start_date"
          id="start_date"
        />
      </div>
      <div class="col-span-2">
        <label
          for="end_date"
          class="inline-block text-xs text-slate-500 ml-3 mb-2"
        >
          End Date
        </label>
        <br />
        <InputText
          style="width: 100%"
          class="rounded border border-gray-500 py-2 px-4"
          type="date"
          v-model="p.end_date"
          name="end_date"
          id="end_date"
        />
      </div>
      <div class="col-span-2 mt-8">
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

<style lang="scss" scoped></style>
