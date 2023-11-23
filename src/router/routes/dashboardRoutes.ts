import type { RouteRecordRaw } from "vue-router";

export enum DashboardRouteNames {
  // Dashboard routes
  dashboard = "dashboard",
  home = "dashboard-home",
  driverHome = "dashboard-driver-home",
  allocatorHome = "dashboard-allocator-home",
  safetyHome = "dashboard-safety-home",
  stats = "dashboard-stats",
  fleets = "dashboard-fleets",
  // ... More route names ...
  newInvoice = "dashboard-add-invoices",
  allInvoices = "dashboard-all-invoices",
  editInvoice = "dashboard-edit-invoices",
  checkInvoice = "dashboard-check-invoices",
  projects = "dashboard-projects",
  vehicles = "dashboard-vehicles",
  logs = "dashboard-logs",
  subcontractors = "dashboard-subcontractors",
  editSubcontractor = "dashboard-edit-subcontractors",
  resources = "dashboard-resources",
  tags = "dashboard-tags",
  allAttachments = "dashboard-attachments",
  newAttachment = "dashboard-new-attachment",
  editAttachment = "dashboard-edit-attachment",
  allAssets = "dashboard-assets",
  newAsset = "dashboard-new-asset",
  editAsset = "dashboard-edit-asset",
  skills = "dashboard-skills",
  resourceCategory = "dashboard-resource-category",
  allUsers = "dashboard-all-users",
  editUser = "dashboard-edit-user",
  userRoles = "dashboard-user-roles",
  settings = "dashboard-settings",
  allSuppliers = "dashboard-suppliers",
  editSupplier = "dashboard-edit-suppliers",
  newSupplier = "dashboard-new-suppliers",
  products = "dashboard-products",
  allClients = "dashboard-clients",
  editClient = "dashboard-edit-clients",
  newClient = "dashboard-new-clients",
  newQuote = "dashboard-add-quote",
  allQuotes = "dashboard-all-quotes",

  newTermsConditions = "dashboard-add-terms-conditions",
  allTermsConditions = "dashboard-all-terms-conditions",
  ediTermsConditions = "dashboard-edit-terms-conditions",

  newQuoteFooter = "dashboard-add-quote-footer",
  allQuoteFooter = "dashboard-all-quote-footer",
  editQuoteFooter = "dashboard-edit-quote-footer",

  allClientQuotes = "dashboard-all-client-quotes",
  editQuote = "dashboard-edit-quote",
  checkQuote = "dashboard-check-quote",
  checkClientQuote = "dashboard-client-check-quote",
  quoteSettings = "dashboard-settings-quote",
  newJob = "dashboard-add-job",
  allJobs = "dashboard-all-jobs",
  editJob = "dashboard-edit-job",

  jobScheduler = "dashboard-job-scheduler",

  newDriverJob = "dashboard-add-driver-job",
  allDriverJobs = "dashboard-all-driver-jobs",
  editDriverJob = "dashboard-edit-driver-job",

  newChecklist = "dashboard-add-checklist",
  allChecklists = "dashboard-all-checklists",
  editChecklist = "dashboard-edit-checklist",
  viewNewChecklist = "dashboard-view-new-checklist",

  allDrivers = "dashboard-drivers",
  editDriver = "dashboard-edit-drivers",
  viewJob = "dashboard-view-job",
  viewAssetChecklist = "dashboard-view-asset-checklist",
  viewChecklist = "dashboard-view-checklist",
  showChecklists = "dashboard-show-checklist",
  completeChecklists = "dashboard-complete-checklist",

  //Allocators
  allocatorResources = "dashboard-resource-resources",
  resourceTags = "dashboard-resource-tags",
  resourceAllAttachments = "dashboard-resource-attachments",
  resourceNewAttachment = "dashboard-new-resource-attachment",
  resourceEditAttachment = "dashboard-edit-resource-attachment",
  resourceAllAssets = "dashboard-resource-assets",
  resourceNewAsset = "dashboard-new-resource-asset",
  resourceEditAsset = "dashboard-edit-resource-asset",
  resourceSkills = "dashboard-resource-skills",
  allocateCategories = "dashboard-allocator-categories",

  //timesheet
  allTimesheet = "dashboard-timesheet",
  editTimesheet = "dashboard-edit-timesheet",
  newTimesheet = "dashboard-new-timesheet",

  registeredUsers = "sign-up-users",
  editRegUser = "view-signup-users",
}

// Define the dashboard routes using RouteRecordRaw type
// @ts-ignore
const dashboardRoutes: RouteRecordRaw = {
  path: "/dashboard",
  name: DashboardRouteNames.dashboard,
  component: () => import("@views/DashboardView.vue"),

  children: [
    // Dashboard Home
    {
      path: "/",
      alias: ["home", ""],
      name: DashboardRouteNames.home,
      component: () => import("@dashboard-views/PortalHome.vue"),
    },
    // Other dashboard routes...
    {
      path: "/allocator",
      alias: ["home", ""],
      name: DashboardRouteNames.allocatorHome,
      component: () => import("@dashboard-views/Allocators/PortalHome.vue"),
    },
    {
      path: "/driver",
      alias: ["home", ""],
      name: DashboardRouteNames.driverHome,
      component: () => import("@dashboard-views/Drivers/PortalHome.vue"),
    },
    {
      path: "/safety_officer",
      alias: ["home", ""],
      name: DashboardRouteNames.safetyHome,
      component: () => import("@dashboard-views/Safety/PortalHome.vue"),
    },
    {
      path: "stats",
      name: DashboardRouteNames.stats,
      component: () => import("@dashboard-views/PortalStats.vue"),
    },
    {
      path: "fleets",
      name: DashboardRouteNames.fleets,
      component: () => import("@dashboard-views/PortalFleets.vue"),
    },
    {
      path: "invoices",
      component: () => import("@dashboard-views/invoicing/PortalInvoices.vue"),
      children: [
        {
          path: "",
          name: DashboardRouteNames.allInvoices,
          component: () => import("@dashboard-views/invoicing/AllInvoices.vue"),
        },
        {
          path: "new",
          name: DashboardRouteNames.newInvoice,
          component: () => import("@dashboard-views/invoicing/InvoiceForm.vue"),
        },
        {
          path: ":id/edit",
          name: DashboardRouteNames.editInvoice,
          component: () =>
            import("@dashboard-views/invoicing/tabs/InvoiceTabs.vue"),
        },
        {
          path: ":id/check",
          name: DashboardRouteNames.checkInvoice,
          component: () =>
            import("@dashboard-views/invoicing/edit-invoice/CheckInvoice.vue"),
        },
      ],
    },
    {
      path: "user-quotes",
      component: () =>
        import(
          "@dashboard-views/Accounts/client-quotes/PortalClientQuotes.vue"
        ),
      children: [
        {
          path: "",
          name: DashboardRouteNames.allClientQuotes,
          component: () =>
            import(
              "@dashboard-views/Accounts/client-quotes/AllClientQuotes.vue"
            ),
        },
        {
          path: ":id/check",
          name: DashboardRouteNames.checkClientQuote,
          component: () =>
            import(
              "@dashboard-views/Accounts/client-quotes/CheckClientQuote.vue"
            ),
        },
      ],
    },
    {
      path: "quotes",
      component: () => import("@dashboard-views/quotes/PortalQuotes.vue"),
      children: [
        {
          path: "",
          name: DashboardRouteNames.allQuotes,
          component: () => import("@dashboard-views/quotes/AllQuotes.vue"),
        },
        {
          path: "new",
          name: DashboardRouteNames.newQuote,
          component: () => import("@dashboard-views/quotes/QuoteForm.vue"),
        },
        {
          path: "settings",
          name: DashboardRouteNames.quoteSettings,
          component: () => import("@dashboard-views/quotes/QuoteSettings.vue"),
        },
        {
          path: ":id/edit",
          name: DashboardRouteNames.editQuote,
          component: () =>
            import("@dashboard-views/quotes/edit-quote/EditQuote.vue"),
        },
        {
          path: ":id/check",
          name: DashboardRouteNames.checkQuote,
          component: () =>
            import("@dashboard-views/quotes/edit-quote/CheckQuote.vue"),
        },
        {
          path: "terms_conditions",
          children: [
            {
              path: "",
              name: DashboardRouteNames.allTermsConditions,
              component: () =>
                import(
                  "@dashboard-views/quotes/terms-conditions/PortalTermsConditions.vue"
                ),
            },
            {
              path: "new",
              name: DashboardRouteNames.newTermsConditions,
              component: () =>
                import(
                  "@dashboard-views/quotes/terms-conditions/TermsConditionsForm.vue"
                ),
            },
            {
              path: ":id/edit",
              name: DashboardRouteNames.ediTermsConditions,
              component: () =>
                import(
                  "@dashboard-views/quotes/terms-conditions/TermsConditionsForm.vue"
                ),
            },
          ],
        },
        {
          path: "quote_footer",
          children: [
            {
              path: "",
              name: DashboardRouteNames.allQuoteFooter,
              component: () =>
                import(
                  "@dashboard-views/quotes/quote-footer/PortalQuoteFooter.vue"
                ),
            },
            {
              path: "new",
              name: DashboardRouteNames.newQuoteFooter,
              component: () =>
                import(
                  "@dashboard-views/quotes/quote-footer/QuoteFooterForm.vue"
                ),
            },
            {
              path: ":id/edit",
              name: DashboardRouteNames.editQuoteFooter,
              component: () =>
                import(
                  "@dashboard-views/quotes/quote-footer/QuoteFooterForm.vue"
                ),
            },
          ],
        },
      ],
    },
    {
      path: "projects",
      name: DashboardRouteNames.projects,
      component: () => import("@dashboard-views/PortalProjects.vue"),
    },
    {
      path: "subcontractors",
      component: () =>
        import("@dashboard-views/subcontractors/PortalSubcontractors.vue"),
      children: [
        {
          path: "",
          name: DashboardRouteNames.subcontractors,
          component: () =>
            import(
              "@components/dashboard/portal/views/subcontractors/AllSubcontractors.vue"
            ),
        },
        {
          path: ":id/edit",
          name: DashboardRouteNames.editSubcontractor,
          component: () =>
            import(
              "@dashboard-views/subcontractors/edit-subcontractor/EditSubcontractor.vue"
            ),
        },
      ],
    },
    {
      path: "clients",
      component: () => import("@dashboard-views/clients/PortalClients.vue"),
      children: [
        {
          path: "",
          name: DashboardRouteNames.allClients,
          component: () => import("@dashboard-views/clients/AllClients.vue"),
        },
        {
          path: "new",
          name: DashboardRouteNames.newClient,
          component: () => import("@dashboard-views/clients/ClientForm.vue"),
        },
        {
          path: ":id/edit",
          name: DashboardRouteNames.editClient,
          component: () =>
            import("@dashboard-views/clients/edit-client/EditClient.vue"),
        },
      ],
    },
    {
      path: "drivers",
      component: () =>
        import("@dashboard-views/admin_drivers/PortalDrivers.vue"),
      children: [
        {
          path: "",
          name: DashboardRouteNames.allDrivers,
          component: () =>
            import("@dashboard-views/admin_drivers/AllDrivers.vue"),
        },
        {
          path: ":id/edit",
          name: DashboardRouteNames.editDriver,
          component: () =>
            import(
              "@dashboard-views/admin_drivers/edit-drivers/EditDriver.vue"
            ),
        },
        {
          path: ":id/:driver/view_job",
          name: DashboardRouteNames.viewJob,
          component: () =>
            import(
              "@dashboard-views/admin_drivers/edit-drivers/tabs/view-job/OverviewJob.vue"
            ),
        },
        {
          path: ":id/:driver/view_checklist",
          name: DashboardRouteNames.viewAssetChecklist,
          component: () =>
            import(
              "@dashboard-views/admin_drivers/edit-drivers/tabs/driver-checklists/DriversChecklistTable.vue"
            ),
        },
        {
          path: ":id/view",
          name: DashboardRouteNames.viewChecklist,
          component: () =>
            import(
              "@dashboard-views/admin_drivers/edit-drivers/tabs/view-checklist/ViewChecklist.vue"
            ),
        },
        {
          path: "timesheet",
          name: DashboardRouteNames.allTimesheet,
          component: () =>
            import("@dashboard-views/admin_drivers/timesheet/AllTimesheet.vue"),
        },
      ],
    },
    {
      path: "jobs",
      component: () => import("@dashboard-views/jobs/PortalJobs.vue"),
      children: [
        {
          path: "",
          name: DashboardRouteNames.allJobs,
          component: () => import("@dashboard-views/jobs/AllJobs.vue"),
        },
        {
          path: "new",
          name: DashboardRouteNames.newJob,
          component: () => import("@dashboard-views/jobs/addJob.vue"),
        },
        {
          path: ":id/edit",
          name: DashboardRouteNames.editJob,
          component: () => import("@dashboard-views/jobs/edit-job/EditJob.vue"),
        },
        {
          path: "job_scheduler",
          children: [
            {
              path: "",
              name: DashboardRouteNames.jobScheduler,
              component: () =>
                import(
                  "@dashboard-views/jobs/job-scheduler/PortalJobScheduler.vue"
                  ),
            },
          ]
        }
      ],
    },
    //Driver Jobs
    {
      path: "driver_jobs",
      component: () => import("@dashboard-views/Drivers/jobs/PortalJobs.vue"),
      children: [
        {
          path: "",
          name: DashboardRouteNames.allDriverJobs,
          component: () => import("@dashboard-views/Drivers/jobs/AllJobs.vue"),
        },
        {
          path: "new",
          name: DashboardRouteNames.newDriverJob,
          component: () => import("@dashboard-views/Drivers/jobs/addJob.vue"),
        },
        {
          path: ":id/edit",
          name: DashboardRouteNames.editDriverJob,
          component: () =>
            import("@dashboard-views/Drivers/jobs/edit-job/EditJob.vue"),
        },
        {
          path: ":id/:asset/complete_checklist",
          name: DashboardRouteNames.completeChecklists,
          component: () =>
            import(
              "@dashboard-views/Drivers/jobs/edit-job/tabs/job-checklists/CompleteChecklist.vue"
            ),
        },
        {
          path: ":id/show_checklists",
          name: DashboardRouteNames.showChecklists,
          component: () =>
            import(
              "@dashboard-views/Drivers/jobs/edit-job/tabs/job-checklists/AssetChecklists.vue"
            ),
        },
      ],
    },
    {
      path: "resources",
      component: () =>
        import(
          "@components/dashboard/portal/views/resources/PortalResources.vue"
        ),
      children: [
        {
          path: "",
          name: DashboardRouteNames.resources,
          component: () =>
            import("@dashboard-views/resources/AllResources.vue"),
        },
        {
          path: "tags",
          name: DashboardRouteNames.tags,
          component: () =>
            import("@dashboard-views/resources/tags/PortalTags.vue"),
        },
        {
          path: "skills",
          name: DashboardRouteNames.skills,
          component: () =>
            import("@dashboard-views/resources/skills/PortalSkills.vue"),
        },
        {
          path: "categories",
          name: DashboardRouteNames.resourceCategory,
          component: () =>
            import("@dashboard-views/resources/categories/PortalCategory.vue"),
        },
        {
          path: "attachments",
          children: [
            {
              path: "",
              name: DashboardRouteNames.allAttachments,
              component: () =>
                import(
                  "@dashboard-views/resources/attachments/PortalAttachments.vue"
                ),
            },
            {
              path: "new",
              name: DashboardRouteNames.newAttachment,
              component: () =>
                import(
                  "@dashboard-views/resources/attachments/AttachmentForm.vue"
                ),
            },
            {
              path: ":id/edit",
              name: DashboardRouteNames.editAttachment,
              component: () =>
                import(
                  "@dashboard-views/resources/attachments/EditAttachment.vue"
                ),
            },
          ],
        },
        {
          path: "assets",
          children: [
            {
              path: "",
              name: DashboardRouteNames.allAssets,
              component: () =>
                import("@dashboard-views/resources/assets/PortalAssets.vue"),
            },
            {
              path: "new",
              name: DashboardRouteNames.newAsset,
              component: () =>
                import("@dashboard-views/resources/assets/AssetsForm.vue"),
            },
            {
              path: ":id/edit",
              name: DashboardRouteNames.editAsset,
              component: () =>
                import("@dashboard-views/resources/assets/EditAsset.vue"),
            },
          ],
        },
        {
          path: "skills",
          name: DashboardRouteNames.skills,
          component: () =>
            import("@dashboard-views/resources/skills/PortalSkills.vue"),
        },
      ],
    },
    {
      path: "settings",
      component: () => import("@dashboard-views/settings/PortalSettings.vue"),
      children: [
        {
          path: "",
          name: DashboardRouteNames.settings,
          component: () => import("@dashboard-views/settings/AllSettings.vue"),
        },
        {
          path: "users",
          component: () => import("@dashboard-views/users/PortalUsers.vue"),
          children: [
            {
              path: "",
              name: DashboardRouteNames.allUsers,
              component: () => import("@dashboard-views/users/AllUsers.vue"),
            },
            {
              path: ":id/edit",
              name: DashboardRouteNames.editUser,
              component: () =>
                import("@dashboard-views/users/edit-users/EditUser.vue"),
            },
            {
              path: "roles",
              name: DashboardRouteNames.userRoles,
              component: () =>
                import("@dashboard-views/users/user-roles/UserRoles.vue"),
            },
          ],
        },
        {
          path: "registered_users",
          component: () => import("@dashboard-views/registered_users/PortalNewUsers.vue"),
          children: [
            {
              path: "",
              name: DashboardRouteNames.registeredUsers,
              component: () => import("@dashboard-views/registered_users/AllNewUsers.vue"),
            },
            {
              path: ":id/view",
              name: DashboardRouteNames.editRegUser,
              component: () =>
                import("@dashboard-views/registered_users/view-registered/TabsNewUser.vue"),
            },
          ],
        },
        {
          path: "logs",
          name: DashboardRouteNames.logs,
          component: () => import("@dashboard-views/PortalLogs.vue"),
        },
        {
          path: "products",
          component: () =>
            import("@dashboard-views/products/PortalProducts.vue"),
          children: [
            {
              path: "",
              name: DashboardRouteNames.products,
              component: () =>
                import("@dashboard-views/products/AllProducts.vue"),
            },
          ],
        },
      ],
    },
    {
      path: "suppliers",
      component: () => import("@dashboard-views/suppliers/PortalSuppliers.vue"),
      children: [
        {
          path: "",
          name: DashboardRouteNames.allSuppliers,
          component: () =>
            import("@dashboard-views/suppliers/AllSuppliers.vue"),
        },
        {
          path: "new",
          name: DashboardRouteNames.newSupplier,
          component: () =>
            import("@dashboard-views/suppliers/SupplierForm.vue"),
        },
        {
          path: ":id/edit",
          name: DashboardRouteNames.editSupplier,
          component: () =>
            import("@dashboard-views/suppliers/edit-supplier/EditSupplier.vue"),
        },
      ],
    },
    {
      path: "checklist",
      component: () =>
        import("@dashboard-views/checklists/PortalChecklists.vue"),
      children: [
        {
          path: "",
          name: DashboardRouteNames.allChecklists,
          component: () =>
            import("@dashboard-views/checklists/AllChecklists.vue"),
        },
        {
          path: "new",
          name: DashboardRouteNames.newChecklist,
          component: () =>
            import("@dashboard-views/checklists/ChecklistForm.vue"),
        },
        {
          path: ":id/view",
          name: DashboardRouteNames.viewNewChecklist,
          component: () =>
            import("@dashboard-views/checklists/ViewChecklist.vue"),
        },
      ],
    },
    {
      path: "allocate-resources",
      component: () =>
        import(
          "@components/dashboard/portal/views/Allocators/resources/PortalResources.vue"
        ),
      children: [
        {
          path: "",
          name: DashboardRouteNames.allocatorResources,
          component: () =>
            import("@dashboard-views/Allocators/resources/AllResources.vue"),
        },
        {
          path: "allocate-tags",
          name: DashboardRouteNames.resourceTags,
          component: () =>
            import("@dashboard-views/Allocators/resources/tags/PortalTags.vue"),
        },
        {
          path: "allocate-skills",
          name: DashboardRouteNames.resourceSkills,
          component: () =>
            import(
              "@dashboard-views/Allocators/resources/skills/PortalSkills.vue"
            ),
        },
        {
          path: "allocate-categories",
          name: DashboardRouteNames.allocateCategories,
          component: () =>
            import(
              "@dashboard-views/Allocators/resources/categories/PortalCategory.vue"
            ),
        },
        {
          path: "allocate-attachments",
          children: [
            {
              path: "",
              name: DashboardRouteNames.resourceAllAttachments,
              component: () =>
                import(
                  "@dashboard-views/Allocators/resources/attachments/PortalAttachments.vue"
                ),
            },
            {
              path: "new",
              name: DashboardRouteNames.resourceNewAttachment,
              component: () =>
                import(
                  "@dashboard-views/Allocators/resources/attachments/AttachmentForm.vue"
                ),
            },
            {
              path: ":id/edit",
              name: DashboardRouteNames.resourceEditAttachment,
              component: () =>
                import(
                  "@dashboard-views/Allocators/resources/attachments/EditAttachment.vue"
                ),
            },
          ],
        },
        {
          path: "allocate-assets",
          children: [
            {
              path: "",
              name: DashboardRouteNames.resourceAllAssets,
              component: () =>
                import(
                  "@dashboard-views/Allocators/resources/assets/PortalAssets.vue"
                ),
            },
            {
              path: "new",
              name: DashboardRouteNames.resourceNewAsset,
              component: () =>
                import(
                  "@dashboard-views/Allocators/resources/assets/AssetsForm.vue"
                ),
            },
            {
              path: ":id/edit",
              name: DashboardRouteNames.resourceEditAsset,
              component: () =>
                import(
                  "@dashboard-views/Allocators/resources/assets/EditAsset.vue"
                ),
            },
          ],
        },
        {
          path: "allocate-skills",
          name: DashboardRouteNames.resourceSkills,
          component: () =>
            import(
              "@dashboard-views/Allocators/resources/skills/PortalSkills.vue"
            ),
        },
      ],
    },
  ],
};

export { dashboardRoutes };
