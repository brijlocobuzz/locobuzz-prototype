import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature { icon: string; title: string; desc: string; }
interface Stat { label: string; value: string; }
interface LockedModule { icon: string; name: string; desc: string; }
interface ChecklistItem { label: string; done: boolean; }
interface LiveModule {
  icon: string; name: string; desc: string;
  metric: string; metricLabel: string;
  confidence?: number;          // shows a progress bar
  footnote?: string;            // shows a footer line instead
}
interface PendingModule { icon: string; name: string; benefit: string; setup: string; }

@Component({
  selector: 'app-ai-hub',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-hub.component.html',
  styleUrl: './ai-hub.component.scss',
  host: { '[class.theme-light]': "theme === 'light'" },
})
export class AiHubComponent {
  /** false = not-yet-active marketing view · true = active dashboard view. */
  aiActive = false;

  /** Visual theme — toggled from the top bar. */
  theme: 'dark' | 'light' = 'light';

  // ---- inactive (activation) view ----
  heroFeatures: Feature[] = [
    { icon: 'bolt', title: 'Instant Scale', desc: 'Resolve 10× more conversations without growing your team.' },
    { icon: 'target', title: '99.9% Accuracy', desc: 'Models trained on your historical brand interactions.' },
  ];

  stats: Stat[] = [
    { label: 'AVG RESPONSE TIME', value: '−60%' },
    { label: 'CSAT LIFT', value: '+24%' },
    { label: 'AGENT PRODUCTIVITY', value: '3.2×' },
  ];

  whyCards: Feature[] = [
    { icon: 'bolt', title: 'Instant Scale', desc: 'Resolve 10× more conversations without growing your team.' },
    { icon: 'target', title: '99.9% Accuracy', desc: 'Models trained on your historical brand interactions.' },
    { icon: 'trending_up', title: 'Predictive Insight', desc: 'Catch sentiment shifts hours before they become trends.' },
    { icon: 'vital_signs', title: 'Always-on Coaching', desc: 'Quality-score every agent reply in real-time.' },
  ];

  lockedModules: LockedModule[] = [
    { icon: 'account_tree', name: 'Workflow Builder', desc: 'Visual automation for routing & priorities.' },
    { icon: 'draw', name: 'Response Genie™', desc: 'Brand-voice replies, drafted in milliseconds.' },
    { icon: 'school', name: 'Agent IQ™', desc: 'Live coaching for compliance & resolution.' },
    { icon: 'radar', name: 'SignalSense™', desc: 'Detect chatter spikes & sentiment shifts.' },
    { icon: 'layers', name: 'Aspect Groups™', desc: 'Cluster feedback into actionable themes.' },
  ];

  // ---- active (dashboard) view ----
  completion = 57;
  completionDone = 4;
  completionTotal = 7;

  checklist: ChecklistItem[] = [
    { label: 'Define Brand Voice', done: true },
    { label: 'Response Genie Templates', done: true },
    { label: 'Cross-channel Routing', done: false },
    { label: 'SignalSense Categories', done: true },
    { label: 'Workflow Builder', done: false },
    { label: 'Aspect Groups', done: true },
    { label: 'Agent IQ Benchmarks', done: false },
  ];

  liveModules: LiveModule[] = [
    { icon: 'draw', name: 'Response Genie™', desc: 'Drafting replies aligned to your brand voice.',
      metric: '12.4k', metricLabel: 'Replies drafted', confidence: 98 },
    { icon: 'radar', name: 'SignalSense™', desc: 'Monitoring chatter spikes & sentiment shifts.',
      metric: '9', metricLabel: 'Active labels', footnote: 'Last sync 4m ago' },
    { icon: 'layers', name: 'Aspect Groups™', desc: 'Clustering feedback into actionable themes.',
      metric: '1', metricLabel: 'Total group', footnote: 'Updated yesterday' },
  ];

  pendingModules: PendingModule[] = [
    { icon: 'account_tree', name: 'Workflow Builder', benefit: 'Cut manual triage by 40%', setup: '~6 min setup' },
    { icon: 'school', name: 'Agent IQ™', benefit: 'Unlock compliance scoring', setup: '~4 min setup' },
  ];

  autonomousPerks = [
    'Cross-channel predictive analytics',
    'Priority AI-driven ticket routing',
    'Advanced brand-voice mimicry across replies',
    'Autonomous decisioning on Level-1 queries',
  ];

  /** Stroke-dashoffset for the 57% progress ring (circumference ≈ 339). */
  get ringOffset(): number {
    const c = 2 * Math.PI * 54;
    return c - (this.completion / 100) * c;
  }
  readonly ringCirc = 2 * Math.PI * 54;
}
