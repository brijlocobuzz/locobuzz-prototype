import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MANAGED_BRANDS, brandLogo, ManagedBrand, BrandMember, BRAND_USERS } from './manage-brands-data';
import { BRAND_ICONS } from '../channel-data';
import { AddBrandWizardComponent, NewBrandPayload } from './add-brand-wizard.component';
import { PaginationBarComponent } from '../../../shared/pagination-bar/pagination-bar.component';

/** A single custom-view filter condition (same model as Channel Config). */
export interface ViewCondition {
  field: string;                 // Brand | Country | Tickets
  operator: 'In' | 'Not In';
  text: string;                  // free-text value (Brand)
  values: string[];              // multi-select values (fixed-value fields)
}
export interface SavedView { id: string; label: string; filter: ViewCondition; }

/** A pending confirmation prompt shown over the grid. */
export interface ConfirmPrompt {
  title: string;
  message: string;
  confirmLabel: string;
  danger: boolean;
  action: () => void;
}

@Component({
  selector: 'app-manage-brands',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTooltipModule, AddBrandWizardComponent, PaginationBarComponent],
  templateUrl: './manage-brands.component.html',
  styleUrl: './manage-brands.component.scss',
})
export class ManageBrandsComponent {
  readonly brandLogo = brandLogo;
  brands: ManagedBrand[] = [...MANAGED_BRANDS];

  /** Explainer shown on hovering the Tickets-creation info icon. */
  readonly ticketsTip =
    'Ticket creation decides whether incoming mentions become actionable tickets.\n\n'
    + 'On — qualifying mentions create tickets your team can action.\n'
    + 'Off — mentions are captured for listening & analytics only; no tickets are created.';

  search = '';
  wizardOpen = false;

  /** Listing view — 'card' grid or 'list' data-grid (table). */
  viewMode: 'card' | 'list' = 'list';

  /** Selected rows (by brand id) in list view. */
  selected = new Set<string>();

  /** Right-side detail drawer (null = closed). */
  detail: ManagedBrand | null = null;

  constructor(private router: Router) {}

  back() {
    this.router.navigate(['/account-settings']);
  }

  /** Real brand-logo SVG path for a channel id (null → none). */
  brandSvg(id: string): string | null { return BRAND_ICONS[id] ?? null; }

  /** Brand colour per channel — same palette as Channel Configuration tiles. */
  private readonly channelColors: Record<string, string> = {
    facebook: '#1877f2', instagram: '#e1306c', twitter: '#000000', youtube: '#ff0000',
    linkedin: '#0a66c2', tiktok: '#010101', whatsapp: '#25d366', telegram: '#229ed9',
    fbgroups: '#1877f2', playstore: '#00c4b3', appstore: '#0d96f6', gmb: '#4285f4',
    tripadvisor: '#00af87', reddit: '#ff4500', email: '#ea4335',
  };
  channelColor(id: string): string { return this.channelColors[id] ?? '#64748b'; }

  /** Two-letter initials for a user avatar. */
  userInitials(u: BrandMember): string {
    return u.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase();
  }

  /** How many user avatars / channel logos to show inline before the "+N" chip. */
  readonly maxUsers = 6;
  readonly maxChannels = 6;

  private readonly usersPool: BrandMember[] = BRAND_USERS.map(u => ({ id: u.id, name: u.name, role: u.role }));

  /** Avatars for the grid — the brand's preview users padded from the pool up to maxUsers. */
  userAvatars(b: ManagedBrand): BrandMember[] {
    const shown = [...(b.userPreview || [])];
    const target = Math.min(this.maxUsers, b.users);
    for (const p of this.usersPool) {
      if (shown.length >= target) break;
      if (!shown.some(s => s.id === p.id)) shown.push(p);
    }
    return shown.slice(0, target);
  }

  channelLogos(b: ManagedBrand): string[] {
    return (b.channelIds || []).slice(0, this.maxChannels);
  }

  /* ===================================================================
     Confirmation prompts for destructive / stateful grid actions
     =================================================================== */
  confirm: ConfirmPrompt | null = null;

  private ask(p: ConfirmPrompt) { this.confirm = p; }
  onConfirm() { this.confirm?.action(); this.confirm = null; }
  onCancelConfirm() { this.confirm = null; }

  /** Ask before flipping ticket creation for a brand. */
  requestToggleTickets(b: ManagedBrand, ev: Event) {
    ev.stopPropagation();
    const next = !b.ticketsEnabled;
    this.ask({
      title: next ? 'Enable ticket creation?' : 'Disable ticket creation?',
      message: next
        ? `Mentions for “${b.name}” will start creating actionable tickets for your team.`
        : `Mentions for “${b.name}” will no longer create tickets — they'll be captured for listening & analytics only.`,
      confirmLabel: next ? 'Enable' : 'Disable',
      danger: !next,
      action: () => (b.ticketsEnabled = next),
    });
  }

  /** Ask before deleting a brand. */
  requestDelete(b: ManagedBrand, ev: Event) {
    ev.stopPropagation();
    this.ask({
      title: 'Delete brand?',
      message: `“${b.name}” and its configuration will be permanently removed. This action can't be undone.`,
      confirmLabel: 'Delete',
      danger: true,
      action: () => this.deleteBrand(b),
    });
  }

  private deleteBrand(b: ManagedBrand) {
    this.brands = this.brands.filter(x => x.id !== b.id);
    this.selected.delete(b.id);
    if (this.detail?.id === b.id) this.detail = null;
  }

  /** Ask before deleting the current selection (bulk). */
  requestBulkDelete() {
    const n = this.selected.size;
    if (!n) return;
    this.ask({
      title: `Delete ${n} brand${n === 1 ? '' : 's'}?`,
      message: `The selected brand${n === 1 ? '' : 's'} and their configuration will be permanently removed. This action can't be undone.`,
      confirmLabel: 'Delete',
      danger: true,
      action: () => {
        this.brands = this.brands.filter(x => !this.selected.has(x.id));
        this.selected.clear();
      },
    });
  }

  /* ===================================================================
     Custom views — filter builder behind the "+" tab
     =================================================================== */
  activeViewId = 'all';
  savedViews: SavedView[] = [];
  viewBuilderOpen = false;
  valueDropdownOpen = false;
  private viewSeq = 0;

  readonly fieldOptions = ['Brand', 'Country', 'Tickets'];
  readonly operatorOptions: ViewCondition['operator'][] = ['In', 'Not In'];
  draft: ViewCondition = { field: 'Country', operator: 'In', text: '', values: [] };

  valueOptions(field: string): string[] {
    switch (field) {
      case 'Country': return Array.from(new Set(this.brands.map(b => b.country))).sort();
      case 'Tickets': return ['On', 'Off'];
      default: return [];
    }
  }
  isTextField(field: string): boolean {
    return this.valueOptions(field).length === 0;
  }

  openViewBuilder() {
    this.draft = { field: 'Country', operator: 'In', text: '', values: [] };
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
  private sortVal(b: ManagedBrand, key: string): string | number {
    switch (key) {
      case 'brand': return b.name.toLowerCase();
      case 'country': return b.country.toLowerCase();
      case 'users': return b.users;
      case 'channels': return b.channels;
      case 'tickets': return b.ticketsEnabled ? 1 : 0;
      default: return 0;
    }
  }

  /* ---- pagination ---- */
  page = 1;
  pageSize = 10;
  onSearch(q: string) { this.search = q; this.page = 1; }
  setView(id: string) { this.activeViewId = id; this.page = 1; }

  /** Brands after search + active view filter + column sort (all pages). */
  get filteredBrands(): ManagedBrand[] {
    const q = this.search.trim().toLowerCase();
    let rows = this.brands.filter(b =>
      !q || b.name.toLowerCase().includes(q) || b.country.toLowerCase().includes(q));

    const v = this.savedViews.find(s => s.id === this.activeViewId);
    if (v) rows = rows.filter(b => this.matchesCondition(b, v.filter));

    if (this.sortKey) {
      const k = this.sortKey, dir = this.sortDir;
      rows = [...rows].sort((a, b) => {
        const av = this.sortVal(a, k), bv = this.sortVal(b, k);
        return av < bv ? -dir : av > bv ? dir : 0;
      });
    }
    return rows;
  }
  get totalBrands(): number { return this.filteredBrands.length; }
  /** Just the current page's rows (what the table/grid renders). */
  get displayBrands(): ManagedBrand[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredBrands.slice(start, start + this.pageSize);
  }
  private matchesCondition(b: ManagedBrand, f: ViewCondition): boolean {
    const inList = (val: string) => f.values.some(x => x.toLowerCase() === val.toLowerCase());
    let ok = false;
    switch (f.field) {
      case 'Brand': {
        const t = f.text.trim().toLowerCase();
        ok = t ? b.name.toLowerCase().includes(t) : true;
        break;
      }
      case 'Country': ok = inList(b.country); break;
      case 'Tickets': ok = inList(b.ticketsEnabled ? 'On' : 'Off'); break;
    }
    return f.operator === 'Not In' ? !ok : ok;
  }

  /* ---- list-view selection (scoped to what's shown) ---- */
  get allSelected(): boolean {
    const rows = this.displayBrands;
    return rows.length > 0 && rows.every(b => this.selected.has(b.id));
  }
  toggleRow(id: string) {
    this.selected.has(id) ? this.selected.delete(id) : this.selected.add(id);
  }
  toggleAll() {
    const rows = this.displayBrands;
    this.allSelected ? rows.forEach(b => this.selected.delete(b.id)) : rows.forEach(b => this.selected.add(b.id));
  }
  clearSelection() {
    this.selected.clear();
  }

  /* ---- detail drawer ---- */
  openDetail(b: ManagedBrand) {
    this.detail = b;
  }
  closeDetail() {
    this.detail = null;
  }

  onBrandSaved(b: NewBrandPayload) {
    const slug = b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    this.brands = [
      {
        id: `${slug || 'brand'}-${this.brands.length}`,
        name: b.name,
        domain: `${b.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        color: b.color,
        country: b.country,
        users: b.users.length,
        channels: 0,
        ticketsEnabled: b.ticketsEnabled,
        logoUrl: b.logoUrl ?? undefined,
        aiFriendlyName: b.aiFriendlyName,
        description: b.description,
        userPreview: b.users,
        channelIds: [],
        categoryGroup: b.categoryGroup,
        catchAll: b.catchAll,
        products: b.products,
        competitors: b.competitors,
      },
      ...this.brands,
    ];
    // jump to the first page so the newly added brand is visible
    this.page = 1;
    this.search = '';
    this.activeViewId = 'all';
  }
}
