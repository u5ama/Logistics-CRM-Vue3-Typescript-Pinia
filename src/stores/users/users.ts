import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type {
  IUser, IUserData,
  IUserInfo,
  IUserProfile,
  IUserWithProfile,
  UserStatus
} from "@app-types/user";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("users");

type AllUsersUser = IUser & { user_profile: IUserProfile };

/**
 * Pinia store to manage `users`
 */
export const useUsersStore = defineStore("users", () => {
  /** Array of fetched `user` objects */
  const users = ref<AllUsersUser[]>([]);

  /** Fetched `user` object */
  const user = ref<IUserWithProfile>();

  const newUser = ref<IUserData>();

  const error = ref<string | null>(null);
  /**
   * Fetches all the users from backend API.
   * Stores them in `users`.
   *
   */
  async function getAllUsers() {
    try {
      const response = await axios.get<IResponse<AllUsersUser[]>>(
        `${BASE_URL}`,
        { headers: authHeader() }
      );

      users.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Fetches all the users from backend API.
   * Stores them in `users`.
   *
   */
  async function newUsers() {
    try {
      const response = await axios.get<IResponse<AllUsersUser[]>>(
        getUserTypeForRoute("newUsers"),
        { headers: authHeader() }
      );

      users.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Fetches a single user details from backend API.
   * Stores it in `user`.
   *
   * @param {number} id - User ID
   */
  async function getUser(id: number) {
    try {
      const response = await axios.post<IResponse<IUserWithProfile>>(
        getUserTypeForRoute("userShow"),
        { id },
        { headers: authHeader() }
      );

      user.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Fetches a single user details from backend API.
   * Stores it in `user`.
   *
   * @param {number} id - User ID
   */
  async function getNewUser(id: number) {
    try {
      const response = await axios.post<IResponse<IUserData>>(
        getUserTypeForRoute("newUserShow"),
        { id },
        { headers: authHeader() }
      );

      newUser.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Adds a new user to the Database.
   *
   * @param {IUser} user - The user object
   */
  const addUser = async (user: IUser) => {
    try {
      const response = await axios.post<IResponse<IUser>>(`${BASE_URL}`, user, {
        headers: authHeader(),
      });

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else if (typeof e === "string") error.value = e;
      else throw e;
    }
  };

  /**
   * Update an existing user properties.
   *
   * @param {number} userId - ID of the user to be updated
   * @param {IUserInfo} userInfo - User Info object with updated properties
   */
  const updateUser = async (userId: number, userInfo: IUserInfo) => {
    try {
      const response = await axios.post<IResponse<IUser>>(
        `${BASE_URL}/${userId}`,
        userInfo,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else if (typeof e === "string") error.value = e;
      else throw e;
    }
  };

  /**
   * Change a user's status as **Active** or **Inactive**.
   *
   * @param {number} userId - The id of user to update
   * @param {UserStatus} newStatus - New status of the user
   */
  const changeUserStatus = async (userId: number, newStatus: UserStatus) => {
    try {
      const response = await axios.post<IResponse<IUser>>(
        getUserTypeForRoute("changeStatus") + "/" + userId,
        { status: newStatus },
        {
          headers: authHeader(),
        }
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Change a new user's status as **Active** or **Inactive**.
   *
   * @param {number} userId - The id of user to update
   * @param {UserStatus} newStatus - New status of the user
   */
  const changeNewUserStatus = async (userId: number, newStatus: UserStatus) => {
    try {
      const response = await axios.post<IResponse<IUser>>(
        "changeNewUserStatus" + "/" + userId,
        { status: newStatus },
        {
          headers: authHeader(),
        }
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };


  /**
   * Update an existing new user properties.
   *
   * @param {number} userId - ID of the user to be updated
   * @param user
   */
  const updateNewUser = async (userId: number, user: IUserData) => {
    try {

      const formData = new FormData();
      formData.append('user', JSON.stringify(user));

      const response = await axios.post<IResponse<IUserData>>(
        getUserTypeForRoute("updateNewUser")+ "/" + userId,
        formData,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else if (typeof e === "string") error.value = e;
      else throw e;
    }
  };


  return {
    error,
    users,
    user,
    newUser,
    updateNewUser,
    getAllUsers,
    newUsers,
    getNewUser,
    updateUser,
    addUser,
    changeUserStatus,
    changeNewUserStatus,
    getUser,
  };
});
