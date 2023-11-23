import { v4 as uuid } from "uuid";
import type { DashboardRouteNames } from "@router";
import type { UserType } from "./user";
import { useRoute, useRouter } from "vue-router";

export interface ISidebarMenuItem {
  routeName: DashboardRouteNames | "#";
  iconClass: string;
  title: string;
  authLevels?: UserType[];
  submenuItems?: ISidebarMenuItem[];
}

export class SidebarMenuItemData implements ISidebarMenuItem {
  public id: string;

  constructor(
    public title: string,
    public routeName: DashboardRouteNames | "#",
    public iconClass: string,
    public submenuItems?: SidebarMenuItemData[],
    public authLevels?: UserType[]
  ) {
    this.id = uuid();
  }

  public getResolvedPath() {
    return this.routeName === "#"
      ? "#"
      : useRouter().resolve({ name: this.routeName }).path;
  }

  public isActive() {
    const resolvedPath = this.getResolvedPath();

    if (resolvedPath === "/") return useRoute().path === resolvedPath;
    else return useRoute().path.startsWith(resolvedPath);
  }
}
