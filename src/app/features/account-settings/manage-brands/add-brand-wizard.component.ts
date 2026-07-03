import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import {
  COUNTRIES, BRAND_USERS, CATEGORY_GROUPS, BRAND_COLORS, MANAGED_BRANDS, brandLogo, countryFlagUrl,
  BrandUser, BrandProduct, BrandCompetitor, CategoryGroupInfo, CategoryNode, ManagedBrand,
  flattenCategories,
} from './manage-brands-data';

type StepKey = 'identity' | 'logo' | 'products' | 'competitors' | 'categories' | 'tickets' | 'users';

interface WizardStep {
  key: StepKey;
  label: string;
  subtitle: string;
  /** Material Symbols Rounded glyph for the stepper node. */
  icon: string;
}

/** Full brand payload emitted when a brand is saved. */
export interface NewBrandPayload {
  name: string;
  aiFriendlyName: string;
  description: string;
  color: string;
  country: string;
  ticketsEnabled: boolean;
  categoryGroup: string;
  catchAll: string;
  users: { id: string; name: string; role: string }[];
  products: { name: string; synonyms: string[] }[];
  competitors: string[];
  logoUrl: string | null;
}

@Component({
  selector: 'app-add-brand-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatMenuModule],
  templateUrl: './add-brand-wizard.component.html',
  styleUrl: './add-brand-wizard.component.scss',
})
export class AddBrandWizardComponent {
  /** Emitted when the wizard should close (Cancel, or after a successful save). */
  @Output() closed = new EventEmitter<void>();
  /** Emitted with the full brand data when the user saves. */
  @Output() saved = new EventEmitter<NewBrandPayload>();

  // ---- wizard chrome -----------------------------------------------------
  currentStep = 1;

  /**
   * Does the current account plan include ticket creation (Digital Care)?
   * When false, the Tickets step is dropped and the wizard has one fewer step.
   */
  planHasTicketing = true;

  /**
   * Preview mode. An **existing** account has data (sample products, competitors,
   * other brands, users, category taxonomies); a **new** account starts blank, so the
   * wizard shows empty states throughout.
   */
  userMode: 'existing' | 'new' = 'existing';

  /** Celebration screen shown after Save. */
  celebrating = false;
  /** Pre-computed confetti pieces — CSS animates them, no JS loop. */
  readonly confetti = this.makeConfetti();

  /** All possible steps; the Tickets step is filtered out on plans without it. */
  private readonly allSteps: WizardStep[] = [
    { key: 'identity', label: 'Brand identity', subtitle: 'Basics & AI context', icon: 'badge' },
    { key: 'logo',     label: 'Logo & color',   subtitle: 'Visual identity',     icon: 'palette' },
    { key: 'products',    label: 'Products',    subtitle: 'What you offer',     icon: 'deployed_code' },
    { key: 'competitors', label: 'Competitors', subtitle: 'Market rivals',       icon: 'flag' },
    { key: 'categories',  label: 'Categories',  subtitle: 'Taxonomy mapping',    icon: 'sell' },
    { key: 'tickets',  label: 'Tickets',        subtitle: 'Ticket creation',     icon: 'confirmation_number' },
    { key: 'users',    label: 'Assign users',   subtitle: 'Brand access',        icon: 'group' },
  ];

  /**
   * The visible steps, numbered sequentially. The Tickets step is hidden on plans
   * without ticketing; the Categories step is skipped for a brand-new account
   * (its group is auto-set to Default), so it appears only for existing accounts.
   */
  get steps(): (WizardStep & { num: number })[] {
    return this.allSteps
      .filter(s => s.key !== 'tickets' || this.planHasTicketing)
      .filter(s => s.key !== 'categories' || this.userMode !== 'new')
      .map((s, i) => ({ ...s, num: i + 1 }));
  }
  get totalSteps(): number { return this.steps.length; }
  get currentKey(): StepKey { return this.steps[this.currentStep - 1]?.key ?? 'identity'; }
  isStep(key: StepKey): boolean { return this.currentKey === key; }

  // ---- reference data ----------------------------------------------------
  readonly countries = COUNTRIES;
  /** Users an existing account can assign; a new account has none yet. */
  get allUsers(): BrandUser[] { return this.userMode === 'new' ? [] : BRAND_USERS; }

  /** Existing account's taxonomies vs a new account's single blank Default group. */
  private readonly existingGroups: CategoryGroupInfo[] =
    CATEGORY_GROUPS.map(g => ({ ...g, tree: this.cloneNodes(g.tree) }));
  private readonly newGroups: CategoryGroupInfo[] = [
    { name: 'Default', description: 'Your starting taxonomy — add the categories you need.', brands: 0, tree: [] },
  ];
  get categoryGroups(): CategoryGroupInfo[] {
    return this.userMode === 'new' ? this.newGroups : this.existingGroups;
  }

  private cloneNodes(nodes: CategoryNode[]): CategoryNode[] {
    return nodes.map(n => ({ name: n.name, keywords: n.keywords, children: n.children ? this.cloneNodes(n.children) : undefined }));
  }
  readonly brandColors = BRAND_COLORS;

  // ---- step 1 · brand identity -------------------------------------------
  brandName = '';
  country = '';
  aiFriendlyName = '';            // recognised brand name (optional)
  showRecognisedName = false;     // revealed via the "Add recognised name" button
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
  // sample data for the brand-color chart preview
  readonly previewBars = [38, 60, 47, 72, 55, 88, 96];
  readonly previewDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  /** Points for the preview sparkline, mapped into a 100×40 viewBox. */
  private get previewPoints(): { x: number; y: number }[] {
    const w = 100, h = 40, pad = 4, max = 100, n = this.previewBars.length;
    return this.previewBars.map((v, i) => ({
      x: +(pad + (i * (w - 2 * pad)) / (n - 1)).toFixed(1),
      y: +(h - pad - (v / max) * (h - 2 * pad)).toFixed(1),
    }));
  }
  get previewLine(): string {
    return this.previewPoints.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');
  }
  get previewArea(): string {
    const pts = this.previewPoints;
    return `M${pts[0].x} 40 ` + pts.map(p => `L${p.x} ${p.y}`).join(' ') + ` L${pts[pts.length - 1].x} 40 Z`;
  }
  get previewLast(): { x: number; y: number } {
    const pts = this.previewPoints;
    return pts[pts.length - 1];
  }

  // ---- step 3 · team & tickets -------------------------------------------
  selectedUserIds = new Set<string>();
  usersDropdownOpen = false;
  userSearch = '';
  ticketsEnabled = this.planHasTicketing;   // off by default when the plan has no ticketing

  // ---- step 4 · categories -----------------------------------------------
  categoryGroup = '';                                 // selected group name (for payload/summary)
  selectedGroup: CategoryGroupInfo | null = null;     // selected group object
  catchAll = '';                                      // selected catch-all category name
  addingGroup = false;
  groupDraft = '';
  // catch-all dropdown
  catchAllOpen = false;
  catchAllSearch = '';
  // tree state
  expandedNodes = new Set<CategoryNode>();
  categorySearch = '';
  addCatParent: CategoryNode | null = null;           // node we're adding a child to (null = root)
  addingCatRoot = false;
  catDraft = '';

  // ---- step 5 · products & competitors -----------------------------------
  products: BrandProduct[] = [{ id: 'p1', name: 'Air Max', synonyms: ['AM', 'Air-Max'] }];
  competitors: BrandCompetitor[] = [{ id: 'c1', name: 'Adidas' }];
  useMappedCompetitors = false;
  mappedCompetitors: BrandCompetitor[] = [{ id: 'm1', name: 'Puma' }, { id: 'm2', name: 'Reebok' }];

  addingCompetitor = false;
  competitorDraft = '';
  editingCompetitorId: string | null = null;

  /** Named sets grouping selected competitors (e.g. "Direct rivals"). */
  competitorSets: { id: string; name: string; members: string[] }[] = [];
  buildingSet = false;
  setNameDraft = '';
  setMemberSel = new Set<string>();

  addingProduct = false;
  productDraftName = '';
  productDraftSynonyms = '';
  editingProductId: string | null = null;

  private seq = 100;

  /** Dialog title — names the brand only after step 1 is completed (past step 1). */
  get headingName(): string {
    const name = this.brandName.trim();
    return this.currentStep > 1 && name ? `Adding brand - ${name}` : 'Add Brand';
  }

  /** Dialog subtitle — names the brand once step 1 is done. */
  get headingSub(): string {
    const name = this.brandName.trim();
    return this.currentStep > 1 && name
      ? `Setting up ${name} for monitoring and analytics.`
      : 'Set up a new brand for monitoring and analytics.';
  }

  // =======================================================================
  //  Step navigation
  // =======================================================================
  /** Validate the visible step at 1-based index `step`. */
  isStepValid(step: number): boolean {
    return this.stepValid(this.steps[step - 1]?.key);
  }

  private stepValid(key: StepKey | undefined): boolean {
    switch (key) {
      case 'identity': {
        const n = this.brandName.trim().length;
        return n >= 3 && n <= 50 && !!this.country
          && !!this.brandDescription.trim() && this.brandDescription.length <= 200;
      }
      case 'logo': return !!this.logoDataUrl;
      case 'products': return true;                   // optional
      case 'competitors': return true;                // optional
      // new accounts skip this step — the Default group is assigned automatically
      case 'categories': return this.userMode === 'new' || (!!this.categoryGroup && !!this.catchAll);
      case 'tickets': return true;                    // toggle always valid
      case 'users': return this.selectedUserIds.size > 0 || this.allUsers.length === 0;
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

  /** Switch the description-authoring tab; the AI tab auto-generates on entry. */
  setDescMode(mode: 'manual' | 'ai') {
    this.descMode = mode;
    if (mode === 'ai' && !this.descGenerated && !this.generating && this.brandName.trim().length >= 3) {
      this.generateDescription();
    }
  }

  /** Reveal / clear the optional recognised-brand-name field. */
  addRecognisedName() { this.showRecognisedName = true; }
  removeRecognisedName() { this.showRecognisedName = false; this.aiFriendlyName = ''; }

  /** Generate the brand description — uses the recognised name if given, else the brand name. */
  generateDescription() {
    if (this.brandName.trim().length < 3 || this.generating) return;
    this.generating = true;
    const name = this.aiFriendlyName.trim() || this.brandName.trim();
    setTimeout(() => {
      this.brandDescription =
        `${name} designs, develops, and markets athletic footwear, apparel, and accessories globally.`
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
    if (!q) return this.allUsers;
    return this.allUsers.filter(u =>
      u.fullName.toLowerCase().includes(q) || u.name.toLowerCase().includes(q)
      || u.role.toLowerCase().includes(q) || u.team.toLowerCase().includes(q));
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
    const parts = u.fullName.trim().split(/\s+/).filter(Boolean);
    const src = parts.length >= 2 ? parts[0][0] + parts[1][0] : (parts[0] ?? u.name);
    return src.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase();
  }

  // =======================================================================
  //  Step 4 · categories
  // =======================================================================
  readonly brandLogo = brandLogo;
  readonly countryFlagUrl = countryFlagUrl;
  /** Existing brands + their colours for the "other brand colors" menu (none for a new account). */
  get otherBrands(): ManagedBrand[] { return this.userMode === 'new' ? [] : MANAGED_BRANDS; }

  /** Existing brands grouped by their category group — shown on each group card. */
  private readonly brandsByGroup: Record<string, ManagedBrand[]> =
    MANAGED_BRANDS.reduce((map, b) => {
      const key = b.categoryGroup ?? '';
      (map[key] ??= []).push(b);
      return map;
    }, {} as Record<string, ManagedBrand[]>);

  groupBrands(name: string): ManagedBrand[] {
    return this.userMode === 'new' ? [] : (this.brandsByGroup[name] ?? []);
  }

  /** "Amazon, Nike +2" — a few names plus an overflow count. */
  groupBrandsLabel(name: string): string {
    const brands = this.groupBrands(name);
    const shown = brands.slice(0, 2).map(b => b.name).join(', ');
    const extra = brands.length - 2;
    return extra > 0 ? `${shown} +${extra}` : shown;
  }

  /** Total categories (all levels) in a group — shown on the group card. */
  catCount(g: CategoryGroupInfo): number {
    return flattenCategories(g.tree).length;
  }

  /** Flat list of every category in the selected group (catch-all candidates). */
  get catchAllOptions(): CategoryNode[] {
    return this.selectedGroup ? flattenCategories(this.selectedGroup.tree) : [];
  }
  get filteredCatchAll(): CategoryNode[] {
    const q = this.catchAllSearch.trim().toLowerCase();
    return q ? this.catchAllOptions.filter(c => c.name.toLowerCase().includes(q)) : this.catchAllOptions;
  }

  selectGroup(g: CategoryGroupInfo) {
    if (this.selectedGroup === g) return;
    this.selectedGroup = g;
    this.categoryGroup = g.name;
    this.catchAll = '';                 // catch-all belongs to the group
    this.catchAllOpen = false;
    this.categorySearch = '';
    this.cancelAddCat();
    // expand every parent node by default so the tree reads like the real page
    this.expandedNodes = new Set(flattenCategories(g.tree).filter(n => n.children?.length));
  }

  selectCatchAll(name: string) {
    this.catchAll = name;
    this.catchAllOpen = false;
    this.catchAllSearch = '';
  }

  // ---- category tree ----
  isExpanded(n: CategoryNode): boolean { return this.expandedNodes.has(n); }
  toggleNode(n: CategoryNode) {
    this.expandedNodes.has(n) ? this.expandedNodes.delete(n) : this.expandedNodes.add(n);
  }

  /** Tree filtered by the search box (keeps a node if it or a descendant matches). */
  get displayTree(): CategoryNode[] {
    const q = this.categorySearch.trim().toLowerCase();
    if (!q || !this.selectedGroup) return this.selectedGroup?.tree ?? [];
    const filter = (nodes: CategoryNode[]): CategoryNode[] =>
      nodes.reduce<CategoryNode[]>((acc, n) => {
        const kids = n.children ? filter(n.children) : [];
        if (n.name.toLowerCase().includes(q) || kids.length) {
          acc.push({ ...n, children: kids.length ? kids : n.children });
        }
        return acc;
      }, []);
    return filter(this.selectedGroup.tree);
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
      brands: 0, tree: [],
    };
    this.categoryGroups.push(g);
    this.selectGroup(g);
    this.cancelAddGroup();
  }

  // ---- inline create: category node (top-level or child) ----
  startAddRootCat() { this.addingCatRoot = true; this.addCatParent = null; this.catDraft = ''; }
  startAddChildCat(parent: CategoryNode) {
    this.addingCatRoot = false;
    this.addCatParent = parent;
    this.catDraft = '';
    this.expandedNodes.add(parent);
  }
  cancelAddCat() { this.addingCatRoot = false; this.addCatParent = null; this.catDraft = ''; }
  saveCat() {
    if (!this.selectedGroup) return;
    const name = this.catDraft.trim();
    if (name.length < 2 || name.length > 50) return;
    const node: CategoryNode = { name, keywords: 0 };
    if (this.addCatParent) {
      this.addCatParent.children = [...(this.addCatParent.children ?? []), node];
      this.expandedNodes.add(this.addCatParent);
    } else {
      this.selectedGroup.tree = [...this.selectedGroup.tree, node];
    }
    this.cancelAddCat();
  }

  // ---- AI category suggestions ----
  suggestingCats = false;

  /** A sensible starter taxonomy the AI "proposes" (keywords filled in later). */
  private buildSuggestedTree(): CategoryNode[] {
    return [
      { name: 'Complaint', keywords: 0, children: [
        { name: 'Product Issue', keywords: 0 },
        { name: 'Service Issue', keywords: 0 },
        { name: 'Delivery', keywords: 0 },
      ] },
      { name: 'Query', keywords: 0, children: [
        { name: 'Product Query', keywords: 0 },
        { name: 'Pricing', keywords: 0 },
      ] },
      { name: 'Feedback', keywords: 0, children: [
        { name: 'Praise', keywords: 0 },
        { name: 'Suggestion', keywords: 0 },
      ] },
      { name: 'General', keywords: 0 },
    ];
  }

  /** Ask the AI to suggest a starter set of categories, then add the new ones. */
  suggestCategories() {
    if (!this.selectedGroup || this.suggestingCats) return;
    this.suggestingCats = true;
    setTimeout(() => {
      const group = this.selectedGroup;
      if (group) {
        const existing = new Set(flattenCategories(group.tree).map(n => n.name.toLowerCase()));
        const fresh = this.buildSuggestedTree().filter(n => !existing.has(n.name.toLowerCase()));
        group.tree = [...group.tree, ...fresh];
        // expand the newly added parents so the suggestions are visible
        fresh.forEach(n => { if (n.children?.length) this.expandedNodes.add(n); });
        // help the user along: default the catch-all to "General" if none chosen
        if (!this.catchAll && flattenCategories(group.tree).some(n => n.name === 'General')) {
          this.catchAll = 'General';
        }
      }
      this.suggestingCats = false;
    }, 1400);
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
    // keep sets in sync if a member was removed
    this.competitorSets.forEach(s => (s.members = s.members.filter(m => m !== c.name)));
    this.competitorSets = this.competitorSets.filter(s => s.members.length);
  }

  // ---- competitor sets ----
  /** All competitor names currently available to group into a set. */
  get allCompetitorNames(): string[] {
    return [
      ...(this.useMappedCompetitors ? this.mappedCompetitors : []),
      ...this.competitors,
    ].map(c => c.name);
  }

  startSet() {
    this.buildingSet = true;
    this.setNameDraft = '';
    this.setMemberSel.clear();
    this.addingCompetitor = false;
  }
  cancelSet() {
    this.buildingSet = false;
    this.setNameDraft = '';
    this.setMemberSel.clear();
  }
  toggleSetMember(name: string) {
    this.setMemberSel.has(name) ? this.setMemberSel.delete(name) : this.setMemberSel.add(name);
  }
  saveSet() {
    const name = this.setNameDraft.trim();
    if (name.length < 2 || !this.setMemberSel.size) return;
    this.competitorSets.push({ id: `s${this.seq++}`, name, members: [...this.setMemberSel] });
    this.cancelSet();
  }
  removeSet(id: string) {
    this.competitorSets = this.competitorSets.filter(s => s.id !== id);
  }

  // =======================================================================
  //  Save / cancel
  // =======================================================================
  /** Every required step must pass before the brand can be saved. */
  get canSubmit(): boolean {
    return this.stepValid('identity') && this.stepValid('logo')
      && this.stepValid('categories') && this.stepValid('users');
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

  /** Commit the current brand (with everything captured) to the list. */
  private emitCurrentBrand() {
    this.saved.emit({
      name: this.brandName.trim(),
      aiFriendlyName: this.aiFriendlyName.trim(),
      description: this.brandDescription.trim(),
      color: this.color,
      country: this.country,
      ticketsEnabled: this.ticketsEnabled,
      categoryGroup: this.categoryGroup,
      catchAll: this.catchAll,
      users: this.selectedUsers.map(u => ({ id: u.id, name: u.fullName, role: u.role })),
      products: this.products.map(p => ({ name: p.name, synonyms: [...p.synonyms] })),
      competitors: [
        ...(this.useMappedCompetitors ? this.mappedCompetitors : []),
        ...this.competitors,
      ].map(c => c.name),
      logoUrl: this.logoDataUrl,
    });
  }

  /** Save this brand and close the dialog. */
  complete() {
    this.emitCurrentBrand();
    this.close();
  }

  /** Save this brand and reset the wizard to add another one. */
  addAnother() {
    this.emitCurrentBrand();
    this.resetForNewBrand();
  }

  /** Wipe all step state so the wizard starts fresh for a new brand. */
  /** Switch between the "existing account" (with data) and "new account" (blank) preview. */
  setUserMode(mode: 'existing' | 'new') {
    if (this.userMode === mode) return;
    this.userMode = mode;

    // sample vs blank product/competitor data
    if (mode === 'new') {
      this.products = [];
      this.competitors = [];
      this.mappedCompetitors = [];
      this.useMappedCompetitors = false;
    } else {
      this.products = [{ id: 'p1', name: 'Air Max', synonyms: ['AM', 'Air-Max'] }];
      this.competitors = [{ id: 'c1', name: 'Adidas' }];
      this.mappedCompetitors = [{ id: 'm1', name: 'Puma' }, { id: 'm2', name: 'Reebok' }];
    }
    this.competitorSets = [];
    this.cancelProduct();
    this.cancelCompetitor();
    this.cancelSet();

    // category selection depends on the (now different) group list.
    // a new account skips the Categories step, so auto-assign the Default group.
    this.selectedGroup = mode === 'new' ? this.newGroups[0] : null;
    this.categoryGroup = mode === 'new' ? 'Default' : '';
    this.catchAll = '';
    this.expandedNodes = new Set<CategoryNode>();
    this.suggestingCats = false;
    this.cancelAddGroup();
    this.cancelAddCat();

    // assigned users
    this.selectedUserIds = new Set<string>();
    this.usersDropdownOpen = false;
    this.userSearch = '';

    // the step list changed length — keep the current step in range
    if (this.currentStep > this.totalSteps) this.currentStep = this.totalSteps;
  }

  private resetForNewBrand() {
    this.celebrating = false;
    this.currentStep = 1;
    // step 1
    this.brandName = '';
    this.country = '';
    this.aiFriendlyName = '';
    this.showRecognisedName = false;
    this.brandDescription = '';
    this.descMode = 'manual';
    this.aiNameLoading = this.aiNameAttempted = this.generating = this.descGenerated = false;
    this.aiNameError = '';
    this.countryOpen = false;
    this.countrySearch = '';
    // step 2
    this.logoDataUrl = null;
    this.color = '#0f172a';
    this.customColorOpen = false;
    // step 3
    this.products = [];
    this.competitors = [];
    this.useMappedCompetitors = false;
    this.competitorSets = [];
    this.cancelProduct();
    this.cancelCompetitor();
    this.cancelSet();
    // step 4
    this.selectedGroup = null;
    this.categoryGroup = '';
    this.catchAll = '';
    this.catchAllOpen = false;
    this.categorySearch = '';
    this.expandedNodes = new Set<CategoryNode>();
    this.suggestingCats = false;
    this.cancelAddGroup();
    this.cancelAddCat();
    // step 5 / 6
    this.ticketsEnabled = this.planHasTicketing;
    this.selectedUserIds = new Set<string>();
    this.userSearch = '';
    this.usersDropdownOpen = false;
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
