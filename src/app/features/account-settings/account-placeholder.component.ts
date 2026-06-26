import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ACCOUNT_NAV } from './account-nav';

@Component({
  selector: 'app-account-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ph" *ngIf="info$ | async as info">
      <span class="ph-icon msr">{{ info.icon }}</span>
      <h2>{{ info.label }}</h2>
      <p>This Account Settings section is part of the prototype shell.</p>
    </div>
  `,
  styles: [`
    .ph { height: 100%; display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 8px; color: var(--text-3); text-align: center; }
    .ph-icon { font-size: var(--font-size-50); color: var(--brand); opacity: .7; }
    h2 { margin: 4px 0 0; color: var(--text-1); font-size: var(--font-size-20); font-weight: 600; }
    p { margin: 0; font-size: var(--font-size-14); }
  `],
})
export class AccountPlaceholderComponent {
  private all = ACCOUNT_NAV.flatMap(s => (s.children?.length ? s.children : [s]));

  info$ = this.route.paramMap.pipe(
    map(p => {
      const section = p.get('section');
      return this.all.find(i => i.route === section) ?? { label: 'Coming soon', icon: 'construction' };
    }),
  );

  constructor(private route: ActivatedRoute) {}
}
