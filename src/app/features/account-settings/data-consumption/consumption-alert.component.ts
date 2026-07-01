import { Component, HostListener } from '@angular/core';
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

interface HistoryEntry {
  icon: string;
  text: string;
  actor: string;
  at: Date;
}

interface ConfirmDialog {
  open: boolean;
  icon: string;
  tone: 'brand' | 'warn' | 'danger';
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
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

  /** Most usage levels a user can watch at once. */
  readonly maxThresholds = 5;

  /** How many recent history entries the timeline shows. */
  readonly historyLimit = 10;

  /** The signed-in user — recorded as the actor on every history entry. */
  readonly currentUser = 'amit.nayak@locobuzz.com';

  /** Audit trail of recent changes, newest first. */
  history: HistoryEntry[] = [
    { icon: 'save',     text: 'Alert settings saved',                          actor: 'amit.nayak@locobuzz.com',  at: this.ago(60 * 26) },
    { icon: 'mail',     text: 'Recipient amit.nayak@locobuzz.com added to Threshold alerts', actor: 'amit.nayak@locobuzz.com', at: this.ago(60 * 26) },
    { icon: 'tune',     text: 'Threshold levels updated to 10, 20, 25, 30, 90, 95%',         actor: 'amit.nayak@locobuzz.com', at: this.ago(60 * 27) },
    { icon: 'schedule', text: 'Daily digest second notification set to 11:45',  actor: 'priya.shah@locobuzz.com',  at: this.ago(60 * 24 * 4) },
    { icon: 'mail',     text: 'Recipient #hydcce-crf@goindigo.in added to Daily digest',     actor: 'priya.shah@locobuzz.com', at: this.ago(60 * 24 * 4) },
  ];

  threshold: AlertSection & { thresholds: number[] } = {
    enabled: true,
    subject: 'Data Consumption Alert – usage threshold reached – {Client Name}',
    recipients: ['amit.nayak@locobuzz.com'],
    draftEmail: '',
    emailError: '',
    thresholds: [10, 25, 50, 90, 95],
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

  /* ---- confirm dialog ---- */
  confirmDialog: ConfirmDialog = {
    open: false, icon: '', tone: 'brand', title: '', message: '', confirmLabel: 'Confirm', cancelLabel: 'Cancel',
  };
  private confirmAction: (() => void) | null = null;

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

  /* ---- history ---- */
  /** The most recent entries shown in the timeline (newest first, capped). */
  get recentHistory(): HistoryEntry[] { return this.history.slice(0, this.historyLimit); }

  /** A Date `minutes` in the past — used to seed the audit trail. */
  private ago(minutes: number): Date { return new Date(Date.now() - minutes * 60_000); }

  /** Prepend an entry to the change history (newest first). */
  private logHistory(icon: string, text: string) {
    this.history.unshift({ icon, text, actor: this.currentUser, at: new Date() });
  }

  /** Human-friendly "x ago" label for a history timestamp. */
  relativeTime(at: Date): string {
    const min = Math.floor((Date.now() - at.getTime()) / 60_000);
    if (min < 1) return 'Just now';
    if (min < 60) return `${min} min ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} hr ago`;
    const d = Math.floor(hr / 24);
    if (d < 30) return `${d} day${d > 1 ? 's' : ''} ago`;
    const mo = Math.floor(d / 30);
    return `${mo} month${mo > 1 ? 's' : ''} ago`;
  }

  /* ---- confirm dialog ---- */
  private askConfirm(opts: Partial<ConfirmDialog> & { onConfirm: () => void }) {
    this.confirmDialog = {
      open: true,
      icon: opts.icon ?? 'help',
      tone: opts.tone ?? 'brand',
      title: opts.title ?? 'Are you sure?',
      message: opts.message ?? '',
      confirmLabel: opts.confirmLabel ?? 'Confirm',
      cancelLabel: opts.cancelLabel ?? 'Cancel',
    };
    this.confirmAction = opts.onConfirm;
  }
  confirmYes() {
    const action = this.confirmAction;
    this.confirmDialog.open = false;
    this.confirmAction = null;
    action?.();
  }
  confirmNo() {
    this.confirmDialog.open = false;
    this.confirmAction = null;
  }
  @HostListener('document:keydown.escape')
  onEscape() { if (this.confirmDialog.open) this.confirmNo(); }

  /** Toggle the daily digest, but confirm first since it changes who gets emailed. */
  toggleDigest() {
    const turningOff = this.digest.enabled;
    this.askConfirm({
      icon: turningOff ? 'notifications_off' : 'notifications_active',
      tone: turningOff ? 'danger' : 'brand',
      title: turningOff ? 'Turn off daily digest?' : 'Turn on daily digest?',
      message: turningOff
        ? 'Recipients will stop receiving the scheduled summary email.'
        : 'Recipients will start receiving a scheduled summary email at the times you set.',
      confirmLabel: turningOff ? 'Turn off' : 'Turn on',
      onConfirm: () => {
        this.digest.enabled = !this.digest.enabled;
        this.logHistory('schedule', `Daily digest turned ${this.digest.enabled ? 'on' : 'off'}`);
      },
    });
  }

  /* ---- thresholds ---- */
  toggleThreshold(v: number) {
    const i = this.threshold.thresholds.indexOf(v);
    if (i >= 0) { this.threshold.thresholds.splice(i, 1); return; }
    // Cap at maxThresholds — ignore clicks on new levels once the limit is hit.
    if (this.threshold.thresholds.length >= this.maxThresholds) return;
    this.threshold.thresholds.push(v);
    this.threshold.thresholds.sort((a, b) => a - b);
  }
  isThresholdSelected(v: number): boolean { return this.threshold.thresholds.includes(v); }

  /** True once the maximum number of usage levels is selected. */
  get thresholdsFull(): boolean { return this.threshold.thresholds.length >= this.maxThresholds; }

  /** A preset chip is disabled when the cap is reached and it isn't already on. */
  isThresholdDisabled(v: number): boolean { return this.thresholdsFull && !this.isThresholdSelected(v); }

  /* ---- email chips ---- */
  addEmail(cfg: AlertSection) {
    const e = (cfg.draftEmail || '').trim().replace(/[,;]+$/, '');
    if (!e) return;
    if (!this.validEmail(e)) { cfg.emailError = 'Enter a valid email address.'; return; }
    if (!cfg.recipients.includes(e)) {
      cfg.recipients.push(e);
      const where = cfg === this.threshold ? 'Threshold alerts' : 'Daily digest';
      this.logHistory('mail', `Recipient ${e} added to ${where}`);
    }
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
    this.logHistory('save', 'Alert settings saved');
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
    if (this.dirty) {
      this.askConfirm({
        icon: 'warning',
        tone: 'warn',
        title: 'Leave without saving?',
        message: 'You have unsaved changes. They will be lost if you leave this page.',
        confirmLabel: 'Leave',
        cancelLabel: 'Stay',
        onConfirm: () => this.router.navigate(['/account-settings', 'data-consumption', 'consumption']),
      });
      return;
    }
    this.router.navigate(['/account-settings', 'data-consumption', 'consumption']);
  }
}
