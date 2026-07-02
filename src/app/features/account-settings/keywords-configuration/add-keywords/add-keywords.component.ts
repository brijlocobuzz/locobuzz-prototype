import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LISTENER_CHANNELS, FB_VAULTS, COUNTRY_POOL, LANGUAGE_POOL, ListenerChannel,
} from './listener-channels';

/** Light summary emitted to the listing when the listener is launched. */
export interface NewQueryPayload {
  name: string;
  terms: string[];
  connector: 'AND' | 'OR';
  channels: string[];
  createdOn: string;
  historicSince?: number;   // days of historic back-fill (omitted for real-time only)
}

interface WizardStep { n: number; label: string; icon: string; subtitle: string; }
interface HistoricPreset { key: string; label: string; days: number; cost: number; }

@Component({
  selector: 'app-add-keywords',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-keywords.component.html',
  styleUrl: './add-keywords.component.scss',
})
export class AddKeywordsComponent {
  /** Brand this listener belongs to — shown in the header. */
  @Input() brand = '';

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<NewQueryPayload>();

  readonly channels = LISTENER_CHANNELS;
  readonly fbVaults = FB_VAULTS;
  readonly countryPool = COUNTRY_POOL;
  readonly languagePool = LANGUAGE_POOL;

  readonly MAX_QUERY = 2000;
  readonly NAME_MAX = 30;
  readonly AVAILABLE_CREDITS = 12500;

  readonly historicPresets: HistoricPreset[] = [
    { key: 'today', label: 'Today', days: 1, cost: 40 },
    { key: '7d', label: 'Last 7 days', days: 7, cost: 240 },
    { key: '30d', label: 'Last 30 days', days: 30, cost: 900 },
    { key: '90d', label: 'Last 90 days', days: 90, cost: 2400 },
    { key: '180d', label: 'Last 180 days', days: 180, cost: 4200 },
    { key: 'custom', label: 'Custom range', days: 0, cost: 0 },
  ];

  /** Deterministic sparkline shape for the "estimated reach" chart. */
  readonly bars = [26, 30, 28, 40, 44, 42, 56, 66, 62, 80, 90, 100];

  // ---- header toggles ----------------------------------------------------
  // Kept for the (commented-out) top-right Real-Time/Historic toggle — the mode
  // is now chosen inside Step 1 via `realtimeOn` / `historicOn`.
  mode: 'realtime' | 'historic' = 'realtime';
  view: 'wizard' | 'edit' = 'wizard';

  /** Listening type — chosen in Step 1; either or both can be on. */
  realtimeOn = true;
  historicOn = false;
  readonly listenModes = [
    {
      key: 'realtime', label: 'Real-Time', icon: 'sensors', color: '#16a34a',
      desc: 'Capture mentions the moment they are posted — continuously, going forward.',
    },
    {
      key: 'historic', label: 'Historic', icon: 'history', color: '#7c3aed',
      desc: 'Back-fill past mentions over a time window you choose. Uses credits.',
    },
  ];

  // ---- wizard state ------------------------------------------------------
  step = 1;

  name = '';
  channelSearch = '';
  selected = new Set<string>(['twitter']);
  /** channelId → set of enabled inner options (retweets/replies/comments). */
  inner: Record<string, Set<string>> = { twitter: new Set(['retweets']) };
  fbVault = FB_VAULTS[0];

  // query builder — seeded so the preview reads well immediately
  matchAny: string[] = ['nike', 'adidas'];
  matchAll: string[] = ['running'];
  /** Joiner used inside the "match all" box. */
  allOp: 'AND' | 'OR' = 'AND';
  exclude: string[] = ['jobs', 'hiring'];
  countries: string[] = ['United States', 'United Kingdom'];
  languages: string[] = ['English'];
  pantipTags: string[] = [];

  rawMode = false;
  rawQuery = '';

  // historic
  historicPreset = '30d';
  /** "Both" modes selected → back-fill then keep listening live. */
  get keepListening(): boolean { return this.realtimeOn && this.historicOn; }

  // edit-mode accordion
  openSection: string | null = 'query';

  /** Channel whose capability info shows in the right helper pane. */
  infoChannel: ListenerChannel | null = null;

  /** Celebration screen shown after Launch. */
  celebrating = false;
  private completedOnce = false;
  readonly confetti = this.makeConfetti();

  // chip-input drafts
  anyDraft = '';
  allDraft = '';
  excludeDraft = '';
  countryDraft = '';
  languageDraft = '';
  pantipDraft = '';

  // ---- steps -------------------------------------------------------------
  get steps(): WizardStep[] {
    const base: WizardStep[] = [
      { n: 1, label: 'Name', icon: 'badge', subtitle: 'Name & type' },
      { n: 2, label: 'Channels', icon: 'hub', subtitle: 'Where to listen' },
      { n: 3, label: 'Query', icon: 'manage_search', subtitle: 'What to track' },
    ];
    if (this.historicOn) base.push({ n: 4, label: 'Time window', icon: 'date_range', subtitle: 'How far back' });
    base.push({ n: base.length + 1, label: 'Review', icon: 'task_alt', subtitle: 'Review & launch' });
    return base;
  }
  get reviewStep(): number { return this.steps.length; }
  stepLabel(n: number): string { return this.steps.find(s => s.n === n)?.label ?? ''; }

  /** At least one listening type must be chosen. */
  get modeValid(): boolean { return this.realtimeOn || this.historicOn; }
  get bothModes(): boolean { return this.realtimeOn && this.historicOn; }

  toggleListenMode(key: string) {
    if (key === 'realtime') this.realtimeOn = !this.realtimeOn;
    else this.historicOn = !this.historicOn;
    // If we're past the (now-removed) Time window step and historic got turned
    // off, clamp the step so we never sit on a step that no longer exists.
    if (this.step > this.reviewStep) this.step = this.reviewStep;
  }

  // Kept for the commented-out top toggle (unused for now).
  setMode(m: 'realtime' | 'historic') {
    if (this.mode === m) return;
    this.mode = m;
    this.step = 1;
  }

  // ---- lookups -----------------------------------------------------------
  channelSvg(c: ListenerChannel): string | null { return c.svg ?? null; }
  channel(id: string): ListenerChannel | undefined { return this.channels.find(c => c.id === id); }

  get selectedChannels(): ListenerChannel[] {
    return this.channels.filter(c => this.selected.has(c.id));
  }
  /** Channels matching the picker search box. */
  get filteredChannels(): ListenerChannel[] {
    const q = this.channelSearch.trim().toLowerCase();
    if (!q) return this.channels;
    return this.channels.filter(c =>
      c.label.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
  }
  /** Selected channels that have configurable options (inner toggles or a vault). */
  get selectedConfigurable(): ListenerChannel[] {
    return this.selectedChannels.filter(c => (c.inner && c.inner.length) || c.hasVault);
  }
  get channelSummary(): string {
    const names = this.selectedChannels.map(c => c.label);
    return names.length ? names.join(', ') : 'no channels yet';
  }
  get hasPantip(): boolean { return this.selected.has('pantip'); }
  get hasFacebook(): boolean { return this.selected.has('facebook'); }
  /** Only "match any" channels are selected → the AND/exclude boxes don't apply. */
  get onlyOrChannels(): boolean {
    const sel = this.selectedChannels;
    return sel.length > 0 && sel.every(c => c.orOnly || c.usesTags);
  }
  get anyOrOnly(): boolean { return this.selectedChannels.some(c => c.orOnly); }
  get hasCountrySupport(): boolean { return this.selectedChannels.some(c => !c.orOnly && !c.usesTags); }
  get showGeo(): boolean { return this.hasCountrySupport && !this.hasFacebook; }

  get preset(): HistoricPreset { return this.historicPresets.find(p => p.key === this.historicPreset)!; }
  get cost(): number { return this.preset.cost; }
  get enoughCredit(): boolean { return this.cost <= this.AVAILABLE_CREDITS; }
  get creditPct(): number { return Math.min(100, (this.cost / this.AVAILABLE_CREDITS) * 100); }

  // ---- channel selection -------------------------------------------------
  toggleChannel(id: string) {
    if (this.selected.has(id)) {
      this.selected.delete(id);
      delete this.inner[id];
    } else {
      this.selected.add(id);
      this.inner[id] ??= new Set();
    }
    this.infoChannel = this.channel(id) ?? null;
  }
  setInfo(c: ListenerChannel) { this.infoChannel = c; }
  /** Channel the right helper pane describes (focused → first selected → first). */
  get activeInfo(): ListenerChannel | null {
    return this.infoChannel ?? this.selectedChannels[0] ?? this.channels[0] ?? null;
  }
  /** Single-item list so *ngFor re-runs the aside reveal animation on change. */
  get infoList(): ListenerChannel[] { return this.activeInfo ? [this.activeInfo] : []; }
  trackInfo(_: number, c: ListenerChannel): string { return c.id; }
  isInnerOn(channelId: string, optId: string): boolean {
    return this.inner[channelId]?.has(optId) ?? false;
  }
  toggleInner(channelId: string, optId: string, ev: Event) {
    ev.stopPropagation();
    const set = (this.inner[channelId] ??= new Set());
    set.has(optId) ? set.delete(optId) : set.add(optId);
  }
  selectVault(v: string, ev: Event) { ev.stopPropagation(); this.fbVault = v; }

  // ---- chip helpers ------------------------------------------------------
  addChip(list: string[], value: string): string {
    const v = value.trim();
    if (v && !list.some(x => x.toLowerCase() === v.toLowerCase())) list.push(v);
    return '';
  }
  removeChip(list: string[], v: string) {
    const i = list.indexOf(v);
    if (i >= 0) list.splice(i, 1);
  }

  addAny()      { this.anyDraft = this.addChip(this.matchAny, this.anyDraft); }
  addAll()      { this.allDraft = this.addChip(this.matchAll, this.allDraft); }
  addExclude()  { this.excludeDraft = this.addChip(this.exclude, this.excludeDraft); }

  // ---- unified "smart" query field --------------------------------------
  addRole: 'any' | 'all' | 'not' = 'any';
  queryDraft = '';

  private roleArr(role: 'any' | 'all' | 'not'): string[] {
    return role === 'any' ? this.matchAny : role === 'all' ? this.matchAll : this.exclude;
  }
  /** All keyword chips in one list, tagged with their role. */
  get tokens(): { text: string; role: 'any' | 'all' | 'not' }[] {
    return [
      ...this.matchAny.map(t => ({ text: t, role: 'any' as const })),
      ...this.matchAll.map(t => ({ text: t, role: 'all' as const })),
      ...this.exclude.map(t => ({ text: t, role: 'not' as const })),
    ];
  }
  roleLabel(role: 'any' | 'all' | 'not'): string {
    return role === 'any' ? 'Any' : role === 'all' ? 'Require' : 'Exclude';
  }
  addToken() {
    const role = this.onlyOrChannels ? 'any' : this.addRole;
    this.queryDraft = this.addChip(this.roleArr(role), this.queryDraft);
  }
  removeToken(role: 'any' | 'all' | 'not', text: string) { this.removeChip(this.roleArr(role), text); }
  /** Click a chip to cycle its role Any → Require → Exclude → Any. */
  cycleToken(role: 'any' | 'all' | 'not', text: string) {
    if (this.onlyOrChannels) return;
    const order: ('any' | 'all' | 'not')[] = ['any', 'all', 'not'];
    const next = order[(order.indexOf(role) + 1) % 3];
    this.removeChip(this.roleArr(role), text);
    this.addChip(this.roleArr(next), text);
  }
  addCountry()  { this.countryDraft = this.addChip(this.countries, this.countryDraft); }
  addLanguage() { this.languageDraft = this.addChip(this.languages, this.languageDraft); }
  addPantip()   { this.pantipDraft = this.addChip(this.pantipTags, this.pantipDraft); }

  // ---- derived query -----------------------------------------------------
  get compiledQuery(): string {
    if (this.rawMode && this.rawQuery.trim()) return this.rawQuery.trim();
    const parts: string[] = [];
    if (this.matchAny.length) parts.push(`(${this.matchAny.join(' OR ')})`);
    if (this.matchAll.length) {
      const inner = this.matchAll.join(` ${this.allOp} `);
      parts.push(this.matchAll.length > 1 ? `(${inner})` : inner);
    }
    let q = parts.join(' AND ');
    if (this.exclude.length) q += `${q ? ' ' : ''}NOT (${this.exclude.join(' OR ')})`;
    return q;
  }
  get queryLength(): number { return this.compiledQuery.length; }
  get queryPct(): number { return Math.min(100, (this.queryLength / this.MAX_QUERY) * 100); }
  get meterClass(): string {
    const p = this.queryPct;
    return p > 90 ? 'red' : p > 70 ? 'amber' : 'green';
  }

  // ---- estimated reach (per-channel model matching the mockups) ----------
  get reachTotal(): number {
    return this.selectedChannels.reduce((sum, c) => sum + c.reach, 0);
  }
  get reachLabel(): string {
    const n = this.reachTotal;
    if (n === 0) return '0';
    if (n < 1000) return `~${n}`;
    const k = n / 1000;
    return `~${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  barHeight(base: number): number {
    const factor = this.reachTotal >= 20000 ? 1 : 0.72 + (this.reachTotal / 20000) * 0.28;
    return Math.max(12, Math.round(base * factor));
  }

  // ---- step navigation ---------------------------------------------------
  get nameValid(): boolean { return this.name.trim().length >= 2; }
  get channelsValid(): boolean { return this.selected.size > 0; }
  get queryValid(): boolean {
    if (this.rawMode) return this.rawQuery.trim().length > 0;
    if (this.hasPantip) return this.pantipTags.length > 0 || this.matchAny.length > 0;
    return this.matchAny.length > 0 || this.matchAll.length > 0;
  }
  stepValid(n: number): boolean {
    switch (this.stepLabel(n)) {
      case 'Name': return this.nameValid && this.modeValid;
      case 'Channels': return this.channelsValid;
      case 'Query': return this.queryValid;
      default: return true;   // Time window, Review
    }
  }
  stepState(n: number): 'done' | 'active' | 'todo' {
    if (n === this.step) return 'active';
    return n < this.step ? 'done' : 'todo';
  }

  goStep(n: number) {
    if (n < this.step) { this.step = n; return; }
    for (let s = this.step; s < n; s++) if (!this.stepValid(s)) return;
    this.step = n;
  }
  next() {
    if (!this.stepValid(this.step)) return;
    if (this.step < this.reviewStep) this.step++;
  }
  back() {
    if (this.step > 1) this.step--;
    else this.close();
  }

  toggleSection(id: string) { this.openSection = this.openSection === id ? null : id; }

  // ---- finish ------------------------------------------------------------
  private buildPayload(): NewQueryPayload {
    const terms: string[] = [];
    if (this.matchAny.length) terms.push(this.matchAny.join(' OR '));
    terms.push(...this.matchAll);
    if (!terms.length) terms.push(this.compiledQuery || this.name.trim());
    return {
      name: this.name.trim(),
      terms,
      connector: 'AND',
      channels: this.selectedChannels.map(c => c.listKey),
      createdOn: 'Jul 01, 2026',
      historicSince: this.historicOn && this.preset.days > 0 ? this.preset.days : undefined,
    };
  }

  launch() {
    if (!this.nameValid || !this.channelsValid || !this.queryValid) return;
    this.celebrating = true;
    setTimeout(() => this.complete(), 3200);
  }
  saveEdit() {
    if (!this.nameValid) return;
    this.saved.emit(this.buildPayload());
  }

  /** Emit the payload once — the parent closes the wizard. */
  complete() {
    if (this.completedOnce) return;
    this.completedOnce = true;
    this.saved.emit(this.buildPayload());
  }

  close() { this.closed.emit(); }

  @HostListener('document:keydown.escape')
  onEscape() { if (!this.celebrating) this.close(); }

  /** A spread of confetti pieces — CSS animates them, no JS loop. */
  private makeConfetti() {
    const colors = ['#6366f1', '#1f9d5a', '#7c4dff', '#f59e0b', '#e1306c', '#06b6d4'];
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
}
