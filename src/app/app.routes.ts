import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { TicketsPageComponent } from './features/tickets/tickets-page.component';
import { PlaceholderPageComponent } from './features/placeholder/placeholder-page.component';
import { AccountSettingsComponent } from './features/account-settings/account-settings.component';
import { ChannelConfigComponent } from './features/account-settings/channel-config/channel-config.component';
import { AccountPlaceholderComponent } from './features/account-settings/account-placeholder.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'social-inbox', pathMatch: 'full' },
      { path: 'social-inbox', component: TicketsPageComponent },
      { path: 'mention-inbox', component: PlaceholderPageComponent },
      { path: 'analytics', component: PlaceholderPageComponent },
      { path: 'reports', component: PlaceholderPageComponent },
      { path: 'social-schedule', component: PlaceholderPageComponent },
      { path: 'ugc', component: PlaceholderPageComponent },
      { path: 'export-data', component: PlaceholderPageComponent },
      { path: 'bulk-action', component: PlaceholderPageComponent },
      { path: 'campaign', component: PlaceholderPageComponent },
      { path: 'chat-with-data', component: PlaceholderPageComponent },
      { path: 'miscellaneous', component: PlaceholderPageComponent },
    ],
  },
  {
    path: 'account-settings',
    component: AccountSettingsComponent,
    children: [
      { path: '', redirectTo: 'channel-configuration', pathMatch: 'full' },
      { path: 'channel-configuration', component: ChannelConfigComponent },
      // Every other Account Settings section falls through to a placeholder.
      { path: ':section', component: AccountPlaceholderComponent },
    ],
  },
  { path: '**', redirectTo: 'social-inbox' },
];
