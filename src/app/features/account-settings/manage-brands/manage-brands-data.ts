/**
 * Data for the "Manage Brands" screen and the Add / Edit Brand wizard.
 *
 * This is prototype mock data — there is no backend. It mirrors the entities the
 * real Add-Brand dialog works with: brands (for the listing), countries, users
 * (for the assign-users step), category groups + catch-all categories, the
 * preset brand-colour palette, and a starter set of products / competitors.
 */

/** A user shown as an avatar (id + display name + role). */
export interface BrandMember { id: string; name: string; role: string; }

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

  /* ---- enriched: everything captured by the Add-Brand wizard ---- */
  aiFriendlyName?: string;        // step 1
  description?: string;           // step 1
  userPreview?: BrandMember[];    // step 3 — a few assigned users for avatar stacks
  channelIds?: string[];          // listening channels (BRAND_ICONS keys) for logo stacks
  categoryGroup?: string;         // step 4
  catchAll?: string;              // step 4
  products?: { name: string; synonyms: string[] }[];  // step 5
  competitors?: string[];         // step 5
}

export const MANAGED_BRANDS: ManagedBrand[] = [
  {
    id: 'amazon', name: 'Amazon', domain: 'amazon.in', color: '#ff9900', country: 'India',
    users: 42, channels: 9, ticketsEnabled: true,
    aiFriendlyName: 'Amazon India', description: 'Amazon is a global e-commerce and cloud-computing marketplace selling products and services across categories.',
    userPreview: [
      { id: 'u4', name: 'Aarav_admin', role: 'Admin' },
      { id: 'u2', name: 'Aakanksha_sup', role: 'Supervisor' },
      { id: 'u1', name: '8Sep_agent', role: 'Agent' },
    ],
    channelIds: ['facebook', 'instagram', 'twitter', 'youtube', 'whatsapp'],
    categoryGroup: 'Customer Care', catchAll: 'General',
    products: [{ name: 'Prime', synonyms: ['Amazon Prime', 'Prime Video'] }, { name: 'Echo', synonyms: ['Alexa'] }],
    competitors: ['Flipkart', 'Walmart'],
  },
  {
    id: 'nike', name: 'Nike', domain: 'nike.com', color: '#0f172a', country: 'United States',
    users: 18, channels: 6, ticketsEnabled: true,
    aiFriendlyName: 'Nike', description: 'Nike designs, develops and markets athletic footwear, apparel and accessories globally.',
    userPreview: [
      { id: 'u7', name: 'Deepak_admin', role: 'Admin' },
      { id: 'u9', name: 'Farhan_TL', role: 'Team Leader' },
      { id: 'u8', name: 'Esha_agent', role: 'Agent' },
    ],
    channelIds: ['instagram', 'facebook', 'twitter', 'youtube'],
    categoryGroup: 'Marketing', catchAll: 'Feedback',
    products: [{ name: 'Air Max', synonyms: ['AM', 'Air-Max'] }, { name: 'Jordan', synonyms: ['AJ'] }],
    competitors: ['Adidas', 'Puma', 'Reebok'],
  },
  {
    id: 'airindia', name: 'Air India', domain: 'airindia.com', color: '#c8102e', country: 'India',
    users: 27, channels: 7, ticketsEnabled: true,
    aiFriendlyName: 'Air India', description: 'Air India is the flag-carrier airline of India operating domestic and international passenger flights.',
    userPreview: [
      { id: 'u6', name: 'Chetan_sup', role: 'Supervisor' },
      { id: 'u11', name: 'Harish_sup', role: 'Supervisor' },
      { id: 'u13', name: 'Jatin_agent', role: 'Agent' },
    ],
    channelIds: ['twitter', 'facebook', 'instagram', 'tripadvisor'],
    categoryGroup: 'Operations', catchAll: 'Complaint',
    products: [{ name: 'Maharaja Lounge', synonyms: ['Lounge'] }],
    competitors: ['IndiGo', 'Vistara'],
  },
  {
    id: 'myntra', name: 'Myntra', domain: 'myntra.com', color: '#e91e63', country: 'India',
    users: 15, channels: 5, ticketsEnabled: false,
    aiFriendlyName: 'Myntra', description: 'Myntra is an Indian fashion e-commerce platform for apparel, footwear and lifestyle products.',
    userPreview: [
      { id: 'u10', name: 'Gauri_agent', role: 'Agent' },
      { id: 'u14', name: 'Kavya_TL', role: 'Team Leader' },
      { id: 'u5', name: 'Bhavna_agent', role: 'Agent' },
    ],
    channelIds: ['instagram', 'facebook', 'twitter'],
    categoryGroup: 'Customer Care', catchAll: 'Query',
    products: [{ name: 'Myntra Insider', synonyms: ['Insider'] }],
    competitors: ['Ajio', 'Nykaa Fashion'],
  },
  {
    id: 'zomato', name: 'Zomato', domain: 'zomato.com', color: '#ef4444', country: 'India',
    users: 33, channels: 8, ticketsEnabled: true,
    aiFriendlyName: 'Zomato', description: 'Zomato is a food-delivery and restaurant-discovery platform operating across hundreds of cities.',
    userPreview: [
      { id: 'u12', name: 'Isha_admin', role: 'Admin' },
      { id: 'u3', name: 'aakanshaTL', role: 'Team Leader' },
      { id: 'u15', name: 'Lokesh_agent', role: 'Agent' },
    ],
    channelIds: ['twitter', 'instagram', 'facebook', 'youtube', 'playstore'],
    categoryGroup: 'Customer Care', catchAll: 'Escalation',
    products: [{ name: 'Zomato Gold', synonyms: ['Gold', 'Pro'] }],
    competitors: ['Swiggy', 'Uber Eats'],
  },
  {
    id: 'tata', name: 'Tata Cliq', domain: 'tatacliq.com', color: '#2563eb', country: 'India',
    users: 11, channels: 4, ticketsEnabled: false,
    aiFriendlyName: 'Tata Cliq', description: 'Tata CLiQ is the flagship omni-channel e-commerce marketplace from the Tata Group.',
    userPreview: [
      { id: 'u4', name: 'Aarav_admin', role: 'Admin' },
      { id: 'u6', name: 'Chetan_sup', role: 'Supervisor' },
    ],
    channelIds: ['facebook', 'instagram', 'twitter'],
    categoryGroup: 'Default', catchAll: 'Account Related',
    products: [{ name: 'CLiQ Luxury', synonyms: ['Luxury'] }],
    competitors: ['Amazon', 'Flipkart'],
  },
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
