<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import Panel from "primevue/panel";
import { useUserAddressesStore } from "@stores/users/addresses";
import { storeToRefs } from "pinia";
import UserAddressItem from "./UserAddressItem.vue";
import { useToast } from "vue-toastification";
import AddressForm from "./AddressForm.vue";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import { editUserInjectionKey } from "@utils/injectionKeys";
import { useLoading } from "@hooks";

const userAddressesStore = useUserAddressesStore();
const { addresses } = storeToRefs(userAddressesStore);
const { getAddresses, addAddress, updateAddress, deleteAddress } =
  userAddressesStore;

const { userId } = inject(editUserInjectionKey)!;
const [isLoading, setLoading] = useLoading();

onMounted(async () => {
  if (addresses.value.length) return;

  await fetchAllAddresses();
});

const fetchAllAddresses = async () => {
  setLoading.start();
  await getAddresses(userId);
  setLoading.stop();
};

const addAddressHandler = async (value: string, cb: Function) => {
  await addAddress(userId, value);

  cb();
  useToast().success("Address added successfully");
};

const updateAddressHandler = async (
  addressId: number,
  newValue: string,
  cb: Function
) => {
  await updateAddress(addressId, newValue, userId);

  cb();
  useToast().success("Address updated successfully");
};

const deleteAddressHandler = async (id: number, cb: Function) => {
  await deleteAddress(id);

  cb();
};

const isAddFormOpen = ref(false);
const toggleAddForm = () => (isAddFormOpen.value = !isAddFormOpen.value);
</script>

<template>
  <Panel header="Addresses">
    <template #icons>
      <button
        class="p-panel-header-icon p-link"
        @click="fetchAllAddresses"
        v-tooltip.top="'Reload Addresses'"
      >
        <span class="pi pi-replay -rotate-45"></span>
      </button>

      <button
        class="p-panel-header-icon p-link"
        @click="toggleAddForm"
        v-tooltip.top="'Add New Address'"
      >
        <span class="pi pi-plus" :class="{ 'pi-minus': isAddFormOpen }"></span>
      </button>
    </template>

    <div
      class="transition-all"
      :class="{
        'py-4': isAddFormOpen,
        'h-0': !isAddFormOpen,
        'overflow-hidden': !isAddFormOpen,
      }"
    >
      <AddressForm @submitted="addAddressHandler" />
    </div>

    <SimpleLoader v-if="isLoading" />

    <p class="text-center mt-4" v-else-if="!addresses.length">
      No Records Found
    </p>

    <div class="divide-y" v-else>
      <UserAddressItem
        v-for="address in addresses"
        :key="address.id"
        :address="address"
        :updateHandler="updateAddressHandler"
        @delete="deleteAddressHandler"
      />
    </div>
  </Panel>
</template>

<style lang="scss" scoped>
* :deep(*) {
  .p-panel-content {
    height: 360px;
    overflow-y: scroll;
  }
}
</style>
