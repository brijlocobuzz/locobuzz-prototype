import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface AlertSection {
  enabled: boolean;
  subject: string;
  recipients: string[];
  draftEmail: string;
  emailError: string;
}

@Component({
  selector: 'app-consumption-alert',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consumption-alert.component.html',
  styleUrl: './consumption-alert.component.scss',
})
export class ConsumptionAlertComponent {
  readonly senderEmail = 'alerts@locobuzz.com';
  readonly presetThresholds = [10, 20, 25, 30, 50, 75, 80, 90, 95];

  threshold: AlertSection & { thresholds: number[] } = {
    enabled: true,
    subject: 'Data Consumption Alert – usage threshold reached – {Client Name}',
    recipients: ['amit.nayak@locobuzz.com'],
    draftEmail: '',
    emailError: '',
    thresholds: [10, 20, 25, 30, 90, 95],
  };

  digest: AlertSection & { time1: string; time2Enabled: boolean; time2: string } = {
    enabled: true,
    subject: 'Data Consumption Digest – daily summary – {Client Name}',
    recipients: ['#hydcce-crf@goindigo.in'],
    draftEmail: '',
    emailError: '',
    time1: '08:15',
    time2Enabled: true,
    time2: '11:45',
  };

  saved = false;

  /** Snapshot of the last-saved state, for dirty detection + revert. */
  private savedSnapshot = '';

  constructor(private router: Router) {
    this.savedSnapshot = this.snapshot();
  }

  private snapshot(): string {
    const t = this.threshold, d = this.digest;
    return JSON.stringify({
      t: { enabled: t.enabled, subject: t.subject, recipients: t.recipients, thresholds: t.thresholds },
      d: { enabled: d.enabled, subject: d.subject, recipients: d.recipients, time1: d.time1, time2Enabled: d.time2Enabled, time2: d.time2 },
    });
  }

  get dirty(): boolean { return this.snapshot() !== this.savedSnapshot; }

  /* ---- thresholds ---- */
  toggleThreshold(v: number) {
    const i = this.threshold.thresholds.indexOf(v);
    if (i >= 0) this.threshold.thresholds.splice(i, 1);
    else { this.threshold.thresholds.push(v); this.threshold.thresholds.sort((a, b) => a - b); }
  }
  isThresholdSelected(v: number): boolean { return this.threshold.thresholds.includes(v); }

  /* ---- email chips ---- */
  addEmail(cfg: AlertSection) {
    const e = (cfg.draftEmail || '').trim().replace(/[,;]+$/, '');
    if (!e) return;
    if (!this.validEmail(e)) { cfg.emailError = 'Enter a valid email address.'; return; }
    if (!cfg.recipients.includes(e)) cfg.recipients.push(e);
    cfg.draftEmail = '';
    cfg.emailError = '';
  }
  removeEmail(cfg: AlertSection, e: string) { cfg.recipients = cfg.recipients.filter(x => x !== e); }
  onEmailKey(ev: KeyboardEvent, cfg: AlertSection) {
    if (ev.key === 'Enter' || ev.key === ',') { ev.preventDefault(); this.addEmail(cfg); }
    else if (ev.key === 'Backspace' && !cfg.draftEmail && cfg.recipients.length) {
      cfg.recipients = cfg.recipients.slice(0, -1);
    }
  }
  validEmail(e: string): boolean { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

  /* ---- validation ---- */
  get thresholdValid(): boolean {
    return !this.threshold.enabled || (this.threshold.recipients.length > 0 && this.threshold.thresholds.length > 0);
  }
  get digestValid(): boolean {
    return !this.digest.enabled ||
      (this.digest.recipients.length > 0 && !!this.digest.time1 && (!this.digest.time2Enabled || !!this.digest.time2));
  }
  get anyEnabled(): boolean { return this.threshold.enabled || this.digest.enabled; }
  get canSave(): boolean { return this.dirty && this.anyEnabled && this.thresholdValid && this.digestValid; }

  /* ---- actions ---- */
  save() {
    if (!this.canSave) return;
    this.savedSnapshot = this.snapshot();   // mark current state as the clean baseline
    this.saved = true;
    setTimeout(() => (this.saved = false), 2600);
  }

  /** Revert the form to the last-saved state. */
  cancel() {
    if (!this.dirty) return;
    const s = JSON.parse(this.savedSnapshot);
    Object.assign(this.threshold, s.t, { draftEmail: '', emailError: '' });
    Object.assign(this.digest, s.d, { draftEmail: '', emailError: '' });
  }

  back() {
    if (this.dirty && !confirm('You have unsaved changes. Leave without saving?')) return;
    this.router.navigate(['/account-settings', 'data-consumption', 'consumption']);
  }
}
