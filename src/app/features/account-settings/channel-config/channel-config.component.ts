import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CHANNEL_GROUPS, FACEBOOK_PROFILES, BRAND_ICONS, Channel, ChannelGroup, ChannelProfile, mentionTypeIcon } from '../channel-data';
import { AddChannelWizardComponent } from './add-channel-wizard.component';
import { PaginationBarComponent } from '../../../shared/pagination-bar/pagination-bar.component';

/** A single custom-view filter condition. */
export interface ViewCondition {
  field: string;                 // Profile | Account Type | Status | Mentions Collected
  operator: 'In' | 'Not In';
  text: string;                  // free-text value (Profile)
  values: string[];              // multi-select values (fixed-value fields)
}

export interface SavedView {
  id: string;
  label: string;
  filter: ViewCondition;
}

@Component({
  selector: 'app-channel-config',
  standalone: true,
  imports: [CommonModule, FormsModule, AddChannelWizardComponent, PaginationBarComponent],
  templateUrl: './channel-config.component.html',
  styleUrl: './channel-config.component.scss',
})
export class ChannelConfigComponent {
  groups = CHANNEL_GROUPS;
  profiles = FACEBOOK_PROFILES;
  expanded: Record<string, boolean> = { 'SOCIAL MEDIA': true };

  mentionIcon = mentionTypeIcon;

  /** The channel whose profiles are shown — drives the panel title + brand theming. */
  activeChannel: Channel = CHANNEL_GROUPS[0].channels![0]; // Facebook

  /** Switch the profiles panel to another channel (resets transient view state). */
  selectChannel(c: Channel) {
    if (c === this.activeChannel) return;
    this.activeChannel = c;
    this.clearSelection();
    this.closeDetail();
    this.activeViewId = 'all';
    this.page = 1;
  }

  /** Light tint of a brand colour for soft backgrounds. */
  tintColor(color: string = this.activeChannel.color): string { return color + '1a'; }

  /** Real brand-logo SVG path for a channel id (null → fall back to a Material icon). */
  brandSvg(id: string | undefined): string | null {
    return id ? (BRAND_ICONS[id] ?? null) : null;
  }

  /** Card colour theme — both share the same layout. */
  cardStyle: 'classic' | 'vibrant' = 'classic';

  /** Profiles view — 'card' grid or 'list' data-grid (table). */
  viewMode: 'card' | 'list' = 'list';

  /** Selected rows (by profile name) in list view. */
  selected = new Set<string>();

  /** Right-side detail drawer (null = closed). */
  detail: ChannelProfile | null = null;

  /** Add-channel wizard modal. */
  wizardOpen = false;

  toggle(g: ChannelGroup) {
    this.expanded[g.label] = !this.expanded[g.label];
  }

  /* ===================================================================
     Custom views — filter builder behind the "+" tab
     =================================================================== */
  activeViewId = 'all';
  savedViews: SavedView[] = [];
  viewBuilderOpen = false;
  valueDropdownOpen = false;
  private viewSeq = 0;

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
  private sortVal(p: ChannelProfile, key: string): string | number {
    switch (key) {
      case 'profile': return p.name.toLowerCase();
      case 'mentions': return p.mentionTypes.length;
      case 'status': return p.alert ? 1 : 0;
      default: return 0;
    }
  }

  readonly fieldOptions = ['Profile', 'Account Type', 'Status', 'Mentions Collected'];
  readonly operatorOptions: ViewCondition['operator'][] = ['In', 'Not In'];

  draft: ViewCondition = { field: 'Account Type', operator: 'In', text: '', values: [] };

  /** Value choices for a fixed-value field (empty => free-text field). */
  valueOptions(field: string): string[] {
    switch (field) {
      case 'Account Type': return ['Owned', 'Public'];
      case 'Status': return ['Active', 'Token Expired'];
      case 'Mentions Collected':
        return ['User Comments', 'Messages', 'User Posts', 'Visitor Posts', 'Mentions', 'Reviews', 'Ratings', 'Recommendations'];
      default: return [];
    }
  }
  isTextField(field: string): boolean {
    return this.valueOptions(field).length === 0;
  }

  openViewBuilder() {
    this.draft = { field: 'Account Type', operator: 'In', text: '', values: [] };
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

  /* ---- pagination ---- */
  page = 1;
  pageSize = 10;
  setView(id: string) { this.activeViewId = id; this.page = 1; }

  /** Profiles after the active view's filter + column sort are applied (all pages). */
  get filteredProfiles(): ChannelProfile[] {
    const v = this.savedViews.find(s => s.id === this.activeViewId);
    let rows = v ? this.profiles.filter(p => this.matchesCondition(p, v.filter)) : [...this.profiles];
    if (this.sortKey) {
      const k = this.sortKey, dir = this.sortDir;
      rows = rows.sort((a, b) => {
        const av = this.sortVal(a, k), bv = this.sortVal(b, k);
        return av < bv ? -dir : av > bv ? dir : 0;
      });
    }
    return rows;
  }
  get totalProfiles(): number { return this.filteredProfiles.length; }
  /** Just the current page's rows (what the table/grid renders). */
  get displayProfiles(): ChannelProfile[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredProfiles.slice(start, start + this.pageSize);
  }
  private matchesCondition(p: ChannelProfile, f: ViewCondition): boolean {
    const inList = (val: string) => f.values.some(x => x.toLowerCase() === val.toLowerCase());
    let ok = false;
    switch (f.field) {
      case 'Profile': {
        const t = f.text.trim().toLowerCase();
        ok = t ? p.name.toLowerCase().includes(t) : true;
        break;
      }
      case 'Account Type': ok = inList(p.status); break;
      case 'Status': ok = inList(p.alert ? 'Token Expired' : 'Active'); break;
      case 'Mentions Collected': ok = p.mentionTypes.some(m => inList(m)); break;
    }
    return f.operator === 'Not In' ? !ok : ok;
  }

  /* ---- list-view selection (scoped to what's shown) ---- */
  get allSelected(): boolean {
    const rows = this.displayProfiles;
    return rows.length > 0 && rows.every(p => this.selected.has(p.name));
  }
  toggleRow(name: string) {
    this.selected.has(name) ? this.selected.delete(name) : this.selected.add(name);
  }
  toggleAll() {
    const rows = this.displayProfiles;
    this.allSelected ? rows.forEach(p => this.selected.delete(p.name)) : rows.forEach(p => this.selected.add(p.name));
  }
  clearSelection() {
    this.selected.clear();
  }

  /* ---- detail drawer ---- */
  openDetail(p: ChannelProfile) {
    this.detail = p;
  }
  closeDetail() {
    this.detail = null;
  }

  /** "Jun 11, 2026 11:57 AM" -> "11 Jun, 2026" */
  shortDate(s: string): string {
    const m = s.match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})/);
    return m ? `${parseInt(m[2], 10)} ${m[1]}, ${m[3]}` : s;
  }
}
