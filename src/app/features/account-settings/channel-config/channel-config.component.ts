import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CHANNEL_GROUPS, FACEBOOK_PROFILES, ChannelGroup, mentionTypeIcon } from '../channel-data';
import { AddChannelWizardComponent } from './add-channel-wizard.component';

@Component({
  selector: 'app-channel-config',
  standalone: true,
  imports: [CommonModule, AddChannelWizardComponent],
  templateUrl: './channel-config.component.html',
  styleUrl: './channel-config.component.scss',
})
export class ChannelConfigComponent {
  groups = CHANNEL_GROUPS;
  profiles = FACEBOOK_PROFILES;
  expanded: Record<string, boolean> = { 'SOCIAL MEDIA': true };

  mentionIcon = mentionTypeIcon;

  /** Card colour theme — both share the same layout. */
  cardStyle: 'classic' | 'vibrant' = 'classic';

  /** Add-channel wizard modal. */
  wizardOpen = false;

  toggle(g: ChannelGroup) {
    this.expanded[g.label] = !this.expanded[g.label];
  }

  /** "Jun 11, 2026 11:57 AM" -> "Jun 11, 2026" */
  shortDate(s: string): string {
    const m = s.match(/^([A-Za-z]+ \d{1,2}, \d{4})/);
    return m ? m[1] : s;
  }
}
