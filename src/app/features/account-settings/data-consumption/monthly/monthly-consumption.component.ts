import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IncreaseLimitDialogComponent } from '../increase-limit-dialog.component';
import { BRAND_ICONS } from '../../channel-data';

interface BrandRow {
  name: string;
  total: number;
  pct: number;
  color: string;
  weekly: number[];
}

interface ChannelRow {
  name: string;
  initials: string;
  id?: string;          // BRAND_ICONS key → real brand logo
  color: string;
  total: number;
  pct: number;
  weekly: number[];
}

interface Dot { x: number; y: number; v: number; week: string; }
interface LineSeries { name: string; color: string; points: string; dots: Dot[]; }
interface BarSegment { name: string; color: string; value: number; x: number; y: number; w: number; h: number; }
interface AxisTick { y: number; label: string; }

@Component({
  selector: 'app-monthly-consumption',
  standalone: true,
  imports: [CommonModule, IncreaseLimitDialogComponent],
  templateUrl: './monthly-consumption.component.html',
  styleUrl: './monthly-consumption.component.scss',
})
export class MonthlyConsumptionComponent {
  /* ---- Headline figures (dummy, mirrors the Monthly Data Consumption screen) ---- */
  readonly limit = 100000;
  readonly billable = 206456;          // billable (public) mentions consumed
  readonly totalMentions = 206491;     // billable + non-billable
  readonly nonBillable = 35;           // owned-brand mentions (not charged)
  readonly consumedPct = 206.46;
  readonly projectedPct = 226.75;      // forecast by month end
  readonly periodLabel = '01 Jun 2026 – 30 Jun 2026';
  readonly daysToRenew = 2;

  get exceededBy(): number { return Math.max(0, this.billable - this.limit); }
  get isOverLimit(): boolean { return this.billable > this.limit; }
  /** Forecast total mentions by month end (plain count, not a >100% figure). */
  get projectedTotal(): number { return Math.round(this.limit * this.projectedPct / 100); }
  get projectedOver(): number { return Math.max(0, this.projectedTotal - this.limit); }

  readonly weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  /** Most brands shown as summary tiles above the trend chart. */
  readonly topBrandCount = 5;
  /** Hard cap on how many brand lines the trend chart renders. */
  readonly maxChartBrands = 15;

  /* ---- Brand breakdown + weekly trend ----
     Recognisable consumer brands so the numbers read like a real account. */
  readonly brands: BrandRow[] = [
    { name: 'IndiGo',       total: 31000,  pct: 15.01, color: '#4a90e2', weekly: [16000, 12000, 6000, 4000] },
    { name: 'Zomato',       total: 29000,  pct: 14.05, color: '#e0485a', weekly: [12000, 18000, 14000, 8000] },
    { name: 'HDFC Bank',    total: 15000,  pct: 7.27,  color: '#23314f', weekly: [3000, 4500, 5000, 4500] },
    { name: 'Myntra',       total: 9900,   pct: 4.79,  color: '#8b6cf6', weekly: [1500, 2500, 3200, 2900] },
    { name: 'boAt',         total: 7600,   pct: 3.68,  color: '#34b27a', weekly: [800, 1500, 2400, 3000] },
    { name: 'Other Brands', total: 113840, pct: 55.13, color: '#f3933a', weekly: [20000, 30000, 18000, 9000] },
  ];

  /** Additional real brands used to fill out the trend chart (up to maxChartBrands). */
  private readonly extraBrandNames = [
    'Swiggy', 'Nykaa', 'Flipkart', 'Amul', 'Tata Motors',
    'Paytm', 'Ola', 'CRED', 'Dream11', 'Licious',
  ];

  /** The top brands shown as summary tiles (excludes the "Other Brands" bucket). */
  get topBrands(): BrandRow[] {
    return this.brands.filter(b => b.name !== 'Other Brands').slice(0, this.topBrandCount);
  }

  /* ---- Channel breakdown + weekly trend ---- */
  readonly channels: ChannelRow[] = [
    { name: 'Facebook',         initials: 'Fb', id: 'facebook',  color: '#1877F2', total: 81183, pct: 39.32, weekly: [27000, 24000, 21000, 9183] },
    { name: 'Reddit',           initials: 'Rd', id: 'reddit',    color: '#FF4500', total: 65406, pct: 31.67, weekly: [20000, 18000, 16000, 11406] },
    { name: 'Tiktok',           initials: 'Tt', id: 'tiktok',    color: '#111827', total: 22311, pct: 10.80, weekly: [7000, 6000, 5500, 3811] },
    { name: 'App Store',        initials: 'As', id: 'appstore',  color: '#0A84FF', total: 10381, pct: 5.03,  weekly: [3000, 3000, 2500, 1881] },
    { name: 'Google Play Store',initials: 'GP', id: 'playstore', color: '#34A853', total: 9760,  pct: 4.73,  weekly: [2800, 2700, 2400, 1860] },
    { name: 'Other Channel',    initials: 'Oc',                  color: '#9aa1ad', total: 17450, pct: 8.45,  weekly: [5000, 4800, 4200, 3450] },
  ];

  get channelConfiguredTotal(): number {
    return this.channels.filter(c => c.name !== 'Other Channel').reduce((s, c) => s + c.total, 0);
  }
  get otherChannelTotal(): number {
    return this.channels.find(c => c.name === 'Other Channel')?.total ?? 0;
  }
  get channelConfiguredPct(): number { return (this.channelConfiguredTotal / this.totalMentions) * 100; }
  get otherChannelPct(): number { return (this.otherChannelTotal / this.totalMentions) * 100; }

  /** Full brand list shown on the chart (tiles summarise the top few above). */
  chartBrands: BrandRow[] = [];

  /* ---- Line chart geometry (brand weekly trend) ----
     High internal resolution keeps axis text crisp and proportionally small. */
  readonly lc = { w: 1040, h: 300, padL: 60, padR: 24, padT: 22, padB: 42, yMax: 20000 };
  lineSeries: LineSeries[] = [];
  lineYTicks: AxisTick[] = [];
  xLabels: { x: number; label: string }[] = [];
  lineZoom = 1;

  /* ---- Stacked bar geometry (channel weekly trend) ---- */
  readonly bc = { w: 1040, h: 320, padL: 64, padR: 24, padT: 22, padB: 46, yMax: 70000, barW: 88 };
  stackedBars: { x: number; label: string; total: number; segments: BarSegment[] }[] = [];
  barYTicks: AxisTick[] = [];
  barZoom = 1;

  /* ---- Duration dropdown ---- */
  dateOpen = false;
  readonly dateOptions = ['Current Month till date', 'Jun 2026', 'May 2026', 'Apr 2026', 'Mar 2026', 'Feb 2026', 'Jan 2026'];
  selectedRange = this.dateOptions[0];

  /* ---- Brand filter for the channel section ---- */
  brandFilterOpen = false;
  readonly brandOptions = ['All brands', ...this.brands.filter(b => b.name !== 'Other Brands').map(b => b.name)];
  selectedBrand = this.brandOptions[0];

  constructor(private router: Router) {
    this.buildBrandSeries();
    this.buildLineChart();
    this.buildStackedChart();
  }

  /** Build the trend-chart brand set: the named brands plus a few more,
      capped at maxChartBrands so the chart stays readable. */
  private buildBrandSeries() {
    const palette = [
      '#4a90e2', '#23314f', '#34b27a', '#e0485a', '#8b6cf6', '#f3933a', '#0aa2c0', '#d6336c',
      '#7048e8', '#2f9e44', '#e8590c', '#1098ad', '#f08c00', '#ae3ec9', '#1c7ed6', '#37b24d',
      '#f76707', '#c2255c', '#5f3dc4', '#0ca678',
    ];
    const named = this.brands.filter(b => b.name !== 'Other Brands');
    const more: BrandRow[] = this.extraBrandNames.map((name, k) => {
      const a = 300 + ((k * 53) % 37) * 70;
      const weekly = [a, Math.round(a * 1.15), Math.round(a * 0.85), Math.round(a * 1.25)];
      const total = weekly.reduce((s, v) => s + v, 0);
      return {
        name,
        total,
        pct: +((total / this.totalMentions) * 100).toFixed(2),
        color: palette[(k + 5) % palette.length],
        weekly,
      };
    });
    this.chartBrands = [...named, ...more].slice(0, this.maxChartBrands);
  }

  /* ---------- chart builders ---------- */
  private lcX(i: number): number {
    const plot = this.lc.w - this.lc.padL - this.lc.padR;
    return this.lc.padL + (i / (this.weeks.length - 1)) * plot;
  }
  private lcY(v: number): number {
    const plot = this.lc.h - this.lc.padT - this.lc.padB;
    return this.lc.padT + plot - (v / this.lc.yMax) * plot;
  }

  /** Short axis label (abbreviated for compactness on the chart only). */
  private axisLabel(v: number): string {
    if (v >= 1_000_000) return `${this.trim(v / 1_000_000)}M`;
    if (v >= 1000) return `${this.trim(v / 1000)}K`;
    return `${v}`;
  }

  private buildLineChart() {
    this.lineYTicks = [0, 5000, 10000, 15000, 20000].map(v => ({ y: this.lcY(v), label: this.axisLabel(v) }));
    this.xLabels = this.weeks.map((label, i) => ({ x: this.lcX(i), label }));
    this.lineSeries = this.chartBrands.map(b => {
      const dots = b.weekly.map((v, i) => ({ x: this.lcX(i), y: this.lcY(v), v, week: this.weeks[i] }));
      return { name: b.name, color: b.color, points: dots.map(d => `${d.x},${d.y}`).join(' '), dots };
    });
  }

  private bcX(i: number): number {
    const plot = this.bc.w - this.bc.padL - this.bc.padR;
    const center = this.bc.padL + (i + 0.5) * (plot / this.weeks.length);
    return center - this.bc.barW / 2;
  }
  private bcPlotH(): number { return this.bc.h - this.bc.padT - this.bc.padB; }
  private bcY(v: number): number { return this.bc.padT + this.bcPlotH() - (v / this.bc.yMax) * this.bcPlotH(); }

  private buildStackedChart() {
    this.barYTicks = [0, 20000, 40000, 60000].map(v => ({ y: this.bcY(v), label: this.axisLabel(v) }));
    this.stackedBars = this.weeks.map((label, i) => {
      let acc = 0;
      const segments: BarSegment[] = this.channels.map(ch => {
        const value = ch.weekly[i];
        const yTop = this.bcY(acc + value);
        const h = (value / this.bc.yMax) * this.bcPlotH();
        acc += value;
        return { name: ch.name, color: ch.color, value, x: this.bcX(i), y: yTop, w: this.bc.barW, h };
      });
      return { x: this.bcX(i), label, total: acc, segments };
    });
  }

  /* ---------- formatting ----------
     Full grouped numbers up to 999,999; only abbreviate from a million up. */
  compact(n: number): string {
    if (n < 1_000_000) return this.fmt(n);
    return `${this.trim(n / 1_000_000)}M`;
  }
  private trim(v: number): string { return v.toFixed(2).replace(/\.?0+$/, ''); }
  fmt(n: number): string { return n.toLocaleString('en-IN'); }

  /** Real brand-logo path for a channel, or null to fall back to initials. */
  brandSvg(id: string | undefined): string | null { return id ? (BRAND_ICONS[id] ?? null) : null; }

  /* ---------- chart zoom ---------- */
  private clampZoom(z: number): number { return Math.min(6, Math.max(1, +z.toFixed(2))); }
  zoomLine(d: number) { this.lineZoom = this.clampZoom(this.lineZoom + d); }
  resetLine() { this.lineZoom = 1; }
  zoomBar(d: number) { this.barZoom = this.clampZoom(this.barZoom + d); }
  resetBar() { this.barZoom = 1; }

  /* ---------- drag-to-pan (grab the chart and drag instead of scrollbars) ---------- */
  private pan: { el: HTMLElement; x: number; y: number; sl: number; st: number } | null = null;

  onPanStart(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    if (el.scrollWidth <= el.clientWidth && el.scrollHeight <= el.clientHeight) return; // nothing to pan
    e.preventDefault();
    this.pan = { el, x: e.clientX, y: e.clientY, sl: el.scrollLeft, st: el.scrollTop };
  }
  onPanMove(e: MouseEvent) {
    if (!this.pan) return;
    this.pan.el.scrollLeft = this.pan.sl - (e.clientX - this.pan.x);
    this.pan.el.scrollTop = this.pan.st - (e.clientY - this.pan.y);
  }
  onPanEnd() { this.pan = null; }

  /* ---------- fullscreen ---------- */
  fullscreen(el: HTMLElement) {
    if (document.fullscreenElement) { document.exitFullscreen(); return; }
    el.requestFullscreen?.();
  }

  /* ---------- hover highlight + tooltip ---------- */
  hoverBrand: string | null = null;
  hoverChannel: string | null = null;
  tip: { chart: 'line' | 'bar'; x: number; y: number; title: string; sub: string; color: string } | null = null;

  onLineEnter(name: string) { this.hoverBrand = name; }
  onLineLeave() { this.hoverBrand = null; this.tip = null; }
  /** Highlight a brand from its summary tile (only if it has a chart line). */
  onTileEnter(name: string) {
    if (this.lineSeries.some(s => s.name === name)) this.hoverBrand = name;
  }

  /* ---------- increase-limit dialog ---------- */
  limitDialogOpen = false;
  showDotTip(e: MouseEvent, s: LineSeries, d: Dot) {
    this.hoverBrand = s.name;
    this.tip = { chart: 'line', x: e.clientX, y: e.clientY, title: s.name, sub: `${d.week} · ${this.fmt(d.v)} mentions`, color: s.color };
  }

  onBarEnter(name: string) { this.hoverChannel = name; }
  onBarLeave() { this.hoverChannel = null; this.tip = null; }
  showSegTip(e: MouseEvent, seg: BarSegment, week: string) {
    this.hoverChannel = seg.name;
    this.tip = { chart: 'bar', x: e.clientX, y: e.clientY, title: seg.name, sub: `${week} · ${this.fmt(seg.value)} mentions`, color: seg.color };
  }
  hideTip() { this.tip = null; }

  /* ---------- nav / dropdowns ---------- */
  back() { this.router.navigate(['/account-settings', 'data-consumption', 'consumption']); }

  toggleDate() { this.dateOpen = !this.dateOpen; this.brandFilterOpen = false; }
  selectRange(o: string) { this.selectedRange = o; this.dateOpen = false; }
  toggleBrand() { this.brandFilterOpen = !this.brandFilterOpen; this.dateOpen = false; }
  selectBrand(o: string) { this.selectedBrand = o; this.brandFilterOpen = false; }

  @HostListener('document:keydown.escape')
  onEsc() { this.dateOpen = false; this.brandFilterOpen = false; }
}
