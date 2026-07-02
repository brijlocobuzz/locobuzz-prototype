import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BRAND_ICONS } from '../channel-data';
import {
  REAL_TIME_QUERIES, CHANNELS, KW_BRANDS, RealTimeQuery, QueryStatus,
} from './keywords-data';
import { AddKeywordsComponent, NewQueryPayload } from './add-keywords/add-keywords.component';
import { PaginationBarComponent } from '../../../shared/pagination-bar/pagination-bar.component';

@Component({
  selector: 'app-keywords-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule, AddKeywordsComponent, PaginationBarComponent],
  templateUrl: './keywords-configuration.component.html',
  styleUrl: './keywords-configuration.component.scss',
})
export class KeywordsConfigurationComponent {
  readonly CHANNELS = CHANNELS;
  readonly BRAND_ICONS = BRAND_ICONS;
  readonly brands = KW_BRANDS;

  queries: RealTimeQuery[] = [...REAL_TIME_QUERIES];

  brand = KW_BRANDS[0];
  brandOpen = false;
  search = '';
  wizardOpen = false;

  page = 1;
  pageSize = 10;

  constructor(private router: Router) {}

  back() { this.router.navigate(['/account-settings']); }

  /** Real brand-logo SVG path for a channel id (null → use Material glyph). */
  channelSvg(id: string): string | null { return this.CHANNELS[id]?.svg ?? null; }

  selectBrand(b: string) { this.brand = b; this.brandOpen = false; this.page = 1; }

  onSearch(q: string) { this.search = q; this.page = 1; }

  /** Total count and active (non-paused, non-pending) count for the header pill. */
  get totalCount(): number { return this.queries.length; }
  get activeCount(): number {
    return this.queries.filter(q => q.status === 'Collecting data').length;
  }

  /** Status → CSS state class. */
  statusClass(s: QueryStatus): string {
    switch (s) {
      case 'Collecting data': return 'ok';
      case 'Approval pending': return 'pending';
      case 'Data Collection Pause': return 'paused';
    }
  }

  /** Queries after the free-text search (all pages). */
  get filtered(): RealTimeQuery[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.queries;
    return this.queries.filter(row =>
      row.name.toLowerCase().includes(q) ||
      row.terms.some(t => t.text.toLowerCase().includes(q)));
  }
  get total(): number { return this.filtered.length; }
  get displayRows(): RealTimeQuery[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  /** Toggle a paused query back to collecting (or pause a collecting one). */
  togglePause(row: RealTimeQuery) {
    row.status = row.status === 'Data Collection Pause' ? 'Collecting data' : 'Data Collection Pause';
  }

  onQuerySaved(payload: NewQueryPayload) {
    this.queries = [
      {
        id: 'q' + (this.queries.length + 1) + '-' + payload.name.replace(/\s+/g, '-').toLowerCase(),
        name: payload.name,
        terms: payload.terms.map(t => ({ text: t })),
        connector: payload.connector,
        channels: payload.channels,
        createdOn: payload.createdOn,
        vault: 'NA',
        status: 'Approval pending',
        historicSince: payload.historicSince,
      },
      ...this.queries,
    ];
    this.page = 1;
    this.wizardOpen = false;
  }
}
