import { object, string, date, mixed } from "yup";

// Schema for login form validation
const loginFormSchema = object({
  email: string().required().email().label("Email"),
  password: string().required().min(8).label("Password"),
});

// Schema for adding a new user form validation
const addUserFormSchema = object({
  email: string().required().email().label("Email"),
  name: string().required().min(3).label("Username"),
  password: string().required().min(8).label("Password"),
});

// Schema for user profile form validation
const userProfileFormSchema = object({
  name: string().required().label("Username"),
  roles: string().required().label("User Role"),
  email: string().required().email().label("Email"),
  title: string().label("Title"),
  dob: date().required().label("Date"),
  first_name: string().required().label("First Name"),
  preferredName: string().label("Preferred Name"),
  middle_name: string().label("Middle Name"),
  last_name: string().label("Last Name"),
  phone: string().required().label("Phone"),
  gender: string().required().label("Gender"),
  tax_file_number: string().required().label("Tax File Number"),
  emergency_contact_name: string().label("Emergency Contact Name"),
  emergency_contact_phone: string().label("Emergency Contact Phone"),
});

// Schema for signup form validation
const signupFormSchema = object({
   email: string().required().email().label("Email"),
   company_name: string().required().label("Company Name"),
   password: string().required().min(8).label("Password"),
   trading_name: string().required().label("Trading Name"),
   corporate_trustee: string().required().label("Corporate Trustee"),
   abn: string().required().label("ABN"),
   acn: string().required().label("ACN"),
   company_director: string().required().label("Company Director"),
   contact_person: string().required().label("Contact Person"),
   mobile: string().required().label("Mobile"),
   phone: string().required().label("Phone"),

  // taxInvoiceCheck: mixed().required().label("Read Tax Invoice"),

  business_number_street: string().required().label("Street, Number"),
  business_suburb: string().required().label("Business Suburb"),
  business_state: string().required().label("Business State"),
  business_post_code: string().required().label("Business Postcode"),

  bsb: string().required().label("BSB"),
  account_number: string().required().label("Account Number"),
  account_name: string().required().label("Account Name"),
  banking_corporation: string().required().label("Banking Corporation"),

  work_policy_number: string().required().label("Work Policy Number"),
  work_policy_expiry_date: string().required().label("Work Policy Expiry Date"),
  // work_cover_file: mixed().required().label("Work Policy File"),

  public_policy_number: string().required().label("Public LIABILITY Policy Number"),
  public_policy_expiry_date: string().required().label("Public LIABILITY Policy Expiry Date"),
  // public_policy_file: mixed().required().label("Public Liability File"),

  equipment_policy_number: string().required().label("Equipment INSURANCE Policy Number"),
  equipment_policy_expiry_date: string().required().label("Equipment INSURANCE Policy Expiry Date"),
  // equipment_policy_file: mixed().required().label("Equipment nsurance Policy File"),

  about_us: string().required().label("About Us"),
});

// Schema for adding a new note form validation
const addNoteFormSchema = object({
  title: string().required().min(3).max(155).label("Title"),
  description: string().required().max(500).label("Description"),
});

// Schema for adding a new tag form validation
const addTagFormSchema = object({
  name: string().required().min(3).max(155).label("name"),
});

// Schema for adding a new document form validation
const addDocumentFormSchema = object({
  title: string().required().min(3).max(255).label("Document Name"),
  document_type: string().required().max(255).label("Document Type"),
  upload_file: mixed().required().label("Document File"),
});

// Schema for adding an allocated invoice form validation
const addAllocatedInvoiceSchema = object({
  subcontractor_id: string().required().label("Subcontractor"),
  upload_file: mixed().required().label("Document File"),
  amount: mixed().required().label("Amount"),
});

// Schema for adding a job document form validation
const addJobDocumentFormSchema = object({
  title: string().required().min(3).max(255).label("Document Name"),
  // upload_file: mixed().required().label("Document File"),
});

// Schema for adding a driver form validation
const addDriverFormSchema = object({
  driver_id: string().required().label("Driver"),
});

// Schema for adding a timesheet form validation
const addTimeSheetFormSchema = object({
  user_id: string().required().label("User"),
  asset_id: string().required().label("User"),
  startTime: string().required().label("Start Time"),
  endTime: string().required().label("End Time"),
  upload_file: mixed().required().label("Document File"),
});

// Schema for adding a driver timesheet form validation
const addDriverTimeSheetFormSchema = object({
  is_confirmed: string().required().label("Status"),
  startTime: string().required().label("Start Time"),
  endTime: string().required().label("End Time"),
  upload_file: mixed().required().label("Document File"),
});

// Schema for adding a subcontractor form validation
const subcontractorFormSchema = object({
  name: string().required().min(3).max(255).label("Full Name"),
  email: string().required().email().label("Email"),
  phone: string().required().label("Phone"),
});

// Schema for adding a new tag form validation
const addNewTagFormSchema = object({
  name: string().required().max(255).label("Tag Name"),
  tag_type: string().required().label("Tag Type"),
});

// Schema for adding a new skill form validation
const addNewSkillFormSchema = object({
  name: string().required().max(255).label("Skill Name"),
});

// Schema for adding a new category form validation
const addNewCategoryFormSchema = object({
  name: string().required().max(255).label("Skill Name"),
});

// Schema for adding term and condition form validation
const addTermConditionFormSchema = object({
  title: string().required().max(255).label("Title"),
  terms_conditions: string().required().max(255).label("Terms Conditions"),
});

// Schema for adding a quote footer form validation
const addQuoteFooterFormSchema = object({
  title: string().required().max(255).label("Title"),
  description: string().required().max(255).label("Description"),
});

// Schema for attachment form validation
const attachmentFormSchema = object({
  name: string().nullable().required().max(255).label("Attachment Name"),
  description: string().nullable().label("Description"),
  rego_number: string().nullable().label("Rego Number"),
  year: string().nullable().label("Year"),
  model: string().nullable().label("Model"),
  make: string().nullable().label("Make"),
  serial_number: string().nullable().label("Serial Number"),
  avg_hourly_rate: string().nullable().label("Average Hourly Charge Rate"),
  current_number_reading: string().nullable().label("Current Number Reading"),
  external_id: string().nullable().label("External ID"),
  tags: string().nullable().label("Tags"),
  comments: string().nullable().label("Comments"),
});

// Schema for assets form validation
const assetsFormSchema = object({
  // photo: mixed().required().label("Asset Photo"),
  name: string().nullable().required().max(255).label("Asset Name"),
  description: string().nullable().label("Description"),
  rego_number: string().nullable().label("Rego Number"),
  year: string().nullable().label("Year"),
  model: string().nullable().label("Model"),
  make: string().nullable().label("Make"),
  serial_number: string().nullable().label("Serial Number"),
  avg_hourly_rate: string().nullable().label("Average Hourly Charge Rate"),
  current_number_reading: string().nullable().label("Current Number Reading"),
  external_id: string().nullable().label("External ID"),
  comments: string().nullable().label("Comments"),
  tags: string().nullable().label("Tags"),
  skills: string().nullable().label("Skills"),
  workers: string().nullable().label("Workers"),
  asset_attachments: string().nullable().label("Attachments"),
});

// Schema for adding an asset document form validation
const addAssetDocumentFormSchema = object({
  title: string().required().min(3).max(255).label("Document Name"),
  upload_file: mixed().required().label("Asset Document File"),
});

// Schema for adding an asset subcontractor sms form validation
const addAssetSMSFormSchema = object({
  message: string().required().min(3).label("Message"),
  subcontractors: string().nullable().label("Subcontractors"),
});

// Schema for adding an asset subcontractor form validation
const addAssetSubcontractorFormSchema = object({
  subcontractor_id: string().required().label("Subcontractor"),
  charge_type: string().required().label("Charge Type"),
  charge_unit: string().required().label("Charge Unit"),
});

// Schema for adding an attachment document form validation
const addAttachmentDocumentFormSchema = object({
  title: string().required().min(3).max(255).label("Document Name"),
  upload_file: mixed().required().label("Asset Document File"),
});

// Schema for adding a supplier form validation
const addSupplierFormSchema = object({
  name: string().required().min(3).max(255).label("Name"),
  email: string().required().email().label("Email"),
  phone: string().required().label("Phone"),
  abn: string().required().label("ABN"),
});

// Schema for adding a checklist form validation
const addChecklistFormSchema = object({
  name: string().required().min(3).max(255).label("Name"),
});

// Schema for adding a supplier document form validation
const addSupplierDocumentFormSchema = object({
  title: string().required().min(3).max(255).label("Document Name"),
  upload_file: mixed().required().label("Document File"),
});

// Schema for adding a subcontractor document form validation
const addSubcontractorDocumentFormSchema = object({
  title: string().required().min(3).max(255).label("Document Name"),
  reminder: string().required().label("Reminder Date"),
  upload_file: mixed().required().label("Document File"),
});

// Schema for adding a subcontractor driver form validation
const addSubcontractorDriverFormSchema = object({
  user_id: string().required().label("Driver"),
});

// Schema for adding a supplier contact form validation
const addSupplierContactFormSchema = object({
  name: string().required().min(3).max(255).label("Name"),
  email: string().required().email().label("Email"),
  phone: string().required().label("Phone"),
  address: string().required().label("Address"),
});

// Schema for adding a supplier item form validation
const addSupplierItemFormSchema = object({
  item_code: string().required().label("Item Code"),
  item_description: string().required().label("Item Description"),
  site: string().required().label("Site"),
  unit_price: string().required().label("Unit Price"),
  gst_incl: string().required().label("GST"),
  UOM: string().required().label("UOM"),
});

// Schema for product form validation
const productFormSchema = object({
  name: string().nullable().required().max(255).label("Name"),
  description: string().nullable().required().max(255).label("Description"),
  docket: string().nullable().label("Docket Number"),
  price: string().nullable().required().max(255).label("Price"),
});

// Schema for client form validation
const clientFormSchema = object({
  name: string().nullable().required().max(255).label("Name"),
  email: string().required().email().label("Email"),
  // password: string().required().min(8).label("Password"),
  phone: string().required().label("Phone"),
  address: string().required().label("Address"),
  abn: string().required().label("ABN"),
  account_terms: string().nullable().required().label("Account Terms"),
});

// Schema for adding a client document form validation
const addClientDocumentFormSchema = object({
  title: string().required().min(3).max(255).label("Document Name"),
  upload_file: mixed().required().label("Document File"),
});

// Schema for adding a client contact form validation
const addClientContactFormSchema = object({
  first_name: string().required().min(3).max(255).label("First Name"),
  last_name: string().required().min(3).max(255).label("last Name"),
  phone: string().required().min(3).max(255).label("Phone"),
  address: string().required().min(3).max(255).label("Address"),
  email: string().required().email().label("Email"),
  title: mixed().required().label("Title"),
});

// Schema for invoice form validation
const invoiceFormSchema = object({
  // invoice_name: string().nullable().required().max(255).label("Name"),
  client_id: string().required().label("Choose Client"),
});

const addExistingInvoiceForm = object({
  invoice_id: string().required().label("Choose Invoice"),
});

// Schema for quote form validation
const quoteFormSchema = object({
  quote_name: string().nullable().required().max(255).label("Name"),
  client_id: string().required().label("Client"),
});

// Schema for quote setting form validation
const quoteSettingFormSchema = object({
  user_ids: string().required().label("User"),
  terms_conditions: string()
      .nullable()
      .required()
      .label("Terms and Conditions"),
});

// Schema for adding a job form validation
const addJobFormSchema = object({
  job_title: string().nullable().required().max(255).label("Title"),
  job_description: string().nullable().required().label("Description"),
  client_id: string().nullable().required().label("Client"),
  end_date: string().nullable().required().label("End Date"),
  start_date: string().nullable().required().label("Start Date"),
});

// Schema for email settings form validation
const emailSettingsFormSchema = object({
  account_name: string().nullable().required().label("Account Name"),
  account_bsb: string().nullable().required().label("Account BSB"),
  account_number: string().nullable().required().label("Account Number"),
  inquiry_email: string().nullable().required().label("Inquiry Email"),
  terms: string().nullable().required().label("Terms"),
  note: string().nullable().required().label("Note"),
});

// Schema for quote email settings form validation
const quoteEmailSettingsFormSchema = object({
  op_manager_name: string().nullable().required().label("Manager Name"),
  op_manager_email: string().nullable().required().label("Manager Email"),
  op_manager_phone: string().nullable().required().label("Manager Phone"),
  quote_note: string().nullable().required().label("Quote Note"),
  company_name: string().nullable().required().label("Company Name"),
});

// Schema for password settings form validation
const passwordSettingsFormSchema = object({
  old_password: string().required().min(8).label("Old Password"),
  new_password: string().required().min(8).label("New Password"),
  confirm_password: string().required().min(8).label("Confirm Password"),
});

export {
  loginFormSchema,
  addUserFormSchema,
  userProfileFormSchema,
  signupFormSchema,
  addNoteFormSchema,
  addDocumentFormSchema,
  subcontractorFormSchema,
  addNewTagFormSchema,
  addNewSkillFormSchema,
  attachmentFormSchema,
  assetsFormSchema,
  addAssetDocumentFormSchema,
  addAttachmentDocumentFormSchema,
  addSupplierFormSchema,
  addSupplierDocumentFormSchema,
  addSupplierContactFormSchema,
  addSupplierItemFormSchema,
  productFormSchema,
  clientFormSchema,
  invoiceFormSchema,
  quoteFormSchema,
  addJobFormSchema,
  quoteSettingFormSchema,
  emailSettingsFormSchema,
  quoteEmailSettingsFormSchema,
  addClientDocumentFormSchema,
  addSubcontractorDocumentFormSchema,
  addDriverFormSchema,
  addTagFormSchema,
  addTimeSheetFormSchema,
  addDriverTimeSheetFormSchema,
  addChecklistFormSchema,
  addJobDocumentFormSchema,
  passwordSettingsFormSchema,
  addNewCategoryFormSchema,
  addSubcontractorDriverFormSchema,
  addAllocatedInvoiceSchema,
  addTermConditionFormSchema,
  addQuoteFooterFormSchema,
  addExistingInvoiceForm,
  addClientContactFormSchema,
  addAssetSubcontractorFormSchema,
  addAssetSMSFormSchema,
};
