import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import router from "@router";
import { getUserFromLocalStorage } from "@utils/helpers";
import { USER_STORAGE_KEY } from "@utils/constants";
import { authHeader, handleAxiosErrors, isTokenExpired } from "@utils/axios";
import type { IResponse } from "@app-types/api";
import type { IUser, IUserData } from "@app-types/user";
import { useToast } from "vue-toastification";

axios.interceptors.request.use();

/**
 * Pinia store to manage the state of the authenticated user
 */
export const useAuthStore = defineStore("auth", () => {
  /** The authenticated user object in the state */
  const user = ref(getUserFromLocalStorage());

  /** Any error message returned by backend API during auth */
  const error = ref<string | null>(null);

  /** Computed value representing the user state as a `boolean` */
  const isAuthenticated = computed(() => !!user.value);

  /** Sets the `error` back to null */
  const clearErrors = () => (error.value = null);

  /**
   * Registers and logs in a new user.
   * Saving the user object in *localStorage*.
   *
   * @param {string} name - Username of the user
   * @param {string} email - Email of the user
   * @param {string} password - Password for the user
   */
  async function signup(name: string, email: string, password: string) {
    try {
      const response = await axios.post<IResponse<IUser>>("/register", {
        name,
        email,
        password,
      });

      if (!response.data.success) throw response.data.message;

      const userValue = { ...response.data.data! };

      user.value = userValue;

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userValue));

      useToast().clear();
      clearErrors();
      router.push("/dashboard");
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else if (typeof e === "string") error.value = e;
      else throw e;
    }
  }

  /**
   * Registers and logs in a new user.
   * Saves the user object in *localStorage*.
   *
   * @param {IUserData} user - The user data to be registered.
   * @param {File[]} insuranceFiles - Array of insurance files to be uploaded.
   * @param {File[]} checklistFiles - Array of checklist files to be uploaded.
   */
  async function registerUser(user: IUserData, insuranceFiles: File[], checklistFiles: File[]) {
    try {
      // Create FormData to send user data and files
      const formData = new FormData();
      formData.append('user', JSON.stringify(user));

      // Append each checklist file to FormData
      checklistFiles.forEach((checklistFile, index) => {
        const fieldName = checklistFile.key;
        formData.append(fieldName, checklistFile.file);
      });

      // Append each insurance file to FormData
      insuranceFiles.forEach((insuranceFile, index) => {
        const fieldName = insuranceFile.key;
        formData.append(fieldName, insuranceFile.file);
      });

      // Send a POST request to register the user
      const response = await axios.post<IResponse<IUserData>>("/register", formData, { headers: authHeader() });

      // Handle the response
      if (!response.data.success) throw response.data.message;

      const userValue = { ...response.data.data! };

      // Save the user data in localStorage
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userValue));

      // Clear any toasts, errors, and redirect to the dashboard if needed
      useToast().clear();
      clearErrors();
      // router.push("/dashboard");
    } catch (e) {
      // Handle errors
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else if (typeof e === "string") error.value = e;
      else throw e;
    }
  }


  /**
   * Logs a user in and saves the user object in *localStorage*.
   *
   * @param {string} email - User email address
   * @param {string} password - User password
   */
  async function login(email: string, password: string) {
    try {
      const response = await axios.post<IResponse<IUser>>("/login", {
        email,
        password,
      });

      if (!response.data.success) throw response.data.message;

      const userValue = { ...response.data.data! };

      user.value = userValue;

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userValue));

      useToast().clear();
      clearErrors();
      if (userValue.user_type === "3") {
        router.push("/allocator");
      } else if (userValue.user_type === "5") {
        router.push("/driver");
      } else if (userValue.user_type === "6") {
        router.push("/safety_officer");
      } else {
        router.push("/dashboard");
      }
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else if (typeof e === "string") error.value = e;
      else throw e;
    }
  }

  /**
   * Logs out the user by removing user object from *state* and *localStorage*.
   *
   */
  async function logout() {
    try {
      const savedUser = getUserFromLocalStorage();

      if (!savedUser) return;

      const tokenExpired = isTokenExpired(savedUser.token); // Check if token is expired
      if (tokenExpired) {
        // Token is expired, handle accordingly (e.g., redirect to login page)
        localStorage.removeItem(USER_STORAGE_KEY);
        await router.push({ path: "/login", query: { _rnd: Math.random() } });
        router.go(0);
        return;
      }

      await axios.get<IResponse<IUser>>("/logout", {
        headers: authHeader(),
      });

      user.value = null;
      localStorage.removeItem(USER_STORAGE_KEY);
      useToast().clear();
      await router.push({ path: "/login", query: { _rnd: Math.random() } });

      router.go(0);
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return { isAuthenticated, clearErrors, user, error, logout, login, signup, registerUser };
});
