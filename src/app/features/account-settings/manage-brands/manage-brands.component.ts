import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MANAGED_BRANDS, brandLogo, ManagedBrand } from './manage-brands-data';
import { AddBrandWizardComponent } from './add-brand-wizard.component';

@Component({
  selector: 'app-manage-brands',
  standalone: true,
  imports: [CommonModule, FormsModule, AddBrandWizardComponent],
  templateUrl: './manage-brands.component.html',
  styleUrl: './manage-brands.component.scss',
})
export class ManageBrandsComponent {
  readonly brandLogo = brandLogo;
  brands: ManagedBrand[] = [...MANAGED_BRANDS];

  search = '';
  wizardOpen = false;

  constructor(private router: Router) {}

  get filteredBrands(): ManagedBrand[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.brands;
    return this.brands.filter(b => b.name.toLowerCase().includes(q));
  }

  back() {
    this.router.navigate(['/account-settings']);
  }

  onBrandSaved(brand: { name: string; color: string; country: string; users: number }) {
    // Prototype: prepend the freshly-created brand to the listing.
    this.brands = [
      {
        id: brand.name.toLowerCase().replace(/\s+/g, '-'),
        name: brand.name,
        domain: `${brand.name.toLowerCase().replace(/\s+/g, '')}.com`,
        color: brand.color,
        country: brand.country,
        users: brand.users,
        channels: 0,
        ticketsEnabled: true,
      },
      ...this.brands,
    ];
  }
}
