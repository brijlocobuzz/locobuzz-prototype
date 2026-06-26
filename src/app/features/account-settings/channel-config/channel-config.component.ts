import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CHANNEL_GROUPS, FACEBOOK_PROFILES, ChannelGroup } from '../channel-data';

@Component({
  selector: 'app-channel-config',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel-config.component.html',
  styleUrl: './channel-config.component.scss',
})
export class ChannelConfigComponent {
  groups = CHANNEL_GROUPS;
  profiles = FACEBOOK_PROFILES;
  expanded: Record<string, boolean> = { 'SOCIAL MEDIA': true };

  toggle(g: ChannelGroup) {
    this.expanded[g.label] = !this.expanded[g.label];
  }
}
