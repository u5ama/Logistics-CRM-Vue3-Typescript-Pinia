<script>
import { defineComponent } from "vue";
import InputText from "primevue/inputtext";
import Editor from "primevue/editor";

export default defineComponent({
  components: { InputText, Editor },
  props: ["loading", "quoteData", "quoteVal"],
  data() {
    return {
      quoteValRec: [],
      quoteRec: [
        {
          quote_price: "",
          title: "",
          description: "",
          quote_file: "",
          quote_id: "",
          quote_price_key_name: "quote_price",
          description_key_name: "description",
          title_key_name: "title",
        },
      ],
    };
  },
  mounted() {
    this.quoteRec = this.quoteData;
  },
  updated() {
    if (this.quoteData) {
      this.quoteValRec = this.quoteData;
      this.quoteRec = this.quoteValRec;
    }
  },
  methods: {
    deleteRow(index) {
      this.quoteRec.splice(index, 1);
    },
    addRow() {
      this.quoteRec.push({
        description: "",
        title: "",
        quote_price: "",
        quote_id: "",
        quote_file: "",
        description_key_name: "description",
        title_key_name: "title",
        quote_price_key_name: "total_price",
      });
    },
  },
});
</script>

<template>
  <div>
    <div
      class="lg:grid grid-cols-7 sm:grid-col-12 gap-3 mb-8"
      v-for="(p, index) in quoteRec"
      :key="index"
    >
      <div class="col-span-2">
        <label
          :for="p.title_key_name"
          class="inline-block text-xs text-slate-500 ml-3 mb-2"
        >
          Title
        </label>
        <br />
        <InputText
          style="width: 100%"
          v-model="p.title"
          :name="p.title_key_name"
          :id="p.title_key_name"
        />
      </div>
      <div class="col-span-1">
        <label
          :for="p.quote_price_key_name"
          class="inline-block text-xs text-slate-500 ml-3 mb-2"
        >
          Item Price
        </label>
        <br />
        <InputText
          style="width: 100%"
          v-model="p.quote_price"
          :name="p.quote_price_key_name"
          :id="p.quote_price_key_name"
        />
      </div>
      <div class="col-span-3">
        <label
          :for="p.description_key_name"
          class="inline-block text-xs text-slate-500 ml-3 mb-2"
          >Description
        </label>
        <br />
        <Editor
          v-model="p.description"
          :name="p.description_key_name"
          :id="p.description_key_name"
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
