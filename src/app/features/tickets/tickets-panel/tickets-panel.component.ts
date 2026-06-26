import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TICKET_FOLDERS } from '../../../core/mock-data';

@Component({
  selector: 'app-tickets-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tickets-panel.component.html',
  styleUrl: './tickets-panel.component.scss',
})
export class TicketsPanelComponent {
  folders = TICKET_FOLDERS;
}
