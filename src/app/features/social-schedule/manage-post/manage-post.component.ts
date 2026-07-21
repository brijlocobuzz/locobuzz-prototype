import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PostCardComponent } from '../post-card/post-card.component';
import { PostFilterComponent, FilterCategoryKey } from '../post-filter/post-filter.component';
import {
  DURATION_OPTIONS,
  EMPTY_FILTERS,
  NETWORK_META,
  POST_BRANDS,
  PostFilters,
  PostNetwork,
  PostStatus,
  SOCIAL_POSTS,
  STATUS_TABS,
  SocialPost,
  StatusTabDef,
} from '../social-posts.data';

/** One removable chip in the applied-filters row. */
interface FilterChip {
  category: FilterCategoryKey;
  value: string;
  label: string;
  icon: string;
  color?: string;   // channel chips carry their network colour
}

const CHIP_ICONS: Record<FilterCategoryKey, string> = {
  channels: 'hub',
  profiles: 'account_circle',
  members: 'person',
  labels: 'sell',
};

@Component({
  selector: 'app-manage-post',
  standalone: true,
  imports: [CommonModule, FormsModule, MatMenuModule, MatTooltipModule, PostCardComponent, PostFilterComponent],
  templateUrl: './manage-post.component.html',
  styleUrl: './manage-post.component.scss',
})
export class ManagePostComponent {
  readonly posts = SOCIAL_POSTS;
  readonly tabs = STATUS_TABS;
  readonly brands = POST_BRANDS;
  readonly durations = DURATION_OPTIONS;

  /** Manage Post / Calendar switch — both live in the left nav rail. */
  readonly view = signal<'manage' | 'calendar'>('manage');

  readonly brand = signal(POST_BRANDS[0]);
  readonly duration = signal('Last 90 Days');
  readonly search = signal('');
  readonly activeTab = signal<'all' | PostStatus>('all');
  readonly filters = signal<PostFilters>(EMPTY_FILTERS);
  /** Collapses the status rail to icons-only for maximum grid width. */
  readonly railSlim = signal(false);

  /** Posts narrowed by brand + search + filters (status applied after, so tab counts stay live). */
  private readonly scoped = computed<SocialPost[]>(() => {
    const brand = this.brand();
    const term = this.search().trim().toLowerCase();
    const f = this.filters();

    return this.posts.filter(p =>
      (brand === 'All Brands' || p.brand === brand) &&
      (!f.channels.length || f.channels.includes(p.network)) &&
      (!f.profiles.length || f.profiles.includes(p.account.handle)) &&
      (!f.members.length || f.members.includes(p.postedBy)) &&
      (!f.labels.length || (p.labels ?? []).some(l => f.labels.includes(l))) &&
      (!term ||
        p.caption?.toLowerCase().includes(term) ||
        p.account.name.toLowerCase().includes(term) ||
        p.hashtags?.some(t => t.toLowerCase().includes(term))),
    );
  });

  readonly filtered = computed<SocialPost[]>(() => {
    const tab = this.activeTab();
    const scoped = this.scoped();
    return tab === 'all' ? scoped : scoped.filter(p => p.status === tab);
  });

  readonly counts = computed<Record<string, number>>(() => {
    const scoped = this.scoped();
    const counts: Record<string, number> = {};
    for (const t of this.tabs) counts[t.key] = 0;
    counts['all'] = scoped.length;
    for (const p of scoped) counts[p.status] += 1;
    return counts;
  });

  /** Flat chips for every applied filter value, shown under the status row. */
  readonly filterChips = computed<FilterChip[]>(() => {
    const f = this.filters();
    return [
      ...f.channels.map(v => ({
        category: 'channels' as const, value: v, icon: CHIP_ICONS.channels,
        label: NETWORK_META[v as PostNetwork].label, color: NETWORK_META[v as PostNetwork].color,
      })),
      ...f.profiles.map(v => ({ category: 'profiles' as const, value: v, label: v, icon: CHIP_ICONS.profiles })),
      ...f.members.map(v => ({ category: 'members' as const, value: v, label: v, icon: CHIP_ICONS.members })),
      ...f.labels.map(v => ({ category: 'labels' as const, value: v, label: v, icon: CHIP_ICONS.labels })),
    ];
  });

  removeFilter(chip: FilterChip): void {
    const f = this.filters();
    this.filters.set({
      ...f,
      [chip.category]: (f[chip.category] as string[]).filter(v => v !== chip.value),
    } as PostFilters);
  }

  clearFilters(): void {
    this.filters.set(EMPTY_FILTERS);
  }

  trackTab = (_: number, t: StatusTabDef) => t.key;
  trackPost = (_: number, p: SocialPost) => p.id;
  trackByValue = (_: number, v: string) => v;
  trackChip = (_: number, c: FilterChip) => c.category + c.value;
}
