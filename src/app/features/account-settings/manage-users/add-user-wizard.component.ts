import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  USER_ROLES, COUNTRY_CODES, ASSIGNABLE_BRANDS, TEAMS,
  NOTIFY_USERS, PERMISSION_GROUPS, ROLE_DEFAULT_GROUPS, countryCodeFlagUrl,
  UserRole, CountryCode, AssignableBrand, Team, PermissionGroup, PermissionCapability,
} from './manage-users-data';

interface WizardStep {
  num: number;
  label: string;
  subtitle: string;
  /** Material Symbols Rounded glyph for the stepper node. */
  icon: string;
}

@Component({
  selector: 'app-add-user-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user-wizard.component.html',
  styleUrl: './add-user-wizard.component.scss',
})
export class AddUserWizardComponent {
  /** Emitted when the wizard should close (Cancel, or after a successful save). */
  @Output() closed = new EventEmitter<void>();
  /** Emitted with a light user summary when the user saves. */
  @Output() saved = new EventEmitter<{
    firstName: string; lastName: string; username: string; email: string; role: string; brands: number;
  }>();

  /** Prototype toggle (inside the dialog) — simulates an SSO org being configured. */
  ssoEnabled = false;
  /** The configured SSO sign-in domain (e.g. "locobuzz.net"). */
  @Input() ssoDomain = 'locobuzz.net';
  /** Usernames already in use — drives the availability check on step 1. */
  @Input() takenUsernames: string[] = [];
  /** Prototype toggle — role selector shown as a card grid vs. a dropdown. */
  roleVariant: 'cards' | 'dropdown' = 'cards';

  // ---- wizard chrome -----------------------------------------------------
  currentStep = 1;
  readonly totalSteps = 6;

  /** Celebration screen shown after Save. */
  celebrating = false;
  /** Pre-computed confetti pieces — CSS animates them, no JS loop. */
  readonly confetti = this.makeConfetti();

  readonly steps: WizardStep[] = [
    { num: 1, label: 'Profile',            subtitle: 'Personal details',   icon: 'person' },
    { num: 2, label: 'Role & permissions', subtitle: 'Access & rights',    icon: 'shield' },
    { num: 3, label: 'Brands',             subtitle: 'Brand access',       icon: 'storefront' },
    { num: 4, label: 'Signature',          subtitle: 'Reply sign-off',     icon: 'draw' },
    { num: 5, label: 'Team & notify',      subtitle: 'Placement & alerts', icon: 'group' },
    { num: 6, label: 'Review',             subtitle: 'Final check',        icon: 'fact_check' },
  ];

  /** Right-side contextual help — describes the important fields on each step. */
  readonly stepInfo: Record<number, {
    title: string; lead: string;
    fields: { key: string; icon: string; label: string; desc: string; required?: boolean }[];
    tip?: string;
  }> = {
    1: {
      title: 'Who is this user?',
      lead: 'Their identity and how they sign in. The email matters most — it’s their login and where the invite goes.',
      fields: [
        { key: 'name', icon: 'badge', label: 'First & last name', desc: 'Their real name (3–20 characters). Shown on tickets and reports.', required: true },
        { key: 'username', icon: 'alternate_email', label: 'Username', desc: 'A unique sign-in handle. It can’t be changed later, so choose carefully.', required: true },
        { key: 'email', icon: 'mail', label: 'Email', desc: 'Their login address, and where the invite is delivered.', required: true },
        { key: 'contact', icon: 'call', label: 'Contact number', desc: 'Optional — for call or SMS escalations.' },
      ],
      tip: 'A clear photo helps teammates recognise them in the shared inbox.',
    },
    2: {
      title: 'Role & permissions',
      lead: 'The role sets a sensible baseline; fine-tune exactly what they can do in each module.',
      fields: [
        { key: 'role', icon: 'shield_person', label: 'Role', desc: 'Sets the access level and pre-selects the permissions below.', required: true },
        { key: 'permissions', icon: 'tune', label: 'Platform permissions', desc: 'What they can see and do, per module. At least one is required.', required: true },
        { key: 'admin', icon: 'warning', label: 'Supervisor Admin', desc: 'Full account-wide control. Grant only to trusted owners.' },
      ],
      tip: 'Start from the role’s defaults, then remove anything this person shouldn’t have.',
    },
    3: {
      title: 'Brand access',
      lead: 'Pick the brands this user works on. Only these appear in their inbox, analytics and reports.',
      fields: [
        { key: 'brands', icon: 'storefront', label: 'Assigned brands', desc: 'One or more brands. The user sees nothing outside them.', required: true },
      ],
      tip: 'Assign the fewest brands needed — you can add more later.',
    },
    4: {
      title: 'Reply signature',
      lead: 'A short sign-off added to the end of this user’s replies.',
      fields: [
        { key: 'signature', icon: 'draw', label: 'Signature', desc: 'Up to 30 characters, e.g. “— Aarav, Acme Care”.' },
        { key: 'perbrand', icon: 'storefront', label: 'Per-brand signatures', desc: 'A different sign-off for each brand they work on.' },
      ],
      tip: 'Signatures are optional — set them later from the user’s profile if you like.',
    },
    5: {
      title: 'Team & notifications',
      lead: 'Place them on a team for routing and reporting, and choose who hears about the new account.',
      fields: [
        { key: 'team', icon: 'group', label: 'Team', desc: 'Groups the user for ticket routing, reporting and bulk actions.' },
        { key: 'notify', icon: 'notifications', label: 'Notify', desc: 'Email the team and/or specific people once the account is created.' },
      ],
      tip: 'Teams are optional — you can assign one later.',
    },
    6: {
      title: 'Review & create',
      lead: 'One last look before the account is created. Jump back to any step to fix something.',
      fields: [
        { key: 'summary', icon: 'fact_check', label: 'Summary', desc: 'Check the name, role, brands and permissions.' },
        { key: 'invite', icon: 'mail', label: 'Invite', desc: 'On create, they get an email invite to set their password.' },
      ],
      tip: 'Adding more people? The success screen has “Add another user”.',
    },
  };

  /** Key of the field currently focused on the left — highlights its aside block. */
  activeInfo: string | null = null;
  setActiveInfo(key: string) { this.activeInfo = key; }
  clearActiveInfo() { this.activeInfo = null; }

  // ---- reference data ----------------------------------------------------
  readonly roles = USER_ROLES;
  readonly countryCodes = COUNTRY_CODES;
  readonly allBrands = ASSIGNABLE_BRANDS;
  readonly allTeams = TEAMS;
  readonly notifyUsers = NOTIFY_USERS;
  readonly groups = PERMISSION_GROUPS;
  /** Flag image URL for a country dial-code entry. */
  readonly countryFlag = countryCodeFlagUrl;

  // =======================================================================
  //  Step 1 · user profile
  // =======================================================================
  photoDataUrl: string | null = null;
  firstName = '';
  lastName = '';
  gender: '0' | '1' | '2' = '0';
  role: UserRole | null = null;
  roleOpen = false;
  isSupervisorAdmin = false;
  username = '';
  email = '';
  country: CountryCode = COUNTRY_CODES[0];
  countryOpen = false;
  countrySearch = '';
  contactNumber = '';

  // =======================================================================
  //  Step 2 · brands & team
  // =======================================================================
  selectedBrandIds = new Set<string>();
  brandsDropdownOpen = false;
  brandSearch = '';
  selectedTeam: Team | null = null;
  teamOpen = false;
  teamSearch = '';

  // =======================================================================
  //  Step 3 · permissions
  // =======================================================================
  /** Which permission groups (the 7 platforms) are granted to this user. */
  selectedGroupIds = new Set<string>();
  /** Flat set of checked permission child keys (`capId::child`). */
  checkedPermissions = new Set<string>();
  platformsDropdownOpen = false;
  platformSearch = '';

  // =======================================================================
  //  Step 4 · signature & notify
  // =======================================================================
  perBrandSignatures = false;
  signature = '';
  brandSignatures: Record<string, string> = {};
  /** Email everyone on the selected team about the new account. */
  notifyTeamMembers = false;
  selectedNotifyEmails = new Set<string>();
  notifyDropdownOpen = false;
  notifySearch = '';

  private readonly emailRe = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // =======================================================================
  //  Step navigation
  // =======================================================================
  isStepValid(step: number): boolean {
    switch (step) {
      case 1: {
        // Profile — pure identity (role moved to step 2).
        const fn = this.firstName.trim().length;
        const ln = this.lastName.trim().length;
        const un = this.username.trim().length;
        return fn >= 3 && fn <= 20 && ln >= 3 && ln <= 20
          && un >= 3 && un <= 20 && !this.usernameTaken && this.emailRe.test(this.email.trim())
          && (!this.contactNumber || this.contactNumber.length >= 4);
      }
      case 2: return !!this.role && this.checkedPermissions.size > 0;   // role & permissions
      case 3: return this.selectedBrandIds.size > 0;                    // brands
      case 4: return true;                                             // signature (optional)
      case 5: return true;                                             // team (optional)
      case 6: return true;                                             // review & notify
      default: return false;
    }
  }

  goToStep(num: number) {
    if (num < this.currentStep) { this.currentStep = num; return; }
    for (let s = this.currentStep; s < num; s++) {
      if (!this.isStepValid(s)) return;
    }
    this.currentStep = num;
    this.committedName = this.displayName;
  }

  nextStep() {
    if (!this.isStepValid(this.currentStep)) return;
    if (this.currentStep < this.totalSteps) this.currentStep++;
    this.committedName = this.displayName;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  // =======================================================================
  //  Step 1 helpers
  // =======================================================================
  get userInitials(): string {
    const f = this.firstName.trim()[0] ?? '';
    const l = this.lastName.trim()[0] ?? '';
    return (f + l).toUpperCase() || 'U';
  }

  /** Display name typed so far (first + last). */
  get displayName(): string {
    return [this.firstName.trim(), this.lastName.trim()].filter(Boolean).join(' ');
  }

  /** Name committed into the heading — only refreshed on step navigation (Next/jump). */
  committedName = '';

  /** Dialog title — personalises once a name is committed by advancing a step. */
  get headingName(): string {
    return this.committedName ? `Adding User - ${this.committedName}` : 'Add User';
  }

  /** Dialog subtitle — mirrors the title. */
  get headingSub(): string {
    return this.committedName
      ? `Set up ${this.committedName}'s account — role, brands and permissions.`
      : 'Create a new user account, assign brands, and define platform permissions.';
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!/image\/(png|jpe?g|gif)/.test(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => (this.photoDataUrl = reader.result as string);
    reader.readAsDataURL(file);
    input.value = '';
  }

  selectRole(r: UserRole) {
    this.role = r;
    this.roleOpen = false;
    this.applyRoleDefaults(r);
  }

  /** "a" / "an" article for the selected role label (vowel-sound aware). */
  get roleArticle(): string {
    return /^[aeiou]/i.test(this.role?.label ?? '') ? 'an' : 'a';
  }

  /** True when SSO is on and the entered email isn't on the SSO sign-in domain. */
  get emailSsoMismatch(): boolean {
    const email = this.email.trim().toLowerCase();
    if (!this.ssoEnabled || !this.ssoDomain || !email) return false;
    return !email.endsWith('@' + this.ssoDomain.toLowerCase());
  }

  /** True when the typed username is already in use. */
  get usernameTaken(): boolean {
    const u = this.username.trim().toLowerCase();
    return u.length >= 3 && this.takenUsernames.some(t => t.toLowerCase() === u);
  }

  /** True when the typed username is valid and free. */
  get usernameAvailable(): boolean {
    const u = this.username.trim();
    return u.length >= 3 && u.length <= 20 && !this.usernameTaken;
  }

  /** True for roles that may be promoted to admin. */
  get showSupervisorAdmin(): boolean {
    return !!this.role && (this.role.id === 3 || this.role.id === 7);
  }

  /** Pre-seed platform access + its properties from the role's default set. */
  private applyRoleDefaults(r: UserRole) {
    const defaults = ROLE_DEFAULT_GROUPS[r.id] ?? [];
    this.selectedGroupIds = new Set(defaults);
    this.checkedPermissions.clear();
    for (const id of defaults) {
      const grp = this.groups.find(g => g.id === id);
      grp?.capabilities.forEach(cap =>
        cap.children.forEach(child => this.checkedPermissions.add(this.childKey(cap, child))));
    }
  }

  get filteredCountryCodes(): CountryCode[] {
    const q = this.countrySearch.trim().toLowerCase();
    if (!q) return this.countryCodes;
    return this.countryCodes.filter(c => c.code.toLowerCase().includes(q) || c.dial.includes(q));
  }

  selectCountry(c: CountryCode) {
    this.country = c;
    this.countryOpen = false;
    this.countrySearch = '';
    this.contactNumber = '';
  }

  onContactInput(event: Event) {
    const el = event.target as HTMLInputElement;
    const digits = el.value.replace(/\D/g, '').slice(0, this.country.maxLen);
    this.contactNumber = digits;
    el.value = digits;
  }

  // =======================================================================
  //  Step 2 helpers
  // =======================================================================
  get selectedBrands(): AssignableBrand[] {
    return this.allBrands.filter(b => this.selectedBrandIds.has(b.id));
  }

  get filteredBrands(): AssignableBrand[] {
    const q = this.brandSearch.trim().toLowerCase();
    return q ? this.allBrands.filter(b => b.name.toLowerCase().includes(q)) : this.allBrands;
  }

  get allBrandsSelected(): boolean {
    return this.selectedBrandIds.size === this.allBrands.length;
  }

  toggleBrand(id: string) {
    this.selectedBrandIds.has(id) ? this.selectedBrandIds.delete(id) : this.selectedBrandIds.add(id);
    this.reconcileBrandSignatures();
  }

  removeBrand(id: string) {
    this.selectedBrandIds.delete(id);
    this.reconcileBrandSignatures();
  }

  toggleAllBrands() {
    if (this.allBrandsSelected) this.selectedBrandIds.clear();
    else this.allBrands.forEach(b => this.selectedBrandIds.add(b.id));
    this.reconcileBrandSignatures();
  }

  get filteredTeams(): Team[] {
    const q = this.teamSearch.trim().toLowerCase();
    return q ? this.allTeams.filter(t => t.name.toLowerCase().includes(q)) : this.allTeams;
  }

  selectTeam(t: Team) {
    this.selectedTeam = t;
    this.teamOpen = false;
    this.teamSearch = '';
  }

  // =======================================================================
  //  Step 3 helpers (permissions)
  // =======================================================================
  /** Stable key for a single child permission within its capability. */
  childKey(cap: PermissionCapability, child: string): string {
    return `${cap.id}::${child}`;
  }

  get selectedGroups(): PermissionGroup[] {
    return this.groups.filter(g => this.selectedGroupIds.has(g.id));
  }

  /** Search-filtered groups for the platform-access dropdown. */
  get filteredGroups(): PermissionGroup[] {
    const q = this.platformSearch.trim().toLowerCase();
    return q ? this.groups.filter(g => g.name.toLowerCase().includes(q)) : this.groups;
  }

  togglePlatform(id: string) {
    const grp = this.groups.find(g => g.id === id);
    if (!grp) return;
    const apply = (fn: (k: string) => void) =>
      grp.capabilities.forEach(cap => cap.children.forEach(c => fn(this.childKey(cap, c))));
    if (this.selectedGroupIds.has(id)) {
      this.selectedGroupIds.delete(id);
      apply(k => this.checkedPermissions.delete(k));
    } else {
      this.selectedGroupIds.add(id);
      apply(k => this.checkedPermissions.add(k));
    }
  }

  removePlatform(id: string) {
    this.togglePlatform(id);   // selected platforms are always currently-on
  }

  // ---- count helpers -----------------------------------------------------
  /** Total child permissions in a group (across all capabilities). */
  groupTotal(g: PermissionGroup): number {
    return g.capabilities.reduce((n, cap) => n + cap.children.length, 0);
  }

  /** Enabled child permissions in a group. */
  groupEnabled(g: PermissionGroup): number {
    return g.capabilities.reduce(
      (n, cap) => n + cap.children.filter(c => this.checkedPermissions.has(this.childKey(cap, c))).length, 0);
  }

  capEnabled(cap: PermissionCapability): number {
    return cap.children.filter(c => this.checkedPermissions.has(this.childKey(cap, c))).length;
  }

  groupAllChecked(g: PermissionGroup): boolean {
    return this.groupEnabled(g) === this.groupTotal(g);
  }

  toggleGroupAll(g: PermissionGroup) {
    const on = !this.groupAllChecked(g);
    g.capabilities.forEach(cap => cap.children.forEach(c => {
      const k = this.childKey(cap, c);
      on ? this.checkedPermissions.add(k) : this.checkedPermissions.delete(k);
    }));
  }

  togglePermission(key: string) {
    this.checkedPermissions.has(key)
      ? this.checkedPermissions.delete(key)
      : this.checkedPermissions.add(key);
  }

  // ---- collapsible permission groups (my-profile style) ------------------
  /** Which permission groups are expanded in the properties accordion. */
  expandedModules: Record<string, boolean> = {};

  toggleModuleExpand(id: string) {
    this.expandedModules[id] = !this.expandedModules[id];
  }

  // =======================================================================
  //  Step 4 helpers
  // =======================================================================
  onTogglePerBrand() {
    this.perBrandSignatures = !this.perBrandSignatures;
    if (this.perBrandSignatures) this.reconcileBrandSignatures();
  }

  /** Per-brand signatures only make sense with more than one assigned brand. */
  get canPerBrand(): boolean { return this.selectedBrands.length > 1; }

  /** Effective per-brand mode — forced off when only a single brand is assigned. */
  get usePerBrand(): boolean { return this.perBrandSignatures && this.canPerBrand; }

  /** Keep the per-brand signature map in sync with the assigned-brand set. */
  private reconcileBrandSignatures() {
    const next: Record<string, string> = {};
    for (const b of this.selectedBrands) next[b.id] = this.brandSignatures[b.id] ?? '';
    this.brandSignatures = next;
  }

  clearSignatures() {
    this.signature = '';
    for (const k of Object.keys(this.brandSignatures)) this.brandSignatures[k] = '';
  }

  /** Emoji quick-inserts for the signature editor. */
  readonly signatureEmojis = ['🙌', '😊', '🙏', '✨', '💙'];

  /** The signature shown in the live preview (common, or the first brand's). */
  get previewSignature(): string {
    if (this.usePerBrand) {
      const first = this.selectedBrands[0];
      return first ? (this.brandSignatures[first.id] ?? '') : '';
    }
    return this.signature;
  }

  /** Brand name shown beside the preview author when in per-brand mode. */
  get previewBrand(): string {
    return this.usePerBrand && this.selectedBrands[0] ? this.selectedBrands[0].name : '';
  }

  /** Replace the common signature with a token (e.g. the user's name). */
  insertSignatureToken(text: string) {
    this.signature = text.slice(0, 30);
  }

  /** Append an emoji to the common signature if there's room. */
  appendSignatureEmoji(emoji: string) {
    if ((this.signature + emoji).length <= 30) this.signature += emoji;
  }

  get filteredNotifyUsers(): string[] {
    const q = this.notifySearch.trim().toLowerCase();
    return q ? this.notifyUsers.filter(u => u.toLowerCase().includes(q)) : this.notifyUsers;
  }

  toggleNotify(email: string) {
    this.selectedNotifyEmails.has(email)
      ? this.selectedNotifyEmails.delete(email)
      : this.selectedNotifyEmails.add(email);
  }

  removeNotify(email: string) {
    this.selectedNotifyEmails.delete(email);
  }

  initialsOf(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase() || name.slice(0, 2).toUpperCase();
  }

  /** Rotating avatar colours for the team member stack. */
  readonly memberColors = ['#007AFF', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  // =======================================================================
  //  Step 5 helpers (read-only review)
  // =======================================================================
  get genderLabel(): string {
    return this.gender === '1' ? 'Female' : this.gender === '2' ? 'Other' : 'Male';
  }

  get contactDisplay(): string {
    return this.contactNumber ? `${this.country.dial} ${this.contactNumber}` : '—';
  }

  /** Total enabled child permissions across every selected platform. */
  get totalEnabledPermissions(): number {
    return this.selectedGroups.reduce((n, g) => n + this.groupEnabled(g), 0);
  }

  /** Human summary of who gets notified — team + individual recipients. */
  get notifySummary(): string {
    const parts: string[] = [];
    if (this.notifyTeamMembers && this.selectedTeam) parts.push(`${this.selectedTeam.name} team`);
    if (this.selectedNotifyEmails.size) {
      parts.push(`${this.selectedNotifyEmails.size} ${this.selectedNotifyEmails.size === 1 ? 'user' : 'users'}`);
    }
    return parts.length ? parts.join(' + ') : 'No one';
  }

  // =======================================================================
  //  Save / cancel
  // =======================================================================
  onSubmit() {
    if (!this.isStepValid(1) || !this.isStepValid(2) || !this.isStepValid(3)) return;
    // Show the celebration summary; the user closes it with the Finish button.
    this.celebrating = true;
  }

  /** Emit the newly-created user to the parent listing. */
  private emitSavedUser() {
    this.saved.emit({
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      username: this.username.trim(),
      email: this.email.trim(),
      role: this.role!.label,
      brands: this.selectedBrandIds.size,
    });
  }

  /** Save this user and close the dialog. */
  complete() {
    this.emitSavedUser();
    this.close();
  }

  /** Save this user and reset the wizard to add another one. */
  addAnother() {
    this.emitSavedUser();
    this.resetForNewUser();
  }

  /** Wipe all step state so the wizard starts fresh for a new user. */
  private resetForNewUser() {
    this.celebrating = false;
    this.currentStep = 1;
    this.committedName = '';
    // step 1 — profile
    this.photoDataUrl = null;
    this.firstName = this.lastName = this.username = this.email = '';
    this.gender = '0';
    this.role = null;
    this.roleOpen = false;
    this.isSupervisorAdmin = false;
    this.country = COUNTRY_CODES[0];
    this.countryOpen = false;
    this.countrySearch = '';
    this.contactNumber = '';
    // step 2 — role & permissions
    this.selectedGroupIds.clear();
    this.checkedPermissions.clear();
    this.expandedModules = {};
    this.platformsDropdownOpen = false;
    this.platformSearch = '';
    // step 3 — brands
    this.selectedBrandIds.clear();
    this.brandsDropdownOpen = false;
    this.brandSearch = '';
    // step 4 — signature
    this.perBrandSignatures = false;
    this.signature = '';
    this.brandSignatures = {};
    // step 5 — team & notify
    this.selectedTeam = null;
    this.teamOpen = false;
    this.teamSearch = '';
    this.notifyTeamMembers = false;
    this.selectedNotifyEmails.clear();
    this.notifyDropdownOpen = false;
    this.notifySearch = '';
  }

  close() {
    this.closed.emit();
  }

  /** A spread of confetti pieces with varied colour, position, timing. */
  private makeConfetti() {
    const colors = ['#007AFF', '#4aa3ff', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899'];
    return Array.from({ length: 28 }, (_, i) => ({
      left: Math.round(Math.random() * 100),
      delay: +(Math.random() * 0.5).toFixed(2),
      duration: +(2 + Math.random() * 1.4).toFixed(2),
      drift: Math.round((Math.random() - 0.5) * 120),
      rotate: Math.round(Math.random() * 360),
      color: colors[i % colors.length],
      round: i % 3 === 0,
    }));
  }

  constructor(private host: ElementRef<HTMLElement>) {}

  private closeAllDropdowns() {
    this.roleOpen = this.countryOpen = this.teamOpen = false;
    this.brandsDropdownOpen = this.platformsDropdownOpen = this.notifyDropdownOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeAllDropdowns();
  }

  /** Click outside any open picker closes it (autocomplete behaviour). */
  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target) return;
    // Clicks landing inside a multiselect or a custom select keep it open;
    // their own handlers manage toggling/selection.
    if (target.closest('.au-multi') || target.closest('.au-select-wrap')) return;
    this.closeAllDropdowns();
  }
}
