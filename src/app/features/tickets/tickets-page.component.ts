import { Component } from '@angular/core';
import { TicketsPanelComponent } from './tickets-panel/tickets-panel.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';

@Component({
  selector: 'app-tickets-page',
  standalone: true,
  imports: [TicketsPanelComponent, TicketListComponent],
  template: `
    <div class="tickets-page">
      <app-tickets-panel></app-tickets-panel>
      <div class="tickets-main">
        <app-ticket-list></app-ticket-list>
      </div>
    </div>
  `,
  styles: [`
    .tickets-page { display: flex; height: 100%; min-height: 0; }
    .tickets-main { flex: 1; min-width: 0; overflow-y: auto; }
  `],
})
export class TicketsPageComponent {}
