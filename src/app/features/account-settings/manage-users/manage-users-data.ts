/**
 * Data for the "Manage Users" screen and the Add / Edit User wizard.
 *
 * Prototype mock data — no backend. It mirrors the entities the real Add-User
 * dialog works with: the user listing, roles, assignable brands, teams, agent
 * skills, the channel / sub-channel tree, configured incoming emails, the
 * country-code list, the platform permission tree, and the notify-users list.
 */

/* ===================================================================
   Listing
   =================================================================== */
/** An assigned brand shown as an avatar (name + colour). */
export interface UserBrand { name: string; color: string; }

export interface ManagedUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  /** Accent colour for the initials avatar. */
  color: string;
  brands: number;
  active: boolean;

  /* ---- enriched: everything captured by the Add-User wizard ---- */
  gender?: string;                 // step 1
  contact?: string;                // step 1 — dial + number
  supervisorAdmin?: boolean;       // step 1
  brandList?: UserBrand[];         // step 2 — assigned brands for avatar stacks
  team?: string;                   // step 2
  skills?: string[];               // step 2
  channelIds?: string[];           // step 3 — channels (BRAND_ICONS keys) for logos
  permissions?: string[];          // step 4 — platform modules
  signature?: string;              // step 5
}

export const MANAGED_USERS: ManagedUser[] = [
  {
    id: 'u1', firstName: 'Aarav', lastName: 'Mehta', username: 'aarav_admin', email: 'aarav.mehta@brand.com',
    role: 'Supervisor Agent', color: '#4f46e5', brands: 12, active: true,
    gender: 'Male', contact: '+91 98200 11234', supervisorAdmin: true,
    brandList: [{ name: 'Amazon', color: '#ff9900' }, { name: 'Nike', color: '#0f172a' }, { name: 'Zomato', color: '#ef4444' }],
    team: 'War Room', skills: ['English', 'Hindi', 'Escalations'],
    channelIds: ['twitter', 'facebook', 'instagram', 'email', 'playstore'],
    permissions: ['Response Dashboard', 'Account Settings', 'Analytics', 'Reports'],
    signature: 'Best regards,\nAarav Mehta · Supervisor',
  },
  {
    id: 'u2', firstName: 'Bhavna', lastName: 'Rao', username: 'bhavna_agent', email: 'bhavna.rao@brand.com',
    role: 'Agent', color: '#0ea5e9', brands: 3, active: true,
    gender: 'Female', contact: '+91 99300 55678', supervisorAdmin: false,
    brandList: [{ name: 'Myntra', color: '#e91e63' }, { name: 'Zomato', color: '#ef4444' }],
    team: 'Customer Support — L1', skills: ['English', 'Refunds'],
    channelIds: ['facebook', 'instagram', 'email'],
    permissions: ['Response Dashboard'],
    signature: 'Thanks,\nBhavna',
  },
  {
    id: 'u3', firstName: 'Chetan', lastName: 'Iyer', username: 'chetan_sup', email: 'chetan.iyer@brand.com',
    role: 'Team Lead', color: '#10b981', brands: 6, active: true,
    gender: 'Male', contact: '+91 90040 22890', supervisorAdmin: false,
    brandList: [{ name: 'Air India', color: '#c8102e' }, { name: 'Nike', color: '#0f172a' }, { name: 'Flipkart', color: '#2874f0' }],
    team: 'Escalations', skills: ['English', 'Technical', 'Billing'],
    channelIds: ['twitter', 'facebook', 'email', 'gmb'],
    permissions: ['Response Dashboard', 'Analytics'],
    signature: 'Regards,\nChetan Iyer · Team Lead',
  },
  {
    id: 'u4', firstName: 'Deepika', lastName: 'Nair', username: 'deepika_cc', email: 'deepika.nair@brand.com',
    role: 'Customer Care', color: '#f59e0b', brands: 2, active: false,
    gender: 'Female', contact: '+91 98765 43210', supervisorAdmin: false,
    brandList: [{ name: 'Amazon', color: '#ff9900' }, { name: 'Swiggy', color: '#fc8019' }],
    team: 'Customer Support — L2', skills: ['English', 'Onboarding'],
    channelIds: ['facebook', 'instagram'],
    permissions: ['Response Dashboard'],
    signature: 'Warm regards,\nDeepika',
  },
  {
    id: 'u5', firstName: 'Esha', lastName: 'Khan', username: 'esha_brand', email: 'esha.khan@brand.com',
    role: 'Brand Account', color: '#ec4899', brands: 4, active: true,
    gender: 'Female', contact: '+91 95550 67788', supervisorAdmin: false,
    brandList: [{ name: 'Nike', color: '#0f172a' }, { name: 'Myntra', color: '#e91e63' }],
    team: 'Social Media', skills: ['English', 'Hindi'],
    channelIds: ['instagram', 'facebook', 'twitter'],
    permissions: ['Response Dashboard', 'Reports'],
    signature: 'Cheers,\nEsha Khan',
  },
  {
    id: 'u6', firstName: 'Farhan', lastName: 'Shaikh', username: 'farhan_tl', email: 'farhan.shaikh@brand.com',
    role: 'Account Configurator', color: '#ef4444', brands: 9, active: true,
    gender: 'Male', contact: '+91 97000 88990', supervisorAdmin: true,
    brandList: [{ name: 'Amazon', color: '#ff9900' }, { name: 'Air India', color: '#c8102e' }, { name: 'Flipkart', color: '#2874f0' }],
    team: 'War Room', skills: ['English', 'Technical', 'Hindi'],
    channelIds: ['twitter', 'facebook', 'instagram', 'email', 'playstore', 'gmb'],
    permissions: ['Response Dashboard', 'Account Settings', 'Analytics', 'Reports'],
    signature: 'Best,\nFarhan Shaikh · Configurator',
  },
];

/* ===================================================================
   Roles
   =================================================================== */
export interface UserRole {
  id: number;
  label: string;
  /** Short description shown in the role dropdown. */
  hint: string;
}

export const USER_ROLES: UserRole[] = [
  { id: 1, label: 'Agent', hint: 'Handles tickets in the Social Inbox' },
  { id: 9, label: 'Team Lead', hint: 'Leads a team of agents' },
  { id: 3, label: 'Supervisor Agent', hint: 'Full account-settings access' },
  { id: 2, label: 'Customer Care', hint: 'Minimal analytics & inbox access' },
  { id: 8, label: 'Brand Account', hint: 'Inbox & publishing for a brand' },
  { id: 7, label: 'Account Configurator', hint: 'Configures all listening modules' },
  { id: 6, label: 'Read-Only Supervisor', hint: 'View-only supervisor access' },
];

/* ===================================================================
   Country codes
   =================================================================== */
export interface CountryCode {
  code: string;        // ISO-ish label e.g. "IND"
  dial: string;        // dial code e.g. "+91"
  /** Max national number length used for validation. */
  maxLen: number;
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: 'IND', dial: '+91', maxLen: 10 },
  { code: 'USA', dial: '+1', maxLen: 10 },
  { code: 'GBR', dial: '+44', maxLen: 10 },
  { code: 'UAE', dial: '+971', maxLen: 9 },
  { code: 'AUS', dial: '+61', maxLen: 9 },
  { code: 'SGP', dial: '+65', maxLen: 8 },
  { code: 'CAN', dial: '+1', maxLen: 10 },
  { code: 'DEU', dial: '+49', maxLen: 11 },
];

/* ===================================================================
   Brands, teams, skills
   =================================================================== */
export interface AssignableBrand {
  id: string;
  name: string;
  color: string;
}

export const ASSIGNABLE_BRANDS: AssignableBrand[] = [
  { id: 'b1', name: 'Amazon', color: '#ff9900' },
  { id: 'b2', name: 'Nike', color: '#0f172a' },
  { id: 'b3', name: 'Air India', color: '#c8102e' },
  { id: 'b4', name: 'Myntra', color: '#e91e63' },
  { id: 'b5', name: 'Zomato', color: '#ef4444' },
  { id: 'b6', name: 'Tata Cliq', color: '#2563eb' },
  { id: 'b7', name: 'Swiggy', color: '#fc8019' },
  { id: 'b8', name: 'Flipkart', color: '#2874f0' },
];

export interface Team {
  id: string;
  name: string;
}

export const TEAMS: Team[] = [
  { id: 't1', name: 'Customer Support — L1' },
  { id: 't2', name: 'Customer Support — L2' },
  { id: 't3', name: 'Escalations' },
  { id: 't4', name: 'Social Media' },
  { id: 't5', name: 'War Room' },
];

export interface Skill {
  id: string;
  name: string;
}

export const SKILLS: Skill[] = [
  { id: 's1', name: 'English' },
  { id: 's2', name: 'Hindi' },
  { id: 's3', name: 'Billing' },
  { id: 's4', name: 'Technical' },
  { id: 's5', name: 'Refunds' },
  { id: 's6', name: 'Onboarding' },
];

/* ===================================================================
   Channels & sub-channels
   =================================================================== */
export interface ChannelLeaf {
  id: string;
  name: string;
}

export interface ChannelGroup {
  id: string;
  name: string;
  /** Material Symbols glyph. */
  icon: string;
  /** True for channels that toggle the signature section (Email). */
  isEmail?: boolean;
  /** True for rating channels that toggle the rating section. */
  isRating?: 'playstore' | 'googlereview';
  children: ChannelLeaf[];
}

export const CHANNEL_GROUPS: ChannelGroup[] = [
  { id: 'g-tw', name: 'Twitter', icon: 'alternate_email', children: [
    { id: 'tw-men', name: 'Twitter Mentions' },
    { id: 'tw-dm', name: 'Twitter DM' },
  ] },
  { id: 'g-fb', name: 'Facebook', icon: 'thumb_up', children: [
    { id: 'fb-post', name: 'Facebook Posts' },
    { id: 'fb-com', name: 'Facebook Comments' },
    { id: 'fb-dm', name: 'Facebook DM' },
  ] },
  { id: 'g-ig', name: 'Instagram', icon: 'photo_camera', children: [
    { id: 'ig-post', name: 'Instagram Posts' },
    { id: 'ig-com', name: 'Instagram Comments' },
    { id: 'ig-dm', name: 'Instagram DM' },
  ] },
  { id: 'g-em', name: 'Email', icon: 'mail', isEmail: true, children: [
    { id: 'em-sup', name: 'Support Email' },
    { id: 'em-sal', name: 'Sales Email' },
  ] },
  { id: 'g-ps', name: 'Play Store', icon: 'shop', isRating: 'playstore', children: [
    { id: 'ps-rev', name: 'Play Store Reviews' },
  ] },
  { id: 'g-gr', name: 'Google Review', icon: 'reviews', isRating: 'googlereview', children: [
    { id: 'gr-rev', name: 'Google Reviews' },
  ] },
];

/* ===================================================================
   Configured incoming emails
   =================================================================== */
export interface ConfiguredEmail {
  id: string;
  address: string;
}

export const CONFIGURED_EMAILS: ConfiguredEmail[] = [
  { id: 'e1', address: 'support@brand.com' },
  { id: 'e2', address: 'help@brand.com' },
  { id: 'e3', address: 'care@brand.com' },
  { id: 'e4', address: 'feedback@brand.com' },
];

/* ===================================================================
   Notify users (new-user-only step)
   =================================================================== */
export const NOTIFY_USERS: string[] = [
  'aarav.mehta@brand.com', 'bhavna.rao@brand.com', 'chetan.iyer@brand.com',
  'deepika.nair@brand.com', 'esha.khan@brand.com', 'farhan.shaikh@brand.com',
];

/* ===================================================================
   Platform permission tree
   =================================================================== */
export interface PermissionChild {
  key: string;
  label: string;
  /** Optional info tooltip (e.g. masked-data warning). */
  info?: string;
}

export interface PermissionModule {
  key: string;
  label: string;
  /** "Response Dashboard" or "Account Settings". */
  group: 'Response Dashboard' | 'Account Settings';
  /** Material Symbols glyph for the platform chip. */
  icon: string;
  children: PermissionChild[];
}

export const PERMISSION_MODULES: PermissionModule[] = [
  // ---- Response Dashboard --------------------------------------------
  { key: 'analytics', label: 'Analytics', group: 'Response Dashboard', icon: 'insights', children: [
    { key: 'an-create', label: 'Create Dashboard' },
    { key: 'an-share', label: 'Share Dashboard' },
    { key: 'an-share-internal', label: 'Share Dashboard with Internal Team' },
    { key: 'an-share-public', label: 'Share Dashboard as Public Link' },
    { key: 'an-widget', label: 'Widget Maker' },
  ] },
  { key: 'reports', label: 'Reports', group: 'Response Dashboard', icon: 'description', children: [
    { key: 'rp-create', label: 'Create Report' },
    { key: 'rp-edit', label: 'Edit Report Template' },
  ] },
  { key: 'socialInbox', label: 'Social Inbox', group: 'Response Dashboard', icon: 'forum', children: [
    { key: 'si-like', label: 'Allow Like' },
    { key: 'si-del-lb', label: 'Allow Delete from Locobuzz' },
    { key: 'si-retweet', label: 'Allow Retweet (Only for Twitter)' },
    { key: 'si-hide', label: 'Allow Hide/Unhide (Only for Facebook)' },
    { key: 'si-del-sm', label: 'Allow Delete from Social Media' },
    { key: 'si-assign', label: 'Allow Assignment' },
    { key: 'si-masked', label: 'Allow to View Masked Data', info: 'Lets the user see unmasked PII such as phone numbers and emails.' },
    { key: 'si-ticket', label: 'Create New Ticket' },
    { key: 'si-escalate', label: 'Ticket Escalation' },
    { key: 'si-actionable', label: 'Make Non-actionable to Actionable' },
    { key: 'si-translate', label: 'Translate' },
    { key: 'si-reply', label: 'Reply' },
    { key: 'si-influencer', label: 'Mark Influencer' },
    { key: 'si-category', label: 'Assign Mention / Ticket Category' },
    { key: 'si-tab', label: 'Tab Creation' },
    { key: 'si-crm', label: 'CRM Integration' },
    { key: 'si-priority', label: 'Change Ticket Priority' },
    { key: 'si-personal', label: 'Edit Personal Details' },
    { key: 'si-chat', label: 'Chat Section' },
    { key: 'si-multi', label: 'Multiple Selection of Mentions/Tickets' },
    { key: 'si-emails', label: 'Send Emails to Locobuzz Users' },
    { key: 'si-block', label: 'Block/Unblock (Only for Twitter)' },
  ] },
  { key: 'tokenManagement', label: 'Token Management', group: 'Response Dashboard', icon: 'vpn_key', children: [
    { key: 'tm-add', label: 'Add Token' },
    { key: 'tm-refresh', label: 'Refresh Token' },
    { key: 'tm-delete', label: 'Delete Token' },
  ] },

  // ---- Account Settings ----------------------------------------------
  { key: 'dataConsumption', label: 'Data Consumption', group: 'Account Settings', icon: 'data_usage', children: [
    { key: 'dc-view', label: 'View Consumption' },
  ] },
  { key: 'manageBrands', label: 'Manage Brands', group: 'Account Settings', icon: 'storefront', children: [
    { key: 'mb-create', label: 'Create Brand' },
    { key: 'mb-edit', label: 'Edit Brand' },
    { key: 'mb-delete', label: 'Delete Brand' },
  ] },
  { key: 'manageUsers', label: 'Manage Users', group: 'Account Settings', icon: 'group', children: [
    { key: 'mu-create', label: 'Create User' },
    { key: 'mu-edit', label: 'Edit User' },
    { key: 'mu-delete', label: 'Delete User' },
  ] },
  { key: 'channelConfiguration', label: 'Channel Configuration', group: 'Account Settings', icon: 'settings_input_component', children: [
    { key: 'cc-add', label: 'Add Channel' },
    { key: 'cc-edit', label: 'Edit Channel' },
    { key: 'cc-delete', label: 'Delete Channel' },
  ] },
  { key: 'keywordConfiguration', label: 'Keywords Configuration', group: 'Account Settings', icon: 'key', children: [
    { key: 'kc-add', label: 'Add Keyword' },
    { key: 'kc-edit', label: 'Edit Keyword' },
  ] },
  { key: 'categoryMapping', label: 'Category Mapping', group: 'Account Settings', icon: 'category', children: [
    { key: 'cm-create', label: 'Create Category' },
    { key: 'cm-edit', label: 'Edit Category' },
  ] },
  { key: 'competitors', label: 'Competitors', group: 'Account Settings', icon: 'groups', children: [
    { key: 'cp-map', label: 'Map New Competitors' },
  ] },
  { key: 'alerts', label: 'Alerts', group: 'Account Settings', icon: 'notifications', children: [
    { key: 'al-create', label: 'Create New Alert' },
    { key: 'al-pause', label: 'Play/Pause Alerts' },
    { key: 'al-edit', label: 'Edit Alerts' },
    { key: 'al-delete', label: 'Delete Alerts' },
  ] },
  { key: 'publishSettings', label: 'Publish Settings', group: 'Account Settings', icon: 'send', children: [
    { key: 'pb-approval', label: 'Edit Users for Approval' },
  ] },
  { key: 'engagementFormula', label: 'Engagement Formula', group: 'Account Settings', icon: 'functions', children: [
    { key: 'ef-create', label: 'Create Formula' },
    { key: 'ef-edit', label: 'Edit Formula' },
    { key: 'ef-delete', label: 'Delete Formula' },
  ] },
  { key: 'tokenExpiryAlert', label: 'Token Expiry Alert', group: 'Account Settings', icon: 'timer', children: [
    { key: 'te-edit', label: "Edit Email Id's" },
  ] },
  { key: 'actionableNonActionable', label: 'Actionable / Non Actionable', group: 'Account Settings', icon: 'rule', children: [
    { key: 'na-actionable', label: 'Edit Actionable' },
    { key: 'na-nonactionable', label: 'Edit Non Actionable' },
    { key: 'na-custom', label: 'Add/Edit Customized' },
  ] },
  { key: 'teamManagement', label: 'Team Management', group: 'Account Settings', icon: 'groups_2', children: [
    { key: 'tg-create', label: 'Create Team' },
    { key: 'tg-edit', label: 'Edit Team' },
    { key: 'tg-delete', label: 'Delete Team' },
  ] },
  { key: 'viralAlerts', label: 'Viral Alerts', group: 'Account Settings', icon: 'trending_up', children: [
    { key: 'va-create', label: 'Create Viral Alert' },
    { key: 'va-pause', label: 'Play/Pause Viral Alerts' },
    { key: 'va-edit', label: 'Edit Viral Alerts' },
    { key: 'va-delete', label: 'Delete Viral Alerts' },
  ] },
  { key: 'manageSkills', label: 'Manage Skills', group: 'Account Settings', icon: 'psychology', children: [
    { key: 'ms-create', label: 'Create Skill' },
    { key: 'ms-edit', label: 'Edit Skill' },
    { key: 'ms-delete', label: 'Delete Skill' },
  ] },
];

/**
 * Default permission module keys pre-selected per role id.
 * Mirrors the role-driven posture of the real dialog (Agent = inbox-only,
 * Supervisor / Configurator = broad access, etc.).
 */
export const ROLE_DEFAULT_MODULES: Record<number, string[]> = {
  1: ['socialInbox'],                                                   // Agent
  9: ['analytics', 'reports', 'socialInbox'],                          // Team Lead
  2: ['analytics', 'reports', 'socialInbox'],                          // Customer Care
  8: ['socialInbox', 'publishSettings'],                              // Brand Account
  6: ['socialInbox'],                                                  // Read-Only Supervisor
  3: PERMISSION_MODULES.map(m => m.key),                               // Supervisor Agent — all
  7: PERMISSION_MODULES.map(m => m.key),                               // Account Configurator — all
};
