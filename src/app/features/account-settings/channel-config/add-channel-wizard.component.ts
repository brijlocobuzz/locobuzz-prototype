import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CHANNEL_CATALOG, FACEBOOK_PAGES, BRAND_ICONS,
  CatalogChannel, CatalogGroup, FacebookPage,
} from '../channel-data';

type StepKey = 'choose' | 'connection' | 'authenticate' | 'public' | 'pages' | 'url' | 'review';
interface Step { key: StepKey; label: string; }

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

  // ---- dynamic step model ------------------------------------------------
  /** The steps shown in the top progress bar — depends on channel + path. */
  get steps(): Step[] {
    const choose: Step = { key: 'choose', label: 'Choose channel' };
    const review: Step = { key: 'review', label: 'Review & finish' };
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
}
