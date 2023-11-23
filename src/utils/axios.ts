import type { AxiosError } from "axios";
import { getUserFromLocalStorage } from "./helpers";
import { APIErrorType, type IResponse } from "@app-types/api";
import {
  CHECKLIST_ALREADY_ADDED_MESSAGE,
  EMAIL_TAKEN_MESSAGE,
  TOKEN_EXPIRED_MESSAGE,
} from "./constants";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@stores/auth";
import router from "@router";

/**
 * Returns an object with the Authorization Header
 * containing the jwt token from local storage
 *
 * @returns `{ Authorization: "Bearer {token}" }`
 *
 * @example
 * headers: { ...authHeader() }
 * headers: authHeader()
 */
export const authHeader = () => {
  const savedUser = getUserFromLocalStorage();

  const Authorization = `Bearer ${savedUser?.token}`;

  return { Authorization };
};

export const isTokenExpired = (token: string): boolean => {
  if (!token) {
    return true; // Token doesn't exist or is empty, considering it as expired
  }

  const expirationTime = getTokenExpirationTime(token);
  const currentTime = Date.now();

  // Compare the expiration time with the current time
  return currentTime > expirationTime;
};

function getTokenExpirationTime(token: string): number {
  // Extract the expiration time from the token
  // You'll need to adapt this based on your token structure
  const decodedToken = decodeToken(token);
  // Convert expiration time to milliseconds
  return decodedToken.exp * 1000;
}

function decodeToken(token: string): any {
  // Decode the token to extract its payload
  // You'll need to use the appropriate decoding mechanism based on your token structure
  // For example, if the token is a JWT, you can use libraries like `jsonwebtoken`
  // Here's a simplified example assuming the token is in the format 'header.payload.signature'
  const tokenParts = token.split(".");
  return JSON.parse(atob(tokenParts[1]));
}

/**
 * Handle api request errors by displaying helpful messages
 * in toast notifications
 *
 * @param {AxiosError} e - The Axios error object
 *
 * @example
 * if (axios.isAxiosError(e)) handleAxiosErrors(e);
 */
export const handleAxiosErrors = (e: AxiosError) => {
  const errorType = getErrorType(e);

  const { logout } = useAuthStore();

  switch (errorType) {
    case APIErrorType.TokenExpired:
      useToast().error("Authorization Token Expired. Please Login Again.", {
        timeout: 1000,
        onClose: logout,
      });
      break;
    case APIErrorType.NotAuthorized:
      useToast().error("You are not Authorized for this action.", {
        timeout: 5000,
        onClose: () => router.replace("/"),
      });
      break;
    case APIErrorType.EmailTaken:
      useToast().error("The email has already been taken.", {
        timeout: 5000,
      });
      break;

    case APIErrorType.ChecklistAdded:
      useToast().error("Checklist already added for today!", {
        timeout: 5000,
      });
      break;

    default:
      useToast().error("Something went wrong.", {
        timeout: 5000,
      });
      break;
  }
};

/**
 * Returns a custom defined error status from
 * enum `APIErrorType`
 *
 * @param {AxiosError} e - The Axios error object
 *
 * @return {string} `APIErrorType` as `string`
 *
 * @example
 * if (axios.isAxiosError(e))
 *   const errorType = getErrorType(e);
 */
export const getErrorType = (e: AxiosError) => {
  if (e.response) {
    const responseData = e.response.data as IResponse<unknown>;

    if (responseData.message === TOKEN_EXPIRED_MESSAGE) {
      return APIErrorType.TokenExpired;
    }

    if (e.response.status === 403) {
      return APIErrorType.NotAuthorized;
    }

    if (responseData.message === EMAIL_TAKEN_MESSAGE) {
      return APIErrorType.EmailTaken;
    }

    if (responseData.message === CHECKLIST_ALREADY_ADDED_MESSAGE) {
      return APIErrorType.ChecklistAdded;
    }
  }

  return APIErrorType.default;
};
