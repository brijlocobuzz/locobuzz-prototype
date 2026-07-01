import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IncreaseLimitDialogComponent } from './increase-limit-dialog.component';

type UsageStatus = 'critical' | 'low' | 'good' | 'exceeded';
type StatusFilter = 'all' | 'critical' | 'low' | 'good';

interface RawUsage {
  title: string;
  used: number;
  total: number;
  hasDetails?: boolean;   // shows the "Show Details" action
  detailsRoute?: string;  // route opened by "Show Details"
  /** Short consequence shown inline on the card (one line). */
  impact?: string;
  /** Full descriptive consequence shown in the hover popover. */
  impactDetail?: string;
}

interface UsageCard {
  title: string;
  used: number;
  total: number;
  remaining: number;
  remainingPct: number;   // 0 - 100
  usedPct: number;        // 0 - 100
  status: UsageStatus;
  statusLabel: string;
  isEmpty: boolean;       // nothing consumed yet
  hasDetails: boolean;
  detailsRoute?: string;
  impact?: string;        // short consequence shown on critical / exceeded cards
  impactDetail?: string;  // full consequence shown in the hover popover
}

@Component({
  selector: 'app-consumption',
  standalone: true,
  imports: [CommonModule, IncreaseLimitDialogComponent],
  templateUrl: './consumption.component.html',
  styleUrl: './consumption.component.scss',
})
export class ConsumptionComponent {
  /** Fixed set of services provided by Locobuzz (not dynamic). */
  private readonly raw: RawUsage[] = [
    { title: 'Monthly Data Consumption', used: 93200, total: 100000, hasDetails: true, detailsRoute: 'data-consumption/monthly', impact: 'Data collection stops', impactDetail: 'Once this limit is reached, new mentions stop being collected for the rest of the cycle — your dashboards, reports and alerts will miss data until the limit is increased.' },
    { title: 'Historic Data Credit Consumption', used: 5960000, total: 14660000, hasDetails: true, detailsRoute: 'data-consumption/historic', impact: 'Historic pulls blocked', impactDetail: 'Once credits run out, pulling historic data for any brand will be blocked until you add more credits.' },
    { title: 'User Licenses', used: 1800, total: 3000, impact: "Can't add users", impactDetail: "Once this limit is reached, you won't be able to add or invite new users to the account until the limit is increased." },
    { title: 'Social Media Profiles', used: 2034, total: 3000, impact: "Can't add profiles", impactDetail: "Once this limit is reached, you won't be able to connect new social media profiles for monitoring until the limit is increased." },
    { title: 'Topic/Keyword Search', used: 116, total: 2000, impact: "Can't add searches", impactDetail: "Once this limit is reached, you won't be able to create new topic or keyword searches until the limit is increased." },
    { title: 'Brand', used: 361, total: 370, impact: "Can't add new brands", impactDetail: "Once this limit is reached, you won't be able to add new brands to monitor until the limit is increased." },
    { title: 'Digital Command Center', used: 74, total: 97, impact: "Can't add command centers", impactDetail: "Once this limit is reached, you won't be able to create new command center dashboards until the limit is increased." },
    { title: 'FB Location', used: 0, total: 139, impact: "Can't add FB locations", impactDetail: "Once this limit is reached, you won't be able to add new Facebook locations until the limit is increased." },
    { title: 'GMB Location', used: 3670, total: 5000, impact: "Can't add Google locations", impactDetail: "Once this limit is reached, you won't be able to add new Google Business locations until the limit is increased." },
    { title: 'Other Channels URLs', used: 1480, total: 2100, impact: "Can't add channel URLs", impactDetail: "Once this limit is reached, you won't be able to add new channel URLs to track until the limit is increased." },
  ];

  /** Status sort priority: critical first, then low, then good. */
  private readonly order: Record<UsageStatus, number> = {
    exceeded: -1, critical: 0, low: 1, good: 2,
  };

  cards: UsageCard[] = this.raw
    .map(r => this.toCard(r))
    .sort((a, b) =>
      this.order[a.status] - this.order[b.status]  // critical → low → good
      || a.remainingPct - b.remainingPct);         // least remaining first within a group

  constructor(private host: ElementRef<HTMLElement>, private router: Router) {}

  showDetails(c: UsageCard) {
    if (c.detailsRoute) this.router.navigate(['/account-settings', ...c.detailsRoute.split('/')]);
  }

  private toCard(r: RawUsage): UsageCard {
    const remaining = r.total - r.used;
    const remainingPct = r.total > 0 ? (remaining / r.total) * 100 : 0;
    const usedPct = r.total > 0 ? (r.used / r.total) * 100 : 0;
    const status = this.statusOf(r.used, r.total, remainingPct);
    return {
      ...r,
      remaining,
      remainingPct,
      usedPct,
      status,
      statusLabel: status.charAt(0).toUpperCase() + status.slice(1),
      isEmpty: r.used === 0,
      hasDetails: !!r.hasDetails,
      detailsRoute: r.detailsRoute,
    };
  }

  /* ---- Summary + filtering ---- */
  filter: StatusFilter = 'all';

  count(status: UsageStatus): number {
    return this.cards.filter(c => c.status === status).length;
  }

  /** Critical or exceeded cards swap the bar for the alert message. */
  isAtRisk(c: UsageCard): boolean {
    return c.status === 'critical' || c.status === 'exceeded';
  }

  /* ---- Global at-risk banner ---- */
  bannerDismissed = false;
  get atRiskCards(): UsageCard[] { return this.cards.filter(c => this.isAtRisk(c)); }
  get hasExceeded(): boolean { return this.cards.some(c => c.status === 'exceeded'); }
  /** e.g. "Brand, Monthly Data Consumption and 3 more". */
  get atRiskNames(): string {
    const names = this.atRiskCards.map(c => c.title);
    if (names.length <= 2) return names.join(' and ');
    return `${names.slice(0, 2).join(', ')} and ${names.length - 2} more`;
  }

  get filteredCards(): UsageCard[] {
    return this.filter === 'all'
      ? this.cards
      : this.cards.filter(c => c.status === this.filter);
  }

  /** At-risk services → prominent 2-up cards; the rest → compact grid.
      Each group is sorted so the lowest-remaining (most urgent) shows first,
      keeping status priority (exceeded → critical, and warning → good). */
  private byUrgency = (a: UsageCard, b: UsageCard) =>
    this.order[a.status] - this.order[b.status]   // severity first
    || a.remaining - b.remaining;                 // lowest remaining count first within a status

  get bigCards(): UsageCard[] {
    return this.filteredCards.filter(c => this.isAtRisk(c)).sort(this.byUrgency);
  }
  get smallCards(): UsageCard[] {
    return this.filteredCards.filter(c => !this.isAtRisk(c)).sort(this.byUrgency);
  }

  setFilter(f: StatusFilter) {
    // Clicking the active chip clears the filter (toggle back to all).
    this.filter = this.filter === f ? 'all' : f;
  }

  /** Banner action — always focus the critical services (one-way, never toggles off). */
  reviewCritical() { this.filter = 'critical'; }

  /** Exact, grouped value for tooltips — e.g. "5,960,000". */
  exact(n: number): string {
    return n.toLocaleString('en-US');
  }

  private statusOf(used: number, total: number, remainingPct: number): UsageStatus {
    if (used > total) return 'exceeded';
    if (remainingPct < 10) return 'critical';
    if (remainingPct < 30) return 'low';
    return 'good';
  }

  /** Compact number format: 199.2K, 5.96M, 116. */
  compact(n: number): string {
    if (n < 1000) return `${n}`;
    if (n < 1_000_000) return `${this.trim(n / 1000)}K`;
    return `${this.trim(n / 1_000_000)}M`;
  }

  private trim(v: number): string {
    return v.toFixed(2).replace(/\.?0+$/, '');
  }

  /** Bar width reflects the consumed (used) proportion, capped to 0-100. */
  barWidth(c: UsageCard): string {
    const usedPct = c.total > 0 ? (c.used / c.total) * 100 : 0;
    return `${Math.max(0, Math.min(100, usedPct))}%`;
  }

  /** Date-range dropdown. */
  dateOpen = false;
  readonly dateOptions = [
    'Current Month till date',
    'Jun 2026', 'May 2026', 'Apr 2026',
    'Mar 2026', 'Feb 2026', 'Jan 2026',
  ];
  selectedRange = this.dateOptions[0];

  toggleDate() { this.dateOpen = !this.dateOpen; }

  selectRange(opt: string) {
    this.selectedRange = opt;
    this.dateOpen = false;
  }

  /** Close the date menu on outside click. */
  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    if (this.dateOpen && !this.host.nativeElement.querySelector('.dc-date-wrap')?.contains(e.target as Node)) {
      this.dateOpen = false;
    }
  }

  /** Close the date menu on Escape. */
  @HostListener('document:keydown.escape')
  onEscape() {
    this.dateOpen = false;
  }

  /* ---- Increase-limit dialog (handled by the shared dialog component) ---- */
  quotaCard: UsageCard | null = null;
  openQuota(c: UsageCard) { this.quotaCard = c; }
  closeQuota() { this.quotaCard = null; }
}
