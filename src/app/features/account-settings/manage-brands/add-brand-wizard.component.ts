import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  COUNTRIES, BRAND_USERS, CATEGORY_GROUPS, BRAND_COLORS, MANAGED_BRANDS, brandLogo,
  BrandUser, BrandProduct, BrandCompetitor, CategoryGroupInfo, TaxonomyCategory, ManagedBrand,
} from './manage-brands-data';

interface WizardStep {
  num: number;
  label: string;
  subtitle: string;
  /** Material Symbols Rounded glyph for the stepper node. */
  icon: string;
}

@Component({
  selector: 'app-add-brand-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-brand-wizard.component.html',
  styleUrl: './add-brand-wizard.component.scss',
})
export class AddBrandWizardComponent {
  /** Emitted when the wizard should close (Cancel, or after a successful save). */
  @Output() closed = new EventEmitter<void>();
  /** Emitted with a light brand summary when the user saves. */
  @Output() saved = new EventEmitter<{ name: string; color: string; country: string; users: number }>();

  // ---- wizard chrome -----------------------------------------------------
  currentStep = 1;
  readonly totalSteps = 6;

  /** Celebration screen shown after Save. */
  celebrating = false;
  private completedOnce = false;
  /** Pre-computed confetti pieces — CSS animates them, no JS loop. */
  readonly confetti = this.makeConfetti();
  readonly steps: WizardStep[] = [
    { num: 1, label: 'Brand identity', subtitle: 'Basics & AI context', icon: 'badge' },
    { num: 2, label: 'Logo & color',   subtitle: 'Visual identity',     icon: 'palette' },
    { num: 3, label: 'Products',       subtitle: 'Market context',      icon: 'deployed_code' },
    { num: 4, label: 'Categories',     subtitle: 'Taxonomy mapping',    icon: 'sell' },
    { num: 5, label: 'Tickets',        subtitle: 'Ticket creation',     icon: 'confirmation_number' },
    { num: 6, label: 'Assign users',   subtitle: 'Brand access',        icon: 'group' },
  ];

  // ---- reference data ----------------------------------------------------
  readonly countries = COUNTRIES;
  readonly allUsers = BRAND_USERS;
  /** Fresh copy each time the dialog opens (inline-created groups/categories stay local). */
  readonly categoryGroups: CategoryGroupInfo[] =
    CATEGORY_GROUPS.map(g => ({ ...g, categoryList: g.categoryList.map(c => ({ ...c })) }));
  readonly brandColors = BRAND_COLORS;

  // ---- step 1 · brand identity -------------------------------------------
  brandName = '';
  country = '';
  aiFriendlyName = '';
  brandDescription = '';
  countryOpen = false;
  countrySearch = '';

  /** Description authoring mode: write it manually, or generate it with AI. */
  descMode: 'manual' | 'ai' = 'manual';
  /** AI tab state. */
  aiNameLoading = false;      // fetching the AI friendly name
  aiNameAttempted = false;    // auto-generation already tried once
  aiNameError = '';           // set when AI-name generation fails
  generating = false;         // description generation in progress
  descGenerated = false;      // AI has produced a description

  // ---- step 2 · logo & color ---------------------------------------------
  logoDataUrl: string | null = null;
  color = '#0f172a';
  customColorOpen = false;

  // ---- step 3 · team & tickets -------------------------------------------
  selectedUserIds = new Set<string>();
  usersDropdownOpen = false;
  userSearch = '';
  ticketsEnabled = true;

  // ---- step 4 · categories -----------------------------------------------
  categoryGroup = '';                                 // selected group name (for payload/summary)
  selectedGroup: CategoryGroupInfo | null = null;     // selected group object
  catchAll = '';                                      // selected catch-all category name
  addingGroup = false;
  groupDraft = '';
  addingCatchAll = false;
  catchAllDraft = '';

  // ---- step 5 · products & competitors -----------------------------------
  products: BrandProduct[] = [{ id: 'p1', name: 'Air Max', synonyms: ['AM', 'Air-Max'] }];
  competitors: BrandCompetitor[] = [{ id: 'c1', name: 'Adidas' }];
  useMappedCompetitors = false;
  mappedCompetitors: BrandCompetitor[] = [{ id: 'm1', name: 'Puma' }, { id: 'm2', name: 'Reebok' }];

  addingCompetitor = false;
  competitorDraft = '';
  editingCompetitorId: string | null = null;

  addingProduct = false;
  productDraftName = '';
  productDraftSynonyms = '';
  editingProductId: string | null = null;

  private seq = 100;

  /** Dialog title — becomes "Adding <Brand>" once a name is typed. */
  get headingName(): string {
    const name = this.brandName.trim();
    return name ? `Adding ${name}` : 'Add Brand';
  }

  /** Dialog subtitle — names the brand once it's typed. */
  get headingSub(): string {
    const name = this.brandName.trim();
    return name
      ? `Setting up ${name} for monitoring and analytics.`
      : 'Set up a new brand for monitoring and analytics.';
  }

  // =======================================================================
  //  Step navigation
  // =======================================================================
  isStepValid(step: number): boolean {
    switch (step) {
      case 1: {                                       // brand identity
        const n = this.brandName.trim().length;
        return n >= 3 && n <= 50 && !!this.country
          && !!this.brandDescription.trim() && this.brandDescription.length <= 200;
      }
      case 2: return !!this.logoDataUrl;              // logo & color
      case 3: return true;                            // products & competitors (optional)
      case 4: return !!this.categoryGroup && !!this.catchAll;  // categories
      case 5: return true;                            // ticket creation (toggle always valid)
      case 6: return this.selectedUserIds.size > 0;   // assign users
      default: return false;
    }
  }

  goToStep(num: number) {
    if (num < this.currentStep) { this.currentStep = num; return; }
    // forward jumps require every intervening step to be valid
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
  //  Step 1 · brand identity
  // =======================================================================
  get filteredCountries(): string[] {
    const q = this.countrySearch.trim().toLowerCase();
    return q ? this.countries.filter(c => c.toLowerCase().includes(q)) : this.countries;
  }

  selectCountry(c: string) {
    this.country = c;
    this.countryOpen = false;
    this.countrySearch = '';
  }

  /** AI friendly name is available (generated or typed) and not mid-fetch. */
  get aiNameReady(): boolean {
    return !!this.aiFriendlyName.trim() && !this.aiNameLoading;
  }

  /** Switch the description-authoring tab; entering the AI tab kicks off name generation. */
  setDescMode(mode: 'manual' | 'ai') {
    this.descMode = mode;
    if (mode === 'ai' && !this.aiNameAttempted && !this.aiFriendlyName.trim()
        && !this.aiNameLoading && this.brandName.trim().length >= 3) {
      this.generateAiName();
    }
  }

  /** Try to fetch/generate the AI friendly name from the brand name. */
  generateAiName() {
    if (this.brandName.trim().length < 3 || this.aiNameLoading) return;
    this.aiNameAttempted = true;
    this.aiNameLoading = true;
    this.aiNameError = '';
    setTimeout(() => {
      this.aiNameLoading = false;
      // Simulated round-trip — occasionally fails so the manual fallback is reachable.
      if (Math.random() < 0.3) {
        this.aiFriendlyName = '';
        this.aiNameError = 'Couldn’t generate AI friendly name. Please enter the AI friendly name.';
      } else {
        this.aiFriendlyName = this.brandName.trim();
      }
    }, 1200);
  }

  /** Generate the brand description from the AI friendly name. */
  generateDescription() {
    if (!this.aiFriendlyName.trim() || this.generating) return;
    this.generating = true;
    setTimeout(() => {
      this.brandDescription =
        `${this.aiFriendlyName.trim()} designs, develops, and markets athletic footwear, apparel, and accessories globally.`
          .slice(0, 200);
      this.descGenerated = true;
      this.generating = false;
    }, 1400);
  }

  // =======================================================================
  //  Step 2 · logo & color
  // =======================================================================
  get brandInitials(): string {
    const parts = this.brandName.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'BR';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!/image\/(png|jpe?g)/.test(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => (this.logoDataUrl = reader.result as string);
    reader.readAsDataURL(file);
    input.value = '';
  }

  pickColor(hex: string) {
    this.color = hex;
    this.customColorOpen = false;
  }

  removeLogo() {
    this.logoDataUrl = null;
  }

  // =======================================================================
  //  Step 3 · team & tickets
  // =======================================================================
  get selectedUsers(): BrandUser[] {
    return this.allUsers.filter(u => this.selectedUserIds.has(u.id));
  }

  get filteredUsers(): BrandUser[] {
    const q = this.userSearch.trim().toLowerCase();
    return q ? this.allUsers.filter(u => u.name.toLowerCase().includes(q)) : this.allUsers;
  }

  get allUsersSelected(): boolean {
    return this.selectedUserIds.size === this.allUsers.length;
  }

  toggleUser(id: string) {
    this.selectedUserIds.has(id) ? this.selectedUserIds.delete(id) : this.selectedUserIds.add(id);
  }

  removeUser(id: string) {
    this.selectedUserIds.delete(id);
  }

  toggleAllUsers() {
    if (this.allUsersSelected) this.selectedUserIds.clear();
    else this.allUsers.forEach(u => this.selectedUserIds.add(u.id));
  }

  userInitials(u: BrandUser): string {
    return u.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase();
  }

  // =======================================================================
  //  Step 4 · categories
  // =======================================================================
  readonly brandLogo = brandLogo;

  /** Existing brands grouped by their category group — shown on each group card. */
  private readonly brandsByGroup: Record<string, ManagedBrand[]> =
    MANAGED_BRANDS.reduce((map, b) => {
      const key = b.categoryGroup ?? '';
      (map[key] ??= []).push(b);
      return map;
    }, {} as Record<string, ManagedBrand[]>);

  groupBrands(name: string): ManagedBrand[] {
    return this.brandsByGroup[name] ?? [];
  }

  /** "Amazon, Nike +2" — a few names plus an overflow count. */
  groupBrandsLabel(name: string): string {
    const brands = this.groupBrands(name);
    const shown = brands.slice(0, 2).map(b => b.name).join(', ');
    const extra = brands.length - 2;
    return extra > 0 ? `${shown} +${extra}` : shown;
  }

  /** Catch-all candidates are the selected group's categories (config is per-group). */
  get catchAllOptions(): TaxonomyCategory[] {
    return this.selectedGroup?.categoryList ?? [];
  }

  selectGroup(g: CategoryGroupInfo) {
    if (this.selectedGroup === g) return;
    this.selectedGroup = g;
    this.categoryGroup = g.name;
    // catch-all belongs to the group, so reset it whenever the group changes
    this.catchAll = '';
    this.cancelAddCatchAll();
  }

  selectCatchAll(c: TaxonomyCategory) {
    this.catchAll = c.name;
  }

  // ---- inline create: category group ----
  startAddGroup() { this.addingGroup = true; this.groupDraft = ''; }
  cancelAddGroup() { this.addingGroup = false; this.groupDraft = ''; }
  saveGroup() {
    const name = this.groupDraft.trim();
    if (name.length < 3 || name.length > 50) return;
    if (this.categoryGroups.some(g => g.name.toLowerCase() === name.toLowerCase())) return;
    const g: CategoryGroupInfo = {
      name,
      description: 'New category group — its taxonomy will be configured after the brand is created.',
      brands: 0, categories: 0, categoryList: [],
    };
    this.categoryGroups.push(g);
    this.selectGroup(g);
    this.cancelAddGroup();
  }

  // ---- inline create: catch-all category (within the selected group) ----
  startAddCatchAll() { this.addingCatchAll = true; this.catchAllDraft = ''; }
  cancelAddCatchAll() { this.addingCatchAll = false; this.catchAllDraft = ''; }
  saveCatchAll() {
    if (!this.selectedGroup) return;
    const name = this.catchAllDraft.trim();
    if (name.length < 3 || name.length > 50) return;
    if (this.selectedGroup.categoryList.some(c => c.name.toLowerCase() === name.toLowerCase())) return;
    const c: TaxonomyCategory = { name, description: 'New category added during brand setup.', keywords: 0 };
    this.selectedGroup.categoryList.push(c);
    this.selectedGroup.categories = this.selectedGroup.categoryList.length;
    this.selectCatchAll(c);
    this.cancelAddCatchAll();
  }

  // =======================================================================
  //  Step 5 · products & competitors
  // =======================================================================
  startAddProduct() {
    this.addingProduct = true;
    this.editingProductId = null;
    this.productDraftName = '';
    this.productDraftSynonyms = '';
  }

  editProduct(p: BrandProduct) {
    this.addingProduct = true;
    this.editingProductId = p.id;
    this.productDraftName = p.name;
    this.productDraftSynonyms = p.synonyms.join(', ');
  }

  saveProduct() {
    const name = this.productDraftName.trim();
    if (!name) return;
    const synonyms = this.productDraftSynonyms.split(',').map(s => s.trim()).filter(Boolean);
    if (this.editingProductId) {
      const existing = this.products.find(p => p.id === this.editingProductId);
      if (existing) { existing.name = name; existing.synonyms = synonyms; }
    } else {
      this.products.push({ id: `p${this.seq++}`, name, synonyms });
    }
    this.cancelProduct();
  }

  cancelProduct() {
    this.addingProduct = false;
    this.editingProductId = null;
    this.productDraftName = '';
    this.productDraftSynonyms = '';
  }

  deleteProduct(p: BrandProduct) {
    this.products = this.products.filter(x => x.id !== p.id);
  }

  startAddCompetitor() {
    this.addingCompetitor = true;
    this.editingCompetitorId = null;
    this.competitorDraft = '';
  }

  editCompetitor(c: BrandCompetitor) {
    this.addingCompetitor = true;
    this.editingCompetitorId = c.id;
    this.competitorDraft = c.name;
  }

  saveCompetitor() {
    const name = this.competitorDraft.trim();
    if (!name) return;
    const dup = [...this.competitors, ...(this.useMappedCompetitors ? this.mappedCompetitors : [])]
      .some(c => c.id !== this.editingCompetitorId && c.name.toLowerCase() === name.toLowerCase());
    if (dup) return;
    if (this.editingCompetitorId) {
      const existing = this.competitors.find(c => c.id === this.editingCompetitorId);
      if (existing) existing.name = name;
    } else {
      this.competitors.push({ id: `c${this.seq++}`, name });
    }
    this.cancelCompetitor();
  }

  cancelCompetitor() {
    this.addingCompetitor = false;
    this.editingCompetitorId = null;
    this.competitorDraft = '';
  }

  /** Chip-style quick add: validate + de-dupe + push, then clear the input. */
  quickAddCompetitor() {
    this.editingCompetitorId = null;
    this.saveCompetitor();   // reuses the existing validation/de-dupe/clear path
  }

  removeCompetitor(c: BrandCompetitor) {
    this.competitors = this.competitors.filter(x => x.id !== c.id);
  }

  // =======================================================================
  //  Save / cancel
  // =======================================================================
  /** Every required step must pass before the brand can be saved. */
  get canSubmit(): boolean {
    return this.isStepValid(1) && this.isStepValid(2) && this.isStepValid(4) && this.isStepValid(6);
  }

  onSubmit() {
    if (!this.canSubmit) return;
    // Show the celebration; the user closes it with the Close button.
    this.celebrating = true;
  }

  /** One-line recap of the brand's basics, shown on the success screen. */
  get brandSummary(): string {
    const users = this.selectedUserIds.size;
    const userPart = `${users} user${users === 1 ? '' : 's'}`;
    const tickets = this.ticketsEnabled ? 'ticket creation on' : 'ticket creation off';
    return `${this.brandName} (${this.country}) is ready — ${userPart} assigned, `
      + `categorised under “${this.categoryGroup}”, with ${tickets}.`;
  }

  /** Emit the saved brand and close — guarded so it only runs once. */
  complete() {
    if (this.completedOnce) return;
    this.completedOnce = true;
    this.saved.emit({
      name: this.brandName.trim(),
      color: this.color,
      country: this.country,
      users: this.selectedUserIds.size,
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

  openUsersDropdown() {
    this.usersDropdownOpen = true;
  }

  // Close the assign-users autocomplete on any click outside it. Clicks inside
  // `.ab-users` call stopPropagation in the template, so they never reach here.
  @HostListener('document:click')
  onDocumentClick() {
    this.usersDropdownOpen = false;
  }

  // Close any open inline popovers when clicking elsewhere in the dialog.
  @HostListener('document:keydown.escape')
  onEscape() {
    this.countryOpen = false;
    this.customColorOpen = this.usersDropdownOpen = false;
  }
}
