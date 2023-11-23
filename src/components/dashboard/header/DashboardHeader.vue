<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@stores/auth";
import { useDashboardStore } from "@stores/dashboard";
import { useLoading } from "@hooks";

const authStore = useAuthStore();
const { logout } = authStore;
const { user } = storeToRefs(authStore);
const dashboardStore = useDashboardStore();
const { isNavDropdownOpen } = storeToRefs(dashboardStore);
const { toggleNavDropdown, reset } = dashboardStore;
const userInitial = computed(() => user.value?.name.charAt(0).toUpperCase());
const [isLoggingOut, setLoggingOut] = useLoading();

const logoutHandler = async () => {
  setLoggingOut.start();

  try {
    await logout();
  } catch (error) {
    return;
  } finally {
    setLoggingOut.stop();
    reset();
  }
};
</script>

<template>
  <div class="container mx-auto px-4 flex items-center">
    <form
      class="flex items-center justify-center sm:w-full lg:max-w-2xl max-w-xs sm:mx-auto ml-11 mr-auto py-7"
      action="#"
      @submit.prevent
    >
      <input
        class="w-full lg:h-11 h-9 border border-grey-200 rounded-full lg:px-7 py-4 px-3 placeholder:text-grey-300 lg:text-base text-sm sm:block hidden"
        type="text"
        name="search"
        id="search"
        placeholder="Search Job, Vehicle, Driver, Invoice…"
      />
      <button
        type="submit"
        class="lg:w-11 lg:h-11 lg:-ml-11 w-9 h-9 -ml-9 bg-brand text-white rounded-full lg:text-2xl text-lg grid place-items-center"
      >
        <i class="pi pi-search"></i>
      </button>
    </form>

    <div class="flex gap-x-8 items-center">
      <i class="icon pi pi-chart-bar hidden"></i>
      <i class="icon pi pi-cog hidden"></i>
      <div class="relative">
        <span
          class="flex items-center justify-center lg:h-12 lg:w-12 w-10 h-10 bg-brand text-white text-2xl rounded-xl leading-none cursor-pointer select-none"
          @click="toggleNavDropdown"
        >
          {{ userInitial }}
        </span>
        <div
          class="absolute bg-white min-w-[160px] rounded right-0 z-50 shadow"
          v-if="isNavDropdownOpen"
        >
          <p class="font-medium text-2xl leading-none whitespace-nowrap m-4">
            {{ user?.name }}
          </p>
          <nav class="flex flex-col divide-y text-sm text-gray-600 w-full">
            <a class="dropdown-option mobile" href="#" @click.prevent>
              <i class="icon pi pi-cog"></i>
              <span>Settings</span>
            </a>
            <a class="dropdown-option mobile" href="#" @click.prevent>
              <i class="icon pi pi-chart-bar"></i>
              <span>Statistics</span>
            </a>
            <a
              class="dropdown-option"
              :class="{ disabled: isLoggingOut }"
              href="#"
              @click.prevent="logoutHandler"
            >
              <i
                class="icon pi pi-sign-out"
                :class="{
                  'pi-spin pi-spinner': isLoggingOut,
                }"
              ></i>
              <span>{{ isLoggingOut ? "Logging Out" : "Logout" }}</span>
            </a>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  @apply lg:text-xl text-base leading-none mr-2;
}
.dropdown-option {
  @apply flex items-center px-4 py-3 font-medium;

  &.mobile {
    @apply sm:hidden;
  }
  &.disabled {
    @apply cursor-not-allowed text-gray-400;
  }
}
</style>
