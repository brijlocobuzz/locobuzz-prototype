import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TICKETS, MY_TEAM, Ticket } from '../../../core/mock-data';
import { TicketViewSettingsService } from '../../../core/ticket-view-settings.service';
import { TicketFolderFilterService } from '../../../core/ticket-folder-filter.service';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss',
})
export class TicketListComponent {
  tickets = TICKETS;
  team = MY_TEAM;

  constructor(
    public viewSettings: TicketViewSettingsService,
    public filter: TicketFolderFilterService,
  ) {}

  private lastFolder: string | null = null;
  private unassignedSnapshotIds: Set<string> | null = null;
  ticketsPageSize = 5;
  showAllTickets = false;

  private get filteredTickets(): Ticket[] {
    const folder = this.filter.selectedFolder();
    if (folder !== this.lastFolder) {
      this.lastFolder = folder;
      this.showAllTickets = false;
      if (folder === 'Unassigned Tickets') {
        // Snapshot which tickets were unassigned when this view was opened, so a ticket
        // assigned via drag-drop stays visible here instead of vanishing mid-review.
        this.unassignedSnapshotIds = new Set(this.tickets.filter((t) => t.unassigned).map((t) => t.id));
      }
    }
    return folder === 'Unassigned Tickets' && this.unassignedSnapshotIds
      ? this.tickets.filter((t) => this.unassignedSnapshotIds!.has(t.id))
      : this.tickets;
  }

  get visibleTickets(): Ticket[] {
    const list = this.filteredTickets;
    return this.showAllTickets ? list : list.slice(0, this.ticketsPageSize);
  }

  get hasMoreTickets(): boolean {
    return this.filteredTickets.length > this.ticketsPageSize;
  }

  toggleShowAllTickets(): void {
    this.showAllTickets = !this.showAllTickets;
  }

  toastMessage: string | null = null;
  private toastTimer?: ReturnType<typeof setTimeout>;

  private showToast(message: string): void {
    this.toastMessage = message;
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => {
      this.toastMessage = null;
    }, 2600);
  }

  sentimentOptions: Ticket['sentiment'][] = [
    { emoji: '😠', label: 'Negative', tone: 'negative' },
    { emoji: '😐', label: 'Neutral', tone: 'neutral' },
    { emoji: '😊', label: 'Positive', tone: 'positive' },
  ];

  openSentimentFor: string | null = null;

  networkIcon(net: string): string {
    switch (net) {
      case 'facebook': return 'thumb_up';
      case 'x': return 'close';
      case 'instagram': return 'photo_camera';
      default: return 'public';
    }
  }

  toggleSentimentMenu(ticketId: string, event: Event): void {
    event.stopPropagation();
    this.openSentimentFor = this.openSentimentFor === ticketId ? null : ticketId;
  }

  selectSentiment(t: Ticket, option: Ticket['sentiment']): void {
    t.sentiment = option;
    this.openSentimentFor = null;
  }

  @HostListener('document:click')
  closeSentimentMenu(): void {
    this.openSentimentFor = null;
  }

  dragOverTicketId: string | null = null;

  onTicketDragOver(event: DragEvent, ticketId: string): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    this.dragOverTicketId = ticketId;
  }

  onTicketDragLeave(ticketId: string): void {
    if (this.dragOverTicketId === ticketId) {
      this.dragOverTicketId = null;
    }
  }

  onTicketDrop(event: DragEvent, t: Ticket): void {
    event.preventDefault();
    this.dragOverTicketId = null;
    const raw = event.dataTransfer?.getData('application/json');
    if (!raw) return;
    try {
      const member = JSON.parse(raw) as { name: string; initials: string; color: string };
      t.assigneeInitials = member.initials;
      t.assigneeColor = member.color;
      t.unassigned = false;

      const teamMember = this.team.find((m) => m.name === member.name);
      if (teamMember) {
        teamMember.assigned++;
      }

      this.showToast(`${member.name} assigned successfully`);
    } catch {
      // ignore malformed drag payloads
    }
  }
}
