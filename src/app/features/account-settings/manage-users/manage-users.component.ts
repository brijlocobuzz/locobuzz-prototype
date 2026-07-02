import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MANAGED_USERS, ManagedUser } from './manage-users-data';
import { BRAND_ICONS } from '../channel-data';
import { AddUserWizardComponent } from './add-user-wizard.component';
import { PaginationBarComponent } from '../../../shared/pagination-bar/pagination-bar.component';

/** A single custom-view filter condition (same model as Channel Config). */
export interface ViewCondition {
  field: string;                 // Name | Role | Status
  operator: 'In' | 'Not In';
  text: string;
  values: string[];
}
export interface SavedView { id: string; label: string; filter: ViewCondition; }

/** Varied sample "days since last login" values, cycled across the mock users. */
const SAMPLE_LAST_LOGIN = [1, 3, 6, 11, 0, 21, 34, 58, 92, 140, 210, 365, 520, 2, 45];

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AddUserWizardComponent, PaginationBarComponent],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss',
})
export class ManageUsersComponent {
  users: ManagedUser[] = MANAGED_USERS.map((u, i) => ({
    ...u,
    // Mock: roughly every other active user already has SSO sign-in enabled.
    ssoEnabled: u.ssoEnabled ?? (u.active && i % 2 === 0),
    // Mock: cycle a spread of last-login recencies across the users.
    lastLoginDays: u.lastLoginDays ?? SAMPLE_LAST_LOGIN[i % SAMPLE_LAST_LOGIN.length],
  }));

  search = '';
  wizardOpen = false;

  /** Listing view — 'card' grid or 'list' data-grid (table). */
  viewMode: 'card' | 'list' = 'list';

  /** Selected rows (by user id) in list view. */
  selected = new Set<string>();

  /** Right-side detail drawer (null = closed). */
  detail: ManagedUser | null = null;

  constructor(private router: Router) {}

  back() {
    this.router.navigate(['/account-settings']);
  }

  fullName(u: ManagedUser): string { return `${u.firstName} ${u.lastName}`; }
  initials(u: ManagedUser): string { return (u.firstName[0] + u.lastName[0]).toUpperCase(); }

  /** Human relative "last login" label — e.g. "5 days ago", "1 month ago". */
  lastLogin(u: ManagedUser): string {
    const d = u.lastLoginDays;
    if (d == null) return '—';
    if (d <= 0) return 'Today';
    if (d === 1) return '1 day ago';
    if (d < 30) return `${d} days ago`;
    const months = Math.floor(d / 30);
    if (months < 12) return months === 1 ? '1 month ago' : `${months} months ago`;
    const years = Math.floor(d / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }
  brandInitials(name: string): string { return name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase(); }

  /** Real brand-logo SVG path for a channel id. */
  brandSvg(id: string): string | null { return BRAND_ICONS[id] ?? null; }
  private readonly channelColors: Record<string, string> = {
    facebook: '#1877f2', instagram: '#e1306c', twitter: '#000000', youtube: '#ff0000',
    linkedin: '#0a66c2', tiktok: '#010101', whatsapp: '#25d366', telegram: '#229ed9',
    email: '#ea4335', playstore: '#00c4b3', gmb: '#4285f4', reddit: '#ff4500',
  };
  channelColor(id: string): string { return this.channelColors[id] ?? '#64748b'; }

  /** Segmented Active/Inactive setter. */
  setActive(u: ManagedUser, on: boolean, ev: Event) {
    ev.stopPropagation();
    u.active = on;
  }

  /** Invite a user to sign in via SSO — flips them to SSO-enabled. */
  inviteSso(u: ManagedUser, ev: Event) {
    ev.stopPropagation();
    u.ssoEnabled = true;
  }

  /* ===================================================================
     Single Sign-On (SSO) — merged into Manage Users
     Manual users log in with username + password; when an SSO org is
     configured, members can additionally sign in with their work email.
     =================================================================== */
  sso = {
    configured: false,
    orgName: 'Locobuzz',
    domain: 'locobuzz.net',
    createdOn: '26 Mar 2026, 3:58 PM',
    status: 'Incomplete' as 'Incomplete' | 'Active',
  };
  /** "Explore SSO" — expands the inline how-it-works explainer. */
  ssoInfoOpen = false;
  /** Collapse the SSO card down to just its heading row. */
  ssoCardCollapsed = false;

  /* ---- setup modal (Create organization -> remaining steps -> active) ---- */
  ssoModalOpen = false;
  ssoModalStep: 'create' | 'pending' | 'done' = 'create';
  draftOrg = { name: '', domain: '' };

  /** Multi-step setup checklist shown after the org is created. */
  ssoSteps = [
    { key: 'org', label: 'Create your organization', desc: 'Name your organization and email domain.', done: false },
    { key: 'idp', label: 'Connect your identity provider', desc: 'Link Okta, Azure AD or Google Workspace via SAML / OIDC.', done: false },
    { key: 'verify', label: 'Verify your domain', desc: 'Confirm ownership of your sign-in domain.', done: false },
    { key: 'activate', label: 'Enable work-email sign-in', desc: 'Switch on SSO login for your members.', done: false },
  ];
  /** Index of the first not-yet-done step (the "Next" one). */
  get firstPending(): number { return this.ssoSteps.findIndex(s => !s.done); }
  get ssoDoneCount(): number { return this.ssoSteps.filter(s => s.done).length; }

  /** "Configure SSO" — open the create-organization modal (step 1). */
  openSsoModal() {
    this.draftOrg = { name: '', domain: '' };
    this.ssoModalStep = 'create';
    this.ssoModalOpen = true;
  }
  /** Create the org — first step only; SSO is NOT active yet. */
  createOrg() {
    if (!this.draftOrg.name.trim() || !this.draftOrg.domain.trim()) return;
    this.sso.orgName = this.draftOrg.name.trim();
    this.sso.domain = this.draftOrg.domain.trim();
    this.sso.createdOn = this.nowStamp();
    this.sso.configured = true;
    this.sso.status = 'Incomplete';
    this.ssoSteps.forEach((s, i) => (s.done = i === 0)); // only "Create organization" is done
    this.ssoModalStep = 'pending';
  }
  /** Reopen the setup to finish the remaining steps. */
  resumeSetup() {
    this.ssoModalStep = this.sso.status === 'Active' ? 'done' : 'pending';
    this.ssoModalOpen = true;
  }
  /** Finish the connection + verification — flips Incomplete -> Active. */
  completeSetup() {
    this.ssoSteps.forEach(s => (s.done = true));
    this.sso.status = 'Active';
    this.ssoModalStep = 'done';
  }
  /** Close the modal — status is preserved (stays Incomplete if not finished). */
  closeSsoModal() { this.ssoModalOpen = false; }

  /** Re-check the IdP verification status (mock). */
  recheckSso() { /* prototype: no-op refresh */ }
  /** Remove the SSO org and return to the setup CTA. */
  disconnectSso() {
    this.sso.configured = false;
    this.sso.status = 'Incomplete';
    this.ssoSteps.forEach(s => (s.done = false));
  }

  /** "26 Jun 2026, 3:58 PM" style timestamp for the created-on field. */
  private nowStamp(): string {
    const d = new Date();
    const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${date}, ${time}`;
  }

  /* ===================================================================
     Custom views — filter builder behind the "+" tab
     =================================================================== */
  activeViewId = 'all';
  savedViews: SavedView[] = [];
  viewBuilderOpen = false;
  valueDropdownOpen = false;
  private viewSeq = 0;

  /** Filterable fields — "SSO Enabled" only offered once an SSO org exists. */
  get fieldOptions(): string[] {
    return this.sso.configured ? ['Name', 'Role', 'Status', 'SSO Enabled'] : ['Name', 'Role', 'Status'];
  }
  readonly operatorOptions: ViewCondition['operator'][] = ['In', 'Not In'];
  draft: ViewCondition = { field: 'Role', operator: 'In', text: '', values: [] };

  valueOptions(field: string): string[] {
    switch (field) {
      case 'Role': return Array.from(new Set(this.users.map(u => u.role))).sort();
      case 'Status': return ['Active', 'Inactive'];
      case 'SSO Enabled': return ['Enabled', 'Not Enabled'];
      default: return [];
    }
  }
  isTextField(field: string): boolean {
    return this.valueOptions(field).length === 0;
  }

  openViewBuilder() {
    this.draft = { field: 'Role', operator: 'In', text: '', values: [] };
    this.valueDropdownOpen = false;
    this.viewBuilderOpen = true;
  }
  closeViewBuilder() {
    this.viewBuilderOpen = false;
    this.valueDropdownOpen = false;
  }
  onFieldChange(field: string) {
    this.draft.field = field;
    this.draft.values = [];
    this.draft.text = '';
    this.valueDropdownOpen = false;
  }
  toggleValue(v: string) {
    const i = this.draft.values.indexOf(v);
    i >= 0 ? this.draft.values.splice(i, 1) : this.draft.values.push(v);
  }
  clearDraft() {
    this.draft = { field: this.draft.field, operator: 'In', text: '', values: [] };
    this.valueDropdownOpen = false;
  }
  get canSaveView(): boolean {
    return this.isTextField(this.draft.field) ? !!this.draft.text.trim() : this.draft.values.length > 0;
  }
  saveView() {
    if (!this.canSaveView) return;
    const detail = this.isTextField(this.draft.field)
      ? `"${this.draft.text.trim()}"`
      : this.draft.values.join(', ');
    const id = 'view-' + (++this.viewSeq);
    this.savedViews.push({
      id,
      label: `${this.draft.field}: ${detail}`,
      filter: { ...this.draft, values: [...this.draft.values] },
    });
    this.activeViewId = id;
    this.page = 1;
    this.closeViewBuilder();
  }
  removeView(id: string, ev: Event) {
    ev.stopPropagation();
    this.savedViews = this.savedViews.filter(v => v.id !== id);
    if (this.activeViewId === id) this.activeViewId = 'all';
    this.page = 1;
  }

  /* ---- column sorting ---- */
  sortKey: string | null = null;
  sortDir: 1 | -1 = 1;
  sortBy(key: string) {
    if (this.sortKey === key) this.sortDir = this.sortDir === 1 ? -1 : 1;
    else { this.sortKey = key; this.sortDir = 1; }
  }
  sortIcon(key: string): string {
    if (this.sortKey !== key) return 'unfold_more';
    return this.sortDir === 1 ? 'arrow_upward' : 'arrow_downward';
  }
  private sortVal(u: ManagedUser, key: string): string | number {
    switch (key) {
      case 'name': return this.fullName(u).toLowerCase();
      case 'role': return u.role.toLowerCase();
      case 'brands': return u.brands;
      case 'status': return u.active ? 1 : 0;
      default: return 0;
    }
  }

  /* ---- pagination ---- */
  page = 1;
  pageSize = 10;
  onSearch(q: string) { this.search = q; this.page = 1; }
  setView(id: string) { this.activeViewId = id; this.page = 1; }

  /** Users after search + active view filter + column sort (all pages). */
  get filteredUsers(): ManagedUser[] {
    const q = this.search.trim().toLowerCase();
    let rows = this.users.filter(u =>
      !q || this.fullName(u).toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
      || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));

    const v = this.savedViews.find(s => s.id === this.activeViewId);
    if (v) rows = rows.filter(u => this.matchesCondition(u, v.filter));

    if (this.sortKey) {
      const k = this.sortKey, dir = this.sortDir;
      rows = [...rows].sort((a, b) => {
        const av = this.sortVal(a, k), bv = this.sortVal(b, k);
        return av < bv ? -dir : av > bv ? dir : 0;
      });
    }
    return rows;
  }
  get totalUsers(): number { return this.filteredUsers.length; }
  /** Just the current page's rows (what the table/grid renders). */
  get displayUsers(): ManagedUser[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }
  private matchesCondition(u: ManagedUser, f: ViewCondition): boolean {
    const inList = (val: string) => f.values.some(x => x.toLowerCase() === val.toLowerCase());
    let ok = false;
    switch (f.field) {
      case 'Name': {
        const t = f.text.trim().toLowerCase();
        ok = t ? this.fullName(u).toLowerCase().includes(t) : true;
        break;
      }
      case 'Role': ok = inList(u.role); break;
      case 'Status': ok = inList(u.active ? 'Active' : 'Inactive'); break;
      case 'SSO Enabled': ok = inList(u.ssoEnabled ? 'Enabled' : 'Not Enabled'); break;
    }
    return f.operator === 'Not In' ? !ok : ok;
  }

  /* ---- list-view selection (scoped to what's shown) ---- */
  get allSelected(): boolean {
    const rows = this.displayUsers;
    return rows.length > 0 && rows.every(u => this.selected.has(u.id));
  }
  toggleRow(id: string) {
    this.selected.has(id) ? this.selected.delete(id) : this.selected.add(id);
  }
  toggleAll() {
    const rows = this.displayUsers;
    this.allSelected ? rows.forEach(u => this.selected.delete(u.id)) : rows.forEach(u => this.selected.add(u.id));
  }
  clearSelection() {
    this.selected.clear();
  }

  /* ---- detail drawer ---- */
  openDetail(u: ManagedUser) {
    this.detail = u;
  }
  closeDetail() {
    this.detail = null;
  }

  onUserSaved(user: { firstName: string; lastName: string; username: string; email: string; role: string; brands: number }) {
    this.users = [
      {
        id: user.username || user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
        color: '#4f46e5',
        brands: user.brands,
        active: true,
      },
      ...this.users,
    ];
  }
}
