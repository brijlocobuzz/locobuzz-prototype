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

/** Industries a brand can belong to. "Others" reveals a free-text input in the wizard. */
export const INDUSTRIES: readonly string[] = [
  'Telecom',
  'BFSI / Banking & Financial Services',
  'Retail',
  'FMCG / Consumer Goods',
  'Healthcare',
  'Automobile / Automotive',
  'Travel',
  'Hospitality',
  'Aviation',
  'Technology / IT / SaaS',
  'Education',
  'Energy & Utilities',
  'Government & Public Sector',
  'Real Estate',
  'E-commerce',
  'Media & Entertainment',
  'Consumer Electronics',
  'Manufacturing',
  'Logistics & Transportation',
  'Insurance',
  'Pharmaceuticals',
  'Food & Beverages',
  'Infrastructure',
  'Non-profit / NGO',
  'Others',
];

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
  /** Industry the brand operates in (from the INDUSTRIES list, or a free-text "Others" value). */
  industry?: string;
  /** Brand website URL. */
  website?: string;
  /** Uploaded logo (data URL) — used for the avatar when present, else the favicon. */
  logoUrl?: string;

  /* ---- enriched: everything captured by the Add-Brand wizard ---- */
  aiFriendlyName?: string;        // step 1 — common name
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
    id: 'amazon', name: 'Amazon', industry: 'E-commerce', domain: 'amazon.in', color: '#ff9900', country: 'India',
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
    id: 'nike', name: 'Nike', industry: 'Retail', domain: 'nike.com', color: '#0f172a', country: 'United States',
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
    id: 'airindia', name: 'Air India', industry: 'Aviation', domain: 'airindia.com', color: '#c8102e', country: 'India',
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
    id: 'myntra', name: 'Myntra', industry: 'E-commerce', domain: 'myntra.com', color: '#e91e63', country: 'India',
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
    id: 'zomato', name: 'Zomato', industry: 'Food & Beverages', domain: 'zomato.com', color: '#ef4444', country: 'India',
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
    id: 'tata', name: 'Tata Cliq', industry: 'E-commerce', domain: 'tatacliq.com', color: '#2563eb', country: 'India',
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
  {
    id: 'flipkart', name: 'Flipkart', industry: 'E-commerce', domain: 'flipkart.com', color: '#2874f0', country: 'India',
    users: 38, channels: 8, ticketsEnabled: true,
    aiFriendlyName: 'Flipkart', description: 'Flipkart is one of India\'s leading e-commerce marketplaces across electronics, fashion and groceries.',
    userPreview: [
      { id: 'u12', name: 'Lakshay_cfg', role: 'Admin' },
      { id: 'u8', name: 'Harsh_TL', role: 'Team Leader' },
      { id: 'u7', name: 'Gauri_agent', role: 'Agent' },
    ],
    channelIds: ['facebook', 'instagram', 'twitter', 'youtube', 'playstore'],
    categoryGroup: 'Customer Care', catchAll: 'General',
    products: [{ name: 'Flipkart Plus', synonyms: ['Plus'] }, { name: 'SuperCoins', synonyms: ['Coins'] }],
    competitors: ['Amazon', 'Meesho'],
  },
  {
    id: 'swiggy', name: 'Swiggy', industry: 'Food & Beverages', domain: 'swiggy.com', color: '#fc8019', country: 'India',
    users: 29, channels: 6, ticketsEnabled: true,
    aiFriendlyName: 'Swiggy', description: 'Swiggy is an on-demand food and grocery delivery platform operating across Indian cities.',
    userPreview: [
      { id: 'u13', name: 'Meera_sup', role: 'Supervisor' },
      { id: 'u10', name: 'Jatin_agent', role: 'Agent' },
    ],
    channelIds: ['twitter', 'instagram', 'facebook', 'playstore'],
    categoryGroup: 'Customer Care', catchAll: 'Escalation',
    products: [{ name: 'Swiggy One', synonyms: ['One', 'Super'] }, { name: 'Instamart', synonyms: ['Grocery'] }],
    competitors: ['Zomato', 'Zepto'],
  },
  {
    id: 'adidas', name: 'Adidas', industry: 'Retail', domain: 'adidas.com', color: '#111827', country: 'Germany',
    users: 21, channels: 5, ticketsEnabled: true,
    aiFriendlyName: 'Adidas', description: 'Adidas designs and manufactures sportswear, footwear and accessories worldwide.',
    userPreview: [
      { id: 'u11', name: 'Kavya_brand', role: 'Brand Account' },
      { id: 'u5', name: 'Esha_agent', role: 'Agent' },
    ],
    channelIds: ['instagram', 'facebook', 'twitter', 'youtube'],
    categoryGroup: 'Marketing', catchAll: 'Feedback',
    products: [{ name: 'Ultraboost', synonyms: ['UB'] }, { name: 'Originals', synonyms: ['Trefoil'] }],
    competitors: ['Nike', 'Puma'],
  },
  {
    id: 'starbucks', name: 'Starbucks', industry: 'Food & Beverages', domain: 'starbucks.com', color: '#00704a', country: 'United States',
    users: 16, channels: 5, ticketsEnabled: false,
    aiFriendlyName: 'Starbucks', description: 'Starbucks is a global coffeehouse chain serving beverages, food and packaged products.',
    userPreview: [
      { id: 'u15', name: 'Priya_TL', role: 'Team Leader' },
      { id: 'u2', name: 'Bhavna_agent', role: 'Agent' },
    ],
    channelIds: ['instagram', 'facebook', 'twitter'],
    categoryGroup: 'Customer Care', catchAll: 'Query',
    products: [{ name: 'Rewards', synonyms: ['Star Rewards'] }],
    competitors: ['Costa Coffee', 'Tim Hortons'],
  },
  {
    id: 'ola', name: 'Ola', industry: 'Logistics & Transportation', domain: 'olacabs.com', color: '#1f2937', country: 'India',
    users: 24, channels: 6, ticketsEnabled: true,
    aiFriendlyName: 'Ola Cabs', description: 'Ola is a mobility platform offering ride-hailing and electric-vehicle services across India.',
    userPreview: [
      { id: 'u9', name: 'Ishita_ro', role: 'Read-Only Supervisor' },
      { id: 'u14', name: 'Nikhil_agent', role: 'Agent' },
    ],
    channelIds: ['twitter', 'facebook', 'instagram', 'playstore'],
    categoryGroup: 'Operations', catchAll: 'Complaint',
    products: [{ name: 'Ola Electric', synonyms: ['S1', 'EV'] }],
    competitors: ['Uber', 'Rapido'],
  },
  {
    id: 'nykaa', name: 'Nykaa', industry: 'E-commerce', domain: 'nykaa.com', color: '#fc2779', country: 'India',
    users: 19, channels: 5, ticketsEnabled: true,
    aiFriendlyName: 'Nykaa', description: 'Nykaa is an Indian beauty and lifestyle e-commerce retailer for cosmetics and wellness.',
    userPreview: [
      { id: 'u11', name: 'Kavya_brand', role: 'Brand Account' },
      { id: 'u1', name: 'Aarav_admin', role: 'Admin' },
    ],
    channelIds: ['instagram', 'facebook', 'youtube'],
    categoryGroup: 'Marketing', catchAll: 'Feedback',
    products: [{ name: 'Nykaa Fashion', synonyms: ['Fashion'] }],
    competitors: ['Myntra', 'Sephora'],
  },
  {
    id: 'cred', name: 'CRED', industry: 'BFSI / Banking & Financial Services', domain: 'cred.club', color: '#0b0b0b', country: 'India',
    users: 13, channels: 4, ticketsEnabled: false,
    aiFriendlyName: 'CRED', description: 'CRED is a members-only platform for credit-card payments, rewards and financial products.',
    userPreview: [
      { id: 'u3', name: 'aakanshaTL', role: 'Team Leader' },
    ],
    channelIds: ['twitter', 'instagram'],
    categoryGroup: 'Default', catchAll: 'Account Related',
    products: [{ name: 'CRED Pay', synonyms: ['Pay'] }],
    competitors: ['Paytm', 'PhonePe'],
  },
  {
    id: 'uber', name: 'Uber', industry: 'Logistics & Transportation', domain: 'uber.com', color: '#000000', country: 'United States',
    users: 31, channels: 7, ticketsEnabled: true,
    aiFriendlyName: 'Uber', description: 'Uber is a global mobility and delivery platform connecting riders, drivers and merchants.',
    userPreview: [
      { id: 'u8', name: 'Harsh_TL', role: 'Team Leader' },
      { id: 'u4', name: 'Deepika_cc', role: 'Customer Care' },
    ],
    channelIds: ['twitter', 'facebook', 'instagram', 'playstore', 'gmb'],
    categoryGroup: 'Operations', catchAll: 'Complaint',
    products: [{ name: 'Uber Eats', synonyms: ['Eats'] }, { name: 'Uber One', synonyms: ['One'] }],
    competitors: ['Ola', 'Lyft'],
  },
  {
    id: 'spotify', name: 'Spotify', industry: 'Media & Entertainment', domain: 'spotify.com', color: '#1db954', country: 'Sweden',
    users: 17, channels: 5, ticketsEnabled: true,
    aiFriendlyName: 'Spotify', description: 'Spotify is a digital music, podcast and audio-streaming service with a global catalogue.',
    userPreview: [
      { id: 'u5', name: 'Esha_brand', role: 'Brand Account' },
      { id: 'u13', name: 'Meera_sup', role: 'Supervisor' },
    ],
    channelIds: ['instagram', 'twitter', 'youtube'],
    categoryGroup: 'Marketing', catchAll: 'Feedback',
    products: [{ name: 'Spotify Premium', synonyms: ['Premium'] }],
    competitors: ['Apple Music', 'Gaana'],
  },
];

/** Google favicon service — same source the rest of the prototype uses. */
export function brandLogo(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

/** India is pinned first; the rest follow. */
export const COUNTRIES: string[] = [
  'India', 'United States', 'United Kingdom', 'United Arab Emirates', 'Australia',
  'Canada', 'Germany', 'France', 'Singapore', 'Japan', 'Brazil', 'South Africa',
  'Spain', 'Italy', 'Netherlands', 'Saudi Arabia', 'Indonesia', 'Mexico',
];

/** Country → ISO-3166 alpha-2 code (used to build the flag image URL). */
export const COUNTRY_CODES: Record<string, string> = {
  'India': 'in', 'United States': 'us', 'United Kingdom': 'gb',
  'United Arab Emirates': 'ae', 'Australia': 'au', 'Canada': 'ca',
  'Germany': 'de', 'France': 'fr', 'Singapore': 'sg', 'Japan': 'jp',
  'Brazil': 'br', 'South Africa': 'za', 'Spain': 'es', 'Italy': 'it',
  'Netherlands': 'nl', 'Saudi Arabia': 'sa', 'Indonesia': 'id', 'Mexico': 'mx',
};
/** Real flag image (renders reliably everywhere, unlike emoji flags on Windows). */
export function countryFlagUrl(name: string): string {
  const code = COUNTRY_CODES[name];
  return code ? `https://flagcdn.com/${code}.svg` : '';
}

export interface BrandUser {
  id: string;
  /** Username / login handle. */
  name: string;
  /** Human full name. */
  fullName: string;
  role: string;
  /** Team the user belongs to. */
  team: string;
}

export const BRAND_USERS: BrandUser[] = [
  { id: 'u1', name: '8Sep_agent', fullName: 'Aditya Sen', role: 'Agent', team: 'Support' },
  { id: 'u2', name: 'Aakanksha_sup', fullName: 'Aakanksha Rao', role: 'Supervisor', team: 'Escalations' },
  { id: 'u3', name: 'aakanshaTL', fullName: 'Aakansha Iyer', role: 'Team Leader', team: 'Social Care' },
  { id: 'u4', name: 'Aarav_admin', fullName: 'Aarav Mehta', role: 'Admin', team: 'Operations' },
  { id: 'u5', name: 'Bhavna_agent', fullName: 'Bhavna Kapoor', role: 'Agent', team: 'Support' },
  { id: 'u6', name: 'Chetan_sup', fullName: 'Chetan Malhotra', role: 'Supervisor', team: 'Social Care' },
  { id: 'u7', name: 'Deepak_admin', fullName: 'Deepak Nair', role: 'Admin', team: 'Operations' },
  { id: 'u8', name: 'Esha_agent', fullName: 'Esha Gupta', role: 'Agent', team: 'Escalations' },
  { id: 'u9', name: 'Farhan_TL', fullName: 'Farhan Sheikh', role: 'Team Leader', team: 'Support' },
  { id: 'u10', name: 'Gauri_agent', fullName: 'Gauri Deshmukh', role: 'Agent', team: 'Social Care' },
  { id: 'u11', name: 'Harish_sup', fullName: 'Harish Kumar', role: 'Supervisor', team: 'Operations' },
  { id: 'u12', name: 'Isha_admin', fullName: 'Isha Verma', role: 'Admin', team: 'Escalations' },
  { id: 'u13', name: 'Jatin_agent', fullName: 'Jatin Arora', role: 'Agent', team: 'Support' },
  { id: 'u14', name: 'Kavya_TL', fullName: 'Kavya Reddy', role: 'Team Leader', team: 'Social Care' },
  { id: 'u15', name: 'Lokesh_agent', fullName: 'Lokesh Pillai', role: 'Agent', team: 'Escalations' },
];

/**
 * A node in a group's hierarchical category taxonomy. Categories can nest into
 * sub-categories (L1 → L2 → L3 …). Any node can be chosen as the catch-all.
 */
export interface CategoryNode {
  name: string;
  /** Keywords that drive auto-tagging into this category. */
  keywords: number;
  children?: CategoryNode[];
}

/**
 * A category group: a shared taxonomy template. Brands attached to the same group
 * inherit its category structure, so the group a brand picks is a meaningful,
 * one-time decision (it can't be changed after creation).
 */
export interface CategoryGroupInfo {
  name: string;
  description: string;
  /** Brands already sharing this group's taxonomy. */
  brands: number;
  /** The hierarchical category tree for this group. */
  tree: CategoryNode[];
}

/** Flatten a category tree into a single list of nodes (depth-first). */
export function flattenCategories(nodes: CategoryNode[]): CategoryNode[] {
  const out: CategoryNode[] = [];
  const walk = (list: CategoryNode[]) => list.forEach(n => { out.push(n); if (n.children) walk(n.children); });
  walk(nodes);
  return out;
}

export const CATEGORY_GROUPS: CategoryGroupInfo[] = [
  {
    name: 'Default',
    description: 'Standard out-of-the-box taxonomy for general listening.',
    brands: 8,
    tree: [
      { name: 'General', keywords: 12 },
      { name: 'Query', keywords: 34, children: [
        { name: 'Product Query', keywords: 18 },
        { name: 'Account Query', keywords: 12 },
      ] },
      { name: 'Complaint', keywords: 56, children: [
        { name: 'Service Issue', keywords: 30, children: [
          { name: 'Delay', keywords: 14 },
        ] },
        { name: 'Billing', keywords: 22 },
      ] },
      { name: 'Feedback', keywords: 28 },
      { name: 'Spam', keywords: 19 },
    ],
  },
  {
    name: 'Customer Care',
    description: 'Service-oriented taxonomy for support and resolution tickets.',
    brands: 14,
    tree: [
      { name: 'Account Related', keywords: 41, children: [
        { name: 'Login Issue', keywords: 24 },
        { name: 'Profile', keywords: 17 },
      ] },
      { name: 'Complaint', keywords: 63, children: [
        { name: 'Service Failure', keywords: 33 },
        { name: 'Rude Staff', keywords: 15 },
      ] },
      { name: 'Query', keywords: 38 },
      { name: 'Escalation', keywords: 22 },
      { name: 'Refund', keywords: 30, children: [
        { name: 'Return', keywords: 16 },
        { name: 'Billing Dispute', keywords: 14 },
      ] },
      { name: 'Delivery', keywords: 27, children: [
        { name: 'Delay', keywords: 15 },
        { name: 'Damaged', keywords: 12 },
      ] },
      { name: 'General', keywords: 10 },
    ],
  },
  {
    name: 'Marketing',
    description: 'Campaign, brand and engagement taxonomy.',
    brands: 9,
    tree: [
      { name: 'Feedback', keywords: 33 },
      { name: 'Appreciation', keywords: 25, children: [
        { name: 'Praise', keywords: 14 },
        { name: 'Love', keywords: 11 },
      ] },
      { name: 'Campaign', keywords: 44, children: [
        { name: 'Contest', keywords: 20 },
        { name: 'Launch', keywords: 24 },
      ] },
      { name: 'Brand Promotion', keywords: 18 },
      { name: 'General', keywords: 9 },
    ],
  },
  {
    name: 'Product Feedback',
    description: 'Captures feature requests, bugs and product sentiment.',
    brands: 6,
    tree: [
      { name: 'Bug Report', keywords: 47, children: [
        { name: 'Crash', keywords: 21 },
        { name: 'UI Bug', keywords: 18 },
      ] },
      { name: 'Feature Request', keywords: 36 },
      { name: 'Usability', keywords: 21 },
      { name: 'Pricing', keywords: 15 },
      { name: 'General', keywords: 8 },
    ],
  },
  {
    name: 'Operations',
    description: 'Logistics, fulfilment and on-ground operations.',
    brands: 5,
    tree: [
      { name: 'Complaint', keywords: 52 },
      { name: 'Delivery', keywords: 40, children: [
        { name: 'Delay', keywords: 22 },
        { name: 'Lost', keywords: 12 },
      ] },
      { name: 'Service Quality', keywords: 29 },
      { name: 'Logistics', keywords: 24, children: [
        { name: 'Routing', keywords: 13 },
        { name: 'Dispatch', keywords: 11 },
      ] },
      { name: 'General', keywords: 11 },
    ],
  },
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
