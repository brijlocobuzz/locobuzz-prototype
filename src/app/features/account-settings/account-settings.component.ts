import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ACCOUNT_NAV, AccountNavItem } from './account-nav';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatTooltipModule],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss',
})
export class AccountSettingsComponent {
  nav = ACCOUNT_NAV;

  /** Tracks which expandable groups are open. Listening Settings open by default. */
  open: Record<string, boolean> = { 'Listening Settings': true };

  active = 'Channel Configuration';

  /** Sidebar collapsed to an icon-only rail. */
  collapsed = false;

  constructor(private router: Router) {}

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  toggle(item: AccountNavItem) {
    if (item.expandable) this.open[item.label] = !this.open[item.label];
    if (item.route) {
      this.active = item.label;
      this.router.navigate(['/account-settings', ...item.route.split('/')]);
    } else {
      this.active = item.label;
    }
  }

  openAiHub() {
    this.active = 'Explore AI Features';
    this.router.navigate(['/account-settings', 'ai-hub']);
  }

  back() {
    this.router.navigate(['/tickets']);
  }
}
