import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PERMISSION_GROUPS,
  BRANDS,
  PermissionGroup,
  PermissionCapability,
  Brand,
} from './your-profile-data';

type Role = 'admin' | 'agent';

@Component({
  selector: 'app-your-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './your-profile.component.html',
  styleUrl: './your-profile.component.scss',
})
export class YourProfileComponent {
  readonly groups = PERMISSION_GROUPS;
  readonly allBrands = BRANDS;

  /** Role view switcher (Admin sees everything, Agent a granted subset). */
  role: Role = 'admin';

  /** Profile form edit mode. */
  editProfile = false;
  mfaOn = true;

  /** Editable profile fields (bound to the form). */
  firstName = 'Alam';
  lastName = 'Shaikh';
  username = 'alam_sv';
  email = 'alam.shaikh@locobuzz.com';
  gender: 'male' | 'female' | 'other' = 'male';
  dob = '';
  countryCode = 'IND +91';
  phone = '';
  status: 'Active' | 'Inactive' = 'Active';

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
  get initials(): string {
    return ((this.firstName[0] || '') + (this.lastName[0] || '')).toUpperCase();
  }
  get roleLabel(): string {
    return this.role === 'admin' ? 'Supervisor Admin' : 'Agent';
  }

  // ---- brands search + presentation ------------------------------------
  brandSearch = '';
  get filteredAssignedBrands(): Brand[] {
    const q = this.brandSearch.trim().toLowerCase();
    const list = this.assignedBrands;
    return q ? list.filter(b => b.name.toLowerCase().includes(q) || b.domain.toLowerCase().includes(q)) : list;
  }
  private readonly brandPalette = ['#6366f1', '#f59e0b', '#ec4899', '#14b8a6', '#8b5cf6', '#0ea5e9', '#f97316', '#10b981'];
  brandColor(name: string): string {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return this.brandPalette[h % this.brandPalette.length];
  }
  brandInitials(name: string): string { return name.slice(0, 2).toUpperCase(); }

  // ---- grouped-permissions view ----------------------------------------
  /** Flat sub-permission list for a group, each with its enabled state. */
  groupPermissions(group: PermissionGroup): { name: string; enabled: boolean }[] {
    const out: { name: string; enabled: boolean }[] = [];
    for (const cap of group.capabilities) {
      const on = this.capEnabled(cap);
      for (const child of cap.children) out.push({ name: child, enabled: on });
    }
    return out;
  }
  /** All sub-permissions in the group are enabled. */
  groupFull(group: PermissionGroup): boolean {
    return this.groupEnabled(group) === this.groupTotal(group);
  }

  /** Assigned brands. */
  assignedBrandIds: string[] = ['amazon', 'ajio', 'airindia', 'myntra'];
  brandsModalOpen = false;
  /** Working copy while the assign-brands modal is open. */
  draftBrandIds: string[] = [];

  /** Permission group expand state. */
  expanded: Record<string, boolean> = {};
  search = '';

  // ---- role / enablement -------------------------------------------------

  /** A capability is granted when viewing as Admin, or when flagged for Agent. */
  capEnabled(cap: PermissionCapability): boolean {
    return this.role === 'admin' || !!cap.agent;
  }

  capEnabledCount(cap: PermissionCapability): number {
    return this.capEnabled(cap) ? cap.children.length : 0;
  }

  groupEnabled(group: PermissionGroup): number {
    return group.capabilities.reduce((n, c) => n + this.capEnabledCount(c), 0);
  }

  groupTotal(group: PermissionGroup): number {
    return group.capabilities.reduce((n, c) => n + c.children.length, 0);
  }

  // ---- header roll-ups ---------------------------------------------------

  get permissionGranted(): number {
    return this.groups.reduce((n, g) => n + this.groupEnabled(g), 0);
  }

  get permissionTotal(): number {
    return this.groups.reduce((n, g) => n + this.groupTotal(g), 0);
  }

  // ---- search ------------------------------------------------------------

  /** Groups (with capabilities narrowed) matching the search term. */
  get visibleGroups(): PermissionGroup[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.groups;
    return this.groups
      .map((g) => {
        const caps = g.capabilities.filter((cap) =>
          [g.name, cap.name, cap.note, cap.risk ?? '', ...cap.children]
            .join(' ')
            .toLowerCase()
            .includes(q),
        );
        return { ...g, capabilities: caps };
      })
      .filter((g) => g.capabilities.length > 0);
  }

  // ---- interactions ------------------------------------------------------

  toggleGroup(id: string): void {
    this.expanded[id] = !this.expanded[id];
  }

  setRole(role: Role): void {
    this.role = role;
  }

  // ---- manage-brands modal ----------------------------------------------

  /** Search term inside the Manage brands dialog. */
  modalSearch = '';

  openBrandsModal(): void {
    this.draftBrandIds = [...this.assignedBrandIds];
    this.modalSearch = '';
    this.brandsModalOpen = true;
  }

  closeBrandsModal(): void {
    this.brandsModalOpen = false;
  }

  /** Brands shown in the dialog, narrowed by the modal search. */
  get modalBrands(): Brand[] {
    const q = this.modalSearch.trim().toLowerCase();
    if (!q) return this.allBrands;
    return this.allBrands.filter((b) => b.name.toLowerCase().includes(q));
  }

  isDraftSelected(brand: Brand): boolean {
    return this.draftBrandIds.includes(brand.id);
  }

  toggleDraftBrand(brand: Brand): void {
    this.draftBrandIds = this.draftBrandIds.includes(brand.id)
      ? this.draftBrandIds.filter((id) => id !== brand.id)
      : [...this.draftBrandIds, brand.id];
  }

  /** Select all currently-visible (filtered) brands. */
  selectAllBrands(): void {
    const ids = new Set(this.draftBrandIds);
    this.modalBrands.forEach((b) => ids.add(b.id));
    this.draftBrandIds = [...ids];
  }

  /** Clear the currently-visible (filtered) brands from the selection. */
  clearAllBrands(): void {
    const visible = new Set(this.modalBrands.map((b) => b.id));
    this.draftBrandIds = this.draftBrandIds.filter((id) => !visible.has(id));
  }

  saveBrands(): void {
    this.assignedBrandIds = [...this.draftBrandIds];
    this.brandsModalOpen = false;
  }

  get assignedBrands(): Brand[] {
    return this.allBrands.filter((b) => this.assignedBrandIds.includes(b.id));
  }
}
