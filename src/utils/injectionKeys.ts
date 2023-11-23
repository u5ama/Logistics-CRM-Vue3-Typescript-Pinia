import type { IUserData, IUserWithProfile } from "@app-types/user";
import type { InjectionKey, Ref } from "vue";
import type { IAssetAttachment, IResourceAsset } from "@/types/resources";
import type { ISupplier } from "@/types/supplier";
import type { IInvoice } from "@/types/invoices";
import type { IQuote } from "@/types/quotes";
import type { IJob } from "@/types/jobs";
import type { IClients } from "@/types/clients";
import type { ISubcontractor } from "@/types/subcontractor";
import type { IChecklist } from "@/types/checklist";
import type { IDriver } from "@/types/drivers";

// Define injection keys for user editing
export const editUserInjectionKey = Symbol() as InjectionKey<{
  user: Ref<IUserWithProfile>;
  userId: number;
}>;

export const editNewUserInjectionKey = Symbol() as InjectionKey<{
  newUser: Ref<IUserData>;
  userId: number;
}>;

// Define injection keys for asset editing
export const editAssetInjectionKey = Symbol() as InjectionKey<{
  asset: Ref<IResourceAsset>;
  assetId: number;
}>;

// Define injection keys for attachment editing
export const editAttachmentInjectionKey = Symbol() as InjectionKey<{
  attachment: Ref<IAssetAttachment>;
  attachmentId: number;
}>;

// Define injection keys for supplier editing
export const editSupplierInjectionKey = Symbol() as InjectionKey<{
  supplier: Ref<ISupplier>;
  supplierId: number;
}>;

// Define injection keys for checklist editing
export const editChecklistInjectionKey = Symbol() as InjectionKey<{
  checklist: Ref<IChecklist>;
  checklistId: number;
}>;

// Define injection keys for subcontractor editing
export const editSubcontractorInjectionKey = Symbol() as InjectionKey<{
  subcontractor: Ref<ISubcontractor>;
  subcontractorId: number;
}>;

// Define injection keys for invoice editing
export const editInvoiceInjectionKey = Symbol() as InjectionKey<{
  invoice: Ref<IInvoice>;
  invoiceId: number;
}>;

// Define injection keys for quote editing
export const editQuoteInjectionKey = Symbol() as InjectionKey<{
  quote: Ref<IQuote>;
  quoteId: number;
}>;

// Define injection keys for job editing
export const editJobInjectionKey = Symbol() as InjectionKey<{
  job: Ref<IJob>;
  jobId: number;
}>;

// Define injection keys for client editing
export const editClientInjectionKey = Symbol() as InjectionKey<{
  client: Ref<IClients>;
  clientId: number;
}>;

// Define injection keys for driver editing
export const editDriverInjectionKey = Symbol() as InjectionKey<{
  driver: Ref<IDriver>;
  driverId: number;
}>;
