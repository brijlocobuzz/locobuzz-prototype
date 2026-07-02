import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface AlertStep { key: string; label: string; icon: string; }
interface ChannelOption { id: string; label: string; icon: string; color: string; selected: boolean; }
interface Condition { id: string; field: string; operator: string; value: string; }
interface EmailRecipient { email: string; initials: string; color: string; }
interface AlertTemplate { name: string; icon: string; color: string; desc: string; conditions: Condition[]; }
interface ConditionPreset { label: string; icon: string; conditions: Condition[]; }
type DeliveryMode = 'custom' | 'digest' | 'realtime';

@Component({
  selector: 'app-create-alert-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-alert-wizard.component.html',
  styleUrl: './create-alert-wizard.component.scss',
})
export class CreateAlertWizardComponent {
  private router = inject(Router);
  @Output() closed = new EventEmitter<void>();

  celebrating = false;
  stepIndex = 0;

  steps: AlertStep[] = [
    { key: 'name',       label: 'Alert Name',  icon: 'label' },
    { key: 'channels',   label: 'Channels',    icon: 'hub' },
    { key: 'conditions', label: 'Conditions',  icon: 'filter_alt' },
    { key: 'schedule',   label: 'Schedule',    icon: 'calendar_month' },
    { key: 'notify',     label: 'Notify',      icon: 'mail' },
    { key: 'review',     label: 'Review',      icon: 'task_alt' },
  ];

  get current() { return this.steps[this.stepIndex].key; }
  get onReview() { return this.stepIndex === this.steps.length - 1; }
  get totalSteps() { return this.steps.length; }

  // ── Step 1: Name ───────────────────────────────────────────────
  alertName = '';
  pendingConditions: Condition[] = [];

  alertTemplates: AlertTemplate[] = [
    { name: 'Negative Sentiment Alert',  icon: 'sentiment_dissatisfied', color: '#ef4444', desc: 'Alert on negative brand mentions',
      conditions: [{ id: 't1', field: 'Sentiment', operator: 'is', value: 'Negative' }] },
    { name: 'Influencer Mention Alert',  icon: 'star',                   color: '#f59e0b', desc: 'Catch high-reach influencer posts',
      conditions: [{ id: 't1', field: 'Follower Count', operator: 'greater than', value: '10000' }] },
    { name: 'Keyword Watch Alert',       icon: 'manage_search',          color: '#6366f1', desc: 'Trigger on specific keywords',
      conditions: [{ id: 't1', field: 'Keyword Contains', operator: 'contains', value: '' }] },
    { name: 'Crisis Monitor Alert',      icon: 'warning',                color: '#dc2626', desc: 'Negative content going viral',
      conditions: [
        { id: 't1', field: 'Sentiment',      operator: 'is',           value: 'Negative' },
        { id: 't2', field: 'Follower Count', operator: 'greater than', value: '50000'    },
      ] },
    { name: 'Rating Drop Alert',         icon: 'star_half',              color: '#ea580c', desc: 'Alert when review ratings drop',
      conditions: [{ id: 't1', field: 'Rating', operator: 'less than', value: '3' }] },
    { name: 'Positive Brand Buzz',       icon: 'thumb_up',               color: '#10b981', desc: 'Track positive mentions to amplify',
      conditions: [{ id: 't1', field: 'Sentiment', operator: 'is', value: 'Positive' }] },
  ];

  applyTemplate(t: AlertTemplate) {
    this.alertName = t.name;
    this.pendingConditions = t.conditions.map((c, i) => ({ ...c, id: 'tmpl-' + i }));
  }

  // ── Step 2: Schedule ───────────────────────────────────────────
  startDate   = new Date().toISOString().split('T')[0];
  hasEndDate  = false;
  endDate     = '';
  deliveryMode: DeliveryMode = 'digest';
  selectedDays: Set<string> = new Set(['M', 'T', 'W', 'T2', 'F']);
  customTime  = '09:00';
  digestTime  = '08:00';

  days = [
    { key: 'S',  label: 'Sunday',    abbr: 'S' },
    { key: 'M',  label: 'Monday',    abbr: 'M' },
    { key: 'T',  label: 'Tuesday',   abbr: 'T' },
    { key: 'W',  label: 'Wednesday', abbr: 'W' },
    { key: 'T2', label: 'Thursday',  abbr: 'T' },
    { key: 'F',  label: 'Friday',    abbr: 'F' },
    { key: 'S2', label: 'Saturday',  abbr: 'S' },
  ];

  deliveryModes = [
    { key: 'custom'   as DeliveryMode, label: 'Custom Time',  icon: 'schedule',  desc: 'Choose one or more times to receive notifications each day.' },
    { key: 'digest'   as DeliveryMode, label: 'Daily Digest', icon: 'summarize', desc: 'One clean summary email per day — no inbox overload.' },
    { key: 'realtime' as DeliveryMode, label: 'Real-Time',    icon: 'bolt',      desc: 'Notify instantly the moment conditions are met.' },
  ];

  toggleDay(key: string) {
    this.selectedDays.has(key) ? this.selectedDays.delete(key) : this.selectedDays.add(key);
  }
  selectWeekdays() { this.selectedDays = new Set(['M', 'T', 'W', 'T2', 'F']); }
  selectAllDays()  { this.selectedDays = new Set(this.days.map(d => d.key)); }

  // ── Step 3: Channels ───────────────────────────────────────────
  channels: ChannelOption[] = [
    { id: 'twitter',     label: 'X (Twitter)',       icon: 'alternate_email', color: '#000000', selected: false },
    { id: 'facebook',    label: 'Facebook',          icon: 'thumb_up',        color: '#1877F2', selected: false },
    { id: 'instagram',   label: 'Instagram',         icon: 'photo_camera',    color: '#E1306C', selected: false },
    { id: 'youtube',     label: 'YouTube',           icon: 'play_circle',     color: '#FF0000', selected: false },
    { id: 'linkedin',    label: 'LinkedIn',          icon: 'work',            color: '#0A66C2', selected: false },
    { id: 'whatsapp',    label: 'WhatsApp',          icon: 'chat',            color: '#25D366', selected: false },
    { id: 'reddit',      label: 'Reddit',            icon: 'forum',           color: '#FF4500', selected: false },
    { id: 'trustpilot',  label: 'Trustpilot',        icon: 'star_rate',       color: '#00B67A', selected: false },
    { id: 'tripadvisor', label: 'TripAdvisor',       icon: 'travel_explore',  color: '#34E0A1', selected: false },
    { id: 'gmb',         label: 'Google My Business',icon: 'place',           color: '#4285F4', selected: false },
    { id: 'news',        label: 'News & Blogs',      icon: 'newspaper',       color: '#6366F1', selected: false },
    { id: 'appstore',    label: 'App Reviews',       icon: 'smartphone',      color: '#1C7ED6', selected: false },
  ];

  get selectedChannels() { return this.channels.filter(c => c.selected); }
  get allChannelsSelected() { return this.channels.every(c => c.selected); }

  toggleChannel(ch: ChannelOption)  { ch.selected = !ch.selected; }
  toggleAllChannels() {
    const all = this.allChannelsSelected;
    this.channels.forEach(c => c.selected = !all);
  }

  // ── Step 4: Conditions ─────────────────────────────────────────
  conditionFields = ['Sentiment', 'Follower Count', 'Keyword Contains', 'Activity Type', 'Language', 'Country', 'Influencer Category', 'Rating'];

  conditionOperators: Record<string, string[]> = {
    'Sentiment':           ['is', 'is not'],
    'Follower Count':      ['greater than', 'less than', 'equals'],
    'Keyword Contains':    ['contains', 'does not contain'],
    'Activity Type':       ['is', 'is not'],
    'Language':            ['is', 'is not'],
    'Country':             ['is', 'is not'],
    'Influencer Category': ['is', 'is not'],
    'Rating':              ['greater than', 'less than', 'equals'],
  };

  conditions: Condition[] = [];

  conditionPresets: ConditionPreset[] = [
    { label: 'Negative sentiment',    icon: 'sentiment_dissatisfied', conditions: [{ id: 'p1', field: 'Sentiment',     operator: 'is',           value: 'Negative' }] },
    { label: 'High-reach account',    icon: 'trending_up',            conditions: [{ id: 'p1', field: 'Follower Count',operator: 'greater than', value: '10000' }]    },
    { label: 'Low review rating',     icon: 'star_half',              conditions: [{ id: 'p1', field: 'Rating',         operator: 'less than',    value: '3' }]        },
    { label: 'Positive + viral',      icon: 'thumb_up',               conditions: [
      { id: 'p1', field: 'Sentiment',      operator: 'is',           value: 'Positive' },
      { id: 'p2', field: 'Follower Count', operator: 'greater than', value: '5000' },
    ]},
  ];

  operatorsFor(field: string): string[] { return this.conditionOperators[field] || ['is', 'is not']; }

  addCondition() {
    this.conditions.push({ id: Date.now().toString(), field: 'Sentiment', operator: 'is', value: '' });
  }
  removeCondition(c: Condition) { this.conditions = this.conditions.filter(x => x.id !== c.id); }

  applyConditionPreset(p: ConditionPreset) {
    this.conditions = p.conditions.map((c, i) => ({ ...c, id: 'pre-' + i }));
  }

  // ── Step 5: Notify ─────────────────────────────────────────────
  emailSearch  = '';
  emailFocused = false;

  recipientEmails: EmailRecipient[] = [
    { email: 'kishan.chaudhary@locobuzz.com', initials: 'KC', color: '#6366F1' },
  ];

  suggestedEmails: EmailRecipient[] = [
    { email: 'kishan.chaudhary@locobuzz.com', initials: 'KC', color: '#6366F1' },
    { email: 'akash.shahane@locobuzz.com',    initials: 'AS', color: '#E1306C' },
    { email: 'brij.patil@locobuzz.com',       initials: 'BP', color: '#25D366' },
    { email: 'team.marketing@locobuzz.com',   initials: 'TM', color: '#FF4500' },
    { email: 'ravi.kumar@locobuzz.com',       initials: 'RK', color: '#0A66C2' },
    { email: 'priya.sharma@locobuzz.com',     initials: 'PS', color: '#f59e0b' },
  ];

  get filteredSuggestions() {
    const q = this.emailSearch.toLowerCase();
    return this.suggestedEmails.filter(e =>
      !this.recipientEmails.find(r => r.email === e.email) &&
      (q ? e.email.toLowerCase().includes(q) : true)
    );
  }

  addRecipient(rec: EmailRecipient) {
    if (!this.recipientEmails.find(r => r.email === rec.email)) this.recipientEmails.push({ ...rec });
    this.emailSearch = '';
  }
  removeRecipient(rec: EmailRecipient) { this.recipientEmails = this.recipientEmails.filter(r => r.email !== rec.email); }
  onEmailBlur() { setTimeout(() => { this.emailFocused = false; }, 200); }

  // ── Confetti ───────────────────────────────────────────────────
  confetti = Array.from({ length: 42 }, (_, i) => ({
    left:     (i * 2.38) % 100,
    color:    ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444'][i % 7],
    delay:    (i * 0.04) % 0.9,
    duration: 1.5 + (i % 6) * 0.3,
    drift:    ((i % 10) - 5) * 24,
    rotate:   (i * 37) % 360,
    round:    i % 3 === 0,
  }));

  // ── Navigation ─────────────────────────────────────────────────
  get canContinue(): boolean {
    switch (this.current) {
      case 'name':       return this.alertName.trim().length >= 3;
      case 'schedule':   return this.selectedDays.size > 0;
      case 'channels':   return this.selectedChannels.length > 0;
      case 'conditions': return true;
      case 'notify':     return this.recipientEmails.length > 0;
      case 'review':     return true;
      default:           return false;
    }
  }

  next() {
    if (this.current === 'name' && this.pendingConditions.length) {
      this.conditions = [...this.pendingConditions];
      this.pendingConditions = [];
    }
    this.onReview ? this.save() : this.stepIndex++;
  }
  back()     { if (this.stepIndex > 0) this.stepIndex--; }
  save()     { this.celebrating = true; }
  complete() { this.closed.observers.length ? this.closed.emit() : this.router.navigate(['/account-settings']); }
  close()    { this.closed.observers.length ? this.closed.emit() : this.router.navigate(['/account-settings']); }

  // ── Helpers ────────────────────────────────────────────────────
  tint(color: string | undefined): string { return color ? color + '1a' : '#eef0fe'; }

  get deliveryModeLabel() { return this.deliveryModes.find(m => m.key === this.deliveryMode)?.label ?? ''; }
  get deliveryModeIcon()  { return this.deliveryModes.find(m => m.key === this.deliveryMode)?.icon  ?? 'schedule'; }

  get scheduleLabel(): string {
    const sel = this.days.filter(d => this.selectedDays.has(d.key));
    if (sel.length === 7) return 'Every day';
    if (sel.length === 5 && !this.selectedDays.has('S') && !this.selectedDays.has('S2')) return 'Weekdays';
    return sel.map(d => d.label.slice(0, 3)).join(', ');
  }
}
