import { Component, EventEmitter, Input, OnInit, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  EMPTY_FILTERS,
  NETWORK_META,
  PostFilters,
  PostNetwork,
  SocialPost,
} from '../social-posts.data';

export type FilterCategoryKey = keyof PostFilters;

interface FilterCategory {
  key: FilterCategoryKey;
  label: string;
  icon: string;
  searchHint: string;
}

interface FilterOption {
  value: string;
  label: string;
  sub?: string;
  /** Small leading visual: a network badge or an initials avatar. */
  badge?: { color: string; glyph: string; isIcon: boolean };
}

@Component({
  selector: 'app-post-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-filter.component.html',
  styleUrl: './post-filter.component.scss',
})
export class PostFilterComponent implements OnInit {
  @Input({ required: true }) posts: SocialPost[] = [];
  @Input({ required: true }) applied: PostFilters = EMPTY_FILTERS;
  @Output() appliedChange = new EventEmitter<PostFilters>();

  readonly categories: FilterCategory[] = [
    { key: 'channels', label: 'Channels',        icon: 'hub',            searchHint: 'Search channels' },
    { key: 'profiles', label: 'Social Profiles', icon: 'account_circle', searchHint: 'Search profiles' },
    { key: 'members',  label: 'Team Members',    icon: 'group',          searchHint: 'Search members' },
    { key: 'labels',   label: 'Post Labels',     icon: 'sell',           searchHint: 'Search labels' },
  ];

  readonly open = signal(false);
  readonly activeCat = signal<FilterCategoryKey>('channels');
  readonly draft = signal<PostFilters>(EMPTY_FILTERS);
  readonly optionSearch = signal('');

  private optionsByCat: Record<FilterCategoryKey, FilterOption[]> = {
    channels: [], profiles: [], members: [], labels: [],
  };

  /** Options for the active category, narrowed by the option search box. */
  readonly options = computed<FilterOption[]>(() => {
    const term = this.optionSearch().trim().toLowerCase();
    const all = this.optionsByCat[this.activeCat()];
    return term
      ? all.filter(o => `${o.label} ${o.sub ?? ''}`.toLowerCase().includes(term))
      : all;
  });

  readonly draftCount = computed(() =>
    (Object.keys(this.draft()) as FilterCategoryKey[]).reduce((n, k) => n + this.draft()[k].length, 0));

  get appliedCount(): number {
    return (Object.keys(this.applied) as FilterCategoryKey[]).reduce((n, k) => n + this.applied[k].length, 0);
  }

  ngOnInit(): void {
    this.optionsByCat = this.buildOptions();
  }

  togglePanel(): void {
    this.open() ? this.cancel() : this.openPanel();
  }

  openPanel(): void {
    this.draft.set(this.clone(this.applied));
    this.optionSearch.set('');
    this.open.set(true);
  }

  cancel(): void {
    this.open.set(false);
  }

  apply(): void {
    this.appliedChange.emit(this.clone(this.draft()));
    this.open.set(false);
  }

  clearAll(): void {
    this.draft.set(EMPTY_FILTERS);
  }

  selectCategory(key: FilterCategoryKey): void {
    this.activeCat.set(key);
    this.optionSearch.set('');
  }

  isSelected(value: string): boolean {
    return (this.draft()[this.activeCat()] as string[]).includes(value);
  }

  toggleValue(value: string): void {
    const key = this.activeCat();
    const d = this.draft();
    const current = d[key] as string[];
    const list = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    this.draft.set({ ...d, [key]: list } as PostFilters);
  }

  draftCountFor(key: FilterCategoryKey): number {
    return this.draft()[key].length;
  }

  activeCategory(): FilterCategory {
    return this.categories.find(c => c.key === this.activeCat())!;
  }

  trackCat = (_: number, c: FilterCategory) => c.key;
  trackOpt = (_: number, o: FilterOption) => o.value;

  private clone(f: PostFilters): PostFilters {
    return { channels: [...f.channels], profiles: [...f.profiles], members: [...f.members], labels: [...f.labels] };
  }

  private buildOptions(): Record<FilterCategoryKey, FilterOption[]> {
    const channels = new Map<PostNetwork, number>();
    const profiles = new Map<string, FilterOption>();
    const members = new Map<string, number>();
    const labels = new Map<string, number>();

    for (const p of this.posts) {
      channels.set(p.network, (channels.get(p.network) ?? 0) + 1);
      if (!profiles.has(p.account.handle)) {
        profiles.set(p.account.handle, {
          value: p.account.handle,
          label: p.account.name,
          sub: p.account.handle,
          badge: { color: p.account.avatarColor, glyph: p.account.initials, isIcon: false },
        });
      }
      members.set(p.postedBy, (members.get(p.postedBy) ?? 0) + 1);
      for (const l of p.labels ?? []) {
        if (!/^\+\d+$/.test(l)) labels.set(l, (labels.get(l) ?? 0) + 1);
      }
    }

    return {
      channels: [...channels.entries()].map(([net, n]) => ({
        value: net,
        label: NETWORK_META[net].label,
        sub: `${n} post${n === 1 ? '' : 's'}`,
        badge: { color: NETWORK_META[net].color, glyph: NETWORK_META[net].glyph, isIcon: NETWORK_META[net].isIcon },
      })),
      profiles: [...profiles.values()],
      members: [...members.entries()].map(([name, n]) => ({
        value: name,
        label: name,
        sub: `${n} post${n === 1 ? '' : 's'}`,
        badge: { color: '#6366f1', glyph: name.charAt(0), isIcon: false },
      })),
      labels: [...labels.entries()].map(([label, n]) => ({
        value: label,
        label,
        sub: `${n} post${n === 1 ? '' : 's'}`,
      })),
    };
  }
}
