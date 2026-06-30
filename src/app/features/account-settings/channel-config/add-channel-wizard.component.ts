import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CHANNEL_CATALOG, FACEBOOK_PAGES, BRAND_ICONS,
  CatalogChannel, CatalogGroup, FacebookPage,
} from '../channel-data';

type StepKey = 'choose' | 'connection' | 'authenticate' | 'public' | 'pages' | 'url' | 'review';
interface Step { key: StepKey; label: string; }

/** Channel-specific guidance for the "Add public source" step. */
interface PublicHelp {
  label: string;        // input label
  placeholder: string;  // input placeholder
  example: string;      // "Ex. …" hint under the input
  title: string;        // guide heading
  steps: string[];      // how-to-find-it steps
}

@Component({
  selector: 'app-add-channel-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-channel-wizard.component.html',
  styleUrl: './add-channel-wizard.component.scss',
})
export class AddChannelWizardComponent {
  /** Emitted when the wizard should close (X, backdrop, or after Finish). */
  @Output() closed = new EventEmitter<void>();
  /** Emitted with the configured channel when the user clicks Finish. */
  @Output() added = new EventEmitter<CatalogChannel>();

  catalog = CHANNEL_CATALOG;
  pages = FACEBOOK_PAGES;
  search = '';

  selected: CatalogChannel | null = null;
  stepIndex = 0;

  /** Celebration screen shown after Finish. */
  celebrating = false;
  private completedOnce = false;

  /** Pre-computed confetti pieces — CSS animates them, no JS loop. */
  readonly confetti = this.makeConfetti();

  // path state
  connectionType: 'owned' | 'public' | null = null;
  publicHandle = '';
  storeUrl = '';
  authDone = false;
  authLoading = false;
  selectedPages = new Set<string>();

  /** Real brand logo path for the current channel, or null → use Material icon. */
  brandSvg(id: string | undefined): string | null {
    return id ? (BRAND_ICONS[id] ?? null) : null;
  }
  /** Light tint of a brand colour for the tile background. */
  tint(color: string | undefined): string { return (color ?? '#888888') + '1a'; }

  /* ---- "Add public source" guidance, per channel ---- */
  readonly publicHelpDefault: PublicHelp = {
    label: 'Public profile or page URL',
    placeholder: 'https://www.example.com/yourpage',
    example: 'https://www.example.com/yourpage',
    title: 'Which link should I add?',
    steps: [
      'Open the public profile or page you want to track.',
      'Copy the full web address from your browser’s address bar.',
      'Paste it above — make sure the page opens without a login.',
    ],
  };
  readonly publicHelp: Record<string, PublicHelp> = {
    twitter: {
      label: 'Public X (Twitter) handle',
      placeholder: '@john_doe',
      example: '@john_doe',
      title: 'Where do I find the handle?',
      steps: [
        'Open the profile on X (Twitter).',
        'Copy the @username shown right under the display name.',
        'Paste it above — e.g. @john_doe.',
      ],
    },
    facebook: {
      label: 'Public Facebook page URL',
      placeholder: 'https://www.facebook.com/locobuzz/',
      example: 'https://www.facebook.com/locobuzz/',
      title: 'Where do I find the page URL?',
      steps: [
        'Open the Facebook page in your browser.',
        'Copy the link from the address bar — it looks like facebook.com/yourpage.',
        'Paste the full URL above.',
      ],
    },
    fbgroups: {
      label: 'Public Facebook group URL',
      placeholder: 'https://www.facebook.com/groups/locobuzz',
      example: 'https://www.facebook.com/groups/locobuzz',
      title: 'Where do I find the group URL?',
      steps: [
        'Open the Facebook group in your browser.',
        'Copy the link from the address bar — it looks like facebook.com/groups/…',
        'Paste the full URL above (the group must be public).',
      ],
    },
    instagram: {
      label: 'Public Instagram profile URL',
      placeholder: 'https://www.instagram.com/locobuzz',
      example: 'https://www.instagram.com/locobuzz',
      title: 'Where do I find the profile URL?',
      steps: [
        'Open the Instagram profile.',
        'Copy the profile link (instagram.com/username) or the @username.',
        'Paste it above.',
      ],
    },
    linkedin: {
      label: 'Public LinkedIn page URL',
      placeholder: 'https://www.linkedin.com/company/locobuzz',
      example: 'https://www.linkedin.com/company/locobuzz',
      title: 'Where do I find the page URL?',
      steps: [
        'Open the LinkedIn company or profile page.',
        'Copy the link from the address bar (linkedin.com/company/… or /in/…).',
        'Paste the full URL above.',
      ],
    },
    gmb: {
      label: 'Google Business profile URL',
      placeholder: 'https://maps.google.com/?cid=1234567890',
      example: 'https://maps.google.com/?cid=…  ·  share link from Google Maps',
      title: 'Where do I find the profile link?',
      steps: [
        'Find the business on Google Maps.',
        'Tap Share and copy the link, or copy the URL from the address bar.',
        'Paste the full link above.',
      ],
    },
    reddit: {
      label: 'Public subreddit or user URL',
      placeholder: 'https://www.reddit.com/r/locobuzz',
      example: 'https://www.reddit.com/r/locobuzz  ·  /u/username',
      title: 'Where do I find the link?',
      steps: [
        'Open the subreddit (r/…) or user (u/…) on Reddit.',
        'Copy the link from the address bar.',
        'Paste the full URL above.',
      ],
    },
    playstore: {
      label: 'Google Play app URL',
      placeholder: 'https://play.google.com/store/apps/details?id=com.yourapp',
      example: 'https://play.google.com/store/apps/details?id=com.yourapp',
      title: 'Where do I find the app URL?',
      steps: [
        'Open your app’s page on the Google Play store (web).',
        'Copy the full link from the address bar — it ends with ?id=your.package.name.',
        'Paste the full URL above.',
      ],
    },
    appstore: {
      label: 'Apple App Store URL',
      placeholder: 'https://apps.apple.com/app/id123456789',
      example: 'https://apps.apple.com/app/id123456789',
      title: 'Where do I find the app URL?',
      steps: [
        'Open your app’s page on the App Store (web).',
        'Copy the full link from the address bar — it contains /id followed by numbers.',
        'Paste the full URL above.',
      ],
    },
  };
  /** Guidance entry for the currently-selected channel. */
  get pubHelp(): PublicHelp {
    return this.publicHelp[this.selected?.id ?? ''] ?? this.publicHelpDefault;
  }

  /** Right-side aside help — step-specific clarification once a channel is chosen. */
  get asideHelp(): { eyebrow: string; title: string; lead: string; points: { icon: string; title: string; text: string }[]; tip?: string } {
    const label = this.selected?.label ?? 'this channel';
    switch (this.current) {
      case 'connection':
        return {
          eyebrow: 'About this step', title: 'Owned or public?',
          lead: `Choose how Locobuzz connects to ${label}.`,
          points: [
            { icon: 'lock', title: 'Owned account', text: 'Authenticate to listen and reply from your own account.' },
            { icon: 'public', title: 'Public source', text: 'Track any public profile or URL — listening only, no replies.' },
            { icon: 'swap_horiz', title: 'Switch anytime', text: 'You can change the mode later from Channel Configuration.' },
          ],
          tip: 'Not sure? Pick Owned for your brand’s own account, Public for anyone else.',
        };
      case 'authenticate':
        return {
          eyebrow: 'About this step', title: `Authorize ${label}`,
          lead: `You’ll be redirected to ${label} to grant access via OAuth.`,
          points: [
            { icon: 'verified_user', title: 'OAuth 2.0', text: 'We never see or store your password.' },
            { icon: 'shield', title: 'Granular scopes', text: 'Read-only by default; replies only when you click send.' },
            { icon: 'link_off', title: 'Revoke anytime', text: 'Disconnect access from settings whenever you want.' },
          ],
          tip: 'A secure popup opens — finish sign-in there and you’ll return here automatically.',
        };
      case 'public':
        return {
          eyebrow: 'About this step', title: `Track a public ${label} source`,
          lead: 'Listen to a public profile without logging in.',
          points: [
            { icon: 'hearing', title: 'Listen-only', text: 'You’ll receive mentions but can’t reply.' },
            { icon: 'person_off', title: 'Anonymous', text: 'Mentions arrive without author identity.' },
            { icon: 'link', title: 'Profile link or handle', text: 'Paste the public URL or @handle of the profile.' },
          ],
        };
      case 'url':
        return {
          eyebrow: 'About this step', title: `Monitor a ${label} page`,
          lead: 'Collect reviews, ratings and Q&A from a public page.',
          points: [
            { icon: 'link', title: 'Public page link', text: 'Use the full https:// product or store URL.' },
            { icon: 'reviews', title: 'Reviews & ratings', text: 'We gather public feedback automatically.' },
            { icon: 'lock_open', title: 'No login needed', text: 'The page must open without signing in.' },
          ],
        };
      case 'pages':
        return {
          eyebrow: 'About this step', title: 'Pick your pages',
          lead: `Choose which ${label} pages to connect.`,
          points: [
            { icon: 'checklist', title: 'One or many', text: 'Connect a single page or several at once.' },
            { icon: 'inbox', title: 'Unified inbox', text: 'All selected pages feed one shared inbox.' },
            { icon: 'tune', title: 'Adjust later', text: 'Add or remove pages anytime.' },
          ],
        };
      case 'review':
        return {
          eyebrow: 'About this step', title: 'Almost there',
          lead: 'Review the setup and finish to start syncing.',
          points: [
            { icon: 'bolt', title: 'Starts in a minute', text: 'Collection begins right after you finish.' },
            { icon: 'trending_up', title: 'Unified insights', text: 'Mentions flow into analytics and your inbox.' },
            { icon: 'add_circle', title: 'Add more', text: 'Connect more channels anytime.' },
          ],
        };
      default:
        return { eyebrow: 'About this step', title: 'Setting up', lead: '', points: [] };
    }
  }

  /** Channels we surface as "Popular" with a badge in the chooser. */
  readonly popularIds = new Set(['twitter', 'facebook', 'instagram', 'tiktok']);
  isPopular(c: CatalogChannel): boolean { return this.popularIds.has(c.id); }
  /** Sub-label under a non-popular channel tile (mirrors the reference design). */
  channelSub(c: CatalogChannel): string {
    if (c.tag) return c.tag;
    if (c.flow === 'url') return 'URL · instant';
    return 'OAuth · ~30s';
  }

  // ---- dynamic step model ------------------------------------------------
  /** Material Symbols glyph shown in the stepper node for each step. */
  readonly stepIcons: Record<StepKey, string> = {
    choose: 'grid_view',
    connection: 'hub',
    authenticate: 'lock',
    public: 'public',
    pages: 'list_alt',
    url: 'link',
    review: 'task_alt',
  };

  /** The steps shown in the top progress bar — depends on channel + path. */
  get steps(): Step[] {
    const choose: Step = { key: 'choose', label: 'Choose channel' };
    const review: Step = { key: 'review', label: 'Review & complete' };
    // Default preview (no channel chosen yet): a typical 3-step path.
    if (!this.selected) return [choose, { key: 'authenticate', label: 'Authenticate' }, review];

    switch (this.selected.flow) {
      case 'choice': {
        const connection: Step = { key: 'connection', label: 'Connection type' };
        if (this.connectionType === 'owned') {
          const owned: Step[] = [choose, connection, { key: 'authenticate', label: 'Authenticate' }];
          if (this.selected.pages) owned.push({ key: 'pages', label: 'Select accounts' });
          owned.push(review);
          return owned;
        }
        if (this.connectionType === 'public')
          return [choose, connection, { key: 'public', label: 'Add public source' }, review];
        return [choose, connection, review];
      }
      case 'pages':
        return [choose,
          { key: 'authenticate', label: 'Authenticate' },
          { key: 'pages', label: 'Select accounts' },
          review];
      case 'oauth':
        return [choose, { key: 'authenticate', label: 'Authenticate' }, review];
      case 'handle':
        return [choose, { key: 'public', label: 'Add public source' }, review];
      case 'url':
        return [choose, { key: 'url', label: 'Add store URL' }, review];
    }
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
    // reset any path state from a previous selection
    this.connectionType = null;
    this.publicHandle = '';
    this.storeUrl = '';
    this.authDone = false;
    this.authLoading = false;
    this.selectedPages.clear();
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

  // ---- pages step --------------------------------------------------------
  togglePage(id: string) {
    this.selectedPages.has(id) ? this.selectedPages.delete(id) : this.selectedPages.add(id);
  }
  get allPagesSelected(): boolean { return this.selectedPages.size === this.pages.length; }
  toggleAllPages() {
    if (this.allPagesSelected) this.selectedPages.clear();
    else this.pages.forEach(p => this.selectedPages.add(p.id));
  }
  get selectedPageList(): FacebookPage[] {
    return this.pages.filter(p => this.selectedPages.has(p.id));
  }

  // ---- navigation --------------------------------------------------------
  get canContinue(): boolean {
    switch (this.current) {
      case 'choose':       return !!this.selected;
      case 'connection':   return !!this.connectionType;
      case 'authenticate': return this.authDone;
      case 'public':       return this.publicHandle.trim().length > 0;
      case 'pages':        return this.selectedPages.size > 0;
      case 'url':          return this.isValidUrl(this.storeUrl);
      case 'review':       return true;
      default:             return false;
    }
  }

  /** Light URL check — must look like a real http(s) web address. */
  isValidUrl(value: string): boolean {
    const v = value.trim();
    return /^https?:\/\/.+\..+/i.test(v);
  }

  get onReview(): boolean { return this.current === 'review'; }

  next() {
    if (!this.canContinue) return;
    if (this.onReview) { this.finish(); return; }
    this.stepIndex = Math.min(this.stepIndex + 1, this.totalSteps - 1);
  }

  back() {
    if (this.stepIndex > 0) this.stepIndex--;
  }

  finish() {
    // Show the celebration, then auto-complete; user can also click Done.
    this.celebrating = true;
    setTimeout(() => this.complete(), 3600);
  }

  /** Emit the added channel and close — guarded so it only runs once. */
  complete() {
    if (this.completedOnce) return;
    this.completedOnce = true;
    if (this.selected) this.added.emit(this.selected);
    this.close();
  }

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

  // ---- review summary value ---------------------------------------------
  get connectionLabel(): string {
    if (this.selected?.flow === 'choice') return this.connectionType === 'public' ? 'Public' : 'Owned';
    if (this.selected?.flow === 'handle') return 'Public';
    if (this.selected?.flow === 'url') return 'URL source';
    return 'Owned';
  }

  /** Whether the chosen path is listen-only (no engagement / reply). */
  get isListenOnly(): boolean {
    return this.connectionType === 'public'
      || this.selected?.flow === 'handle'
      || this.selected?.flow === 'url';
  }

  /** Account value shown on the Review card. */
  get reviewAccount(): string {
    if (this.publicHandle.trim()) return this.publicHandle.trim();
    if (this.storeUrl.trim()) return this.storeUrl.trim();
    if (this.selectedPageList.length) return this.selectedPageList.length + ' account(s)';
    return '@your_brand';
  }
  /** Permission summary shown on the Review card. */
  get reviewPermissions(): string {
    return this.isListenOnly ? 'Read only' : 'Read · Reply';
  }
}
