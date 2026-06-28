import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  USER_ROLES, COUNTRY_CODES, ASSIGNABLE_BRANDS, TEAMS, SKILLS, CHANNEL_GROUPS,
  CONFIGURED_EMAILS, NOTIFY_USERS, PERMISSION_MODULES, ROLE_DEFAULT_MODULES,
  UserRole, CountryCode, AssignableBrand, Team, Skill, ChannelGroup,
  ConfiguredEmail, PermissionModule,
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

  // ---- wizard chrome -----------------------------------------------------
  currentStep = 1;
  readonly totalSteps = 5;

  /** Celebration screen shown after Save. */
  celebrating = false;
  private completedOnce = false;
  /** Pre-computed confetti pieces — CSS animates them, no JS loop. */
  readonly confetti = this.makeConfetti();

  readonly steps: WizardStep[] = [
    { num: 1, label: 'User profile',      subtitle: 'Identity & role',     icon: 'badge' },
    { num: 2, label: 'Brands & team',     subtitle: 'Access & tickets',    icon: 'group' },
    { num: 3, label: 'Channels',          subtitle: 'Inbox & ratings',     icon: 'hub' },
    { num: 4, label: 'Permissions',       subtitle: 'Platform access',     icon: 'shield' },
    { num: 5, label: 'Signature & notify', subtitle: 'Finishing touches',  icon: 'draw' },
  ];

  // ---- reference data ----------------------------------------------------
  readonly roles = USER_ROLES;
  readonly countryCodes = COUNTRY_CODES;
  readonly allBrands = ASSIGNABLE_BRANDS;
  readonly allTeams = TEAMS;
  readonly allSkills = SKILLS;
  readonly channelGroups = CHANNEL_GROUPS;
  readonly allEmails = CONFIGURED_EMAILS;
  readonly notifyUsers = NOTIFY_USERS;
  readonly modules = PERMISSION_MODULES;

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
  assignToOthers = false;
  assignLevel: 1 | 2 = 2;       // 1 = team-level, 2 = user-level (all)
  ticketView: 1 | 2 | 3 = 1;    // 1 = all, 2 = assigned to me, 3 = others
  selectedSkillIds = new Set<string>();
  skillSearch = '';

  // =======================================================================
  //  Step 3 · channels & ratings
  // =======================================================================
  selectedChannelIds = new Set<string>();
  channelSearch = '';
  selectedEmailIds = new Set<string>();
  playStoreRatings = new Set<number>();
  googleReviewRatings = new Set<number>();
  readonly stars = [1, 2, 3, 4, 5];

  // =======================================================================
  //  Step 4 · permissions
  // =======================================================================
  selectedModuleKeys = new Set<string>();
  /** Flat set of checked permission child keys. */
  checkedPermissions = new Set<string>();
  permissionSearch = '';
  platformsDropdownOpen = false;
  platformSearch = '';

  // =======================================================================
  //  Step 5 · signature & notify
  // =======================================================================
  perBrandSignatures = false;
  signature = '';
  brandSignatures: Record<string, string> = {};
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
        const fn = this.firstName.trim().length;
        const ln = this.lastName.trim().length;
        const un = this.username.trim().length;
        return fn >= 3 && fn <= 20 && ln >= 3 && ln <= 20 && !!this.role
          && un >= 3 && un <= 20 && this.emailRe.test(this.email.trim())
          && (!this.contactNumber || this.contactNumber.length >= 4);
      }
      case 2: return this.selectedBrandIds.size > 0;
      case 3: return true;
      case 4: return this.checkedPermissions.size > 0;
      case 5: return true;
      default: return false;
    }
  }

  goToStep(num: number) {
    if (num < this.currentStep) { this.currentStep = num; return; }
    for (let s = this.currentStep; s < num; s++) {
      if (!this.isStepValid(s)) return;
    }
    this.currentStep = num;
  }

  nextStep() {
    if (!this.isStepValid(this.currentStep)) return;
    if (this.currentStep < this.totalSteps) this.currentStep++;
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

  /** True for roles that may be promoted to admin. */
  get showSupervisorAdmin(): boolean {
    return !!this.role && (this.role.id === 3 || this.role.id === 7);
  }

  /** Pre-seed the permission tree from the role's default module set. */
  private applyRoleDefaults(r: UserRole) {
    const defaults = ROLE_DEFAULT_MODULES[r.id] ?? [];
    this.selectedModuleKeys = new Set(defaults);
    this.checkedPermissions.clear();
    for (const key of defaults) {
      const mod = this.modules.find(m => m.key === key);
      mod?.children.forEach(c => this.checkedPermissions.add(c.key));
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

  get filteredSkills(): Skill[] {
    const q = this.skillSearch.trim().toLowerCase();
    return q ? this.allSkills.filter(s => s.name.toLowerCase().includes(q)) : this.allSkills;
  }

  toggleSkill(id: string) {
    this.selectedSkillIds.has(id) ? this.selectedSkillIds.delete(id) : this.selectedSkillIds.add(id);
  }

  /** Skills & ticket-view settings only apply to Agent / Team Lead. */
  get showAgentSettings(): boolean {
    return !!this.role && (this.role.id === 1 || this.role.id === 9);
  }

  // =======================================================================
  //  Step 3 helpers
  // =======================================================================
  get filteredChannelGroups(): ChannelGroup[] {
    const q = this.channelSearch.trim().toLowerCase();
    if (!q) return this.channelGroups;
    return this.channelGroups
      .map(g => ({ ...g, children: g.children.filter(c => c.name.toLowerCase().includes(q)) }))
      .filter(g => g.name.toLowerCase().includes(q) || g.children.length);
  }

  groupChecked(g: ChannelGroup): boolean {
    return g.children.every(c => this.selectedChannelIds.has(c.id));
  }

  groupIndeterminate(g: ChannelGroup): boolean {
    const some = g.children.some(c => this.selectedChannelIds.has(c.id));
    return some && !this.groupChecked(g);
  }

  toggleChannelGroup(g: ChannelGroup) {
    if (this.groupChecked(g)) g.children.forEach(c => this.selectedChannelIds.delete(c.id));
    else g.children.forEach(c => this.selectedChannelIds.add(c.id));
  }

  toggleChannel(id: string) {
    this.selectedChannelIds.has(id) ? this.selectedChannelIds.delete(id) : this.selectedChannelIds.add(id);
  }

  /** The Email channel toggles the configured-emails picker. */
  get emailChannelSelected(): boolean {
    const grp = this.channelGroups.find(g => g.isEmail);
    return !!grp && grp.children.some(c => this.selectedChannelIds.has(c.id));
  }

  get playStoreSelected(): boolean {
    const grp = this.channelGroups.find(g => g.isRating === 'playstore');
    return !!grp && grp.children.some(c => this.selectedChannelIds.has(c.id));
  }

  get googleReviewSelected(): boolean {
    const grp = this.channelGroups.find(g => g.isRating === 'googlereview');
    return !!grp && grp.children.some(c => this.selectedChannelIds.has(c.id));
  }

  get anyRatingSelected(): boolean {
    return this.playStoreSelected || this.googleReviewSelected;
  }

  get selectedEmails(): ConfiguredEmail[] {
    return this.allEmails.filter(e => this.selectedEmailIds.has(e.id));
  }

  toggleEmail(id: string) {
    this.selectedEmailIds.has(id) ? this.selectedEmailIds.delete(id) : this.selectedEmailIds.add(id);
  }

  toggleRating(kind: 'playstore' | 'googlereview', star: number) {
    const set = kind === 'playstore' ? this.playStoreRatings : this.googleReviewRatings;
    set.has(star) ? set.delete(star) : set.add(star);
  }

  // =======================================================================
  //  Step 4 helpers
  // =======================================================================
  get selectedModules(): PermissionModule[] {
    return this.modules.filter(m => this.selectedModuleKeys.has(m.key));
  }

  get filteredPlatforms(): PermissionModule[] {
    const q = this.platformSearch.trim().toLowerCase();
    return q ? this.modules.filter(m => m.label.toLowerCase().includes(q)) : this.modules;
  }

  togglePlatform(key: string) {
    const mod = this.modules.find(m => m.key === key);
    if (!mod) return;
    if (this.selectedModuleKeys.has(key)) {
      this.selectedModuleKeys.delete(key);
      mod.children.forEach(c => this.checkedPermissions.delete(c.key));
    } else {
      this.selectedModuleKeys.add(key);
      mod.children.forEach(c => this.checkedPermissions.add(c.key));
    }
  }

  removePlatform(key: string) {
    this.togglePlatform(key);   // selected platforms are always currently-on
  }

  /** Permission modules visible in the properties list, filtered by search. */
  get visibleModules(): PermissionModule[] {
    const q = this.permissionSearch.trim().toLowerCase();
    let mods = this.selectedModules;
    if (q) {
      mods = mods
        .map(m => ({ ...m, children: m.children.filter(c => c.label.toLowerCase().includes(q)) }))
        .filter(m => m.label.toLowerCase().includes(q) || m.children.length);
    }
    return mods;
  }

  moduleChecked(m: PermissionModule): boolean {
    return m.children.every(c => this.checkedPermissions.has(c.key));
  }

  moduleIndeterminate(m: PermissionModule): boolean {
    const some = m.children.some(c => this.checkedPermissions.has(c.key));
    return some && !this.moduleChecked(m);
  }

  toggleModule(m: PermissionModule) {
    if (this.moduleChecked(m)) m.children.forEach(c => this.checkedPermissions.delete(c.key));
    else m.children.forEach(c => this.checkedPermissions.add(c.key));
  }

  togglePermission(childKey: string) {
    this.checkedPermissions.has(childKey)
      ? this.checkedPermissions.delete(childKey)
      : this.checkedPermissions.add(childKey);
  }

  /** Response-Dashboard vs Account-Settings group of the currently-visible modules. */
  modulesInGroup(group: PermissionModule['group']): PermissionModule[] {
    return this.visibleModules.filter(m => m.group === group);
  }

  get hasResponseDashboard(): boolean { return this.modulesInGroup('Response Dashboard').length > 0; }
  get hasAccountSettings(): boolean { return this.modulesInGroup('Account Settings').length > 0; }

  // =======================================================================
  //  Step 5 helpers
  // =======================================================================
  onTogglePerBrand() {
    this.perBrandSignatures = !this.perBrandSignatures;
    if (this.perBrandSignatures) this.reconcileBrandSignatures();
  }

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
    return name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase();
  }

  // =======================================================================
  //  Save / cancel
  // =======================================================================
  onSubmit() {
    if (!this.isStepValid(1) || !this.isStepValid(2) || !this.isStepValid(4)) return;
    // Show the celebration, then auto-complete; user can also click Done.
    this.celebrating = true;
    setTimeout(() => this.complete(), 3600);
  }

  /** Emit the saved user and close — guarded so it only runs once. */
  complete() {
    if (this.completedOnce) return;
    this.completedOnce = true;
    this.saved.emit({
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      username: this.username.trim(),
      email: this.email.trim(),
      role: this.role!.label,
      brands: this.selectedBrandIds.size,
    });
    this.close();
  }

  close() {
    this.closed.emit();
  }

  /** A spread of confetti pieces with varied colour, position, timing. */
  private makeConfetti() {
    const colors = ['#4f46e5', '#7c6cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899'];
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

  @HostListener('document:keydown.escape')
  onEscape() {
    this.roleOpen = this.countryOpen = this.teamOpen = false;
    this.brandsDropdownOpen = this.platformsDropdownOpen = this.notifyDropdownOpen = false;
  }
}
