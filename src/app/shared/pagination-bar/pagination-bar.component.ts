import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable table/grid pagination footer.
 *
 *  ┌───────────────────────────────────────────────────────────────────────┐
 *  │ Showing 1-10 of 568 brands       ‹ [1] 2 3 4 … 57 ›        ROWS [ 10 ▾ ]│
 *  └───────────────────────────────────────────────────────────────────────┘
 *
 * Stateless: the parent owns `page`/`pageSize` and slices its own rows. This
 * component only renders the controls and emits the requested changes.
 */
@Component({
  selector: 'app-pagination-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination-bar.component.html',
  styleUrl: './pagination-bar.component.scss',
})
export class PaginationBarComponent {
  /** Total number of (filtered) rows across all pages. */
  @Input() total = 0;
  /** Current 1-based page. */
  @Input() page = 1;
  /** Rows per page. */
  @Input() pageSize = 10;
  /** Plural noun shown in "of N <noun>" (e.g. "brands", "users"). */
  @Input() noun = 'records';
  /** Page-size choices in the ROWS dropdown. */
  @Input() pageSizes: number[] = [10, 25, 50, 100];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }
  get fromRow(): number {
    return this.total === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
  }
  get toRow(): number {
    return Math.min(this.page * this.pageSize, this.total);
  }

  /** Page tokens with gaps collapsed to '…' (always shows first/last + neighbours). */
  get pages(): (number | '…')[] {
    const last = this.totalPages;
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);

    const out: (number | '…')[] = [1];
    const start = Math.max(2, this.page - 1);
    const end = Math.min(last - 1, this.page + 1);
    if (start > 2) out.push('…');
    for (let i = start; i <= end; i++) out.push(i);
    if (end < last - 1) out.push('…');
    out.push(last);
    return out;
  }

  isGap(p: number | '…'): boolean { return p === '…'; }

  go(p: number) {
    const next = Math.min(this.totalPages, Math.max(1, p));
    if (next !== this.page) this.pageChange.emit(next);
  }
  prev() { this.go(this.page - 1); }
  next() { this.go(this.page + 1); }

  onSize(ev: Event) {
    const size = +(ev.target as HTMLSelectElement).value;
    this.pageSizeChange.emit(size);
  }
}
