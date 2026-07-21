import { Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketViewSettingsService } from '../../core/ticket-view-settings.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  @Input() searchPlaceholder = 'Search for a Ticket ID...';

  eyeMenuOpen = false;

  constructor(public viewSettings: TicketViewSettingsService) {}

  toggleEyeMenu(event: Event): void {
    event.stopPropagation();
    this.eyeMenuOpen = !this.eyeMenuOpen;
  }

  @HostListener('document:click')
  closeEyeMenu(): void {
    this.eyeMenuOpen = false;
  }
}
