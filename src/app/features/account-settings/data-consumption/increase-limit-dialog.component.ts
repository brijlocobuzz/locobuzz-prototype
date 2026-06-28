import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/** Reusable "Increase Limit" request dialog. Parent toggles it with *ngIf. */
@Component({
  selector: 'app-increase-limit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './increase-limit-dialog.component.html',
  styleUrl: './increase-limit-dialog.component.scss',
})
export class IncreaseLimitDialogComponent implements OnInit {
  @Input({ required: true }) serviceName!: string;
  @Input({ required: true }) currentLimit!: number;
  @Input() usedAmount = 0;
  @Input() status = 'critical';        // critical | low | good
  @Output() closed = new EventEmitter<void>();

  additional = 0;
  reason = '';
  presets: number[] = [];
  sent = false;
  sending = false;

  @ViewChild('addInput') set addInput(el: ElementRef<HTMLInputElement> | undefined) {
    if (el) setTimeout(() => { el.nativeElement.focus(); el.nativeElement.select(); });
  }

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.presets = [0.1, 0.25, 0.5].map(f => this.nice(this.currentLimit * f));
  }

  close() { this.closed.emit(); }

  addPreset(n: number) { this.additional = Math.max(0, (Number(this.additional) || 0) + n); }
  clampAdditional() {
    if (!this.additional || this.additional < 0) this.additional = 0;
    this.additional = Math.round(this.additional);
  }

  get resulting(): number { return this.currentLimit + (Number(this.additional) || 0); }
  get increasePct(): number {
    return this.currentLimit > 0 ? ((Number(this.additional) || 0) / this.currentLimit) * 100 : 0;
  }
  get canSend(): boolean { return (Number(this.additional) || 0) > 0; }

  send() {
    if (!this.canSend || this.sending) return;
    this.sending = true;
    setTimeout(() => { this.sending = false; this.sent = true; }, 900);
  }

  @HostListener('document:keydown.escape')
  onEsc() { if (!this.sent && !this.sending) this.close(); }

  onTrapKeydown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    const root = this.host.nativeElement.querySelector('.rq-modal') as HTMLElement | null;
    if (!root) return;
    const nodes = root.querySelectorAll<HTMLElement>('button, input, textarea, [tabindex]:not([tabindex="-1"])');
    const f = Array.from(nodes).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  fmt(n: number): string { return n.toLocaleString('en-IN'); }
  compact(n: number): string {
    if (n < 1000) return `${n}`;
    if (n < 1_000_000) return `${this.trim(n / 1000)}K`;
    return `${this.trim(n / 1_000_000)}M`;
  }
  private trim(v: number): string { return v.toFixed(2).replace(/\.?0+$/, ''); }
  private nice(n: number): number {
    if (n <= 0) return 0;
    const d = Math.floor(Math.log10(n));
    const f = Math.pow(10, Math.max(0, d - 1));
    return Math.round(n / f) * f;
  }
}
