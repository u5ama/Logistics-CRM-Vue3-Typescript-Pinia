<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { useDropzone } from "vue3-dropzone";

const props = defineProps(["file"]);
const emit = defineEmits(['pass-files']);

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop: (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      console.log(props.file.name);
      emit("pass-files", { key: props.file.name, file: file });
    });
  },
  multiple: false,
});

</script>

<template>
  <div>
    <label :for="file.name" class="text-slate-500 text-sm -mb-2" v-html="file.label"></label>
    <div
      v-bind="getRootProps()"
      class="h-28 w-full bg-brand-100 rounded-md border border-brand-300 border-dashed grid place-content-center"
    >
      <input :id="file.name" v-bind="getInputProps()" />
      <p v-if="isDragActive">Drop the file here ...</p>
      <p v-else>Drag 'n' Drop a file here, or click to select a file</p>
    </div>
  </div>
</template>
