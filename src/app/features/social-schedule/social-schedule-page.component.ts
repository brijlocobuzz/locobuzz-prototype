import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagePostComponent } from './manage-post/manage-post.component';

type ScheduleView = 'manage' | 'calendar';

@Component({
  selector: 'app-social-schedule-page',
  standalone: true,
  imports: [CommonModule, ManagePostComponent],
  template: `
    <ng-template #switchTpl>
      <div class="ssp-switch" role="tablist" aria-label="Social scheduling views">
        <button type="button" class="ssp-tab" role="tab"
                [attr.aria-selected]="view() === 'manage'"
                [class.ssp-tab--on]="view() === 'manage'"
                (click)="view.set('manage')">
          <span class="msr">grid_view</span> Manage Post
        </button>
        <button type="button" class="ssp-tab" role="tab"
                [attr.aria-selected]="view() === 'calendar'"
                [class.ssp-tab--on]="view() === 'calendar'"
                (click)="view.set('calendar')">
          <span class="msr">calendar_month</span> Calendar
        </button>
      </div>
    </ng-template>

    <div class="ssp">
      <!-- The view switch is projected into the Manage Post toolbar to save a header row. -->
      <app-manage-post class="ssp-body" *ngIf="view() === 'manage'">
        <ng-container [ngTemplateOutlet]="switchTpl" />
      </app-manage-post>

      <ng-container *ngIf="view() === 'calendar'">
        <div class="ssp-bar">
          <ng-container [ngTemplateOutlet]="switchTpl" />
        </div>
        <div class="ssp-ph">
          <span class="msr">calendar_month</span>
          <h2>Calendar</h2>
          <p>The scheduling calendar will be wired up next.</p>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .ssp { display: flex; flex-direction: column; height: 100%; min-height: 0; }
    .ssp-body { flex: 1; min-height: 0; }

    .ssp-bar {
      padding: 8px 12px;
      background: var(--surface);
      border-bottom: 1px solid var(--border-soft);
    }

    .ssp-switch {
      display: inline-flex;
      gap: 2px;
      padding: 3px;
      background: #eef1f6;
      border-radius: 10px;
      flex: 0 0 auto;
    }
    .ssp-tab {
      display: inline-flex; align-items: center; gap: 6px;
      height: 28px;
      padding: 0 12px;
      border: none; border-radius: 8px;
      background: transparent;
      font: inherit; font-size: var(--font-size-12); font-weight: 600;
      color: var(--text-2); cursor: pointer; white-space: nowrap;
      transition: background .13s ease, color .13s ease;
      .msr { font-size: 15px; }
      &:hover { color: var(--text-1); }
      &:focus-visible { outline: 2px solid var(--brand); outline-offset: -1px; }
      &--on {
        background: var(--surface);
        color: var(--brand);
        box-shadow: 0 1px 2px rgba(15, 23, 42, .12);
      }
    }

    .ssp-ph {
      flex: 1;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 8px; color: var(--text-3); text-align: center;
      .msr { font-size: var(--font-size-50); color: var(--brand); opacity: .7; }
      h2 { margin: 0; color: var(--text-1); font-size: var(--font-size-20); font-weight: 600; }
      p { margin: 0; font-size: var(--font-size-13); }
    }
  `],
})
export class SocialSchedulePageComponent {
  readonly view = signal<ScheduleView>('manage');
}
