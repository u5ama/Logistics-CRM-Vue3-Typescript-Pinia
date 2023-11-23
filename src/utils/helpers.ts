import { type IUser, UserStatus, UserType } from "@app-types/user";
import { USER_STORAGE_KEY } from "./constants";
import { InvoiceStatus } from "@/types/jobs";
import { DocumentStatus } from "@/types/subcontractor";

/**
 * Converts a number in to formatted USD currency string
 *  using the `Intl` API
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat Intl.NumberFormat - JavaScript | MDN}
 *
 * @param {number} value - The number that needs to be formatted
 *
 * @example
 * currencyFormat(4547) => "$4,547"
 * currencyFormat(2_500_000) => "$2,500,000"
 */
export const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
}).format;

/**
 * Gets the user stored in local storage.
 *
 * @returns {IUser} The user object
 * @returns {null} `null` - If no user is found
 *
 * @example
 * const savedUser = getUserFromLocalStorage();
 */
export function getUserFromLocalStorage() {
  const savedUserString = localStorage.getItem(USER_STORAGE_KEY);
  return savedUserString ? (JSON.parse(savedUserString) as IUser) : null;
}

export function getUserTypeForRoute(route: string) {
  const loggedInUser = getUserFromLocalStorage();
  let type = "";
  if (loggedInUser?.user_type === "1") {
    type = "superAdmin";
  } else if (loggedInUser?.user_type === "2") {
    type = "accounts";
  } else if (loggedInUser?.user_type === "3") {
    type = "allocators";
  } else if (loggedInUser?.user_type === "4") {
    type = "sales";
  } else if (loggedInUser?.user_type === "5") {
    type = "drivers";
  } else if (loggedInUser?.user_type === "6") {
    type = "safetyOfficer";
  } else {
    type = "";
  }
  type = "/" + type + "/" + route;
  return type;
}
/**
 * Converts `UserType` enums to human-readable strings.
 *
 * @param {UserType} type - UserType enum value
 * @returns {string}
 *
 * @example
 * mapUserTypeToString(UserType.SuperAdmin) => "Administrator"
 * mapUserTypeToString(UserType.Driver) => "Driver"
 */
export function mapUserTypeToString(type: UserType) {
  const map: Record<UserType, string> = {
    [UserType.SuperAdmin]: "Administrator",
    [UserType.Accounts]: "Accounts",
    [UserType.Allocator]: "Allocator",
    [UserType.Sales]: "Sales",
    [UserType.Driver]: "Driver",
    [UserType.SafetyOfficer]: "Safety Officer",
  };

  return map[type];
}

/**
 * Converts `UserStatus` enums to human-readable strings.
 *
 * @param {UserType} type - UserStatus enum value
 * @returns {string}
 *
 * @example
 * mapUserTypeToString(UserType.NotActive) => "Inactive"
 */
export function mapUserActiveToString(type: UserStatus) {
  const map: Record<UserStatus, string> = {
    [UserStatus.Active]: "Active",
    [UserStatus.NotActive]: "Inactive",
  };

  return map[type];
}

export function mapTimeSheetActiveToString(type: InvoiceStatus) {
  const map: Record<InvoiceStatus, string> = {
    [InvoiceStatus.Invoiced]: "Invoiced",
    [InvoiceStatus.NotInvoiced]: "NotInvoiced",
  };

  return map[type];
}

export function mapDocumentActiveToString(type: DocumentStatus) {
  const map: Record<DocumentStatus, string> = {
    [DocumentStatus.Approved]: "Approved",
    [DocumentStatus.NotApproved]: "NotApproved",
  };

  return map[type];
}

/**
 * Concatenates all the strings passed using spaces
 *
 * @param {...string[]} names
 *
 * @returns {string} concatenated name
 *
 * @example
 * generateFullName('Mr.', 'John', 'Doe') => 'Mr. John Doe'
 */
export const generateFullName = (...names: string[]) => names.join(" ");
