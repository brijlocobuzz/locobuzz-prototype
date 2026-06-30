import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PERMISSION_GROUPS,
  BRANDS,
  brandLogo,
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
  readonly brandLogo = brandLogo;

  /** Role view switcher (Admin sees everything, Agent a granted subset). */
  role: Role = 'admin';

  /** Profile form edit mode. */
  editProfile = false;
  mfaOn = true;

  /** Editable profile fields (bound to the form). */
  firstName = 'Alam';
  lastName = 'Shaikh';
  email = 'alam.shaikh@locobuzz.com';
  gender: 'male' | 'female' | 'other' = 'male';
  dob = '';
  countryCode = 'IND +91';
  phone = '';

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
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

  openBrandsModal(): void {
    this.draftBrandIds = [...this.assignedBrandIds];
    this.brandsModalOpen = true;
  }

  toggleDraftBrand(brand: Brand): void {
    this.draftBrandIds = this.draftBrandIds.includes(brand.id)
      ? this.draftBrandIds.filter((id) => id !== brand.id)
      : [...this.draftBrandIds, brand.id];
  }

  saveBrands(): void {
    this.assignedBrandIds = [...this.draftBrandIds];
    this.brandsModalOpen = false;
  }

  get assignedBrands(): Brand[] {
    return this.allBrands.filter((b) => this.assignedBrandIds.includes(b.id));
  }
}
