import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateAlertWizardComponent } from './create-alert-wizard.component';

interface ChannelIcon { icon: string; color: string; bg: string; label: string; }
interface AlertRow {
  id: number;
  subject: string;
  channels: ChannelIcon[];
  extraChannels: number;
  sentiments: ('positive' | 'negative' | 'neutral')[];
  query: string;
  emailCount: number;
  scheduleStart: string;
  scheduleEnd: string;
  createdOn: string;
  paused: boolean;
}

@Component({
  selector: 'app-alerts-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateAlertWizardComponent],
  templateUrl: './alerts-list.component.html',
  styleUrl: './alerts-list.component.scss',
})
export class AlertsListComponent {
  showWizard = false;
  searchQuery = '';
  selectedBrand = '1 97 QA TEst brand';

  brands = ['1 97 QA TEst brand', 'Locobuzz Demo', 'Brand Alpha'];

  CH: Record<string, ChannelIcon> = {
    twitter:     { icon: 'alternate_email', color: '#fff',    bg: '#000000', label: 'X'           },
    youtube:     { icon: 'play_circle',     color: '#fff',    bg: '#FF0000', label: 'YouTube'      },
    facebook:    { icon: 'thumb_up',        color: '#fff',    bg: '#1877F2', label: 'Facebook'     },
    instagram:   { icon: 'photo_camera',    color: '#fff',    bg: '#E1306C', label: 'Instagram'    },
    email:       { icon: 'mail',            color: '#fff',    bg: '#4285F4', label: 'Email'        },
    blogger:     { icon: 'rss_feed',        color: '#fff',    bg: '#FF5722', label: 'Blogger'      },
    linkedin:    { icon: 'work',            color: '#fff',    bg: '#0A66C2', label: 'LinkedIn'     },
    reddit:      { icon: 'forum',           color: '#fff',    bg: '#FF4500', label: 'Reddit'       },
    news:        { icon: 'newspaper',       color: '#fff',    bg: '#6366F1', label: 'News'         },
    trustpilot:  { icon: 'star_rate',       color: '#fff',    bg: '#00B67A', label: 'Trustpilot'  },
    gmb:         { icon: 'place',           color: '#fff',    bg: '#4285F4', label: 'GMB'          },
    web:         { icon: 'public',          color: '#fff',    bg: '#607D8B', label: 'Web'          },
    whatsapp:    { icon: 'chat',            color: '#fff',    bg: '#25D366', label: 'WhatsApp'     },
    appstore:    { icon: 'smartphone',      color: '#fff',    bg: '#1C7ED6', label: 'App Reviews'  },
  };

  alerts: AlertRow[] = [
    {
      id: 1,
      subject: 'AL Alert 16-06 service',
      channels: [this.CH['twitter'], this.CH['youtube'], this.CH['facebook']],
      extraChannels: 3,
      sentiments: ['positive', 'negative', 'neutral'],
      query: '(Sentiment In Positive, Neg...',
      emailCount: 2,
      scheduleStart: 'Jun 16, 2025',
      scheduleEnd: 'Jun 18, 2025',
      createdOn: 'Jun 16, 2025',
      paused: false,
    },
    {
      id: 2,
      subject: 'alert test 10',
      channels: [this.CH['facebook'], this.CH['email'], this.CH['instagram']],
      extraChannels: 1,
      sentiments: ['positive', 'negative', 'neutral'],
      query: '(Sentiment In Positive, Neg...',
      emailCount: 2,
      scheduleStart: 'Jun 10, 2025',
      scheduleEnd: 'Jun 23, 2026',
      createdOn: 'Jun 10, 2025',
      paused: false,
    },
    {
      id: 3,
      subject: 'bugsTestdemo',
      channels: [this.CH['twitter']],
      extraChannels: 0,
      sentiments: ['positive', 'negative', 'neutral'],
      query: '(Sentiment In Positive, Neg...',
      emailCount: 1,
      scheduleStart: 'Jun 10, 2025',
      scheduleEnd: 'NA',
      createdOn: 'Jun 10, 2025',
      paused: false,
    },
    {
      id: 4,
      subject: 'eshatest08',
      channels: [this.CH['blogger'], this.CH['reddit'], this.CH['web']],
      extraChannels: 25,
      sentiments: [],
      query: '(Influencer Category In ...',
      emailCount: 1,
      scheduleStart: 'May 08, 2026',
      scheduleEnd: 'Jun 23, 2026',
      createdOn: 'May 08, 2026',
      paused: false,
    },
    {
      id: 5,
      subject: 'genericalert',
      channels: [this.CH['twitter']],
      extraChannels: 0,
      sentiments: [],
      query: '(Keyword Contains ...',
      emailCount: 1,
      scheduleStart: 'May 21, 2025',
      scheduleEnd: 'Jun 6, 2025',
      createdOn: 'May 21, 2025',
      paused: false,
    },
    {
      id: 6,
      subject: 'isai',
      channels: [this.CH['twitter']],
      extraChannels: 0,
      sentiments: ['positive', 'negative', 'neutral'],
      query: '(Sentiment In Positive, Neg...',
      emailCount: 1,
      scheduleStart: 'Jun 11, 2025',
      scheduleEnd: 'NA',
      createdOn: 'Jun 11, 2025',
      paused: false,
    },
    {
      id: 7,
      subject: 'LocoTest',
      channels: [this.CH['twitter']],
      extraChannels: 0,
      sentiments: ['positive', 'negative', 'neutral'],
      query: '(Sentiment In Positive, Neg...',
      emailCount: 1,
      scheduleStart: 'Jun 11, 2025',
      scheduleEnd: 'NA',
      createdOn: 'Jun 11, 2025',
      paused: false,
    },
    {
      id: 8,
      subject: 'REAL-TIME key word',
      channels: [this.CH['twitter']],
      extraChannels: 0,
      sentiments: [],
      query: '(Keyword Contains ...',
      emailCount: 1,
      scheduleStart: 'Jun 02, 2025',
      scheduleEnd: 'Jun 6, 2025',
      createdOn: 'Jun 02, 2025',
      paused: false,
    },
    {
      id: 9,
      subject: 'Test Alert',
      channels: [this.CH['blogger'], this.CH['reddit'], this.CH['web']],
      extraChannels: 22,
      sentiments: [],
      query: '(Activity Type In ...',
      emailCount: 1,
      scheduleStart: 'May 20, 2025',
      scheduleEnd: 'NA',
      createdOn: 'May 20, 2025',
      paused: false,
    },
    {
      id: 10,
      subject: 'Testing Alert',
      channels: [this.CH['blogger'], this.CH['reddit'], this.CH['web']],
      extraChannels: 24,
      sentiments: [],
      query: '(Follower Count It...',
      emailCount: 1,
      scheduleStart: 'May 20, 2026',
      scheduleEnd: 'NA',
      createdOn: 'May 20, 2026',
      paused: false,
    },
  ];

  get filteredAlerts() {
    if (!this.searchQuery.trim()) return this.alerts;
    const q = this.searchQuery.toLowerCase();
    return this.alerts.filter(a => a.subject.toLowerCase().includes(q));
  }

  togglePause(a: AlertRow) { a.paused = !a.paused; }
  openWizard()  { this.showWizard = true; }
  closeWizard() { this.showWizard = false; }
}
