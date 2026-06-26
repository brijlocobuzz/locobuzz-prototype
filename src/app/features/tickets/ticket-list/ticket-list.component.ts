import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TICKETS } from '../../../core/mock-data';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss',
})
export class TicketListComponent {
  tickets = TICKETS;

  networkIcon(net: string): string {
    switch (net) {
      case 'facebook': return 'thumb_up';
      case 'x': return 'close';
      case 'instagram': return 'photo_camera';
      default: return 'public';
    }
  }
}
