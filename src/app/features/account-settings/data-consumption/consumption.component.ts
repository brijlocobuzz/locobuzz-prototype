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
    { title: 'Monthly Data Consumption', used: 93200, total: 100000, hasDetails: true, detailsRoute: 'data-consumption/monthly' },
    { title: 'Historic Data Credit Consumption', used: 5960000, total: 14660000, hasDetails: true, detailsRoute: 'data-consumption/historic' },
    { title: 'User Licenses', used: 1800, total: 3000 },
    { title: 'Social Media Profiles', used: 2034, total: 3000 },
    { title: 'Topic/Keyword Search', used: 116, total: 2000 },
    { title: 'Brand', used: 361, total: 370 },
    { title: 'Digital Command Center', used: 74, total: 97 },
    { title: 'FB Location', used: 0, total: 139 },
    { title: 'GMB Location', used: 3670, total: 5000 },
    { title: 'Other Channels URLs', used: 1480, total: 2100 },
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

  get filteredCards(): UsageCard[] {
    return this.filter === 'all'
      ? this.cards
      : this.cards.filter(c => c.status === this.filter);
  }

  setFilter(f: StatusFilter) {
    // Clicking the active chip clears the filter (toggle back to all).
    this.filter = this.filter === f ? 'all' : f;
  }

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
