import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TicketFolderFilterService {
  selectedFolder = signal<string>('Active Tickets');

  select(label: string): void {
    this.selectedFolder.set(label);
  }
}
