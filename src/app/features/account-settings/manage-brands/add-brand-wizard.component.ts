import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  COUNTRIES, BRAND_USERS, CATEGORY_GROUPS, CATCH_ALL_CATEGORIES, BRAND_COLORS,
  BrandUser, BrandProduct, BrandCompetitor,
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
  readonly totalSteps = 5;

  /** Celebration screen shown after Save. */
  celebrating = false;
  private completedOnce = false;
  /** Pre-computed confetti pieces — CSS animates them, no JS loop. */
  readonly confetti = this.makeConfetti();
  readonly steps: WizardStep[] = [
    { num: 1, label: 'Brand identity',        subtitle: 'Basics and AI context', icon: 'badge' },
    { num: 2, label: 'Logo & color',          subtitle: 'Visual identity',       icon: 'palette' },
    { num: 3, label: 'Team & tickets',        subtitle: 'Access and behavior',   icon: 'group' },
    { num: 4, label: 'Categories',            subtitle: 'Taxonomy mapping',      icon: 'sell' },
    { num: 5, label: 'Products & Competitors', subtitle: 'Market context',       icon: 'deployed_code' },
  ];

  // ---- reference data ----------------------------------------------------
  readonly countries = COUNTRIES;
  readonly allUsers = BRAND_USERS;
  readonly categoryGroups = CATEGORY_GROUPS;
  readonly catchAllCategories = CATCH_ALL_CATEGORIES;
  readonly brandColors = BRAND_COLORS;

  // ---- step 1 · brand identity -------------------------------------------
  brandName = '';
  country = '';
  aiFriendlyName = '';
  brandDescription = '';
  descriptionDisabled = true;
  generating = false;
  countryOpen = false;
  countrySearch = '';

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
  categoryGroup = '';
  catchAll = '';
  catchAllOpen = false;
  catchAllSearch = '';
  groupOpen = false;
  groupSearch = '';

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

  // =======================================================================
  //  Step navigation
  // =======================================================================
  isStepValid(step: number): boolean {
    switch (step) {
      case 1: {
        const n = this.brandName.trim().length;
        return n >= 3 && n <= 50 && !!this.country && !!this.aiFriendlyName.trim()
          && !!this.brandDescription.trim() && this.brandDescription.length <= 200;
      }
      case 2: return !!this.logoDataUrl;
      case 3: return this.selectedUserIds.size > 0;
      case 4: return !!this.categoryGroup && !!this.catchAll;
      case 5: return true;
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

  generateDescription() {
    if (!this.aiFriendlyName.trim() || this.generating) return;
    this.generating = true;
    // Simulate the AI round-trip.
    setTimeout(() => {
      const name = this.aiFriendlyName.trim();
      this.brandDescription =
        `${name} designs, develops, and markets athletic footwear, apparel, and accessories globally.`
          .slice(0, 200);
      this.descriptionDisabled = false;
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
  get filteredGroups(): string[] {
    const q = this.groupSearch.trim().toLowerCase();
    return q ? this.categoryGroups.filter(c => c.toLowerCase().includes(q)) : this.categoryGroups;
  }

  get filteredCatchAll(): string[] {
    const q = this.catchAllSearch.trim().toLowerCase();
    return q ? this.catchAllCategories.filter(c => c.toLowerCase().includes(q)) : this.catchAllCategories;
  }

  selectGroup(g: string) {
    this.categoryGroup = g;
    this.groupOpen = false;
    this.groupSearch = '';
  }

  selectCatchAll(c: string) {
    this.catchAll = c;
    this.catchAllOpen = false;
    this.catchAllSearch = '';
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

  removeCompetitor(c: BrandCompetitor) {
    this.competitors = this.competitors.filter(x => x.id !== c.id);
  }

  // =======================================================================
  //  Save / cancel
  // =======================================================================
  onSubmit() {
    if (!this.isStepValid(1) || !this.isStepValid(2) || !this.isStepValid(3) || !this.isStepValid(4)) return;
    // Show the celebration, then auto-complete; user can also click Done.
    this.celebrating = true;
    setTimeout(() => this.complete(), 3600);
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

  // Close any open inline popovers when clicking elsewhere in the dialog.
  @HostListener('document:keydown.escape')
  onEscape() {
    this.countryOpen = this.catchAllOpen = this.groupOpen = false;
    this.customColorOpen = this.usersDropdownOpen = false;
  }
}
