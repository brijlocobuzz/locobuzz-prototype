import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consumption-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dc">
      <span class="dc-icon msr">notifications_active</span>
      <h2>Consumption Alert</h2>
      <p>Configure alerts for your data consumption thresholds here.</p>
    </div>
  `,
  styles: [`
    .dc { height: 100%; display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 8px; color: var(--text-3); text-align: center; }
    .dc-icon { font-size: var(--font-size-50); color: var(--brand); opacity: .7; }
    h2 { margin: 4px 0 0; color: var(--text-1); font-size: var(--font-size-20); font-weight: 600; }
    p { margin: 0; font-size: var(--font-size-14); }
  `],
})
export class ConsumptionAlertComponent {}
