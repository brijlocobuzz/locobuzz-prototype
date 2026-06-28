/**
 * Data for the "Manage Brands" screen and the Add / Edit Brand wizard.
 *
 * This is prototype mock data — there is no backend. It mirrors the entities the
 * real Add-Brand dialog works with: brands (for the listing), countries, users
 * (for the assign-users step), category groups + catch-all categories, the
 * preset brand-colour palette, and a starter set of products / competitors.
 */

export interface ManagedBrand {
  id: string;
  name: string;
  domain: string;
  /** Brand colour (hex) used for the accent + initials avatar fallback. */
  color: string;
  country: string;
  users: number;
  channels: number;
  ticketsEnabled: boolean;
}

export const MANAGED_BRANDS: ManagedBrand[] = [
  { id: 'amazon', name: 'Amazon', domain: 'amazon.in', color: '#ff9900', country: 'India', users: 42, channels: 9, ticketsEnabled: true },
  { id: 'nike', name: 'Nike', domain: 'nike.com', color: '#0f172a', country: 'United States', users: 18, channels: 6, ticketsEnabled: true },
  { id: 'airindia', name: 'Air India', domain: 'airindia.com', color: '#c8102e', country: 'India', users: 27, channels: 7, ticketsEnabled: true },
  { id: 'myntra', name: 'Myntra', domain: 'myntra.com', color: '#e91e63', country: 'India', users: 15, channels: 5, ticketsEnabled: false },
  { id: 'zomato', name: 'Zomato', domain: 'zomato.com', color: '#ef4444', country: 'India', users: 33, channels: 8, ticketsEnabled: true },
  { id: 'tata', name: 'Tata Cliq', domain: 'tatacliq.com', color: '#2563eb', country: 'India', users: 11, channels: 4, ticketsEnabled: false },
];

/** Google favicon service — same source the rest of the prototype uses. */
export function brandLogo(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export const COUNTRIES: string[] = [
  'United States', 'India', 'United Kingdom', 'United Arab Emirates', 'Australia',
  'Canada', 'Germany', 'France', 'Singapore', 'Japan', 'Brazil', 'South Africa',
  'Spain', 'Italy', 'Netherlands', 'Saudi Arabia', 'Indonesia', 'Mexico',
];

export interface BrandUser {
  id: string;
  /** Display name / username portion. */
  name: string;
  role: string;
}

export const BRAND_USERS: BrandUser[] = [
  { id: 'u1', name: '8Sep_agent', role: 'Agent' },
  { id: 'u2', name: 'Aakanksha_sup', role: 'Supervisor' },
  { id: 'u3', name: 'aakanshaTL', role: 'Team Leader' },
  { id: 'u4', name: 'Aarav_admin', role: 'Admin' },
  { id: 'u5', name: 'Bhavna_agent', role: 'Agent' },
  { id: 'u6', name: 'Chetan_sup', role: 'Supervisor' },
  { id: 'u7', name: 'Deepak_admin', role: 'Admin' },
  { id: 'u8', name: 'Esha_agent', role: 'Agent' },
  { id: 'u9', name: 'Farhan_TL', role: 'Team Leader' },
  { id: 'u10', name: 'Gauri_agent', role: 'Agent' },
  { id: 'u11', name: 'Harish_sup', role: 'Supervisor' },
  { id: 'u12', name: 'Isha_admin', role: 'Admin' },
  { id: 'u13', name: 'Jatin_agent', role: 'Agent' },
  { id: 'u14', name: 'Kavya_TL', role: 'Team Leader' },
  { id: 'u15', name: 'Lokesh_agent', role: 'Agent' },
];

export const CATEGORY_GROUPS: string[] = [
  'Default', 'Default2', 'Customer Care', 'Marketing', 'Product Feedback', 'Operations',
];

export const CATCH_ALL_CATEGORIES: string[] = [
  '123 12', 'Account Related', 'ActionabilityTest', 'asish signal', 'asishtest',
  'General', 'Complaint', 'Query', 'Feedback', 'Escalation', 'Spam',
];

/** Preset brand-colour palette shown as swatches on the Logo & color step. */
export const BRAND_COLORS: string[] = [
  '#0f172a', '#5b50e8', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899',
];

export interface BrandProduct {
  id: string;
  name: string;
  synonyms: string[];
}

export interface BrandCompetitor {
  id: string;
  name: string;
}
