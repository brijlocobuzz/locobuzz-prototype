export interface ChannelGroup {
  label: string;
  count?: number;
  expanded?: boolean;
  channels?: Channel[];
}

export interface Channel {
  label: string;
  icon: string;          // Material Symbols ligature (fallback)
  color: string;
  id?: string;           // BRAND_ICONS key → real brand logo
  count?: number;        // configured count
  expiredBadge?: number; // red "Expired: n"
  active?: boolean;
  empty?: boolean;       // shows hollow dot instead of count
}

export const CHANNEL_GROUPS: ChannelGroup[] = [
  {
    label: 'SOCIAL MEDIA', count: 7, expanded: true,
    channels: [
      { label: 'Facebook', id: 'facebook', icon: 'thumb_up', color: '#1877f2', count: 13, expiredBadge: 2, active: true },
      { label: 'Instagram', id: 'instagram', icon: 'photo_camera', color: '#e1306c', count: 3 },
      { label: 'X (Twitter)', id: 'twitter', icon: 'close', color: '#000000', count: 9, expiredBadge: 4 },
      { label: 'LinkedIn', id: 'linkedin', icon: 'work', color: '#0a66c2', empty: true },
      { label: 'YouTube', id: 'youtube', icon: 'smart_display', color: '#ff0000', count: 1 },
      { label: 'TikTok', id: 'tiktok', icon: 'music_note', color: '#010101', empty: true },
      { label: 'Facebook Groups', id: 'fbgroups', icon: 'groups', color: '#1877f2', empty: true },
    ],
  },
  {
    label: 'ADS ACCOUNTS', count: 3, expanded: true,
    channels: [
      { label: 'Meta Ads', id: 'meta-ads', icon: 'ads_click', color: '#1877f2', count: 2 },
      { label: 'X Ads', id: 'x-ads', icon: 'ads_click', color: '#000000', empty: true },
      { label: 'LinkedIn Ads', id: 'linkedin-ads', icon: 'ads_click', color: '#0a66c2', count: 1 },
    ],
  },
  { label: 'MESSAGING', count: 4 },
  {
    label: 'EMAIL', count: 1,
    channels: [
      { label: 'Email', id: 'email', icon: 'mail', color: '#ea4335', count: 2 },
    ],
  },
  {
    label: 'REVIEW PLATFORMS', count: 9,
    channels: [
      { label: 'Google My Business', id: 'gmb', icon: 'storefront', color: '#4285f4', count: 3 },
    ],
  },
  { label: 'E-COMMERCE', count: 1 },
  { label: 'WEB / NEWS', count: 4 },
  { label: 'ANALYTICS & MESSAGING API', count: 2 },
  { label: 'FORM', count: 1 },
];

/** A child of a grouped profile — a GMB location or an Email direction (Incoming/Outgoing). */
export interface SubProfile {
  name: string;                 // location name / "Incoming Emails"
  meta: string;                 // address / protocol description (table sub-row)
  icon: string;                 // Material Symbols glyph for the child row
  mentionTypes: string[];
  alert?: { text: string; badge: string };   // token/collection issue
  // --- Email-direction card fields ---
  tone?: 'in' | 'out';          // incoming (blue) / outgoing (purple) accent
  account?: string;             // person on the mailbox
  address?: string;             // email address
  server?: string;              // IMAP / SMTP host
}

export interface ChannelProfile {
  name: string;
  owner: string;
  initials: string;
  avatarColor: string;
  status: 'Owned' | 'Public';
  addedOn: string;
  updatedOn: string;
  mentionTypes: string[];   // all types shown, no overflow
  alert?: { text: string; badge: string };   // e.g. token expired
  /** A linked ads account is active for this profile (Meta / X / LinkedIn Ads). */
  adsActive?: boolean;
  /** Ids of the linked ads accounts (from AD_ACCOUNTS). */
  adAccountIds?: string[];
  /** For ad-account rows: which channel the ads run on (facebook / instagram / …). */
  adChannel?: string;
  /** Grouped channels (GMB, Email) expand into child rows. */
  childKind?: 'location' | 'mailbox';
  children?: SubProfile[];
}

export const FACEBOOK_PROFILES: ChannelProfile[] = [
  {
    name: 'Brandacca1', owner: 'Asish Locobuzz Brand', initials: 'B', avatarColor: '#7c4dff',
    status: 'Owned', addedOn: 'Jun 11, 2026 11:57 AM', updatedOn: 'Jun 26, 2026 6:07 PM',
    mentionTypes: ['User Comments', 'Messages', 'User Posts', 'Mentions', 'Reviews', 'Ratings'],
    adsActive: true, adAccountIds: ['ad-brand', 'ad-perf'],
  },
  {
    name: 'Locouser', owner: 'Nani R', initials: 'L', avatarColor: '#f0a020',
    status: 'Owned', addedOn: 'Jun 22, 2026 1:13 PM', updatedOn: 'Jun 26, 2026 6:07 PM',
    mentionTypes: ['User Comments', 'Messages', 'Visitor Posts', 'Mentions', 'Reviews', 'Recommendations'],
    alert: { text: 'Access token expired', badge: 'ACTION NEEDED' },
  },
  {
    name: 'Acme Official', owner: 'Priya Menon', initials: 'A', avatarColor: '#2563eb',
    status: 'Owned', addedOn: 'May 03, 2026 9:21 AM', updatedOn: 'Jun 25, 2026 4:42 PM',
    mentionTypes: ['User Comments', 'Messages', 'User Posts', 'Mentions'],
    adsActive: true, adAccountIds: ['ad-brand'],
  },
  {
    name: 'Acme India', owner: 'Ravi Shah', initials: 'A', avatarColor: '#e1306c',
    status: 'Owned', addedOn: 'Mar 27, 2026 6:48 PM', updatedOn: 'Jun 20, 2026 8:15 AM',
    mentionTypes: ['User Comments', 'User Posts', 'Mentions', 'Reviews'],
    alert: { text: 'Access token expired', badge: 'ACTION NEEDED' },
  },
  {
    name: 'Acme Labs', owner: 'Eva Cruz', initials: 'A', avatarColor: '#e37400',
    status: 'Public', addedOn: 'Feb 09, 2026 10:12 AM', updatedOn: 'Jun 18, 2026 3:27 PM',
    mentionTypes: ['Messages', 'Visitor Posts', 'Mentions', 'Reviews', 'Ratings', 'Recommendations'],
  },
  {
    name: 'Acme Careers', owner: 'Lena Frost', initials: 'A', avatarColor: '#0caa41',
    status: 'Public', addedOn: 'Dec 21, 2025 4:18 PM', updatedOn: 'Jun 15, 2026 10:22 AM',
    mentionTypes: ['User Posts', 'Mentions', 'Reviews'],
  },
  {
    name: 'Acme Global', owner: 'Marcus Webb', initials: 'A', avatarColor: '#5c6bc0',
    status: 'Owned', addedOn: 'Nov 30, 2025 11:11 AM', updatedOn: 'Jun 12, 2026 6:48 PM',
    mentionTypes: ['User Comments', 'Messages', 'Visitor Posts', 'Mentions', 'Reviews', 'Recommendations'],
    adsActive: true, adAccountIds: ['ad-brand', 'ad-perf', 'ad-retarget'],
  },
  {
    name: 'Acme Events', owner: 'Aria Tan', initials: 'A', avatarColor: '#ff7043',
    status: 'Public', addedOn: 'Nov 08, 2025 2:55 PM', updatedOn: 'Jun 10, 2026 9:30 AM',
    mentionTypes: ['Messages', 'User Comments', 'Mentions', 'Ratings'],
  },
  {
    name: 'Acme Cloud', owner: 'Noah Bennett', initials: 'A', avatarColor: '#7c4dff',
    status: 'Owned', addedOn: 'Oct 19, 2025 7:02 PM', updatedOn: 'Jun 08, 2026 3:14 PM',
    mentionTypes: ['User Comments', 'Messages', 'User Posts', 'Mentions', 'Reviews'],
  },
  {
    name: 'Acme Retail', owner: 'Sara Oyelaran', initials: 'A', avatarColor: '#ec407a',
    status: 'Public', addedOn: 'Sep 27, 2025 10:45 AM', updatedOn: 'Jun 05, 2026 12:00 PM',
    mentionTypes: ['User Comments', 'Visitor Posts', 'Reviews', 'Ratings', 'Recommendations'],
  },
  {
    name: 'Acme Studio', owner: 'Jon Hale', initials: 'A', avatarColor: '#26a69a',
    status: 'Owned', addedOn: 'Sep 02, 2025 5:36 PM', updatedOn: 'Jun 02, 2026 8:50 AM',
    mentionTypes: ['Messages', 'User Comments', 'User Posts', 'Mentions', 'Reviews', 'Ratings'],
  },
];

/* ===================================================================
   Grouped channels — each account expands into child rows.
   GMB → business locations · Email → Inbound / Outbound directions.
   =================================================================== */
export const GMB_PROFILES: ChannelProfile[] = [
  {
    name: 'Acme Retail (Business Profile)', owner: 'Priya Menon', initials: 'A', avatarColor: '#4285f4',
    status: 'Owned', addedOn: 'May 03, 2026 9:21 AM', updatedOn: 'Jun 25, 2026 4:42 PM',
    mentionTypes: ['Reviews', 'Ratings', 'Q&A'], childKind: 'location',
    children: [
      { name: 'Acme Store — MG Road', meta: 'MG Road, Bengaluru · 4.6★', icon: 'place', mentionTypes: ['Reviews', 'Ratings', 'Q&A'] },
      { name: 'Acme Store — Indiranagar', meta: 'Indiranagar, Bengaluru · 4.4★', icon: 'place', mentionTypes: ['Reviews', 'Ratings'],
        alert: { text: 'Access token expired', badge: 'ACTION NEEDED' } },
      { name: 'Acme Store — Whitefield', meta: 'Whitefield, Bengaluru · 4.7★', icon: 'place', mentionTypes: ['Reviews', 'Q&A'] },
    ],
  },
  {
    name: 'Acme Cafe (Business Profile)', owner: 'Daniel Kim', initials: 'A', avatarColor: '#16b364',
    status: 'Owned', addedOn: 'Apr 18, 2026 2:05 PM', updatedOn: 'Jun 24, 2026 11:30 AM',
    mentionTypes: ['Reviews', 'Ratings'], childKind: 'location',
    children: [
      { name: 'Acme Cafe — Koramangala', meta: 'Koramangala, Bengaluru · 4.5★', icon: 'place', mentionTypes: ['Reviews', 'Ratings'] },
      { name: 'Acme Cafe — HSR Layout', meta: 'HSR Layout, Bengaluru · 4.3★', icon: 'place', mentionTypes: ['Reviews', 'Ratings'] },
    ],
  },
];

export const EMAIL_PROFILES: ChannelProfile[] = [
  {
    name: 'support@acme.com', owner: 'Shivansh Choudhary', initials: 'S', avatarColor: '#ea4335',
    status: 'Owned', addedOn: 'Jun 11, 2026 11:57 AM', updatedOn: 'Jun 26, 2026 6:07 PM',
    mentionTypes: ['Messages'], childKind: 'mailbox',
    children: [
      { name: 'Incoming Emails', tone: 'in', icon: 'call_received', account: 'Shivansh Choudhary',
        address: 'support@acme.com', server: 'imap.gmail.com', meta: 'imap.gmail.com', mentionTypes: ['Messages'] },
      { name: 'Outgoing Emails', tone: 'out', icon: 'call_made', account: 'Shivansh Choudhary',
        address: 'support@acme.com', server: 'smtp.gmail.com', meta: 'smtp.gmail.com', mentionTypes: ['Messages'] },
    ],
  },
  {
    name: 'care@acme.com', owner: 'Ravi Shah', initials: 'C', avatarColor: '#f0a020',
    status: 'Owned', addedOn: 'May 03, 2026 9:21 AM', updatedOn: 'Jun 25, 2026 4:42 PM',
    mentionTypes: ['Messages'], childKind: 'mailbox',
    children: [
      { name: 'Incoming Emails', tone: 'in', icon: 'call_received', account: 'Ravi Shah',
        address: 'care@acme.com', server: 'imap.outlook.com', meta: 'imap.outlook.com', mentionTypes: ['Messages'],
        alert: { text: 'Mailbox auth expired', badge: 'ACTION NEEDED' } },
      { name: 'Outgoing Emails', tone: 'out', icon: 'call_made', account: 'Ravi Shah',
        address: 'care@acme.com', server: 'smtp.outlook.com', meta: 'smtp.outlook.com', mentionTypes: ['Messages'] },
    ],
  },
];

/* ===================================================================
   Cross-channel "token expired" roll-up — the account-wide list shown
   when the user opens the "Token Expired" pill in the channels header.
   Grouped by channel; only owned accounts have a token that can expire.
   =================================================================== */
export interface ExpiredGroup {
  channelId: string;    // BRAND_ICONS / activeChannel id
  label: string;
  icon: string;         // Material Symbols fallback
  color: string;        // brand colour
  profiles: ChannelProfile[];
}

/** X (Twitter) accounts whose auth token has expired (no X profile table yet). */
const TWITTER_EXPIRED: ChannelProfile[] = [
  {
    name: '@AcmeGlobal', owner: 'Marcus Webb', initials: 'A', avatarColor: '#000000',
    status: 'Owned', addedOn: 'May 14, 2026 10:05 AM', updatedOn: 'Jun 28, 2026 9:12 AM',
    mentionTypes: ['Mentions', 'User Comments', 'Messages'],
    alert: { text: 'Access token expired', badge: 'ACTION NEEDED' },
  },
  {
    name: '@AcmeSupport', owner: 'Daniel Kim', initials: 'A', avatarColor: '#111827',
    status: 'Owned', addedOn: 'Apr 02, 2026 3:40 PM', updatedOn: 'Jun 27, 2026 6:20 PM',
    mentionTypes: ['Messages', 'Mentions'],
    alert: { text: 'Access token expired', badge: 'ACTION NEEDED' },
  },
  {
    name: '@AcmeIndia', owner: 'Ravi Shah', initials: 'A', avatarColor: '#1f2937',
    status: 'Owned', addedOn: 'Mar 19, 2026 1:15 PM', updatedOn: 'Jun 25, 2026 11:48 AM',
    mentionTypes: ['Mentions', 'User Comments'],
    alert: { text: 'Access token expired', badge: 'ACTION NEEDED' },
  },
  {
    name: '@AcmeCloud', owner: 'Noah Bennett', initials: 'A', avatarColor: '#0b1220',
    status: 'Owned', addedOn: 'Feb 21, 2026 8:55 AM', updatedOn: 'Jun 22, 2026 4:33 PM',
    mentionTypes: ['Mentions', 'Messages', 'User Comments'],
    alert: { text: 'Access token expired', badge: 'ACTION NEEDED' },
  },
];

export const EXPIRED_PROFILES: ExpiredGroup[] = [
  {
    channelId: 'facebook', label: 'Facebook', icon: 'thumb_up', color: '#1877f2',
    profiles: FACEBOOK_PROFILES.filter(p => !!p.alert),
  },
  {
    channelId: 'twitter', label: 'X (Twitter)', icon: 'close', color: '#000000',
    profiles: TWITTER_EXPIRED,
  },
];

/* ===================================================================
   Add-channel wizard — catalog + per-channel flow descriptors
   =================================================================== */

/**
 * How a channel is connected once chosen. Drives the dynamic stepper:
 *  - 'choice'  : pick Owned vs Public  (X/Twitter)  → auth OR handle → review
 *  - 'pages'   : OAuth then pick pages/accounts      (Facebook)       → review
 *  - 'oauth'   : OAuth only                          (Instagram, …)   → review
 *  - 'handle'  : public handle/URL only, listen-only (Reddit, …)      → review
 *  - 'url'     : no auth — paste a page URL w/ guidance (E-Commerce)  → review
 */
export type ChannelFlow = 'choice' | 'pages' | 'oauth' | 'handle' | 'url';

export interface CatalogChannel {
  id: string;
  label: string;
  icon: string;     // Material Symbols ligature (fallback when no brand logo)
  color: string;    // brand colour for the tile glyph
  flow: ChannelFlow;
  pages?: boolean;  // owned path includes a "select accounts/pages" step
  tag?: string;     // small corner tag e.g. "Premium"
}

/**
 * Real brand logos (Simple Icons single-path SVGs, 24×24 viewBox) keyed by
 * channel id. Rendered in the brand colour on a light tile so each channel
 * reads as its actual logo. Channels without an entry fall back to `icon`.
 */
export const BRAND_ICONS: Record<string, string> = {
  twitter:    'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z',
  facebook:   'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
  instagram:  'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077',
  youtube:    'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  linkedin:   'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  tiktok:     'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  telegram:   'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
  whatsapp:   'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z',
  fbgroups:   'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
  playstore:  'M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z',
  appstore:   'M8.8086 14.9194l6.1107-11.0368c.0837-.1513.1682-.302.2437-.4584.0685-.142.1267-.2854.1646-.4403.0803-.3259.0588-.6656-.066-.9767-.1238-.3095-.3417-.5678-.6201-.7355a1.4175 1.4175 0 0 0-.921-.1924c-.3207.043-.6135.1935-.8443.4288-.1094.1118-.1996.2361-.2832.369-.092.1463-.175.2979-.259.4492l-.3864.6979-.3865-.6979c-.0837-.1515-.1667-.303-.2587-.4492-.0837-.1329-.1739-.2572-.2835-.369-.2305-.2353-.5233-.3857-.844-.429a1.4181 1.4181 0 0 0-.921.1926c-.2784.1677-.4964.426-.6203.7355-.1246.311-.1461.6508-.066.9767.038.155.0962.2984.1648.4403.0753.1564.1598.307.2437.4584l1.248 2.2543-4.8625 8.7825H2.0295c-.1676 0-.3351-.0007-.5026.0092-.1522.009-.3004.0284-.448.0714-.3108.0906-.5822.2798-.7783.548-.195.2665-.3006.5929-.3006.9279 0 .3352.1057.6612.3006.9277.196.2683.4675.4575.7782.548.1477.043.296.0623.4481.0715.1675.01.335.009.5026.009h13.0974c.0171-.0357.059-.1294.1-.2697.415-1.4151-.6156-2.843-2.0347-2.843zM3.113 18.5418l-.7922 1.5008c-.0818.1553-.1644.31-.2384.4705-.067.1458-.124.293-.1611.452-.0785.3346-.0576.6834.0645 1.0029.1212.3175.3346.583.607.7549.2727.172.5891.2416.9013.1975.3139-.044.6005-.1986.8263-.4402.1072-.1148.1954-.2424.2772-.3787.0902-.1503.1714-.3059.2535-.4612L6 19.4636c-.0896-.149-.9473-1.4704-2.887-.9218m20.5861-3.0056a1.4707 1.4707 0 0 0-.779-.5407c-.1476-.0425-.2961-.0616-.4483-.0705-.1678-.0099-.3352-.0091-.503-.0091H18.648l-4.3891-7.817c-.6655.7005-.9632 1.485-1.0773 2.1976-.1655 1.0333.0367 2.0934.546 3.0004l5.2741 9.3933c.084.1494.167.299.2591.4435.0837.131.1739.2537.2836.364.231.2323.5238.3809.8449.4232.3192.0424.643-.0244.9217-.1899.2784-.1653.4968-.4204.621-.7257.1246-.3072.146-.6425.0658-.9641-.0381-.1529-.0962-.2945-.165-.4346-.0753-.1543-.1598-.303-.2438-.4524l-1.216-2.1662h1.596c.1677 0 .3351.0009.5029-.009.1522-.009.3007-.028.4483-.0705a1.4707 1.4707 0 0 0 .779-.5407A1.5386 1.5386 0 0 0 24 16.452a1.539 1.539 0 0 0-.3009-.9158Z',
  gmb:        'M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z',
  line:       'M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314',
  glassdoor:  'M14.1093.0006c-.0749-.0074-.1348.0522-.1348.127v3.451c0 .0673.0537.1194.121.127 2.619.172 4.6092.9501 4.6092 3.6814H13.086a.1343.1343 0 0 0-.1348.1347v8.9644c0 .0748.06.1347.1348.1347h10.0034c.0748 0 .1347-.0599.1347-.1347V7.342c0-2.2374-.7996-4.0558-2.4159-5.3279C19.3191.8469 17.0874.1428 14.1093.0006ZM.9107 7.387a.1342.1342 0 0 0-.1347.1347v8.9566c0 .0748.06.1347.1347.1347h5.6189c0 2.7313-1.9902 3.5094-4.6091 3.6815-.0674.0075-.1192.0596-.1192.127v3.451c0 .0747.06.1343.1348.1269 2.9781-.1422 5.2078-.8463 6.6969-2.0136 1.6163-1.272 2.4159-3.0905 2.4159-5.3278V7.5217a.1343.1343 0 0 0-.1348-.1347z',
  sitejabber: 'M14.1093.0006c-.0749-.0074-.1348.0522-.1348.127v3.451c0 .0673.0537.1194.121.127 2.619.172 4.6092.9501 4.6092 3.6814H13.086a.1343.1343 0 0 0-.1348.1347v8.9644c0 .0748.06.1347.1348.1347h10.0034c.0748 0 .1347-.0599.1347-.1347V7.342c0-2.2374-.7996-4.0558-2.4159-5.3279C19.3191.8469 17.0874.1428 14.1093.0006Z',
  reddit:     'M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z',
  email:      'M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z',
  galerts:    'M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z',
  tripadvisor:'M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 0 0 4.04 10.43 5.976 5.976 0 0 0 4.075-1.6L12 19.705l1.922-2.09a5.972 5.972 0 0 0 4.072 1.598 6 6 0 0 0 6-5.998 5.982 5.982 0 0 0-1.957-4.432L24 6.648h-4.35a13.573 13.573 0 0 0-7.644-2.353zM12 6.255c1.531 0 3.063.303 4.504.903C13.943 8.138 12 10.43 12 13.1c0-2.671-1.942-4.962-4.504-5.942A11.72 11.72 0 0 1 12 6.256zM6.002 9.157a4.059 4.059 0 1 1 0 8.118 4.059 4.059 0 0 1 0-8.118zm11.992.002a4.057 4.057 0 1 1 .003 8.115 4.057 4.057 0 0 1-.003-8.115zm-11.992 1.93a2.128 2.128 0 0 0 0 4.256 2.128 2.128 0 0 0 0-4.256zm11.992 0a2.128 2.128 0 0 0 0 4.256 2.128 2.128 0 0 0 0-4.256z',
  booking:    'M24 0H0v24h24ZM8.575 6.563h2.658c2.108 0 3.473 1.15 3.473 2.898 0 1.15-.575 1.82-.91 2.108l-.287.263.335.192c.815.479 1.318 1.389 1.318 2.395 0 1.988-1.51 3.257-3.857 3.257H7.449V7.713c0-.623.503-1.126 1.126-1.15zm1.7 1.868c-.479.024-.694.264-.694.79v1.893h1.676c.958 0 1.294-.743 1.294-1.365 0-.815-.503-1.318-1.318-1.318zm-.096 4.36c-.407.071-.598.31-.598.79v2.251h1.868c.934 0 1.509-.55 1.509-1.533 0-.934-.599-1.509-1.51-1.509zm7.737 2.394c.743 0 1.341.599 1.341 1.342a1.34 1.34 0 0 1-1.341 1.341 1.355 1.355 0 0 1-1.341-1.341c0-.743.598-1.342 1.34-1.342z',
  expedia:    'M19.067 0H4.933A4.94 4.94 0 0 0 0 4.933v14.134A4.932 4.932 0 0 0 4.933 24h14.134A4.932 4.932 0 0 0 24 19.067V4.933C24.01 2.213 21.797 0 19.067 0ZM7.336 19.341c0 .19-.148.337-.337.337h-2.33a.333.333 0 0 1-.337-.337v-2.33c0-.189.148-.336.337-.336H7c.19 0 .337.147.337.337zm12.121-1.486-2.308 2.298c-.169.168-.422.053-.422-.2V9.57l-6.44 6.44a.533.533 0 0 1-.421.17H8.169a.32.32 0 0 1-.338-.338v-1.697c0-.2.053-.316.169-.422l6.44-6.44H4.058c-.253 0-.369-.253-.2-.421l2.297-2.309c.137-.137.285-.232.517-.232H18.15c.854 0 1.539.686 1.539 1.54v11.478c-.01.231-.095.368-.232.516z',
  ganalytics: 'M22.84 2.9982v17.9987c.0086 1.6473-1.3197 2.9897-2.967 2.9984a2.9808 2.9808 0 01-.3677-.0208c-1.528-.226-2.6477-1.5558-2.6105-3.1V3.1204c-.0369-1.5458 1.0856-2.8762 2.6157-3.1 1.6361-.1915 3.1178.9796 3.3093 2.6158.014.1201.0208.241.0202.3619zM4.1326 18.0548c-1.6417 0-2.9726 1.331-2.9726 2.9726C1.16 22.6691 2.4909 24 4.1326 24s2.9726-1.3309 2.9726-2.9726-1.331-2.9726-2.9726-2.9726zm7.8728-9.0098c-.0171 0-.0342 0-.0513.0003-1.6495.0904-2.9293 1.474-2.891 3.1256v7.9846c0 2.167.9535 3.4825 2.3505 3.763 1.6118.3266 3.1832-.7152 3.5098-2.327.04-.1974.06-.3983.0593-.5998v-8.9585c.003-1.6474-1.33-2.9852-2.9773-2.9882z',
};

export interface CatalogGroup {
  label: string;
  channels: CatalogChannel[];
}

export const CHANNEL_CATALOG: CatalogGroup[] = [
  {
    label: 'Social Media',
    channels: [
      { id: 'twitter',   label: 'X (Twitter)',      icon: 'close',          color: '#000000', flow: 'choice' },
      { id: 'facebook',  label: 'Facebook',         icon: 'thumb_up',       color: '#1877f2', flow: 'choice', pages: true },
      { id: 'instagram', label: 'Instagram',        icon: 'photo_camera',   color: '#e1306c', flow: 'choice', pages: true },
      { id: 'youtube',   label: 'Youtube',          icon: 'smart_display',  color: '#ff0000', flow: 'choice' },
      { id: 'linkedin',  label: 'LinkedIn',         icon: 'work',           color: '#0a66c2', flow: 'choice', pages: true },
      { id: 'tiktok',    label: 'TikTok',           icon: 'music_note',     color: '#010101', flow: 'choice' },
      { id: 'fbgroups',  label: 'FB Groups',        icon: 'groups',         color: '#1877f2', flow: 'choice' },
      { id: 'reddit',    label: 'Reddit (SubReddit)',icon: 'forum',         color: '#ff4500', flow: 'handle', tag: 'Premium' },
    ],
  },
  {
    label: 'Messaging',
    channels: [
      { id: 'whatsapp',  label: 'WhatsApp',         icon: 'chat',           color: '#25d366', flow: 'oauth'  },
      { id: 'telegram',  label: 'Telegram',         icon: 'send',           color: '#229ed9', flow: 'oauth'  },
      { id: 'line',      label: 'LINE',             icon: 'chat_bubble',    color: '#00c300', flow: 'oauth'  },
    ],
  },
  {
    label: 'Email',
    channels: [
      { id: 'email',     label: 'Email',            icon: 'mail',           color: '#ea4335', flow: 'oauth'  },
    ],
  },
  {
    label: 'Review Platforms',
    channels: [
      { id: 'gmb',        label: 'Google My Business',icon: 'storefront',    color: '#4285f4', flow: 'choice', pages: true },
      { id: 'playstore',  label: 'Google Play Store', icon: 'shop',          color: '#00c4b3', flow: 'handle' },
      { id: 'appstore',   label: 'App Store',         icon: 'shopping_bag',  color: '#0d96f6', flow: 'handle' },
      { id: 'glassdoor',  label: 'Glassdoor',         icon: 'reviews',       color: '#0caa41', flow: 'handle', tag: 'Premium' },
      { id: 'sitejabber', label: 'Sitejabber',        icon: 'verified',      color: '#f6a623', flow: 'handle' },
      { id: 'tripadvisor',label: 'TripAdvisor',       icon: 'travel_explore',color: '#00af87', flow: 'handle', tag: 'Premium' },
      { id: 'booking',    label: 'Booking',           icon: 'hotel',         color: '#003580', flow: 'handle', tag: 'Premium' },
      { id: 'expedia',    label: 'Expedia',           icon: 'flight',        color: '#fbc02d', flow: 'handle', tag: 'Premium' },
    ],
  },
  {
    label: 'E-Commerce',
    channels: [
      { id: 'amazon',    label: 'Amazon',           icon: 'shopping_cart',  color: '#ff9900', flow: 'url', tag: 'Premium' },
      { id: 'flipkart',  label: 'Flipkart',         icon: 'shopping_bag',   color: '#2874f0', flow: 'url', tag: 'Premium' },
      { id: 'bestbuy',   label: 'BestBuy',          icon: 'store',          color: '#0046be', flow: 'url', tag: 'Premium' },
    ],
  },
  {
    label: 'Web / News',
    channels: [
      { id: 'galerts',   label: 'Google Alerts',    icon: 'notifications',  color: '#4285f4', flow: 'handle' },
    ],
  },
  {
    label: 'Analytics & Messaging API',
    channels: [
      { id: 'ganalytics',label: 'Google Analytics', icon: 'analytics',      color: '#e37400', flow: 'oauth'  },
      { id: 'voice',     label: 'Voice',            icon: 'call',           color: '#34a853', flow: 'oauth'  },
    ],
  },
];

export interface FacebookPage {
  id: string;
  name: string;
  followers: string;
  initials: string;
  color: string;
  /** Linked Instagram account (Meta grants IG access through the same Page
   *  connection). When set, this Page also pulls Instagram content + DMs. */
  igHandle?: string;
  igMessages?: boolean;   // Instagram messages (DMs) are included for this account
  /** Not selectable (e.g. Gmail folders that can't be collected — Drafts/Trash/Chat). */
  disabled?: boolean;
}

export const FACEBOOK_PAGES: FacebookPage[] = [
  { id: 'official', name: 'Acme Official', followers: '12.4k followers', initials: 'A', color: '#1877f2', igHandle: '@acme.official', igMessages: true },
  { id: 'support',  name: 'Acme Support',  followers: '3.1k followers',  initials: 'A', color: '#7c4dff', igHandle: '@acme.support', igMessages: true },
  { id: 'careers',  name: 'Acme Careers',  followers: '920 followers',   initials: 'A', color: '#0caa41' },
  { id: 'labs',     name: 'Acme Labs',     followers: '5.6k followers',  initials: 'A', color: '#e37400', igHandle: '@acme.labs' },
  { id: 'india',    name: 'Acme India',    followers: '8.2k followers',  initials: 'A', color: '#e1306c', igHandle: '@acme.india', igMessages: true },
  { id: 'store',    name: 'Acme Store',    followers: '2.7k followers',  initials: 'A', color: '#00bcd4' },
];

export const LINKEDIN_PAGES: FacebookPage[] = [
  { id: 'li-official', name: 'Acme Inc.',          followers: '48.2k followers', initials: 'A', color: '#0a66c2' },
  { id: 'li-careers',  name: 'Acme Careers',        followers: '9.6k followers',  initials: 'A', color: '#0a66c2' },
  { id: 'li-india',    name: 'Acme India',          followers: '14.1k followers', initials: 'A', color: '#0a66c2' },
];

/** An advertising account the user can link (Meta / X / LinkedIn Ads). */
export interface AdAccount {
  id: string; name: string;
  meta: string;               // "Ad account ID 4471029" — the account's unique id
  currency?: string;          // billing currency (USD / INR / EUR)
  owner?: 'own' | 'agency';   // agency = runs on a different (external) account
  via?: string;               // managing @handle, when owner is 'agency'
  channel?: string;           // which channel the ads run on (Meta = facebook / instagram)
}

/** Ads accounts on the connected login (own). */
export const AD_ACCOUNTS: AdAccount[] = [
  { id: 'ad-brand',   name: 'Acme — Brand Ads',      meta: 'Ad account ID 4471029', currency: 'USD', owner: 'own' },
  { id: 'ad-perf',    name: 'Acme — Performance',    meta: 'Ad account ID 8820551', currency: 'USD', owner: 'own' },
  { id: 'ad-retarget',name: 'Acme — Retargeting',    meta: 'Ad account ID 1290337', currency: 'INR', owner: 'own' },
  { id: 'ad-intl',    name: 'Acme — International',   meta: 'Ad account ID 5563100', currency: 'EUR', owner: 'own' },
];

/** Linked ads accounts per platform — drives the "Ads Accounts" side-panel group. */
export const ADS_PLATFORM_ACCOUNTS: Record<string, AdAccount[]> = {
  'meta-ads': [
    { id: 'meta-brand', name: 'Acme — Brand Ads',   meta: 'Ad account ID 4471029', currency: 'USD', owner: 'own', channel: 'facebook' },
    { id: 'meta-perf',  name: 'Acme — Performance',  meta: 'Ad account ID 8820551', currency: 'USD', owner: 'own', channel: 'instagram' },
  ],
  'x-ads': [],   // none linked yet → empty state
  'linkedin-ads': [
    { id: 'li-demand', name: 'Acme — B2B Demand Gen', meta: 'Ad account ID 5099210', currency: 'USD', owner: 'own', channel: 'linkedin' },
  ],
};

/** Ads accounts surfaced after authorizing an external (agency / partner) account. */
export const EXTERNAL_AD_ACCOUNTS: AdAccount[] = [
  { id: 'ext-retainer', name: 'Always-On Retainer', meta: 'Ad account ID 9912004', currency: 'USD', owner: 'agency' },
  { id: 'ext-launch',   name: 'Q3 Product Launch',  meta: 'Ad account ID 9913551', currency: 'USD', owner: 'agency' },
  { id: 'ext-retarget', name: 'Web Retargeting',    meta: 'Ad account ID 9914820', currency: 'INR', owner: 'agency' },
];

/** Channels that support linking an ads account (X, LinkedIn, Meta = FB/IG). */
export const ADS_SUPPORTED_IDS = ['twitter', 'facebook', 'instagram', 'linkedin'];

/** Icon per mention type for the chips. */
export function mentionTypeIcon(type: string): string {
  switch (type) {
    case 'Messages': return 'chat';
    case 'User Comments': return 'mode_comment';
    case 'User Posts':
    case 'Visitor Posts': return 'post_add';
    case 'Mentions': return 'alternate_email';
    case 'Reviews': return 'rate_review';
    case 'Ratings': return 'star';
    case 'Recommendations': return 'thumb_up';
    default: return 'label';
  }
}

/* ===================================================================
   Per-channel × per-mode content spec  (source: "Channel Config —
   What to Show per Channel (Owned vs Public)" workbook → master tab).
   Drives every wizard screen with channel-accurate copy.
   =================================================================== */

/** Copy that is identical on every channel (global, rewrite-once). */
export const WIZARD_COPY = {
  header: 'Add a channel',
  sub: 'Connect a platform to listen, analyse and respond from one inbox. You can add more channels anytime.',
  search: 'Search channels — try Instagram, Google reviews, WhatsApp…',
  connectionSub:
    "Owned connects an account you manage, so you can reply and see private metrics. Public tracks a source you don't own — listen-only. You can add the other mode later.",
};

export type ModeKey = 'owned' | 'public';
export type ChannelTier = 'Regular' | 'Premium';
/** ok = ships as-is · validate = unconfirmed source · planned = not live yet. */
export type ChannelFlag = 'ok' | 'validate' | 'planned';

export interface ModeReview {
  account: string;      // ACCOUNT / SOURCE value
  permissions: string;  // PERMISSIONS value
  sync: string;         // MENTIONS SYNC value
  history: string;      // HISTORY ON CONNECT value
}

export interface PublicField {
  label: string;
  placeholder: string;
  guide: string;        // single-paragraph "where to find it"
}

export interface ChannelMode {
  key: ModeKey;
  cardHeading: string;  // e.g. "Connect your X account" / "Track public X conversation"
  get: string[];        // What you GET
  dontGet: string[];    // What you DON'T get
  pickIf: string;       // "Pick this if…"
  dataTypes: string;    // Data / mention types collected
  sync: string;         // Mentions sync (real-time vs frequency)
  history: string;      // History on connect (backfill)
  review: ModeReview;
  celebration: string;  // celebration sub-text

  // --- owned / authenticate path ---
  pages?: boolean;          // owned path includes a "select accounts" step
  pagesNoun?: string;       // "pages" | "locations" | "Organisation Pages"
  accessHeading?: string;   // "What we'll access on your X account:"
  access?: string[];        // bullet list of access lines
  accessNote?: string;      // trailing connect-method note (JSON key, IMAP…)
  authButton?: string;      // big auth button label (defaults to "Login with {label}")

  // --- public path ---
  field?: PublicField;
}

export interface ChannelSpec {
  id: string;
  label: string;
  tier: ChannelTier;
  tileSub: string;              // step-1 tile sub-label
  flag?: ChannelFlag;
  flagText?: string;            // banner text when flag = validate / planned
  connectionQuestion: string;   // "How do you want to add X (Twitter)?"
  modes: ChannelMode[];         // 1 (single-mode) or 2 (choice)
}

export const CHANNEL_SPECS: Record<string, ChannelSpec> = {
  twitter: {
    id: 'twitter', label: 'X (Twitter)', tier: 'Regular', tileSub: 'Popular · OAuth · ~30s',
    connectionQuestion: 'How do you want to add X (Twitter)?',
    modes: [
      {
        key: 'owned', cardHeading: 'Connect your X account',
        get: ['@mentions, replies & retweets', 'Direct messages', 'Promoted tweets', 'Post analytics — impressions & engagement'],
        dontGet: ['Needs a periodic re-login when X expires the token'],
        pickIf: "Pick this if it's your brand's handle and you want to reply, not just watch.",
        dataTypes: 'Mentions, replies, retweets, direct messages, promoted tweets, post analytics',
        sync: 'Real-time + backup sweeps every few minutes',
        history: 'Last 10 days of tweets & mentions and 7 days of DMs, then continuous. Longer backfill available on request.',
        accessHeading: "What we'll access on your X account:",
        access: ['Read your tweets, replies, @mentions and DMs', 'Read post analytics', 'Post & reply only when you click send'],
        review: { account: '@your_handle', permissions: 'Read · Reply · DMs · Publish', sync: 'Near real-time', history: '10d tweets/mentions, 7d DMs' },
        celebration: 'X is connected and listening — you can reply straight from your inbox.',
      },
      {
        key: 'public', cardHeading: 'Track a public X account',
        get: ["The account's tweets & replies", '@mentions of the account', 'Retweets', 'Estimated reach & engagement'],
        dontGet: ['No direct messages', 'No promoted tweets', 'Listen-only — replying needs an Owned connection'],
        pickIf: "Pick this to monitor a competitor's or partner's X account.",
        dataTypes: "The account's tweets, @mentions, replies & retweets",
        sync: 'Near real-time',
        history: 'Last 10 days on connect. Longer backfill available on request.',
        field: { label: 'Public X handle', placeholder: '@brand', guide: 'Open the profile on X and copy the @username.' },
        review: { account: '@handle', permissions: 'Read only (public)', sync: 'Near real-time', history: '10 days' },
        celebration: 'X is connected and listening to that account.',
      },
    ],
  },

  facebook: {
    id: 'facebook', label: 'Facebook', tier: 'Regular', tileSub: 'Popular · OAuth · ~30s',
    connectionQuestion: 'How do you want to add Facebook?',
    modes: [
      {
        key: 'owned', cardHeading: 'Connect your Facebook Page', pages: true, pagesNoun: 'pages',
        get: ['Comments on your posts', 'Messenger inbox', 'Page reviews & review comments', 'Tagged posts & Reels', 'Page & post insights — reach, impressions, video views'],
        dontGet: ['Needs a periodic re-login when the token expires', "Posts on users' own profiles and Recommendations aren't captured"],
        pickIf: 'Pick this if you manage the Page and want to reply and see full insights.',
        dataTypes: 'Comments, Messenger, page reviews, tagged posts, Reels, page & post insights',
        sync: 'Real-time + several backup sweeps a day',
        history: 'Last 2 days of posts, 7 days of comments and 1 day of Messenger on connect',
        accessHeading: "What we'll access on your Facebook Page:",
        access: ['Read Page posts, comments and reviews', 'Read & send Messenger messages', 'Read Page insights', 'Publish & reply only when you click send'],
        review: { account: 'N page(s)', permissions: 'Read · Reply · DMs · Insights · Publish', sync: 'Real-time + sweeps', history: '2d posts, 7d comments' },
        celebration: 'Facebook is connected — listening for mentions and ready for replies.',
      },
      {
        key: 'public', cardHeading: 'Track a public Facebook Page',
        get: ["The Page's posts", 'Comments on those posts'],
        dontGet: ["Comments are anonymized — commenter names aren't available for public Pages", 'No tagged posts, reviews or Messenger', 'Reach & impressions are estimates', 'Listen-only — no replies'],
        pickIf: "Pick this to monitor a competitor or a Page you don't manage.",
        dataTypes: "The Page's posts & comments (comments anonymized)",
        sync: 'Twice a day, with weekly and monthly deep sweeps',
        history: 'Up to 90 days',
        field: { label: 'Public Facebook Page URL', placeholder: 'https://www.facebook.com/yourpage', guide: 'Open the Page and copy the URL from the address bar (facebook.com/yourpage).' },
        review: { account: 'Page URL', permissions: 'Read only (public)', sync: 'Twice a day + deep sweeps', history: 'up to 90 days' },
        celebration: 'Facebook is connected and listening to that Page.',
      },
    ],
  },

  instagram: {
    id: 'instagram', label: 'Instagram', tier: 'Regular', tileSub: 'Popular · OAuth · ~30s',
    connectionQuestion: 'How do you want to add Instagram?',
    modes: [
      {
        key: 'owned', cardHeading: 'Connect your Instagram account', pages: true, pagesNoun: 'accounts',
        get: ['Comments on your posts', 'DMs & story replies', 'Tagged posts & story mentions', 'Reels', 'Post & account insights — reach, engagement, saves'],
        dontGet: ['Connects through Facebook — your Instagram must be a professional (Business or Creator) account linked to a Facebook Page', 'Needs a periodic re-login'],
        pickIf: "Pick this if it's your account and you want to reply and see private insights.",
        dataTypes: 'Comments, DMs, story mentions & replies, tagged posts, Reels, insights',
        sync: 'Real-time + several backup sweeps a day',
        history: 'Last 2 days of posts, 15 days of comments and 1 day of DMs on connect',
        accessHeading: "What we'll access on your Instagram account:",
        access: ['Read your posts, comments and @mentions', 'Read & send DMs and story replies', 'Read insights', 'Reply & publish only when you click send'],
        review: { account: '@handle', permissions: 'Read · Reply · DMs · Insights', sync: 'Real-time + sweeps', history: '2d posts, 15d comments' },
        celebration: 'Instagram is connected — listening for mentions and ready for replies.',
      },
      {
        key: 'public', cardHeading: 'Track a public Instagram account',
        get: ['Posts & Reels from any business or creator account'],
        dontGet: ['No comments on their posts', 'No DMs, stories or tagged posts', "Personal (non-professional) accounts can't be tracked", 'Listen-only'],
        pickIf: "Pick this to monitor a competitor's or partner's Instagram.",
        dataTypes: 'Public posts & Reels from a business/creator account',
        sync: 'Several sweeps a day',
        history: 'Recent posts on connect',
        field: { label: 'Public Instagram handle or URL', placeholder: '@handle', guide: 'Enter the @handle or paste the profile URL. It must be a business or creator account.' },
        review: { account: '@handle', permissions: 'Read only (public)', sync: 'Several sweeps a day', history: 'recent posts' },
        celebration: 'Instagram is connected and listening to that account.',
      },
    ],
  },

  youtube: {
    id: 'youtube', label: 'YouTube', tier: 'Regular', tileSub: 'OAuth · ~30s',
    connectionQuestion: 'How do you want to add YouTube?',
    modes: [
      {
        key: 'owned', cardHeading: 'Connect your YouTube channel',
        get: ['Comments on your videos', 'Your videos & Shorts', 'Channel & video stats — subscribers, views'],
        dontGet: ['Needs a periodic re-login', "Top-level comments only — replies to replies aren't captured", "Live-stream chat isn't captured; the video is picked up once published"],
        pickIf: "Pick this if it's your channel and you want stats plus comment replies.",
        dataTypes: 'Your videos, Shorts, top-level comments, channel & video stats',
        sync: 'Videos 4× a day · comments every 2 hours',
        history: 'Last 30 days of videos and your latest 200 comments on connect',
        accessHeading: "What we'll access on your YouTube channel:",
        access: ['Read your videos, Shorts and comments', 'Read channel & video stats', 'Reply to comments only when you click send'],
        review: { account: 'channel', permissions: 'Read · Reply · Analytics', sync: 'Videos 4×/day, comments 2-hourly', history: '30d videos / 200 comments' },
        celebration: 'YouTube is connected — listening for comments and ready for replies.',
      },
      {
        key: 'public', cardHeading: 'Track a public YouTube channel',
        get: ["The channel's videos & Shorts", 'Top-level comments', 'Video stats — views, likes, comments'],
        dontGet: ["Top-level comments only; live chat isn't captured", 'Listen-only — no replies'],
        pickIf: "Pick this to monitor a competitor's or partner's channel.",
        dataTypes: "The channel's videos, Shorts, top-level comments & video stats",
        sync: 'Twice a day',
        history: "The channel's latest 60 videos and 200 comments on connect",
        field: { label: 'Public YouTube channel URL', placeholder: 'https://youtube.com/@channel', guide: 'Paste the channel URL (youtube.com/@channel).' },
        review: { account: 'channel', permissions: 'Read only (public)', sync: 'Twice a day', history: '60 videos / 200 comments' },
        celebration: 'YouTube is connected and listening to that channel.',
      },
    ],
  },

  linkedin: {
    id: 'linkedin', label: 'LinkedIn', tier: 'Regular', tileSub: 'OAuth · ~30s',
    connectionQuestion: '(No connection-type choice — LinkedIn is owned-only)',
    modes: [
      {
        key: 'owned', cardHeading: 'Connect your LinkedIn Page', pages: true, pagesNoun: 'Organisation Pages',
        get: ['Your Page posts', 'Comments on your posts — with reply', 'Page inbox messages', 'Tagged posts & @mentions', 'Followers and page & post insights', 'Ad campaign data'],
        dontGet: ["No public or competitor tracking — LinkedIn's API doesn't allow it", 'No posts from personal profiles', "Comments older than 90 days aren't captured", 'Tagged posts can be read but not replied to', 'Needs a periodic re-login'],
        pickIf: 'LinkedIn supports your own organisation Page only.',
        dataTypes: 'Page posts, comments, inbox messages, tagged/@mention posts, follower data, page insights, ad campaign data',
        sync: 'Real-time + several sweeps a day',
        history: 'Last 30 days of posts and insights on connect',
        accessHeading: "What we'll access on your LinkedIn Organisation Page:",
        access: ['Read your Page posts, comments, messages and follower data', 'Read page, post and ad insights', 'Reply & publish only when you click send'],
        review: { account: 'Org Page', permissions: 'Read · Reply · Messages · Insights · Ads', sync: 'Real-time + sweeps', history: '30d posts' },
        celebration: 'LinkedIn is connected — listening for comments and messages on your Page.',
      },
    ],
  },

  tiktok: {
    id: 'tiktok', label: 'TikTok', tier: 'Premium', tileSub: 'Premium · OAuth · ~30s',
    connectionQuestion: 'How do you want to add TikTok?',
    modes: [
      {
        key: 'owned', cardHeading: 'Connect your TikTok account',
        get: ['Your videos & their comments', 'Direct messages', 'Video & profile stats'],
        dontGet: ['Needs a periodic re-login', 'Up to 60 comments per video'],
        pickIf: "Pick this if it's your account and you want to engage and see video performance.",
        dataTypes: 'Your videos, comments, direct messages, video & profile stats',
        sync: 'Continuous · stats refreshed daily',
        history: 'Last 7 days on connect (up to a year / 500 videos on request)',
        accessHeading: "What we'll access on your TikTok account:",
        access: ['Read your videos and comments', 'Read & reply to direct messages', 'Read video & profile stats'],
        review: { account: '@handle', permissions: 'Read · DMs · Stats', sync: 'Continuous', history: '7 days' },
        celebration: 'TikTok is connected — collecting videos, comments and DMs.',
      },
      {
        key: 'public', cardHeading: 'Track a public TikTok account',
        get: ["The account's public videos", 'Public comments'],
        dontGet: ['Starts from setup — no history before you add it', 'Up to 60 comments per video', 'Stats are captured once and not refreshed', 'Listen-only'],
        pickIf: "Pick this to monitor a competitor's or creator's TikTok.",
        dataTypes: "The account's public videos & comments",
        sync: 'Continuous from setup',
        history: 'None — collection starts the moment you add it',
        field: { label: 'Public TikTok handle or URL', placeholder: '@handle', guide: "Enter the @handle or paste the profile URL. Collection starts now — there's no history before setup." },
        review: { account: '@handle', permissions: 'Read only (public)', sync: 'Continuous from setup', history: 'none' },
        celebration: 'TikTok is connected and listening to that account.',
      },
    ],
  },

  telegram: {
    id: 'telegram', label: 'Telegram', tier: 'Regular', tileSub: 'OAuth · ~30s',
    connectionQuestion: '(No choice — Telegram is a messaging channel)',
    modes: [
      {
        key: 'owned', cardHeading: 'Connect your Telegram bot',
        get: ['Two-way direct & group messages'],
        dontGet: ['No public listening', 'Starts from connection — no message history', 'The bot must be added to a group to read its messages'],
        pickIf: "Telegram connects your brand's bot for customer conversations.",
        dataTypes: 'Direct messages, group messages',
        sync: 'Real-time',
        history: 'None — messages are collected from connection onward',
        accessHeading: "What we'll access via your Telegram bot:",
        access: ['Receive direct & group messages', 'Send replies you compose'],
        authButton: 'Connect Telegram bot',
        review: { account: '@yourbot', permissions: 'Receive · Reply', sync: 'Real-time', history: 'none (from connect)' },
        celebration: 'Telegram is connected — ready to receive and reply.',
      },
    ],
  },

  whatsapp: {
    id: 'whatsapp', label: 'WhatsApp', tier: 'Regular', tileSub: 'OAuth · ~30s',
    connectionQuestion: '(No choice — WhatsApp is a messaging channel)',
    modes: [
      {
        key: 'owned', cardHeading: 'Connect your WhatsApp Business number',
        get: ['Two-way customer messaging', 'Template messages', 'Delivery & read receipts'],
        dontGet: ['No public listening — WhatsApp is private messaging', 'Starts from connection — no message history', 'Replies after 24 hours must use an approved template'],
        pickIf: 'WhatsApp connects your Business number for customer conversations.',
        dataTypes: 'Inbound & outbound messages, template messages, media messages',
        sync: 'Real-time',
        history: 'None — messages are collected from connection onward',
        accessHeading: "What we'll access on your WhatsApp Business number:",
        access: ['Receive incoming messages', 'Send replies & approved templates', 'Read delivery and read status'],
        authButton: 'Connect WhatsApp Business',
        review: { account: 'business number', permissions: 'Receive · Reply · Templates', sync: 'Real-time', history: 'none' },
        celebration: 'WhatsApp is connected — ready to receive and reply.',
      },
    ],
  },

  fbgroups: {
    id: 'fbgroups', label: 'FB Groups', tier: 'Regular', tileSub: 'Public · URL',
    connectionQuestion: '(No connection-type choice — FB Groups is public-only)',
    modes: [
      {
        key: 'public', cardHeading: 'Track a public Facebook Group',
        get: ['Posts & comments in a public Group'],
        dontGet: ["Public Groups only — private Groups can't be tracked", 'Listen-only — no replies or admin actions'],
        pickIf: 'Pick this to monitor a public Group where your brand or market is discussed.',
        dataTypes: 'Public Group posts & comments',
        sync: 'Several sweeps a day',
        history: 'Recent Group activity on connect',
        field: { label: 'Public Facebook group URL', placeholder: 'https://www.facebook.com/groups/yourgroup', guide: 'Paste the Group URL (facebook.com/groups/…). The Group must be public.' },
        review: { account: 'group URL', permissions: 'Read only (public)', sync: 'Several sweeps a day', history: 'recent activity' },
        celebration: 'The Facebook Group is connected and listening.',
      },
    ],
  },

  playstore: {
    id: 'playstore', label: 'Google Play Store', tier: 'Regular', tileSub: 'JSON key · setup',
    connectionQuestion: '(No choice — your own app only)',
    modes: [
      {
        key: 'owned', cardHeading: 'Connect your Play Store app',
        get: ["Your app's reviews & ratings — with developer replies"],
        dontGet: ['Your own app only — no competitor apps', 'Connects with a service-account key, not a login'],
        pickIf: 'Play Store connects your own published app.',
        dataTypes: 'App reviews, ratings, developer replies',
        sync: 'Every 2 hours',
        history: 'Last 7 days on connect',
        accessHeading: "What we'll access for your app:",
        access: ['Read reviews & ratings', 'Post developer replies you compose'],
        accessNote: 'Connect by uploading your Google Play service-account key.',
        authButton: 'Upload service key & connect',
        review: { account: 'your package', permissions: 'Read · Reply', sync: 'Every 2 hours', history: '7 days' },
        celebration: 'Google Play is connected — collecting your reviews and ratings.',
      },
    ],
  },

  appstore: {
    id: 'appstore', label: 'App Store', tier: 'Regular', tileSub: 'API key · setup',
    connectionQuestion: 'How do you want to add App Store?',
    modes: [
      {
        key: 'owned', cardHeading: 'Connect your App Store app',
        get: ["Your app's reviews & ratings — with developer replies"],
        dontGet: ['Your own app only'],
        pickIf: "Pick this if it's your app and you want to reply to reviews.",
        dataTypes: 'App reviews, ratings, developer replies',
        sync: 'Every 2 hours',
        history: 'Last 30 days on connect',
        accessHeading: "What we'll access for your app:",
        access: ['Read reviews & ratings', 'Post developer replies you compose'],
        accessNote: 'Connect with an App Store Connect API key.',
        authButton: 'Add App Store key',
        review: { account: 'your app', permissions: 'Read · Reply', sync: 'Every 2 hours', history: '30 days' },
        celebration: 'App Store is connected — collecting your reviews and ratings.',
      },
      {
        key: 'public', cardHeading: 'Track a public App Store app',
        get: ['Public reviews & ratings for any app'],
        dontGet: ['Reviews only', 'Listen-only — no developer replies'],
        pickIf: "Pick this to monitor a competitor app or one you don't own.",
        dataTypes: 'App reviews & ratings',
        sync: 'Daily',
        history: 'All publicly available reviews',
        field: { label: 'Apple App Store URL', placeholder: 'https://apps.apple.com/app/id123456789', guide: "Open the app's App Store page and copy the URL — it contains /id followed by numbers." },
        review: { account: 'app URL', permissions: 'Read only (public)', sync: 'Daily', history: 'all public reviews' },
        celebration: 'App Store is connected and listening for public reviews.',
      },
    ],
  },

  gmb: {
    id: 'gmb', label: 'Google My Business', tier: 'Regular', tileSub: 'OAuth · ~30s',
    connectionQuestion: 'How do you want to add Google My Business?',
    modes: [
      {
        key: 'owned', cardHeading: 'Connect your Google Business Profile', pages: true, pagesNoun: 'locations',
        get: ['Reviews & ratings — with owner replies', 'Questions & answers'],
        dontGet: ['Needs a periodic re-login'],
        pickIf: 'Pick this if you manage the locations and want to reply.',
        dataTypes: 'Reviews, ratings, Q&A, owner responses',
        sync: 'Real-time + a daily sweep',
        history: 'Last 30 days on connect',
        accessHeading: "What we'll access on your Business Profile:",
        access: ['Read & respond to reviews and Q&A', 'Read business insights', 'Reply only when you click send'],
        review: { account: 'N location(s)', permissions: 'Read · Reply · Q&A · Insights', sync: 'Real-time + daily', history: '30 days' },
        celebration: 'Google My Business is connected — collecting reviews and ready for replies.',
      },
      {
        key: 'public', cardHeading: 'Track a public Google listing',
        get: ['Reviews & ratings for any public location'],
        dontGet: ['Reviews only — no Q&A', 'Listen-only — no owner replies'],
        pickIf: "Pick this to monitor a competitor location or one you don't manage.",
        dataTypes: 'Reviews, ratings',
        sync: 'Daily',
        history: 'Last 30 days on connect',
        field: { label: 'Google Business profile / Maps link', placeholder: 'https://maps.google.com/?cid=...', guide: 'Find the business on Google Maps, tap Share and copy the link.' },
        review: { account: 'Maps link', permissions: 'Read only (public)', sync: 'Daily', history: '30 days' },
        celebration: 'Google My Business is connected and listening for public reviews.',
      },
    ],
  },

  line: {
    id: 'line', label: 'LINE', tier: 'Regular', tileSub: 'OAuth · ~30s',
    connectionQuestion: '(No connection-type choice — LINE is a messaging channel)',
    modes: [
      {
        key: 'owned', cardHeading: 'Connect your LINE official account',
        get: ['Two-way messaging with your LINE followers'],
        dontGet: ['No public listening', 'Starts from connection — no message history'],
        pickIf: 'LINE connects your official account for customer conversations.',
        dataTypes: 'Direct & official-account messages',
        sync: 'Real-time',
        history: 'None — messages are collected from connection onward',
        accessHeading: "What we'll access on your LINE account:",
        access: ['Receive incoming messages', 'Send replies you compose'],
        authButton: 'Connect LINE account',
        review: { account: 'official account', permissions: 'Receive · Reply', sync: 'Real-time', history: 'none' },
        celebration: 'LINE is connected — ready to receive and reply.',
      },
    ],
  },

  glassdoor: {
    id: 'glassdoor', label: 'Glassdoor', tier: 'Premium', tileSub: 'Premium · URL · instant',
    connectionQuestion: '(No choice — public listening only)',
    modes: [
      {
        key: 'public', cardHeading: 'Track a Glassdoor company',
        get: ['Employer reviews & ratings'],
        dontGet: ['Listen-only — no employer replies from here'],
        pickIf: 'Glassdoor tracks public employer reviews for any company.',
        dataTypes: 'Employer reviews & ratings',
        sync: 'Twice a day',
        history: 'As far back as public pages allow',
        field: { label: 'Glassdoor company page URL', placeholder: 'https://www.glassdoor.com/Reviews/your-company', guide: "Open the company's Glassdoor reviews page and copy the URL." },
        review: { account: 'company URL', permissions: 'Read only (public)', sync: 'Twice a day', history: 'public pages' },
        celebration: 'Glassdoor is connected and listening for employer reviews.',
      },
    ],
  },

  sitejabber: {
    id: 'sitejabber', label: 'Sitejabber', tier: 'Regular', tileSub: 'API · setup',
    connectionQuestion: '(No choice — your business profile only)',
    modes: [
      {
        key: 'owned', cardHeading: 'Connect your Sitejabber business profile',
        get: ['Your business reviews — with responses'],
        dontGet: ['Your own profile only — no competitor tracking'],
        pickIf: 'Sitejabber connects your own business profile.',
        dataTypes: 'Reviews, comments on reviews',
        sync: 'Regular sweeps through the day',
        history: 'Recent reviews on connect',
        accessHeading: "What we'll access on your Sitejabber profile:",
        access: ['Read reviews & comments', 'Post responses you compose'],
        authButton: 'Connect with API key',
        review: { account: 'your profile', permissions: 'Read · Reply', sync: 'Regular sweeps', history: 'recent reviews' },
        celebration: 'Sitejabber is connected — collecting your reviews.',
      },
    ],
  },

  reddit: {
    id: 'reddit', label: 'Reddit (SubReddit)', tier: 'Premium', tileSub: 'Premium · URL · instant',
    connectionQuestion: '(No choice — public listening only)',
    modes: [
      {
        key: 'public', cardHeading: 'Track a subreddit',
        get: ['Posts & comments from any public subreddit'],
        dontGet: ['Subreddits only — no user or keyword tracking', 'Listen-only — no replies'],
        pickIf: 'Reddit tracks public subreddit posts and comments.',
        dataTypes: 'Subreddit posts & comments',
        sync: 'Daily',
        history: 'Recent subreddit activity on connect',
        field: { label: 'Subreddit URL', placeholder: 'https://www.reddit.com/r/yourbrand', guide: 'Paste the subreddit URL (reddit.com/r/…).' },
        review: { account: 'subreddit', permissions: 'Read only (public)', sync: 'Daily', history: 'recent activity' },
        celebration: 'Reddit is connected and listening for subreddit activity.',
      },
    ],
  },

  email: {
    id: 'email', label: 'Email', tier: 'Regular', tileSub: 'OAuth · ~30s',
    connectionQuestion: '(No choice — connect your mailbox)',
    modes: [
      {
        key: 'owned', cardHeading: 'Connect a support mailbox',
        get: ['Incoming email as tickets', 'Two-way email — reply from your own address', 'Auto-response rules'],
        dontGet: ["Starts from connection — older email isn't imported", "Sending needs your domain's email authentication (SPF/DKIM/DMARC) set up"],
        pickIf: 'Email connects a support inbox like support@yourbrand.com.',
        dataTypes: 'Email threads, attachment metadata, auto-created tickets',
        sync: 'Continuous — new mail appears within a minute',
        history: 'None — email is collected from connection onward',
        accessHeading: "What we'll access on the connected mailbox:",
        access: ['Read incoming email in this mailbox', 'Send replies from your address'],
        accessNote: 'Connect with Google or Microsoft sign-in, or IMAP/SMTP.',
        authButton: 'Connect mailbox',
        review: { account: 'support@brand.com', permissions: 'Read inbox · Send replies', sync: 'continuous', history: 'none' },
        celebration: 'Email is connected — incoming mail now becomes tickets you can answer.',
      },
    ],
  },

  galerts: {
    id: 'galerts', label: 'Google Alerts', tier: 'Regular', tileSub: 'URL · instant',
    connectionQuestion: '(No connection-type choice — public listening)',
    modes: [
      {
        key: 'public', cardHeading: 'Add a Google Alerts feed',
        get: ['Web mentions matching your alert — news, blogs and more'],
        dontGet: ['Coverage follows whatever your Google Alert matches', 'Listen-only'],
        pickIf: 'Google Alerts brings your existing web alerts into your inbox.',
        dataTypes: 'Web mentions matching your alert',
        sync: 'Continuous — as the feed updates',
        history: 'Starts from when you connect the feed',
        field: { label: 'Google Alerts RSS feed URL', placeholder: 'https://www.google.com/alerts/feeds/...', guide: 'In Google Alerts, set delivery to "RSS feed", then copy the feed URL here.' },
        review: { account: 'RSS feed', permissions: 'Read only (public)', sync: 'Continuous', history: 'from connect' },
        celebration: 'Google Alerts is connected — web mentions will flow into your inbox.',
      },
    ],
  },

  tripadvisor: {
    id: 'tripadvisor', label: 'TripAdvisor', tier: 'Premium', tileSub: 'Premium · URL · instant',
    connectionQuestion: '(No choice — public listening only)',
    modes: [
      {
        key: 'public', cardHeading: 'Track a TripAdvisor property',
        get: ['Property reviews & ratings'],
        dontGet: ['Listen-only — no owner replies from here'],
        pickIf: 'TripAdvisor tracks public reviews for any property.',
        dataTypes: 'Property reviews & ratings',
        sync: 'Twice a day',
        history: 'As far back as public pages allow',
        field: { label: 'TripAdvisor property URL', placeholder: 'https://www.tripadvisor.com/Hotel_Review-...', guide: 'Open the property page on TripAdvisor and copy the URL.' },
        review: { account: 'property URL', permissions: 'Read only (public)', sync: 'Twice a day', history: 'public pages' },
        celebration: 'TripAdvisor is connected and listening for reviews.',
      },
    ],
  },

  booking: {
    id: 'booking', label: 'Booking', tier: 'Premium', tileSub: 'Premium · URL · instant',
    connectionQuestion: '(No choice — public listening only)',
    modes: [
      {
        key: 'public', cardHeading: 'Track a Booking.com property',
        get: ['Guest reviews & ratings'],
        dontGet: ['Listen-only — no owner replies from here'],
        pickIf: 'Booking tracks public guest reviews for any property.',
        dataTypes: 'Guest reviews & ratings',
        sync: 'Regular sweeps through the day',
        history: 'As far back as public pages allow',
        field: { label: 'Booking.com property URL', placeholder: 'https://www.booking.com/hotel/...', guide: 'Open the property page on Booking.com and copy the URL.' },
        review: { account: 'property URL', permissions: 'Read only (public)', sync: 'Regular sweeps', history: 'public pages' },
        celebration: 'Booking.com is connected and listening for reviews.',
      },
    ],
  },

  expedia: {
    id: 'expedia', label: 'Expedia', tier: 'Premium', tileSub: 'Premium · URL · instant',
    connectionQuestion: '(No connection-type choice — public listening)',
    modes: [
      {
        key: 'public', cardHeading: 'Track an Expedia property',
        get: ['Guest reviews & ratings'],
        dontGet: ['Listen-only — no owner replies from here'],
        pickIf: 'Expedia tracks public guest reviews for any property.',
        dataTypes: 'Guest reviews & ratings',
        sync: 'Regular sweeps through the day',
        history: 'As far back as public pages allow',
        field: { label: 'Expedia property URL', placeholder: 'https://www.expedia.com/...', guide: 'Open the property page on Expedia and copy the URL.' },
        review: { account: 'property URL', permissions: 'Read only (public)', sync: 'Regular sweeps', history: 'public pages' },
        celebration: 'Expedia is connected and listening for reviews.',
      },
    ],
  },

  ganalytics: {
    id: 'ganalytics', label: 'Google Analytics', tier: 'Regular', tileSub: 'OAuth · ~30s · Analytics',
    connectionQuestion: '(No choice — analytics integration)',
    modes: [
      {
        key: 'owned', cardHeading: 'Connect Google Analytics',
        get: ['Website traffic, sessions & conversions in your dashboards'],
        dontGet: ['No mentions, comments, DMs or reviews — this adds metrics, not conversations', 'Read-only'],
        pickIf: "Google Analytics adds website metrics to your dashboards — it's not a social channel.",
        dataTypes: 'GA property metrics (sessions, users, conversions, traffic sources)',
        sync: 'Refreshed on a schedule',
        history: 'Whatever your GA property holds',
        accessHeading: "What we'll access:",
        access: ['Read your Google Analytics property metrics (read-only)'],
        accessNote: 'No posting or messaging access — metrics only.',
        authButton: 'Connect Google Analytics',
        review: { account: 'GA property', permissions: 'Read metrics (read-only)', sync: 'scheduled', history: 'per GA' },
        celebration: 'Google Analytics is connected — your website metrics are on their way.',
      },
    ],
  },

  amazon: {
    id: 'amazon', label: 'Amazon', tier: 'Premium', tileSub: 'Premium · URL · instant',
    connectionQuestion: '(No choice — public product reviews)',
    modes: [
      {
        key: 'public', cardHeading: 'Track an Amazon product',
        get: ['Product reviews & ratings'],
        dontGet: ['Listen-only — no seller replies from here'],
        pickIf: 'Amazon tracks public reviews on any product you want to monitor.',
        dataTypes: 'Product reviews & ratings',
        sync: 'Daily',
        history: 'As far back as public pages allow',
        field: { label: 'Amazon product or store URL', placeholder: 'https://www.amazon.in/dp/B0CXXXX', guide: 'Open the product page and copy the URL — it contains /dp/ followed by the product code. Use the product page, not your seller dashboard.' },
        review: { account: 'product URL', permissions: 'Read only (public)', sync: 'Daily', history: 'public pages' },
        celebration: 'Amazon is connected and listening for product reviews.',
      },
    ],
  },

  flipkart: {
    id: 'flipkart', label: 'Flipkart', tier: 'Premium', tileSub: 'Premium · URL · instant',
    connectionQuestion: '(No choice — public product reviews)',
    modes: [
      {
        key: 'public', cardHeading: 'Track a Flipkart product',
        get: ['Product reviews & ratings'],
        dontGet: ['Listen-only — no seller replies from here'],
        pickIf: 'Flipkart tracks public reviews on any product listing.',
        dataTypes: 'Product reviews & ratings',
        sync: 'Continuous',
        history: 'As far back as public pages allow',
        field: { label: 'Flipkart product URL', placeholder: 'https://www.flipkart.com/product/p/itmXXXX', guide: 'Open the product page and copy the URL from the address bar. It should open without a login.' },
        review: { account: 'product URL', permissions: 'Read only (public)', sync: 'Continuous', history: 'public pages' },
        celebration: 'Flipkart is connected and listening for product reviews.',
      },
    ],
  },

  bestbuy: {
    id: 'bestbuy', label: 'BestBuy', tier: 'Premium', tileSub: 'Premium · URL · instant',
    connectionQuestion: '(No choice — public product reviews)',
    modes: [
      {
        key: 'public', cardHeading: 'Track a BestBuy product',
        get: ['Product reviews & ratings'],
        dontGet: ['Listen-only — no seller replies from here'],
        pickIf: 'BestBuy tracks public reviews on any product page.',
        dataTypes: 'Product reviews & ratings',
        sync: 'Daily',
        history: 'As far back as public pages allow',
        field: { label: 'BestBuy product URL', placeholder: 'https://www.bestbuy.com/site/.../1234567.p', guide: 'Open the product page on BestBuy.com and copy the URL — it ends with a product id like /1234567.p' },
        review: { account: 'product URL', permissions: 'Read only (public)', sync: 'Daily', history: 'public pages' },
        celebration: 'BestBuy is connected and listening for product reviews.',
      },
    ],
  },

  voice: {
    id: 'voice', label: 'Voice', tier: 'Regular', tileSub: 'Coming soon',
    flag: 'planned',
    flagText: 'Coming soon — this channel is launching shortly.',
    connectionQuestion: '(No connection-type choice — Voice is a call channel)',
    modes: [
      {
        key: 'owned', cardHeading: 'Connect Voice',
        get: ['Voice calls & recordings', 'Call metrics & resolution tracking'],
        dontGet: ['No public listening — calls are private conversations'],
        pickIf: 'Voice brings your call conversations into the same inbox as everything else.',
        dataTypes: 'Voice calls, recordings, call metrics',
        sync: 'Real-time',
        history: 'None — calls are captured from connection onward',
        accessHeading: "What we'll access:",
        access: ['Receive call events & recordings', 'Log resolutions your team records'],
        authButton: 'Connect Voice',
        review: { account: 'Voice', permissions: 'Receive · Log', sync: 'Real-time', history: 'none' },
        celebration: 'Voice is connected — calls now land in your inbox.',
      },
    ],
  },
};

/** Lookup helper — spec for a catalog channel id (or null). */
export function channelSpec(id: string | undefined): ChannelSpec | null {
  return id ? (CHANNEL_SPECS[id] ?? null) : null;
}


/* ===================================================================
   X (Twitter) — Owned account splits its access across two APIs.
   The user can authenticate either or both; each unlocks different
   capabilities. Shown as a dedicated step after picking "Owned".
   =================================================================== */
export interface XApiVersion {
  id: 'v1' | 'v2';
  tag: string;        // short label e.g. "v1.1"
  badge: string;      // "API v1.1 · OAuth 1.0a"
  title: string;      // "Legacy API"
  sub: string;        // one-line summary
  caps: string[];     // what it unlocks
  best: string;       // "Best for …"
  recommended?: boolean;
}

export const X_API_VERSIONS: XApiVersion[] = [
  {
    id: 'v2', tag: 'v2', badge: 'API v2 · OAuth 2.0', title: 'Content & analytics',
    sub: 'Everything we read and send on your behalf.',
    caps: [
      'Read your tweets, @mentions & replies',
      'Read & send Direct Messages',
      'Post replies with images, video & GIFs',
      'Impressions & engagement analytics',
    ],
    best: '',
  },
  {
    id: 'v1', tag: 'v1.1', badge: 'API v1.1 · OAuth 1.0a', title: 'Real-time delivery',
    sub: 'The always-on pipe from X to your inbox.',
    caps: [
      'Mentions arrive the moment they’re posted',
      'DMs arrive instantly',
      'Backup sweeps still run if the pipe hiccups',
    ],
    best: '',
  },
];

/* ===================================================================
   E-Commerce — "Add by search" mock product catalog.
   Readable product data only (NO price). Used to preview the search
   experience for Amazon / Flipkart / BestBuy. Verify / extend freely.
   =================================================================== */
export interface EcomProduct {
  id: string;
  title: string;
  brand: string;
  category: string;      // Phone · Earbuds · Smartwatch · Speaker · Headphones …
  rating: number;        // 4.6
  ratingCount: string;   // "3.2k ratings"
  attrs: string[];       // readable specs, NO price
  color: string;         // tile colour
  emoji: string;         // simple visual stand-in for a product image
  keywords?: string[];   // extra search terms
}

export const ECOM_PRODUCTS: EcomProduct[] = [
  // Apple
  { id: 'ip17',     title: 'Apple iPhone 17',            brand: 'Apple',   category: 'Phone',      rating: 4.6, ratingCount: '3.2k ratings',  attrs: ['6.1-inch', '128 GB', '5G', 'Black'],        color: '#000000', emoji: '📱', keywords: ['ios', 'mobile'] },
  { id: 'ip17pro',  title: 'Apple iPhone 17 Pro',        brand: 'Apple',   category: 'Phone',      rating: 4.7, ratingCount: '1.8k ratings',  attrs: ['6.3-inch', '256 GB', '5G', 'A19 Pro'],      color: '#1d1d1f', emoji: '📱', keywords: ['ios', 'mobile'] },
  { id: 'ip17max',  title: 'Apple iPhone 17 Pro Max',    brand: 'Apple',   category: 'Phone',      rating: 4.8, ratingCount: '1.1k ratings',  attrs: ['6.9-inch', '512 GB', '5G'],                 color: '#1d1d1f', emoji: '📱', keywords: ['ios', 'mobile'] },
  { id: 'ip16',     title: 'Apple iPhone 16',            brand: 'Apple',   category: 'Phone',      rating: 4.6, ratingCount: '22.4k ratings', attrs: ['6.1-inch', '128 GB', '5G'],                 color: '#000000', emoji: '📱', keywords: ['ios', 'mobile'] },
  { id: 'awatch10', title: 'Apple Watch Series 10',      brand: 'Apple',   category: 'Smartwatch', rating: 4.7, ratingCount: '5.1k ratings',  attrs: ['46 mm', 'GPS', 'Aluminium'],                color: '#000000', emoji: '⌚', keywords: ['watch'] },
  { id: 'airpods3', title: 'Apple AirPods Pro 3',        brand: 'Apple',   category: 'Earbuds',    rating: 4.7, ratingCount: '18.9k ratings', attrs: ['ANC', 'USB-C', 'Spatial audio'],            color: '#000000', emoji: '🎧', keywords: ['earphones', 'tws'] },

  // boAt
  { id: 'boat191',  title: 'boAt Airdopes 191',          brand: 'boAt',    category: 'Earbuds',    rating: 4.2, ratingCount: '44.1k ratings', attrs: ['ENx tech', '45h playback', 'BT 5.3'],       color: '#e63946', emoji: '🎧', keywords: ['earphones', 'tws'] },
  { id: 'boat311',  title: 'boAt Airdopes 311 Pro',      brand: 'boAt',    category: 'Earbuds',    rating: 4.1, ratingCount: '12.3k ratings', attrs: ['50h playback', 'Low latency'],              color: '#e63946', emoji: '🎧', keywords: ['earphones', 'tws'] },
  { id: 'boatwave', title: 'boAt Wave Call 2',           brand: 'boAt',    category: 'Smartwatch', rating: 4.0, ratingCount: '9.7k ratings',  attrs: ['1.83-inch', 'BT calling', 'HR monitor'],    color: '#e63946', emoji: '⌚', keywords: ['watch'] },
  { id: 'boatstorm',title: 'boAt Storm Pro',             brand: 'boAt',    category: 'Smartwatch', rating: 4.1, ratingCount: '6.2k ratings',  attrs: ['AMOLED', 'IP68', 'BT calling'],             color: '#e63946', emoji: '⌚', keywords: ['watch'] },
  { id: 'boatstone',title: 'boAt Stone 350',             brand: 'boAt',    category: 'Speaker',    rating: 4.3, ratingCount: '15.6k ratings', attrs: ['10 W', 'IPX7', 'BT 5.3'],                   color: '#e63946', emoji: '🔊', keywords: ['bluetooth speaker'] },
  { id: 'boatrock', title: 'boAt Rockerz 450',           brand: 'boAt',    category: 'Headphones', rating: 4.2, ratingCount: '38.5k ratings', attrs: ['15h playback', '40 mm drivers'],            color: '#e63946', emoji: '🎧', keywords: ['headphone'] },

  // Samsung
  { id: 's24',      title: 'Samsung Galaxy S24',         brand: 'Samsung', category: 'Phone',      rating: 4.5, ratingCount: '8.9k ratings',  attrs: ['6.2-inch', '256 GB', '5G'],                 color: '#1428a0', emoji: '📱', keywords: ['android', 'mobile'] },
  { id: 'gwatch7',  title: 'Samsung Galaxy Watch 7',     brand: 'Samsung', category: 'Smartwatch', rating: 4.4, ratingCount: '3.3k ratings',  attrs: ['44 mm', 'GPS', 'BioActive'],                color: '#1428a0', emoji: '⌚', keywords: ['watch'] },
  { id: 'buds3',    title: 'Samsung Galaxy Buds3',       brand: 'Samsung', category: 'Earbuds',    rating: 4.3, ratingCount: '2.1k ratings',  attrs: ['ANC', 'IPX7'],                              color: '#1428a0', emoji: '🎧', keywords: ['earphones', 'tws'] },

  // OnePlus
  { id: 'op13',     title: 'OnePlus 13',                 brand: 'OnePlus', category: 'Phone',      rating: 4.5, ratingCount: '4.4k ratings',  attrs: ['6.8-inch', '256 GB', '5G'],                 color: '#eb0028', emoji: '📱', keywords: ['android', 'mobile'] },
  { id: 'opnord',   title: 'OnePlus Nord Buds 3',        brand: 'OnePlus', category: 'Earbuds',    rating: 4.1, ratingCount: '7.7k ratings',  attrs: ['49h playback', 'BT 5.4'],                   color: '#eb0028', emoji: '🎧', keywords: ['earphones', 'tws'] },

  // Noise
  { id: 'noise5',   title: 'Noise ColorFit Pro 5',       brand: 'Noise',   category: 'Smartwatch', rating: 4.0, ratingCount: '11.2k ratings', attrs: ['1.85-inch', 'BT calling'],                  color: '#ff3b30', emoji: '⌚', keywords: ['watch'] },
];

/** AND-match every query token against title + brand + category + keywords. */
export function searchEcom(q: string): EcomProduct[] {
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  return ECOM_PRODUCTS.filter(p => {
    const hay = (p.title + ' ' + p.brand + ' ' + p.category + ' ' + (p.keywords ?? []).join(' ')).toLowerCase();
    return tokens.every(t => hay.includes(t));
  });
}

/* ===================================================================
   Google My Business — nested account → locations picker.
   =================================================================== */
export interface GmbLocation { id: string; name: string; locality?: string; rating?: string; }
export interface GmbAccountGroup { id: string; name: string; overCap?: boolean; locations: GmbLocation[]; }

export const GMB_ACCOUNTS: GmbAccountGroup[] = [
  {
    id: 'acct-retail', name: 'Acme Retail (Business Profile)',
    locations: [
      { id: 'loc-mg', name: 'Acme Store — MG Road', locality: 'MG Road, Bengaluru', rating: '4.6★' },
      { id: 'loc-indira', name: 'Acme Store — Indiranagar', locality: 'Indiranagar, Bengaluru', rating: '4.4★' },
      { id: 'loc-white', name: 'Acme Store — Whitefield', locality: 'Whitefield, Bengaluru', rating: '4.7★' },
    ],
  },
  {
    id: 'acct-cafe', name: 'Acme Cafe (Business Profile)',
    locations: [
      { id: 'loc-kor', name: 'Acme Cafe — Koramangala', locality: 'Koramangala, Bengaluru', rating: '4.5★' },
      { id: 'loc-hsr', name: 'Acme Cafe — HSR Layout', locality: 'HSR Layout, Bengaluru', rating: '4.3★' },
    ],
  },
  {
    id: 'acct-labs', name: 'Acme Labs (Business Profile)', overCap: true,
    locations: [
      { id: 'loc-labs-hq', name: 'Acme Labs — Head Office', locality: 'Electronic City, Bengaluru', rating: '4.2★' },
    ],
  },
];

/* ===================================================================
   Google Analytics — accounts flattened to web properties.
   =================================================================== */
export interface GaProperty { id: string; name: string; account: string; propertyId: string; }
export const GA_PROPERTIES: GaProperty[] = [
  { id: 'ga-web', name: 'Acme — Website (GA4)', account: 'Acme Retail Pvt Ltd', propertyId: '349102771' },
  { id: 'ga-app', name: 'Acme — Mobile App', account: 'Acme Retail Pvt Ltd', propertyId: '349102908' },
  { id: 'ga-blog', name: 'Acme — Blog', account: 'Acme Retail Pvt Ltd', propertyId: '349103015' },
  { id: 'ga-store', name: 'Acme Store — Web', account: 'Acme Store Ops', propertyId: '349109933' },
];

/* ===================================================================
   Email — mailbox folders/labels offered after OAuth (Gmail blocks
   Drafts/Trash/Chat; Outlook has no such restriction).
   =================================================================== */
export interface EmailFolder { id: string; name: string; count?: string; disabled?: boolean; }
export function emailFolders(gmail: boolean): EmailFolder[] {
  return gmail
    ? [
        { id: 'inbox', name: 'Inbox', count: '128 unread' },
        { id: 'sent', name: 'Sent' },
        { id: 'important', name: 'Important', count: '12 unread' },
        { id: 'starred', name: 'Starred' },
        { id: 'draft', name: 'Drafts', disabled: true },
        { id: 'trash', name: 'Trash', disabled: true },
        { id: 'chat', name: 'Chat', disabled: true },
      ]
    : [
        { id: 'inbox', name: 'Inbox', count: '94 unread' },
        { id: 'sentitems', name: 'Sent Items' },
        { id: 'junk', name: 'Junk Email', count: '6 unread' },
        { id: 'archive', name: 'Archive' },
        { id: 'drafts', name: 'Drafts' },
      ];
}

/* ===================================================================
   App Store — apps returned after verifying the Connect API key.
   =================================================================== */
export interface AppStoreApp { id: string; name: string; bundleId: string; }
export const APPSTORE_APPS: AppStoreApp[] = [
  { id: 'app-main', name: 'Acme — Shop & Track', bundleId: 'com.acme.shop' },
  { id: 'app-lite', name: 'Acme Lite', bundleId: 'com.acme.shop.lite' },
  { id: 'app-biz', name: 'Acme for Business', bundleId: 'com.acme.biz' },
];

/* ===================================================================
   TikTok / FB Groups — simulated "fetch a preview" results, keyed
   loosely off whatever the user typed so the demo feels responsive.
   =================================================================== */
export interface TiktokPreview { name: string; handle: string; avatarEmoji: string; }
export function tiktokPreview(handle: string): TiktokPreview {
  const clean = handle.replace(/^@/, '').replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/, '').split(/[/?]/)[0] || 'brand';
  return { name: 'Acme — ' + (clean.charAt(0).toUpperCase() + clean.slice(1)), handle: clean, avatarEmoji: '🎵' };
}
export interface FbGroupPreview { groupName: string; memberCount: number; isPrivate: boolean; }
export function fbGroupPreview(url: string): FbGroupPreview {
  const isPrivate = /private/i.test(url) || Math.random() < 0.15;
  return { groupName: 'Acme Community & Support', memberCount: 8600 + Math.floor(Math.random() * 4000), isPrivate };
}

/* ===================================================================
   Per-field "where do I find / generate this?" help — shown in the
   right aside when a credential input is focused.
   =================================================================== */
export interface FieldHelp { field: string; label: string; icon: string; lead?: string; steps: string[]; note?: string; }

export const FIELD_HELP: Record<string, FieldHelp[]> = {
  appstore: [
    {
      field: 'keyId', label: 'Key ID', icon: 'key',
      lead: 'A short identifier for your App Store Connect API key.',
      steps: [
        'Log in to App Store Connect.',
        'Select Users and Access, then the API Keys tab.',
        'Key IDs appear in a column under the Active heading.',
        'Hover next to a key ID and click "Copy Key ID".',
      ],
    },
    {
      field: 'issuerId', label: 'Issuer ID', icon: 'badge',
      lead: 'A single ID shared by all API keys in your account.',
      steps: [
        'Log in to App Store Connect.',
        'Select Users and Access, then the API Keys tab.',
        'The Issuer ID is shown near the top of the Keys tab.',
        'Copy the Issuer ID.',
      ],
      note: 'You need an Admin account in App Store Connect to manage keys.',
    },
    {
      field: 'privateKey', label: 'Private key (.p8)', icon: 'lock',
      lead: 'The private half of the API key — paste its full contents.',
      steps: [
        'App Store Connect → Users and Access → API Keys.',
        'Click Generate API Key (or the + button).',
        'Enter a name, pick a role under Access, then click Generate.',
        'Click "Download API Key" to download the .p8 file, then paste its contents here.',
      ],
      note: 'The private key can be downloaded only once — Apple keeps no copy, so store it safely.',
    },
  ],
  playstore: [
    {
      field: 'serviceKey', label: 'Service-account key (.json)', icon: 'upload_file',
      lead: 'A JSON key that lets Locobuzz read your app’s reviews.',
      steps: [
        'Open Google Play Console → Setup → API access.',
        'Create (or pick) a Google Cloud service account and grant it access.',
        'Under Service accounts, create a key of type JSON and download it.',
        'Upload that .json file here.',
      ],
      note: 'Keep the key file safe — anyone with it can access your Play data.',
    },
    {
      field: 'packageName', label: 'App package name', icon: 'inventory_2',
      lead: 'The unique id of your app on Google Play.',
      steps: [
        'It’s the app’s Play Store URL after id=, e.g. com.yourcompany.app.',
        'Or find it in Play Console → your app → Dashboard.',
      ],
    },
    {
      field: 'friendlyName', label: 'App friendly name', icon: 'badge',
      steps: ['A display name for this app inside Locobuzz — your choice.'],
    },
  ],
  telegram: [
    {
      field: 'token', label: 'Bot token', icon: 'key',
      lead: 'An HTTP API token that lets Locobuzz operate your bot.',
      steps: [
        'Open Telegram and start a chat with @BotFather.',
        'Send /newbot and follow the prompts (bot name + username).',
        'BotFather replies with an HTTP API token — copy it here.',
      ],
    },
  ],
  line: [
    {
      field: 'channelId', label: 'Channel ID', icon: 'tag',
      steps: [
        'Open the LINE Developers Console and pick your provider.',
        'Open your Messaging API channel.',
        'Copy the Channel ID from the Basic settings tab.',
      ],
    },
    {
      field: 'accessToken', label: 'Channel access token', icon: 'key',
      steps: [
        'In your Messaging API channel, open the Messaging API tab.',
        'Under "Channel access token (long-lived)", click Issue.',
        'Copy the generated token here.',
      ],
    },
    {
      field: 'secret', label: 'Channel secret', icon: 'lock',
      steps: [
        'Open your Messaging API channel in the LINE Developers Console.',
        'Copy the Channel secret from the Basic settings tab.',
      ],
    },
  ],
  sitejabber: [
    { field: 'email', label: 'Business email', icon: 'mail', steps: ['Use the email you sign in to your Sitejabber business account with.'] },
    { field: 'password', label: 'Password', icon: 'lock', steps: ['Your Sitejabber business-account password.'], note: 'Stored securely and only used to connect the account.' },
    { field: 'apiKey', label: 'API key', icon: 'key', steps: ['Open your Sitejabber business dashboard.', 'Go to the API / integrations settings.', 'Copy the API key issued for your business.'] },
    { field: 'business', label: 'Business name', icon: 'business', steps: ['Enter the business / domain name exactly as it appears on your Sitejabber profile.'] },
  ],
};

/** Field help for the manual Email steps — shown as one block per input in the right aside. */
export const EMAIL_INCOMING_HELP: FieldHelp[] = [
  {
    field: 'forwarding', label: 'Forwarding method', icon: 'swap_horiz',
    lead: 'How we read mail from your server.',
    steps: [
      'IMAP — mail stays on the server and folders stay in sync. Recommended.',
      'POP — mail is downloaded; some servers delete it afterwards.',
      'MAPI — for Microsoft Exchange servers.',
    ],
  },
  { field: 'inName', label: 'Name', icon: 'badge', steps: ['A label for this mailbox inside Locobuzz — e.g. "Support".'] },
  { field: 'inEmail', label: 'Email address', icon: 'mail', steps: ['The mailbox we listen to. Every mail landing here becomes a ticket.'] },
  {
    field: 'inPassword', label: 'Password', icon: 'lock',
    steps: ['The mailbox password.', 'Gmail / Outlook with 2FA need an app password, not your normal one.'],
    note: 'Stored encrypted and only used to connect to your mail server.',
  },
  { field: 'inPort', label: 'Port', icon: 'tag', steps: ['IMAP over SSL → 993', 'POP over SSL → 995', 'Leave the default unless your provider says otherwise.'] },
  { field: 'inServer', label: 'Incoming server', icon: 'dns', steps: ['Gmail → imap.gmail.com', 'Office 365 → outlook.office365.com', 'Otherwise ask your mail admin.'] },
  { field: 'inSSL', label: 'SSL', icon: 'shield', steps: ['Keep this on — it encrypts the connection to your mail server.'] },
];

export const EMAIL_OUTGOING_HELP: FieldHelp[] = [
  { field: 'outName', label: 'Name', icon: 'badge', steps: ['The sender name your customers see on replies.'] },
  { field: 'outEmail', label: 'Email address', icon: 'mail', steps: ['The address replies are sent from. Usually the same as incoming.'] },
  { field: 'outPassword', label: 'Password', icon: 'lock', steps: ['The SMTP password — normally the same as the incoming one.'], note: 'With 2FA, use an app password.' },
  { field: 'outPort', label: 'Port', icon: 'tag', steps: ['STARTTLS → 587 (most common)', 'SSL → 465'] },
  { field: 'outServer', label: 'Outgoing server', icon: 'dns', steps: ['Gmail → smtp.gmail.com', 'Office 365 → smtp.office365.com'] },
  { field: 'outSSL', label: 'SSL', icon: 'shield', steps: ['Encrypts replies on the way out. Keep it on.'] },
  { field: 'outReplyTo', label: 'Reply-to address', icon: 'reply', steps: ['Where customer responses should land, if that differs from the sending address.'], note: 'Optional.' },
  { field: 'outAlias', label: 'Email alias', icon: 'alternate_email', steps: ['Send as a friendlier address your mailbox is allowed to send from.'], note: 'Optional.' },
  { field: 'cc', label: 'Cc', icon: 'group', steps: ['Every reply is copied to these addresses, visibly.', 'Press Enter after each address.'], note: 'Optional.' },
  { field: 'bcc', label: 'Bcc', icon: 'visibility_off', steps: ['Copies every reply silently — useful for an archive mailbox.'], note: 'Optional.' },
  { field: 'outFooter', label: 'Email footer', icon: 'edit_note', steps: ['Appended to every reply sent from this mailbox.', 'Add your signature, support hours or a disclaimer.'], note: 'Required.' },
];
