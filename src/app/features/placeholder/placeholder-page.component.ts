import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ALL_NAV_ITEMS } from '../../core/menu';

@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ph" *ngIf="info$ | async as info">
      <span class="ph-icon msr">{{ info.icon }}</span>
      <h2>{{ info.label }}</h2>
      <p>This module is part of the Locobuzz CX Suite prototype shell.<br />Screens for “{{ info.label }}” will be wired up next.</p>
    </div>
  `,
  styles: [`
    .ph {
      height: 100%;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 10px; color: var(--text-3); text-align: center;
    }
    .ph-icon { font-size: var(--font-size-50); color: var(--brand); opacity: .7; }
    h2 { margin: 4px 0 0; color: var(--text-1); font-size: var(--font-size-22); font-weight: 600; }
    p { margin: 0; font-size: var(--font-size-14); line-height: 1.6; }
  `],
})
export class PlaceholderPageComponent {
  info$ = this.route.url.pipe(
    map(() => {
      const path = '/' + (this.route.snapshot.routeConfig?.path ?? '');
      return ALL_NAV_ITEMS.find(i => i.route === path) ?? { label: 'Module', icon: 'dashboard' };
    }),
  );
  constructor(private route: ActivatedRoute) {}
}
