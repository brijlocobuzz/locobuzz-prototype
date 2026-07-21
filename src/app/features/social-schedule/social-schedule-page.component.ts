import { Component } from '@angular/core';
import { ManagePostComponent } from './manage-post/manage-post.component';

@Component({
  selector: 'app-social-schedule-page',
  standalone: true,
  imports: [ManagePostComponent],
  // Manage Post / Calendar now switch from the left nav rail inside the shell below.
  template: `<app-manage-post />`,
  styles: [`:host { display: block; height: 100%; }`],
})
export class SocialSchedulePageComponent {}
