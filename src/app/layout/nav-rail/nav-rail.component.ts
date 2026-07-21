import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NAV_ITEMS, MORE_ITEMS } from '../../core/menu';
import { FontSizeService, FONT_SIZE_STEPS } from '../../core/font-size.service';

@Component({
  selector: 'app-nav-rail',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatTooltipModule],
  templateUrl: './nav-rail.component.html',
  styleUrl: './nav-rail.component.scss',
})
export class NavRailComponent {
  items = NAV_ITEMS;
  moreItems = MORE_ITEMS;
  moreOpen = false;

  profileMenuOpen = false;
  soundOn = false;
  fontSizeSteps = FONT_SIZE_STEPS;

  constructor(public fontSize: FontSizeService) {}

  toggleMore() {
    this.moreOpen = !this.moreOpen;
  }

  closeMore() {
    this.moreOpen = false;
  }

  toggleProfileMenu(event: Event) {
    event.stopPropagation();
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu() {
    this.profileMenuOpen = false;
  }
}
