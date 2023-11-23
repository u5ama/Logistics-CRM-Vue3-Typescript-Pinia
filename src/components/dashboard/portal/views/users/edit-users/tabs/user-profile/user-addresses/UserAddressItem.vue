<script setup lang="ts">
import { ref, type HTMLAttributes } from "vue";
import Button from "primevue/button";
import type { IUserAddress } from "@app-types/user";
import { useToast } from "vue-toastification";
import AddressForm from "./AddressForm.vue";
import { useLoading } from "@hooks";

interface Props extends HTMLAttributes {
  address: IUserAddress;
  updateHandler: (
    addressId: number,
    newValue: string,
    cb: Function
  ) => Promise<void>;
}

interface Emits {
  (e: "delete", id: number, cb: Function): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const [isDeleting, setDeleting] = useLoading();
const [isCopying, setCopying] = useLoading();
const deleteAddressHandler = () => {
  setDeleting.start();

  emit("delete", props.address.id, () => {
    setDeleting.stop();
    useToast().success("Address removed successfully");
  });
};

const copyAddressHandler = async () => {
  setCopying.start();
  await navigator.clipboard.writeText(props.address.address);
  setCopying.stop();
};

const isEditing = ref(false);
</script>

<template>
  <div class="py-4">
    <AddressForm
      :initialValue="address.address"
      isEditing
      v-if="isEditing"
      @close="isEditing = false"
      @submitted="
        async (value, cb) => {
          await updateHandler(address.id, value, cb);
          isEditing = false;
        }
      "
    />

    <div class="flex items-center" :key="address.id" v-else>
      <div class="font-medium">
        {{ address.address }}
      </div>
      <div class="controls ml-auto flex gap-x-1">
        <Button
          icon="pi pi-copy"
          class="p-button-secondary p-button-sm p-button-rounded"
          v-tooltip.left="'Copy'"
          :disabled="isCopying"
          @click="copyAddressHandler"
        />
        <Button
          icon="pi pi-pencil"
          class="p-button-secondary p-button-sm p-button-rounded"
          v-tooltip.top="'Edit'"
          @click="isEditing = true"
        />
        <Button
          icon="pi pi-trash"
          class="p-button-danger p-button-sm p-button-rounded"
          v-tooltip.right="'Delete'"
          :disabled="isDeleting"
          @click="deleteAddressHandler"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
