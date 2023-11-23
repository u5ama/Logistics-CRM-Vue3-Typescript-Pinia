import type { IApiObject } from "./api";

/**
 * Interface for the `users` returned by the backend API
 *
 */
export interface IUser extends IApiObject {
  name: string;
  email: string;
  email_verified_at: string;
  user_status: UserStatus;
  user_type: UserType;
  deleted_at: string;
  token: string;
}

/**
 * Interface for user information when updating the user
 *
 */
export interface IUserInfo {
  name: string;
  email: string;
  roles: string;
  title: string;
  first_name: string;
  preferredName: string;
  dob: Date;
  middle_name: string;
  last_name: string;
  phone: string;
  gender: string;
  tax_file_number: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}

/**
 * Interface for user profile
 *
 */
export interface IUserProfile
  extends Omit<IUserInfo, "roles" | "email" | "name"> {
  user_id: number;
}

/**
 * Interface for `user` returned when getting a single user
 *
 */
export interface IUserWithProfile extends IUser {
  userRole: [IUserRole];
  user_profile: IUserProfile;
  total_notes: number;
}

/**
 * `enum` encapsulating user status values
 *
 * @example
 * UserStatus.Active => "active"
 * NotActive = "NotActive"
 */
export enum UserStatus {
  Active = "active",
  NotActive = "NotActive",
}

/**
 * `enum` encapsulating user type codes
 *
 * @example
 * UserType.SuperAdmin => "1"
 * UserType.Allocator = "2"
 */
export enum UserType {
  SuperAdmin = "1",
  Accounts = "2",
  Allocator = "3",
  Sales = "4",
  Driver = "5",
  SafetyOfficer = "6",
}

/**
 * Interface for the `addresses` returned by the backend API
 *
 */
export interface IUserAddress extends IApiObject {
  user_id: number;
  address: string;
}

/**
 * Interface for the `roles` returned by the backend API
 *
 */
export interface IUserRole extends IApiObject {
  name: string;
  guard_name: string;
}

/**
 * Interface for the `notes` returned by the backend API
 *
 */
export interface IUserNote extends IApiObject {
  user_id: string;
  title: string;
  description: string;
}
export interface IUserTags extends IApiObject {
  user_id: string;
  name: string;
  tag_type: UserTagType;
}

export enum UserTagType {
  Competency = "competency",
  UserTag = "user",
}
/**
 * Interface for the `documents` returned by the backend API
 *
 */
export interface IUserDocument extends IApiObject {
  title: string;
  document_type: string;
  file: string;
}

/**
 * Interface for the `permissions` returned by the backend API
 *
 */
export interface IUserPermission extends IApiObject {
  name: string;
  guard_name: string;
}

/**
 * Interface for the `activities` returned by the backend API
 *
 */
export interface IUserActivity extends IApiObject {
  name: string;
  field: string;
  oldValue: string;
  newValue: string;
}

/**
 * Interface for a single `role` returned by the backend API
 *
 */
export interface IUserRoleWithPermissions extends IUserRole {
  permissions: IUserPermission[];
}

/**
 * Interface for response data from `/showRoles` returned by the backend API
 *
 */
export interface RoleAndPermissions {
  role: IUserRoleWithPermissions;
  permissions: IUserPermission[];
}

/**
 * Interface for the `password change` returned by the backend API
 *
 */
export interface IUserPassword extends IApiObject {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface IUserData extends IApiObject {
  checklistFiles: any[];
  //Company
  company_name : string;
  trading_name : string;
  corporate_trustee : string;
  abn : string;
  acn : string;
  company_director : string;
  email : string;
  contact_person : string;
  mobile : string;
  phone : string;

  business_number_street : string;
  business_suburb : string;
  business_state : string;
  business_post_code : string;
  postal_number_street : string;
  postal_suburb : string;
  postal_state : string;
  postal_post_code : string;

  bsb : string;
  account_number : string;
  account_name : string;
  banking_corporation : string;

  TaxCheck : string;
  infoCheck : string;

  //insurance
  work_policy_number : string;
  work_policy_expiry_date : string;
  work_cover_file : string;

  public_policy_number : string;
  public_policy_expiry_date : string;
  public_policy_file : string;

  equipment_policy_number : string;
  equipment_policy_expiry_date : string;
  equipment_policy_file : string;

  operatorDetails: any[];
  insuranceFiles: any[];

  complianceChecklist: any[],
  equipmentChecklist: any[],
  requirementChecklist: any[],
  hireChecklist: any[],

  truckDetails: any[],
  trailerDetails: any[],
  plantDetails: any[],
}
