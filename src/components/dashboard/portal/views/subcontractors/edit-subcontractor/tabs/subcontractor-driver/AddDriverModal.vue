<script setup lang="ts">
import { useForm } from "vee-validate";
import { addSubcontractorDriverFormSchema } from "@utils/schemas";
import Button from "primevue/button";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import { useSubcontractorDriversStore } from "@stores/subcontractors/subcontractorsDrivers";
import { useToast } from "vue-toastification";
import { inject, onMounted } from "vue";
import { editSubcontractorInjectionKey } from "@utils/injectionKeys";
import InvoiceFormDropdown from "@dashboard-views/invoicing/InvoiceFormDropdown.vue";
import { useLoading } from "@hooks";
import { storeToRefs } from "pinia";
import { useJobDriversStore } from "@stores/jobs/drivers";

interface Props {
  open: boolean;
}

const emit = defineEmits(["close", "success"]);

defineProps<Props>();
const { subcontractorId } = inject(editSubcontractorInjectionKey)!;
const isEditing = !!subcontractorId;
const driversStore = useSubcontractorDriversStore();
const { addNewDriver } = driversStore;

const jobDriversStore = useJobDriversStore();
const { allDrivers } = storeToRefs(jobDriversStore);
const { allDriversList } = jobDriversStore;

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: addSubcontractorDriverFormSchema,
  validateOnMount: false,
});

const [isJobLoading, setJobLoading] = useLoading(isEditing);

onMounted(async () => {
  setJobLoading.start();
  await allDriversList();
  setJobLoading.stop();
});

const onSubmit = handleSubmit(
  async (values) => {
    const { user_id } = values;
    const success = await addNewDriver(subcontractorId, user_id);

    if (!success) return;
    useToast().success("Driver linked Successfully!");
    emit("close");
  },
  (data) => console.log(data.errors)
);
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

          <StyledHeading class="mb-12"> Link New Driver </StyledHeading>

          <form
            class="flex flex-col gap-y-4 px-2 mx-auto"
            autocomplete="off"
            @submit.prevent="onSubmit"
          >
            <InvoiceFormDropdown
              class="col-span-6"
              label="Choose Driver"
              name="user_id"
              :options="allDrivers"
              :loading="isJobLoading"
            />

            <Button
              :loading="isSubmitting"
              label="Add Driver"
              type="submit"
              class="p-button p-button-primary w-full"
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
