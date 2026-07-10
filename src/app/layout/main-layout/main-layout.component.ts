import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { NavRailComponent } from '../nav-rail/nav-rail.component';
import { TopbarComponent } from '../topbar/topbar.component';

/** Routes that render their own toolbar — the shared tickets topbar is hidden there. */
const SELF_HEADED_ROUTES = ['/social-schedule'];

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavRailComponent, TopbarComponent],
  template: `
    <div class="shell">
      <app-nav-rail class="shell-rail"></app-nav-rail>
      <div class="shell-main">
        <app-topbar *ngIf="!hideTopbar()"></app-topbar>
        <main class="shell-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
    .shell { display: flex; height: 100vh; overflow: hidden; }
    .shell-rail { flex: 0 0 var(--rail-w); }
    .shell-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .shell-content { flex: 1; min-height: 0; overflow: hidden; }
  `],
})
export class MainLayoutComponent {
  private readonly router = inject(Router);

  readonly hideTopbar = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => SELF_HEADED_ROUTES.some(r => e.urlAfterRedirects.startsWith(r))),
    ),
    { initialValue: SELF_HEADED_ROUTES.some(r => this.router.url.startsWith(r)) },
  );
}
