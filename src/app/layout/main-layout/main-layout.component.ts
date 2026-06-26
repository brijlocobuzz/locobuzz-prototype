import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavRailComponent } from '../nav-rail/nav-rail.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavRailComponent, TopbarComponent],
  template: `
    <div class="shell">
      <app-nav-rail class="shell-rail"></app-nav-rail>
      <div class="shell-main">
        <app-topbar></app-topbar>
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
export class MainLayoutComponent {}
