<script setup lang="ts">
import { useForm } from "vee-validate";
import { addAssetSubcontractorFormSchema } from "@utils/schemas";
import Button from "primevue/button";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import { useAssetSubcontractorStore } from "@stores/resources/assetSubcontractor";
import { useToast } from "vue-toastification";
import { computed, inject, onMounted, watch } from "vue";
import { editAssetInjectionKey } from "@utils/injectionKeys";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import InvoiceFormDropdown from "@dashboard-views/invoicing/InvoiceFormDropdown.vue";
import { useLoading } from "@hooks";
import { storeToRefs } from "pinia";
import { useSubcontractorsStore } from "@stores/subcontractors/subcontractors";
import UserProfileFormDropdown
  from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormDropdown.vue";
import type { IAssetSubcontractors } from "@/types/resources";
interface Props {
    selectedItem: IAssetSubcontractors,
    open: boolean;
}
const props = defineProps<Props>();
const [isOptionsLoading, setOptionsLoading] = useLoading();
const isUpdating = computed(() => !!props.selectedItem?.id);
const emit = defineEmits(["close", "success"]);

const { assetId } = inject(editAssetInjectionKey)!;

const materials = [
  { name: "Per Hour", value: "per_hour" },
  { name: "Per Trip", value: "per_trip" },
  { name: "Per M3", value: "per_m3" },
];

const subcontractorsStore = useSubcontractorsStore();
const { getAllSubcontractors } = subcontractorsStore;
const { subcontractors } = storeToRefs(subcontractorsStore);

onMounted(async () => {
  setOptionsLoading.start();
  await getAllSubcontractors();
  setOptionsLoading.stop();
});

const assetSubcontractorStore = useAssetSubcontractorStore();
const { addSubcontractor, updateSubcontractor } = assetSubcontractorStore;

const { handleSubmit, isSubmitting, setValues, setErrors } = useForm({
  validationSchema: addAssetSubcontractorFormSchema,
  validateOnMount: false,
});

const addHandler = async (subcontractor: IAssetSubcontractors) => {
  const { subcontractor_id, charge_type, charge_unit } = subcontractor;
  await addSubcontractor(
    assetId,
    subcontractor_id,
    charge_type,
    charge_unit,
  );
  useToast().success("Subcontractor updated successfully");
};

const updateHandler = async (subcontractor: IAssetSubcontractors) => {
  await updateSubcontractor(props.selectedItem?.id, subcontractor);
  useToast().success("Subcontractor updated successfully");
};

const submitHandler = handleSubmit(async (values) => {
  const subcontractor = values as IAssetSubcontractors;
  if (isUpdating.value) await updateHandler(subcontractor);
  else await addHandler(subcontractor);

  emit("close");
},
(data) => console.log(data.errors)
);
const resetFields = () => {
  setValues({});
  setErrors({});
};
watch(() => props.selectedItem, resetFields);

</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-mask">
        <div
          class="modal-container relative bg-white w-full max-w-xl py-12 px-16 rounded"
          @click.stop
        >
          <div class="absolute top-3 right-4">
            <i class="pi pi-times cursor-pointer" @click="$emit('close')"></i>
          </div>

          <StyledHeading class="mb-12"> {{ (selectedItem?.name ? 'Edit' : 'Add') }} Asset Subcontractor</StyledHeading>

          <form
            class="flex flex-col gap-y-1 px-2 mx-auto"
            autocomplete="off"
          >
            <InvoiceFormDropdown
              class="col-span-3"
              label="Choose Subcontractor"
              name="subcontractor_id"
              :options="subcontractors"
              :loading="isOptionsLoading"
              :value="selectedItem?.subcontractor_id"
            />

            <UserProfileFormDropdown
              class="col-span-4"
              label="Choose Charge Type"
              name="charge_type"
              :options="materials"
              :loading="isOptionsLoading"
              :value="selectedItem?.charge_type"
            />

            <UserProfileFormTextField
              name="charge_unit"
              label="Charge Unit"
              :value="selectedItem?.charge_unit"
            />
            <Button
              :label="selectedItem?.name ? 'Update Subcontractor' : 'Add Subcontractor'"
              class="p-button p-button-primary w-full"
              :loading="isSubmitting"
              @click="submitHandler"
            />
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
  display: grid;
  place-items: center;
  overflow: scroll;
  overflow-x: hidden;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(1.1);
}
</style>
