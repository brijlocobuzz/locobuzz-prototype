import { Component, ElementRef, Input, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NETWORK_META, NetworkMeta, SocialPost } from '../social-posts.data';

interface StatDef {
  key: keyof NonNullable<SocialPost['stats']>;
  icon: string;
  tone: 'like' | 'comment' | 'share' | 'reach';
  label: string;
}

/** Media types whose caption is overlaid on the media itself (per approved design). */
const OVERLAY_CAPTION_TYPES: ReadonlySet<string> = new Set(['image', 'carousel', 'video', 'story']);

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent {
  @Input({ required: true }) post!: SocialPost;

  @ViewChild('profileTrack') profileTrack?: ElementRef<HTMLElement>;

  /** Current carousel slide (0-based). */
  readonly slide = signal(0);
  /** Selected target profile in the multi-profile strip. */
  readonly selectedProfile = signal(0);

  readonly stats: StatDef[] = [
    { key: 'likes',       icon: 'favorite',      tone: 'like',    label: 'Likes' },
    { key: 'comments',    icon: 'mode_comment',  tone: 'comment', label: 'Comments' },
    { key: 'shares',      icon: 'share',         tone: 'share',   label: 'Shares' },
    { key: 'impressions', icon: 'auto_awesome',  tone: 'reach',   label: 'Impressions' },
  ];

  net(key: SocialPost['network'] = this.post.network): NetworkMeta {
    return NETWORK_META[key];
  }

  /** Caption sits on the media for visual posts, in the body for text/document posts. */
  get overlayCaption(): boolean {
    return OVERLAY_CAPTION_TYPES.has(this.post.mediaType) && !!this.post.caption;
  }

  get bodyCaption(): boolean {
    return !!this.post.caption && !this.overlayCaption;
  }

  get slideCount(): number {
    return this.post.mediaCount ?? 1;
  }

  mediaUrl(w = 640, h = 400): string {
    const i = this.slide();
    const seed = i > 0 ? `${this.post.mediaSeed}-${i}` : this.post.mediaSeed;
    return `https://picsum.photos/seed/${seed}/${w}/${h}`;
  }

  prevSlide(): void {
    this.slide.set((this.slide() - 1 + this.slideCount) % this.slideCount);
  }

  nextSlide(): void {
    this.slide.set((this.slide() + 1) % this.slideCount);
  }

  scrollProfiles(dir: -1 | 1): void {
    this.profileTrack?.nativeElement.scrollBy({ left: dir * 132, behavior: 'smooth' });
  }

  trackStat = (_: number, s: StatDef) => s.key;
  trackChannel = (i: number) => i;
}
