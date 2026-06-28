import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MANAGED_USERS, ManagedUser } from './manage-users-data';
import { AddUserWizardComponent } from './add-user-wizard.component';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AddUserWizardComponent],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss',
})
export class ManageUsersComponent {
  users: ManagedUser[] = [...MANAGED_USERS];

  search = '';
  wizardOpen = false;

  constructor(private router: Router) {}

  get filteredUsers(): ManagedUser[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.users;
    return this.users.filter(u =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q));
  }

  initials(u: ManagedUser): string {
    return (u.firstName[0] + u.lastName[0]).toUpperCase();
  }

  back() {
    this.router.navigate(['/account-settings']);
  }

  onUserSaved(user: { firstName: string; lastName: string; username: string; email: string; role: string; brands: number }) {
    // Prototype: prepend the freshly-created user to the listing.
    this.users = [
      {
        id: user.username || user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
        color: '#4f46e5',
        brands: user.brands,
        active: true,
      },
      ...this.users,
    ];
  }
}
