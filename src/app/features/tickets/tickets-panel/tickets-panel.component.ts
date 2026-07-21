import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TICKET_FOLDERS, MY_TEAM, TeamMember } from '../../../core/mock-data';
import { TicketFolderFilterService } from '../../../core/ticket-folder-filter.service';

@Component({
  selector: 'app-tickets-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tickets-panel.component.html',
  styleUrl: './tickets-panel.component.scss',
})
export class TicketsPanelComponent {
  folders = TICKET_FOLDERS;
  collapsed: Record<string, boolean> = {};

  team = MY_TEAM;
  teamExpanded = true;
  teamSearch = '';
  showAllTeam = true;
  teamVisibleCount = 4;

  constructor(public filter: TicketFolderFilterService) {}

  isCollapsed(label: string): boolean {
    return !!this.collapsed[label];
  }

  selectFolder(label: string, hasChildren: boolean): void {
    this.filter.select(label);
    if (hasChildren) {
      this.collapsed[label] = !this.collapsed[label];
    }
  }

  toggleTeam(): void {
    this.teamExpanded = !this.teamExpanded;
  }

  toggleShowAllTeam(): void {
    this.showAllTeam = !this.showAllTeam;
  }

  get filteredTeam() {
    const q = this.teamSearch.trim().toLowerCase();
    return q ? this.team.filter((m) => m.name.toLowerCase().includes(q)) : this.team;
  }

  get visibleTeam() {
    const filtered = this.filteredTeam;
    return this.showAllTeam ? filtered : filtered.slice(0, this.teamVisibleCount);
  }

  onMemberDragStart(event: DragEvent, member: TeamMember): void {
    event.dataTransfer?.setData(
      'application/json',
      JSON.stringify({ name: member.name, initials: member.initials, color: member.avatarColor }),
    );
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
    }
  }
}
