import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CHANNEL_CATALOG, FACEBOOK_PAGES, LINKEDIN_PAGES, BRAND_ICONS, CHANNEL_SPECS, WIZARD_COPY, X_API_VERSIONS,
  AD_ACCOUNTS, ADS_SUPPORTED_IDS, ECOM_PRODUCTS, searchEcom,
  GMB_ACCOUNTS, GA_PROPERTIES, APPSTORE_APPS, emailFolders,
  tiktokPreview, fbGroupPreview, TiktokPreview, FbGroupPreview,
  FIELD_HELP, EMAIL_INCOMING_HELP, EMAIL_OUTGOING_HELP, FieldHelp,
  CatalogChannel, CatalogGroup, FacebookPage, AdAccount, ChannelSpec, ChannelMode, EcomProduct,
  GmbAccountGroup, GmbLocation, GaProperty, EmailFolder, AppStoreApp,
} from '../channel-data';

type StepKey = 'choose' | 'connection' | 'authenticate' | 'public' | 'pages' | 'ads' | 'incoming' | 'outgoing' | 'settings' | 'review';
interface Step { key: StepKey; label: string; }

/** Channels whose "authenticate" step is a token/credential form instead of OAuth. */
type TokenFormKind = 'telegram' | 'line' | 'sitejabber';
/** Channels that hand off to a dedicated (out-of-wizard) setup instead of connecting here. */
const DELEGATE_IDS = new Set(['whatsapp', 'voice']);
const TOKEN_FORM_IDS: Record<string, TokenFormKind> = { telegram: 'telegram', line: 'line', sitejabber: 'sitejabber' };

@Component({
  selector: 'app-add-channel-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-channel-wizard.component.html',
  styleUrl: './add-channel-wizard.component.scss',
})
export class AddChannelWizardComponent implements OnInit {
  /** Optionally pre-select a channel by id (e.g. opened from an empty channel state). */
  @Input() preselectId: string | null = null;
  /** Emitted when the wizard should close (X, backdrop, or after Finish). */
  @Output() closed = new EventEmitter<void>();
  /** Emitted with the configured channel when the user clicks Finish. */
  @Output() added = new EventEmitter<CatalogChannel>();

  ngOnInit(): void {
    if (this.preselectId) {
      const c = this.catalog.flatMap(g => g.channels).find(ch => ch.id === this.preselectId);
      if (c) this.pickChannel(c);
    }
  }

  catalog = CHANNEL_CATALOG;
  copy = WIZARD_COPY;
  search = '';

  /** Field currently focused — highlights the matching block in the right aside. */
  activeField: string | null = null;
  setActive(field: string) { this.activeField = field; }
  clearActive() { this.activeField = null; }
  get fieldHelps(): FieldHelp[] {
    const id = this.selected?.id;
    return id && FIELD_HELP[id] ? FIELD_HELP[id] : [];
  }

  selected: CatalogChannel | null = null;
  stepIndex = 0;

  /** Aside highlight — the option block the user is hovering (e.g. 'owned' / 'public'). */
  activeInfo: string | null = null;
  setActiveInfo(key: string) { this.activeInfo = key; }
  clearActiveInfo() { this.activeInfo = null; }

  /** Celebration screen shown after Finish. */
  celebrating = false;
  private completedOnce = false;

  /** Pre-computed confetti pieces — CSS animates them, no JS loop. */
  readonly confetti = this.makeConfetti();

  // path state
  connectionType: 'owned' | 'public' | null = null;
  publicHandle = '';
  authDone = false;
  authLoading = false;
  selectedPages = new Set<string>();

  // X (Twitter) owned — independent v1.1 / v2 API authentication
  xVersions = X_API_VERSIONS;
  xState: Record<'v1' | 'v2', { loading: boolean; done: boolean }> = {
    v1: { loading: false, done: false },
    v2: { loading: false, done: false },
  };

  // Ads accounts (Meta / X / LinkedIn) — optional step
  adAccounts = AD_ACCOUNTS;
  /** Demo toggle in the header: does this account have ads accounts available? */
  adsAvailable = false;
  selectedAds = new Set<string>();
  private readonly adsSupported = new Set(ADS_SUPPORTED_IDS);

  // E-Commerce — add sources by URL, CSV or search
  ecomTab: 'url' | 'search' = 'url';
  urlDraft = '';
  urlList: string[] = [];
  editIndex = -1;
  editDraft = '';
  csvName = '';
  csvCols: string[] = [];
  csvRows: string[][] = [];
  searchQuery = '';
  searchResults: EcomProduct[] = [];
  searchLoading = false;
  hasSearched = false;
  private searchTimer: any;
  selectedProducts = new Set<string>();

  // ---- token / credential / key-upload channels (Telegram, LINE, Sitejabber, App Store, Play Store) ----
  telegramToken = '';
  lineChannelId = ''; lineAccessToken = ''; lineSecret = '';
  sjEmail = ''; sjPassword = ''; sjApiKey = ''; sjBusiness = '';
  asKeyId = ''; asIssuerId = ''; asPrivateKey = '';
  appsFetched = false;
  selectedApps = new Set<string>();
  psFile: File | null = null; psFileName = ''; psPackage = ''; psFriendly = '';

  // ---- TikTok / FB Groups public: simulated preview fetch ----
  ttFetching = false; ttData: TiktokPreview | null = null; ttComments = true; ttReplies = false;
  fbgFetching = false; fbgData: FbGroupPreview | null = null; fbgComments = true;

  // ---- GMB: nested account → locations tree ----
  gmbAccounts = GMB_ACCOUNTS;
  gmbOpen = new Set<string>([GMB_ACCOUNTS[0]?.id]);
  selectedGmbLocs = new Set<string>();
  gmbGroupName = '';

  // ---- Google Analytics: accounts flattened to properties ----
  gaProperties = GA_PROPERTIES;

  // ---- Email: OAuth (folders) or manual (IMAP/SMTP) ----
  emailMode: 'oauth' | 'manual' | null = null;
  emailProvider: 'gmail' | 'outlook' | null = null;
  emailAddress = '';
  emailFolderList: EmailFolder[] = [];
  emailPrevTrail = true; emailAutoAck = false; emailAliasReply = false; emailFooter = '';
  showPw = false;
  inType: '1' | '2' | '3' = '1';
  inName = ''; inEmail = ''; inPassword = ''; inPort = 993; inServer = 'imap.gmail.com'; inSSL = true;
  outName = ''; outEmail = ''; outPassword = ''; outPort = 587; outServer = 'smtp.gmail.com'; outSSL = true;
  outReplyTo = ''; outAlias = ''; outFooter = '';
  ccChips: string[] = []; bccChips: string[] = []; ccDraft = ''; bccDraft = '';
  testingIn = false; testingOut = false;
  readonly emailIncomingHelp = EMAIL_INCOMING_HELP;
  readonly emailOutgoingHelp = EMAIL_OUTGOING_HELP;

  /** Real brand logo path for the current channel, or null → use Material icon. */
  brandSvg(id: string | undefined): string | null {
    return id ? (BRAND_ICONS[id] ?? null) : null;
  }
  /** Light tint of a brand colour for the tile background. */
  tint(color: string | undefined): string { return (color ?? '#888888') + '1a'; }

  /* ---- spec lookup --------------------------------------------------- */
  /** Full content spec for the currently-selected channel. */
  get spec(): ChannelSpec | null {
    return this.selected ? (CHANNEL_SPECS[this.selected.id] ?? null) : null;
  }
  /** Does this channel offer an Owned vs Public choice? */
  get isChoice(): boolean { return (this.spec?.modes.length ?? 0) === 2; }

  /** The mode whose content we render right now (resolves single-mode channels automatically). */
  get activeMode(): ChannelMode | null {
    const s = this.spec;
    if (!s) return null;
    if (s.modes.length === 1) return s.modes[0];
    if (this.connectionType) return s.modes.find(m => m.key === this.connectionType) ?? null;
    return null;
  }
  modeFor(key: 'owned' | 'public'): ChannelMode | null {
    return this.spec?.modes.find(m => m.key === key) ?? null;
  }
  /** Show the GET / DON'T capabilities panel inline (single-mode channels have no choice screen). */
  get showCaps(): boolean { return !this.isChoice; }

  /** Total channels in the catalog — shown on the choose-step intro. */
  get totalChannels(): number {
    return this.catalog.reduce((n, g) => n + g.channels.length, 0);
  }

  /** Single-item list of the selected spec — lets *ngFor re-create (and re-animate) the
   *  choose-step preview whenever the picked channel changes. */
  get specList(): ChannelSpec[] { return this.spec ? [this.spec] : []; }
  trackSpec(_: number, s: ChannelSpec): string { return s.id; }

  /** Primary mode used for the "choose" preview (owned-first, else the only mode). */
  get primaryMode(): ChannelMode | null { return this.spec?.modes[0] ?? null; }
  /** "Owned" / "Public" labels for the modes this channel supports. */
  get modeLabels(): string[] {
    return this.spec?.modes.map(m => (m.key === 'owned' ? 'Owned' : 'Public')) ?? [];
  }

  /* ---- step-1 tile sub-label + tier badge ---------------------------- */
  tileSub(c: CatalogChannel): string {
    return CHANNEL_SPECS[c.id]?.tileSub ?? 'OAuth · ~30s';
  }
  /** A leading "Popular" / "Premium" / "Coming soon" token rendered as a badge. */
  tileBadge(c: CatalogChannel): string | null {
    const sub = this.tileSub(c);
    for (const b of ['Popular', 'Premium', 'Coming soon']) {
      if (sub.startsWith(b)) return b;
    }
    return null;
  }
  /** The remainder of the sub-label after the badge token. */
  tileSubRest(c: CatalogChannel): string {
    const sub = this.tileSub(c);
    const b = this.tileBadge(c);
    if (!b) return sub;
    return sub.slice(b.length).replace(/^\s*·\s*/, '');
  }

  /* ---- token / credential / key-upload channels ----------------------- */
  get tokenFormKind(): TokenFormKind | null {
    const id = this.selected?.id;
    return id ? (TOKEN_FORM_IDS[id] ?? null) : null;
  }
  get credFormKind(): 'appstore' | null { return this.selected?.id === 'appstore' ? 'appstore' : null; }
  get keyFormKind(): 'playstore' | null { return this.selected?.id === 'playstore' ? 'playstore' : null; }
  get hasCredForm(): boolean { return !!this.tokenFormKind || !!this.credFormKind || !!this.keyFormKind; }

  /** WhatsApp / Voice: hand off to a dedicated setup instead of connecting here. */
  get isDelegate(): boolean { return !!this.selected && DELEGATE_IDS.has(this.selected.id); }
  /** Closes the wizard — the real setup continues in its own dedicated step. */
  openExternalSetup() { this.close(); }

  get isGmbPicker(): boolean { return this.selected?.id === 'gmb'; }
  get isGaPicker(): boolean { return this.selected?.id === 'ganalytics'; }
  get isEmailAuth(): boolean { return this.selected?.id === 'email'; }
  get isEmailManual(): boolean { return this.emailMode === 'manual'; }
  get isTiktokPublic(): boolean { return this.selected?.id === 'tiktok' && this.activeMode?.key === 'public'; }
  get isFbGroupPublic(): boolean { return this.selected?.id === 'fbgroups'; }

  /** The picker list for the flat (non-GMB) "pages" step — swaps per channel. */
  get pages(): FacebookPage[] {
    switch (this.selected?.id) {
      case 'facebook':
      case 'instagram': return FACEBOOK_PAGES;
      case 'linkedin': return LINKEDIN_PAGES;
      case 'appstore': return APPSTORE_APPS.map(a => ({
        id: a.id, name: a.name, followers: a.bundleId, initials: a.name.charAt(0), color: '#0d96f6',
      }));
      case 'ganalytics': return GA_PROPERTIES.map(p => ({
        id: p.id, name: p.name, followers: 'Property ID ' + p.propertyId, initials: p.name.charAt(0), color: '#e37400',
      }));
      case 'email': return this.emailFolderList.map(f => ({
        id: f.id, name: f.name, followers: f.count ?? '', initials: f.name.charAt(0), color: '#ea4335', disabled: f.disabled,
      }));
      default: return FACEBOOK_PAGES;
    }
  }

  /* ---- "Select accounts" wording ------------------------------------- */
  get pagesNoun(): string {
    if (this.credFormKind === 'appstore') return 'apps';
    if (this.isGaPicker) return 'properties';
    if (this.isEmailAuth) return 'folders';
    return this.activeMode?.pagesNoun ?? 'pages';
  }
  get selectHeading(): string {
    const noun = this.pagesNoun === 'Organisation Pages' ? 'Organisation Pages'
      : this.pagesNoun === 'locations' ? 'locations'
      : this.pagesNoun === 'accounts' ? 'accounts'
      : this.pagesNoun === 'apps' ? 'apps'
      : this.pagesNoun === 'properties' ? 'properties'
      : this.pagesNoun === 'folders' ? 'folders' : 'pages';
    return 'Select ' + noun + ' to connect';
  }

  /* ---- auth note + button -------------------------------------------- */
  get authButtonLabel(): string {
    return this.activeMode?.authButton ?? `Login with ${this.selected?.label}`;
  }
  get authNote(): string {
    return this.activeMode?.accessNote
      ?? `You'll be redirected to ${this.selected?.label} to approve access. We never see or store your password.`;
  }

  // ---- dynamic step model ------------------------------------------------
  /** The steps shown in the top progress bar — depends on channel + mode. */
  get steps(): Step[] {
    const choose: Step = { key: 'choose', label: 'Choose channel' };
    const review: Step = { key: 'review', label: 'Review & Complete' };
    const s = this.spec;
    // Default preview (no channel chosen yet): a typical 3-step path.
    if (!s) return [choose, { key: 'authenticate', label: 'Authenticate' }, review];

    const ownedPath = (m: ChannelMode, withConnection: boolean): Step[] => {
      const arr: Step[] = [choose];
      if (withConnection) arr.push({ key: 'connection', label: 'Account Type' });
      arr.push({ key: 'authenticate', label: 'Authenticate' });
      if (this.isEmailAuth) {
        if (this.emailMode === 'manual') {
          arr.push({ key: 'incoming', label: 'Incoming' }, { key: 'outgoing', label: 'Outgoing' });
        } else if (this.emailMode === 'oauth') {
          arr.push({ key: 'pages', label: 'Select folders' });
        }
        if (this.emailMode) arr.push({ key: 'settings', label: 'Advanced settings' });
      } else if (m.pages || this.credFormKind || this.isGaPicker) {
        arr.push({ key: 'pages', label: this.isGaPicker ? 'Select properties' : this.credFormKind ? 'Select apps' : 'Select accounts' });
      }
      if (this.showAdsStep) arr.push({ key: 'ads', label: 'Ads account' });
      arr.push(review);
      return arr;
    };
    const publicPath = (withConnection: boolean): Step[] => {
      const arr: Step[] = [choose];
      if (withConnection) arr.push({ key: 'connection', label: 'Account Type' });
      arr.push({ key: 'public', label: 'Add source' }, review);
      return arr;
    };

    if (s.modes.length === 2) {
      const m = this.activeMode;
      if (!m) return [choose, { key: 'connection', label: 'Account Type' }, review];
      return m.key === 'owned' ? ownedPath(m, true) : publicPath(true);
    }
    const only = s.modes[0];
    return only.key === 'owned' ? ownedPath(only, false) : publicPath(false);
  }

  get current(): StepKey { return this.steps[this.stepIndex]?.key ?? 'choose'; }
  get totalSteps(): number { return this.steps.length; }

  // ---- choose step -------------------------------------------------------
  filteredGroups(): CatalogGroup[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.catalog;
    return this.catalog
      .map(g => ({ ...g, channels: g.channels.filter(c => c.label.toLowerCase().includes(q)) }))
      .filter(g => g.channels.length);
  }

  pickChannel(c: CatalogChannel) {
    this.selected = c;
    this.resetPathState();
  }

  /** Every field that belongs to a specific channel's flow — cleared on pick/re-add. */
  private resetPathState() {
    this.connectionType = null;
    this.publicHandle = '';
    this.authDone = false;
    this.authLoading = false;
    this.activeField = null;
    this.selectedPages.clear();
    this.selectedAds.clear();
    this.xState = { v1: { loading: false, done: false }, v2: { loading: false, done: false } };
    this.ecomTab = 'url';
    this.urlDraft = ''; this.urlList = []; this.editIndex = -1; this.editDraft = '';
    this.csvName = ''; this.csvCols = []; this.csvRows = [];
    this.searchQuery = ''; this.searchResults = []; this.selectedProducts.clear();
    this.searchLoading = false; this.hasSearched = false; clearTimeout(this.searchTimer);

    this.telegramToken = '';
    this.lineChannelId = ''; this.lineAccessToken = ''; this.lineSecret = '';
    this.sjEmail = ''; this.sjPassword = ''; this.sjApiKey = ''; this.sjBusiness = '';
    this.asKeyId = ''; this.asIssuerId = ''; this.asPrivateKey = ''; this.appsFetched = false; this.selectedApps.clear();
    this.psFile = null; this.psFileName = ''; this.psPackage = ''; this.psFriendly = '';

    this.ttFetching = false; this.ttData = null; this.ttComments = true; this.ttReplies = false;
    this.fbgFetching = false; this.fbgData = null; this.fbgComments = true;

    this.selectedGmbLocs.clear(); this.gmbOpen = new Set<string>([GMB_ACCOUNTS[0]?.id]); this.gmbGroupName = '';

    this.emailMode = null; this.emailProvider = null; this.emailAddress = ''; this.emailFolderList = [];
    this.emailPrevTrail = true; this.emailAutoAck = false; this.emailAliasReply = false; this.emailFooter = ''; this.showPw = false;
    this.inType = '1'; this.inName = ''; this.inEmail = ''; this.inPassword = ''; this.inPort = 993; this.inServer = 'imap.gmail.com'; this.inSSL = true;
    this.outName = ''; this.outEmail = ''; this.outPassword = ''; this.outPort = 587; this.outServer = 'smtp.gmail.com'; this.outSSL = true;
    this.outReplyTo = ''; this.outAlias = ''; this.outFooter = '';
    this.ccChips = []; this.bccChips = []; this.ccDraft = ''; this.bccDraft = '';
    this.testingIn = false; this.testingOut = false;
  }

  /* ---- E-Commerce: add product sources by URL / CSV / search ---- */
  readonly ecommerceIds = new Set(['amazon', 'flipkart', 'bestbuy']);
  get isEcommerce(): boolean { return !!this.selected && this.ecommerceIds.has(this.selected.id); }

  isValidUrl(v: string): boolean { return /^https?:\/\/.+\..+/i.test(v.trim()); }

  addUrl() {
    const v = this.urlDraft.trim();
    if (!this.isValidUrl(v) || this.urlList.includes(v)) return;
    this.urlList.push(v);
    this.urlDraft = '';
  }
  removeUrl(i: number) {
    this.urlList.splice(i, 1);
    if (this.editIndex === i) this.editIndex = -1;
  }
  startEditUrl(i: number) { this.editIndex = i; this.editDraft = this.urlList[i]; }
  saveEditUrl() {
    const v = this.editDraft.trim();
    if (this.editIndex >= 0 && this.isValidUrl(v)) this.urlList[this.editIndex] = v;
    this.editIndex = -1;
  }
  cancelEditUrl() { this.editIndex = -1; }

  /** Parse an uploaded CSV into a small preview table (first URL/name columns). */
  onCsv(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.csvName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? '');
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (!lines.length) { this.csvCols = []; this.csvRows = []; return; }
      const split = (l: string) => l.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      this.csvCols = split(lines[0]);
      this.csvRows = lines.slice(1).map(split);
    };
    reader.readAsText(file);
    input.value = '';
  }
  clearCsv() { this.csvName = ''; this.csvCols = []; this.csvRows = []; }

  /** Trigger a sample CSV download — URLs match the selected store only. */
  downloadSample() {
    const id = this.selected?.id;
    const rows: [string, string][] =
      id === 'flipkart' ? [
        ['Apple iPhone 17', 'https://www.flipkart.com/apple-iphone-17/p/itm1a2b3c4d'],
        ['boAt Airdopes 191', 'https://www.flipkart.com/boat-airdopes-191/p/itm4d5e6f7g'],
        ['Noise ColorFit Pro 5', 'https://www.flipkart.com/noise-colorfit-pro-5/p/itm7g8h9i0j'],
      ] : id === 'bestbuy' ? [
        ['Apple iPhone 17', 'https://www.bestbuy.com/site/apple-iphone-17/6100011.p'],
        ['Sony WH-1000XM5', 'https://www.bestbuy.com/site/sony-wh-1000xm5/6100022.p'],
        ['Samsung Galaxy S24', 'https://www.bestbuy.com/site/samsung-galaxy-s24/6100033.p'],
      ] : [
        ['Apple iPhone 17', 'https://www.amazon.in/dp/B0EXAMPLE1'],
        ['boAt Airdopes 191', 'https://www.amazon.in/dp/B0EXAMPLE2'],
        ['Noise ColorFit Pro 5', 'https://www.amazon.in/dp/B0EXAMPLE3'],
      ];
    const csv = 'product_name,product_url\n' + rows.map(r => r.join(',')).join('\n') + '\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${id ?? 'store'}-product-sample.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /** Run only on Enter / Search click — simulates a live API call with a loader. */
  doSearch() {
    const q = this.searchQuery.trim();
    if (!q) { this.clearSearch(); return; }
    this.hasSearched = true;
    this.searchLoading = true;
    this.searchResults = [];
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.searchResults = searchEcom(q).slice(0, 5); // top 5 matches only
      this.searchLoading = false;
    }, 950);
  }
  clearSearch() {
    clearTimeout(this.searchTimer);
    this.searchQuery = '';
    this.searchResults = [];
    this.searchLoading = false;
    this.hasSearched = false;
  }
  toggleProduct(id: string) {
    this.selectedProducts.has(id) ? this.selectedProducts.delete(id) : this.selectedProducts.add(id);
  }
  isProdSelected(id: string): boolean { return this.selectedProducts.has(id); }
  productById(id: string): EcomProduct | undefined { return ECOM_PRODUCTS.find(p => p.id === id); }
  get selectedProductList(): EcomProduct[] { return ECOM_PRODUCTS.filter(p => this.selectedProducts.has(p.id)); }
  /** Total product sources added across URL + CSV + search. */
  get ecomTotal(): number { return this.urlList.length + this.csvRows.length + this.selectedProducts.size; }

  /** Unified list of everything added — shown on the review screen. */
  get ecomSources(): { label: string; sub: string; icon: string }[] {
    const out: { label: string; sub: string; icon: string }[] = [];
    for (const p of this.selectedProductList) out.push({ label: p.title, sub: p.brand + ' · ' + p.category, icon: 'shopping_bag' });
    for (const u of this.urlList) out.push({ label: u, sub: 'Product URL', icon: 'link' });
    for (const r of this.csvRows) out.push({ label: r[0] || r[r.length - 1] || 'CSV row', sub: 'From CSV', icon: 'description' });
    return out;
  }

  // ---- authenticate step -------------------------------------------------
  /** Simulate the OAuth round-trip with a short "Authenticating…" delay. */
  startAuth() {
    if (this.authLoading || this.authDone) return;
    this.authLoading = true;
    setTimeout(() => {
      this.authLoading = false;
      this.authDone = true;
    }, 2500);
  }

  /* ---- X (Twitter) owned: per-API-version auth ---- */
  /** True when the authenticate step should show the X v1.1 / v2 picker. */
  get isXVersionAuth(): boolean {
    return this.selected?.id === 'twitter' && this.activeMode?.key === 'owned';
  }
  xDone(id: 'v1' | 'v2'): boolean { return this.xState[id].done; }
  xLoading(id: 'v1' | 'v2'): boolean { return this.xState[id].loading; }
  /** How many APIs are connected — drives the continue guard and review. */
  get xConnectedCount(): number { return (this.xState.v1.done ? 1 : 0) + (this.xState.v2.done ? 1 : 0); }
  startXAuth(id: 'v1' | 'v2') {
    const s = this.xState[id];
    if (s.loading || s.done) return;
    s.loading = true;
    setTimeout(() => { s.loading = false; s.done = true; }, 2000);
  }

  // ---- pages step --------------------------------------------------------
  togglePage(id: string) {
    if (this.pages.find(p => p.id === id)?.disabled) return;
    this.selectedPages.has(id) ? this.selectedPages.delete(id) : this.selectedPages.add(id);
  }
  get allPagesSelected(): boolean {
    const selectable = this.pages.filter(p => !p.disabled);
    return selectable.length > 0 && selectable.every(p => this.selectedPages.has(p.id));
  }
  toggleAllPages() {
    if (this.allPagesSelected) this.selectedPages.clear();
    else this.pages.forEach(p => { if (!p.disabled) this.selectedPages.add(p.id); });
  }
  get selectedPageList(): FacebookPage[] {
    return this.pages.filter(p => this.selectedPages.has(p.id));
  }

  // ---- token / credential / key-upload channels --------------------------
  onPsFile(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.psFile = file;
    this.psFileName = file.name;
  }
  /** App Store: verify the API key, then fetch the app list (before the picker step). */
  verifyAppStoreKey() {
    if (this.authLoading) return;
    this.authLoading = true;
    setTimeout(() => { this.authLoading = false; this.appsFetched = true; }, 1600);
  }

  // ---- TikTok / FB Groups public: simulated preview fetch ---------------
  fetchTiktok() {
    if (this.ttFetching || !this.publicHandle.trim()) return;
    this.ttFetching = true;
    setTimeout(() => { this.ttFetching = false; this.ttData = tiktokPreview(this.publicHandle); }, 1300);
  }
  fetchFbGroup() {
    if (this.fbgFetching || !this.publicHandle.trim()) return;
    this.fbgFetching = true;
    setTimeout(() => { this.fbgFetching = false; this.fbgData = fbGroupPreview(this.publicHandle); }, 1300);
  }

  // ---- GMB: nested account → locations tree ------------------------------
  gmbToggleOpen(id: string) { this.gmbOpen.has(id) ? this.gmbOpen.delete(id) : this.gmbOpen.add(id); }
  gmbIsOpen(id: string): boolean { return this.gmbOpen.has(id); }
  gmbAccountCount(acct: GmbAccountGroup): number {
    return acct.locations.filter(l => this.selectedGmbLocs.has(l.id)).length;
  }
  gmbAccountChecked(acct: GmbAccountGroup): boolean {
    return acct.locations.length > 0 && this.gmbAccountCount(acct) === acct.locations.length;
  }
  gmbAccountPartial(acct: GmbAccountGroup): boolean {
    const n = this.gmbAccountCount(acct);
    return n > 0 && n < acct.locations.length;
  }
  gmbToggleAccount(acct: GmbAccountGroup) {
    const allOn = this.gmbAccountChecked(acct);
    acct.locations.forEach(l => allOn ? this.selectedGmbLocs.delete(l.id) : this.selectedGmbLocs.add(l.id));
  }
  gmbLocChecked(loc: GmbLocation): boolean { return this.selectedGmbLocs.has(loc.id); }
  gmbToggleLoc(loc: GmbLocation) {
    this.selectedGmbLocs.has(loc.id) ? this.selectedGmbLocs.delete(loc.id) : this.selectedGmbLocs.add(loc.id);
  }
  get selectedGmbLocList(): GmbLocation[] {
    return this.gmbAccounts.flatMap(a => a.locations).filter(l => this.selectedGmbLocs.has(l.id));
  }

  // ---- Email: OAuth (folders) or manual (IMAP/SMTP) ----------------------
  startEmailOAuth(gmail: boolean) {
    if (this.authLoading) return;
    this.emailProvider = gmail ? 'gmail' : 'outlook';
    this.authLoading = true;
    setTimeout(() => {
      this.authLoading = false;
      this.authDone = true;
      this.emailMode = 'oauth';
      this.emailAddress = gmail ? 'support@acme.com' : 'care@acme.com';
      this.emailFolderList = emailFolders(gmail);
      this.selectedPages.clear();
      this.selectedPages.add('inbox');
    }, 1800);
  }
  chooseEmailManual() {
    this.emailMode = 'manual';
    this.next();
  }
  onIncomingTypeChange() {
    if (this.inType === '1') { this.inPort = 993; this.inServer = 'imap.gmail.com'; }
    else if (this.inType === '2') { this.inPort = 995; this.inServer = 'pop.gmail.com'; }
    else { this.inPort = 0; this.inServer = 'outlook.office365.com'; }
  }
  testIncoming() {
    if (this.testingIn) return;
    this.testingIn = true;
    setTimeout(() => { this.testingIn = false; }, 1400);
  }
  testOutgoing(_mode: string) {
    if (this.testingOut) return;
    this.testingOut = true;
    setTimeout(() => { this.testingOut = false; }, 1400);
  }
  addChip(kind: 'cc' | 'bcc') {
    const draft = kind === 'cc' ? this.ccDraft : this.bccDraft;
    const v = draft.trim();
    if (!v) return;
    const list = kind === 'cc' ? this.ccChips : this.bccChips;
    if (!list.includes(v)) list.push(v);
    if (kind === 'cc') this.ccDraft = ''; else this.bccDraft = '';
  }
  removeChip(kind: 'cc' | 'bcc', i: number) {
    (kind === 'cc' ? this.ccChips : this.bccChips).splice(i, 1);
  }
  personalizeFooter(token: string) {
    this.emailFooter = (this.emailFooter ? this.emailFooter + ' ' : '') + token;
  }

  // ---- ads accounts step -------------------------------------------------
  /** This channel + mode can link an ads account (owned X / LinkedIn / Meta). */
  get channelSupportsAds(): boolean {
    return !!this.selected && this.adsSupported.has(this.selected.id) && this.activeMode?.key === 'owned';
  }
  /** The optional "Ads account" step is shown (demo toggle on + supported channel). */
  get showAdsStep(): boolean { return this.adsAvailable && this.channelSupportsAds; }
  toggleAd(id: string) { this.selectedAds.has(id) ? this.selectedAds.delete(id) : this.selectedAds.add(id); }
  get allAdsSelected(): boolean { return this.selectedAds.size === this.adAccounts.length; }
  toggleAllAds() {
    if (this.allAdsSelected) this.selectedAds.clear();
    else this.adAccounts.forEach(a => this.selectedAds.add(a.id));
  }
  get selectedAdList(): AdAccount[] { return this.adAccounts.filter(a => this.selectedAds.has(a.id)); }

  // ---- navigation --------------------------------------------------------
  get canContinue(): boolean {
    switch (this.current) {
      case 'choose':       return !!this.selected;
      case 'connection':   return !!this.connectionType;
      case 'authenticate':
        if (this.isDelegate) return false;   // the card's own button closes the wizard
        if (this.tokenFormKind === 'telegram') return this.telegramToken.trim().length > 0;
        if (this.tokenFormKind === 'line') return this.lineChannelId.trim().length > 0 && this.lineAccessToken.trim().length > 0 && this.lineSecret.trim().length > 0;
        if (this.tokenFormKind === 'sitejabber') return this.sjEmail.trim().length > 0 && this.sjPassword.trim().length > 0 && this.sjApiKey.trim().length > 0 && this.sjBusiness.trim().length > 0;
        if (this.credFormKind === 'appstore') return !this.authLoading && this.asKeyId.trim().length > 0 && this.asIssuerId.trim().length > 0 && this.asPrivateKey.trim().length > 0;
        if (this.keyFormKind === 'playstore') return !!this.psFile && this.psPackage.trim().length > 0 && this.psFriendly.trim().length > 0;
        if (this.isEmailAuth) return this.emailMode === 'manual' ? true : this.emailMode === 'oauth' ? this.authDone : false;
        return this.isXVersionAuth ? this.xConnectedCount === 2 : this.authDone;
      case 'public':       return this.isEcommerce ? this.ecomTotal > 0 : this.publicHandle.trim().length > 0;
      case 'pages':         return this.isGmbPicker ? this.selectedGmbLocs.size > 0 : this.selectedPages.size > 0;
      case 'incoming':      return this.inName.trim().length > 0 && this.inEmail.trim().length > 0 && this.inPassword.trim().length > 0 && this.inServer.trim().length > 0;
      case 'outgoing':      return this.outName.trim().length > 0 && this.outEmail.trim().length > 0 && this.outPassword.trim().length > 0 && this.outServer.trim().length > 0 && this.outFooter.trim().length > 0;
      case 'settings':      return true;
      case 'ads':          return true;   // optional — skippable
      case 'review':       return true;
      default:             return false;
    }
  }

  get onReview(): boolean { return this.current === 'review'; }

  next() {
    if (this.current === 'authenticate' && this.credFormKind === 'appstore' && !this.appsFetched) {
      this.verifyAppStoreKey();
      return;
    }
    if (!this.canContinue) return;
    if (this.current === 'incoming' && !this.outName) {
      this.outName = this.inName; this.outEmail = this.inEmail; this.outPassword = this.inPassword;
      this.outServer = this.inServer.replace(/^imap\.|^pop\./, 'smtp.'); this.outPort = 587; this.outSSL = true;
    }
    if (this.onReview) { this.finish(); return; }
    this.stepIndex = Math.min(this.stepIndex + 1, this.totalSteps - 1);
  }

  back() {
    if (this.stepIndex > 0) this.stepIndex--;
  }

  finish() {
    // Show the success screen and register the channel — but keep the popover open
    // so the user can review the details and choose to add another or close.
    this.celebrating = true;
    if (this.selected && !this.completedOnce) {
      this.completedOnce = true;
      this.added.emit(this.selected);
    }
  }

  /** Reset the wizard back to the channel picker to add another channel. */
  addAnother() {
    this.celebrating = false;
    this.completedOnce = false;
    this.selected = null;
    this.stepIndex = 0;
    this.search = '';
    this.resetPathState();
  }

  /** Close the popover from the success screen. */
  complete() { this.close(); }

  close() { this.closed.emit(); }

  /** A spread of confetti pieces with varied colour, position, timing. */
  private makeConfetti() {
    const colors = ['#2563eb', '#1f9d5a', '#7c4dff', '#f6a623', '#e1306c', '#06b6d4'];
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

  // ---- review summary values --------------------------------------------
  get connectionLabel(): string {
    return this.activeMode?.key === 'public' ? 'Public' : 'Owned';
  }

  /** Account value shown on the Review card (prefers live entry over the spec default). */
  get reviewAccount(): string {
    if (this.isEcommerce) {
      const n = this.ecomTotal;
      return n + ' product' + (n === 1 ? '' : 's');
    }
    if (this.isGmbPicker && this.selectedGmbLocList.length) {
      const n = this.selectedGmbLocList.length;
      return n + ' location' + (n === 1 ? '' : 's');
    }
    if (this.isEmailAuth) {
      if (this.emailMode === 'oauth' && this.emailAddress) return this.emailAddress;
      if (this.emailMode === 'manual' && this.inEmail) return this.inEmail;
    }
    if ((this.activeMode?.pages || this.credFormKind || this.isGaPicker) && this.selectedPageList.length) {
      const noun = this.pagesNoun === 'locations' ? 'location'
        : this.pagesNoun === 'Organisation Pages' ? 'Page'
        : this.pagesNoun === 'apps' ? 'app'
        : this.pagesNoun === 'properties' ? 'property'
        : this.pagesNoun === 'folders' ? 'folder' : 'account';
      const n = this.selectedPageList.length;
      const plural = noun === 'property' ? 'properties' : noun + 's';
      return n + ' ' + (n > 1 ? plural : noun);
    }
    if (this.tokenFormKind === 'telegram' && this.telegramToken.trim()) return '@yourbot';
    if (this.tokenFormKind === 'line' && this.lineChannelId.trim()) return 'Channel ' + this.lineChannelId.trim();
    if (this.tokenFormKind === 'sitejabber' && this.sjBusiness.trim()) return this.sjBusiness.trim();
    if (this.keyFormKind === 'playstore' && this.psPackage.trim()) return this.psPackage.trim();
    if (this.publicHandle.trim()) return this.publicHandle.trim();
    return this.activeMode?.review.account ?? '—';
  }
  get reviewPermissions(): string { return this.activeMode?.review.permissions ?? '—'; }
  get reviewSync(): string { return this.activeMode?.review.sync ?? '—'; }
  get reviewHistory(): string { return this.activeMode?.review.history ?? '—'; }

  /** Real-time channels promise instant data; scheduled ones wait for the next run. */
  get isRealtime(): boolean {
    return /real-?time|webhook|continuous/i.test(this.activeMode?.sync ?? '');
  }
  get reviewReadySub(): string {
    return this.isRealtime
      ? 'We start syncing within a minute.'
      : 'First mentions arrive after the next collection run — usually within a few hours.';
  }
  get celebrationSub(): string {
    return this.activeMode?.celebration ?? `${this.selected?.label} is now configured.`;
  }

  /** Data / mention types as individual chips for the review summary. */
  get dataTypeList(): string[] {
    return (this.activeMode?.dataTypes ?? '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }
}
