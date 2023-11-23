import { UserType } from "@app-types/user";
import { type ISidebarMenuItem, SidebarMenuItemData } from "@app-types/utils";
import { DashboardRouteNames } from "@router";

// Define the original menu items with the old structure
const menuItemsOld: ISidebarMenuItem[] = [
  // Menu item examples...
  {
    routeName: DashboardRouteNames.home,
    iconClass: "pi-home",
    title: "Home",
    authLevels: [UserType.SuperAdmin, UserType.Accounts],
  },
  {
    routeName: DashboardRouteNames.allocatorHome,
    iconClass: "pi-home",
    title: "Home",
    authLevels: [UserType.Allocator],
  },
  {
    routeName: DashboardRouteNames.driverHome,
    iconClass: "pi-home",
    title: "Home",
    authLevels: [UserType.Driver],
  },
  {
    routeName: DashboardRouteNames.safetyHome,
    iconClass: "pi-home",
    title: "Home",
    authLevels: [UserType.SafetyOfficer],
  },
  {
    routeName: DashboardRouteNames.allInvoices,
    iconClass: "pi-bars",
    title: "Invoice Manager",
    authLevels: [UserType.SuperAdmin],
  },
  {
    routeName: DashboardRouteNames.allQuotes,
    iconClass: "pi-book",
    title: "Quotes",
    authLevels: [UserType.SuperAdmin],
    submenuItems: [
      {
        routeName: DashboardRouteNames.allTermsConditions,
        iconClass: "pi-key",
        title: "Terms & Conditions",
      },
      {
        routeName: DashboardRouteNames.allQuoteFooter,
        iconClass: "pi-sitemap",
        title: "Quote Footer",
      },
    ],
  },
  {
    routeName: DashboardRouteNames.allClientQuotes,
    iconClass: "pi-book",
    title: "Quotes",
    authLevels: [UserType.Accounts],
  },
  {
    routeName: DashboardRouteNames.allSuppliers,
    iconClass: "pi-users",
    title: "Suppliers",
    authLevels: [UserType.SuperAdmin],
  },
  {
    routeName: DashboardRouteNames.subcontractors,
    iconClass: "pi-money-bill",
    title: "Subcontractors",
    authLevels: [UserType.SuperAdmin],
  },
  {
    routeName: DashboardRouteNames.allClients,
    iconClass: "pi-user",
    title: "Customers",
    authLevels: [UserType.SuperAdmin],
  },
  {
    routeName: DashboardRouteNames.allJobs,
    iconClass: "pi-briefcase",
    title: "Jobs",
    authLevels: [UserType.SuperAdmin, UserType.Allocator],
    submenuItems: [
      {
        routeName: DashboardRouteNames.jobScheduler,
        iconClass: "pi-calendar-times",
        title: "Job Scheduler",
      },
    ],
  },
  {
    routeName: DashboardRouteNames.allChecklists,
    iconClass: "pi-check-square",
    title: "Checklists",
    authLevels: [UserType.SuperAdmin, UserType.SafetyOfficer],
  },
  {
    routeName: DashboardRouteNames.allDrivers,
    iconClass: "pi-user",
    title: "Drivers",
    authLevels: [
      UserType.SuperAdmin,
      UserType.SafetyOfficer,
      UserType.Accounts,
    ],
    submenuItems: [
      {
        routeName: DashboardRouteNames.allTimesheet,
        iconClass: "pi-clock",
        title: "Timesheet",
        authLevels: [UserType.SuperAdmin, UserType.Accounts],
      },
    ],
  },
  {
    routeName: DashboardRouteNames.allDriverJobs,
    iconClass: "pi-briefcase",
    title: "Jobs",
    authLevels: [UserType.Driver],
  },
  {
    routeName: DashboardRouteNames.allocatorResources,
    iconClass: "pi-cloud",
    title: "Resources",
    authLevels: [UserType.Allocator],
    submenuItems: [
      {
        routeName: DashboardRouteNames.resourceAllAttachments,
        iconClass: "pi-link",
        title: "Attachments",
      },
      {
        routeName: DashboardRouteNames.resourceAllAssets,
        iconClass: "pi-file",
        title: "Assets",
      },
      {
        routeName: DashboardRouteNames.resourceTags,
        iconClass: "pi-hashtag",
        title: "Tags",
      },
      {
        routeName: DashboardRouteNames.resourceSkills,
        iconClass: "pi-tag",
        title: "Skills",
      },
      {
        routeName: DashboardRouteNames.allocateCategories,
        iconClass: "pi-server",
        title: "Tag Categories",
      },
    ],
  },
  {
    routeName: DashboardRouteNames.resources,
    iconClass: "pi-cloud",
    title: "Resources",
    authLevels: [UserType.SuperAdmin],
    submenuItems: [
      {
        routeName: DashboardRouteNames.allAttachments,
        iconClass: "pi-link",
        title: "Attachments",
      },
      {
        routeName: DashboardRouteNames.allAssets,
        iconClass: "pi-file",
        title: "Assets",
      },
      {
        routeName: DashboardRouteNames.tags,
        iconClass: "pi-hashtag",
        title: "Tags",
      },
      {
        routeName: DashboardRouteNames.skills,
        iconClass: "pi-tag",
        title: "Skills",
      },
      {
        routeName: DashboardRouteNames.resourceCategory,
        iconClass: "pi-server",
        title: "Tag Categories",
      },
    ],
  },
  {
    routeName: DashboardRouteNames.settings,
    iconClass: "pi-cog",
    title: "Settings",
    authLevels: [
      UserType.SuperAdmin,
      UserType.Allocator,
      UserType.Driver,
      UserType.Sales,
      UserType.Accounts,
      UserType.SafetyOfficer,
    ],
    submenuItems: [
      {
        routeName: DashboardRouteNames.allUsers,
        iconClass: "pi-users",
        title: "Users Management",
        authLevels: [UserType.SuperAdmin, UserType.Accounts],
      },
      {
        routeName: DashboardRouteNames.logs,
        iconClass: "pi-book",
        title: "Activity Logs",
        authLevels: [UserType.SuperAdmin],
      },
      {
        routeName: DashboardRouteNames.products,
        iconClass: "pi-box",
        title: "Products",
        authLevels: [UserType.SuperAdmin],
      },
    ],
  },
];

// Convert the old menu items to the new structure using the `parseItemWithClassType` function
const menuItems = menuItemsOld.map(parseItemWithClassType);

// Function to parse an individual menu item with the new structure
function parseItemWithClassType(item: ISidebarMenuItem): SidebarMenuItemData {
  const { title, routeName, iconClass, submenuItems, authLevels } = item;
  let parsedSubmenuItems;

  // Recursively parse submenu items if present
  if (submenuItems)
    parsedSubmenuItems = submenuItems.map(parseItemWithClassType);

  // Create a new instance of `SidebarMenuItemData` with the parsed data
  return new SidebarMenuItemData(
    title,
    routeName,
    iconClass,
    parsedSubmenuItems,
    authLevels
  );
}

export default menuItems;
