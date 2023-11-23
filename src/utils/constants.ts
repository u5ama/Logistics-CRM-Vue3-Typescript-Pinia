/**
 * The key used to store user data in `localStorage`
 *
 * @const {string}
 */
export const USER_STORAGE_KEY = "user";

/**
 * The response message from backend API
 * when the token is expired
 *
 * @const {string}
 */
export const TOKEN_EXPIRED_MESSAGE = "Token is Expired";
export const EMAIL_TAKEN_MESSAGE = "The email has already been taken.";
export const CHECKLIST_ALREADY_ADDED_MESSAGE =
  "Checklist already added for today!";

/**
 * The base url of the backend server without the `api` path
 *
 * @const {string}
 */
export const API_BASE_URL = new URL(import.meta.env.VITE_API_URL).origin;
export const MYOB_CLIENT_ID = import.meta.env.VITE_MYOB_CLIENT_ID;
export const MYOB_REDIRECT_URL = import.meta.env.VITE_MYOB_REDIRECT_URL;
export const DOCUSIGN_CLIENT_ID = import.meta.env.VITE_DOCUSIGN_CLIENT_ID;
export const DOCUSIGN_REDIRECT_URL = import.meta.env.VITE_DOCUSIGN_REDIRECT_URL;
