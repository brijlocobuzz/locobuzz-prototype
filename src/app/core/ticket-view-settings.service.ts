import { Injectable, signal } from '@angular/core';

export interface TicketViewSettings {
  signalSense: boolean;
  ticketCategories: boolean;
  mentionCategories: boolean;
  upperCategory: boolean;
  aspects: boolean;
  aspectGroups: boolean;
  priority: boolean;
  slaBreached: boolean;
  mentionCount: boolean;
  createdTime: boolean;
  ticketId: boolean;
  actionButtons: boolean;
  brandName: boolean;
  assignTo: boolean;
  ticketStatus: boolean;
}

const DEFAULT_SETTINGS: TicketViewSettings = {
  signalSense: true,
  ticketCategories: true,
  mentionCategories: true,
  upperCategory: true,
  aspects: true,
  aspectGroups: true,
  priority: true,
  slaBreached: true,
  mentionCount: true,
  createdTime: true,
  ticketId: true,
  actionButtons: true,
  brandName: true,
  assignTo: true,
  ticketStatus: true,
};

@Injectable({ providedIn: 'root' })
export class TicketViewSettingsService {
  settings = signal<TicketViewSettings>({ ...DEFAULT_SETTINGS });

  toggle(key: keyof TicketViewSettings): void {
    this.settings.update((s) => ({ ...s, [key]: !s[key] }));
  }
}
