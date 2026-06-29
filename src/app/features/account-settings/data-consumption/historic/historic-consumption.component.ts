import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BRAND_ICONS } from '../../channel-data';

interface BrandSeg { name: string; color: string; value: number; pct: number; }
interface ChannelSeg { name: string; initials: string; id?: string; color: string; pct: number; count: number; }

@Component({
  selector: 'app-historic-consumption',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historic-consumption.component.html',
  styleUrl: './historic-consumption.component.scss',
})
export class HistoricConsumptionComponent {
  /* ---- Headline figures (dummy, mirrors the Historic Consumption screen) ---- */
  readonly limit = 14660332;          // total historic data credit pool
  readonly used = 5961900;            // credits consumed
  readonly totalBrands = 66;

  get remaining(): number { return this.limit - this.used; }
  get usedPct(): number { return (this.used / this.limit) * 100; }
  get remainingPct(): number { return 100 - this.usedPct; }
  get healthy(): boolean { return this.remainingPct >= 30; }

  /* ---- Brand composition ---- */
  private readonly brandSrc = [
    { name: 'Colors TV - Krishna Mohini', color: '#d99a16', pct: 22.7 },
    { name: 'Cards UAT',                  color: '#2bb3e0', pct: 21.8 },
    { name: 'Jetstar Japan',              color: '#3bbf4d', pct: 13.7 },
    { name: 'AJIO',                       color: '#6c3fd1', pct: 11.0 },
    { name: '1 97 QA TEst brand',         color: '#e0392b', pct: 6.6 },
  ];
  brands: BrandSeg[] = [];

  /* ---- Channel composition (per selected brand) ---- */
  private readonly channelSrc = [
    { name: 'X (Twitter)',   initials: 'X',  id: 'twitter',   color: '#111827', pct: 42 },
    { name: 'Facebook',      initials: 'Fb', id: 'facebook',  color: '#1877F2', pct: 26 },
    { name: 'Instagram',     initials: 'Ig', id: 'instagram', color: '#E1306C', pct: 17 },
    { name: 'Reddit',        initials: 'Rd', id: 'reddit',    color: '#FF4500', pct: 9 },
    { name: 'Other Channel', initials: 'Oc',                  color: '#9aa1ad', pct: 6 },
  ];
  channels: ChannelSeg[] = [];

  selectedBrand = 'Jetstar Japan';
  brandOptions: string[] = [];
  brandFilterOpen = false;

  /* ---- hover state ---- */
  hoverBrand: string | null = null;
  hoverChannel: string | null = null;
  tip: { x: number; y: number; title: string; sub: string; color: string } | null = null;

  constructor(private router: Router) {
    let acc = 0;
    const named: BrandSeg[] = this.brandSrc.map(b => {
      const value = Math.round((b.pct / 100) * this.used);
      acc += value;
      return { name: b.name, color: b.color, value, pct: b.pct };
    });
    const otherVal = this.used - acc;
    named.push({ name: 'Other Brands', color: '#2bbf9e', value: otherVal, pct: +((otherVal / this.used) * 100).toFixed(2) });
    this.brands = named;
    this.brandOptions = this.brandSrc.map(b => b.name);
    this.buildChannels();
  }

  get selectedBrandTotal(): number {
    return this.brands.find(b => b.name === this.selectedBrand)?.value ?? 0;
  }

  private buildChannels() {
    const total = this.selectedBrandTotal;
    this.channels = this.channelSrc.map(c => ({ ...c, count: Math.round((c.pct / 100) * total) }));
  }

  get configuredTotal(): number { return this.channels.filter(c => c.name !== 'Other Channel').reduce((s, c) => s + c.count, 0); }
  get otherTotal(): number { return this.channels.find(c => c.name === 'Other Channel')?.count ?? 0; }
  get configuredPct(): number { const t = this.selectedBrandTotal; return t ? (this.configuredTotal / t) * 100 : 0; }
  get otherPct(): number { const t = this.selectedBrandTotal; return t ? (this.otherTotal / t) * 100 : 0; }
  channelPct(c: ChannelSeg): number { const t = this.selectedBrandTotal; return t ? +((c.count / t) * 100).toFixed(2) : 0; }

  /** Donut geometry for the channel-share chart (radius 48 → circumference ≈ 301.6). */
  readonly donutR = 48;
  get donutSegments() {
    const C = 2 * Math.PI * this.donutR;
    let acc = 0;
    return this.channels.map(c => {
      const frac = this.channelPct(c) / 100;
      const seg = { name: c.name, color: c.color, count: c.count, pct: this.channelPct(c),
                    dash: `${frac * C} ${C - frac * C}`, offset: -acc * C };
      acc += frac;
      return seg;
    });
  }

  /* ---- brand dropdown ---- */
  toggleBrand() { this.brandFilterOpen = !this.brandFilterOpen; }
  selectBrand(b: string) { this.selectedBrand = b; this.brandFilterOpen = false; this.buildChannels(); }

  /* ---- hover highlight + tooltip ---- */
  onBrandEnter(name: string) { this.hoverBrand = name; }
  onBrandLeave() { this.hoverBrand = null; this.tip = null; }
  brandTip(e: MouseEvent, b: BrandSeg) {
    this.hoverBrand = b.name;
    this.tip = { x: e.clientX, y: e.clientY, title: b.name, sub: `${this.compact(b.value)} · ${b.pct}%`, color: b.color };
  }
  onChannelEnter(name: string) { this.hoverChannel = name; }
  onChannelLeave() { this.hoverChannel = null; this.tip = null; }
  channelTip(e: MouseEvent, c: ChannelSeg) {
    this.hoverChannel = c.name;
    this.tip = { x: e.clientX, y: e.clientY, title: c.name, sub: `${this.compact(c.count)} · ${this.channelPct(c)}%`, color: c.color };
  }

  /** The brand/channel currently highlighted — drives the inline value readout in the bar captions. */
  get hoveredBrand(): BrandSeg | undefined { return this.brands.find(b => b.name === this.hoverBrand); }
  get hoveredChannel(): ChannelSeg | undefined { return this.channels.find(c => c.name === this.hoverChannel); }

  back() { this.router.navigate(['/account-settings', 'data-consumption', 'consumption']); }

  @HostListener('document:keydown.escape')
  onEsc() { this.brandFilterOpen = false; }

  /* ---- formatting: full up to 999,999, abbreviate from a million ---- */
  compact(n: number): string {
    if (n < 1_000_000) return this.fmt(n);
    return `${this.trim(n / 1_000_000)}M`;
  }
  private trim(v: number): string { return v.toFixed(2).replace(/\.?0+$/, ''); }
  fmt(n: number): string { return n.toLocaleString('en-IN'); }

  /** Real brand-logo path for a channel, or null to fall back to initials. */
  brandSvg(id: string | undefined): string | null { return id ? (BRAND_ICONS[id] ?? null) : null; }
}
