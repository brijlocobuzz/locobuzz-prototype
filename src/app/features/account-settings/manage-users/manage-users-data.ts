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
  /** Whether this user can sign in via the configured SSO org (work email). */
  ssoEnabled?: boolean;

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
  {
    id: 'u7', firstName: 'Gauri', lastName: 'Deshmukh', username: 'gauri_agent', email: 'gauri.deshmukh@brand.com',
    role: 'Agent', color: '#8b5cf6', brands: 2, active: true,
    gender: 'Female', contact: '+91 98201 33445', supervisorAdmin: false,
    brandList: [{ name: 'Swiggy', color: '#fc8019' }, { name: 'Zomato', color: '#ef4444' }],
    team: 'Customer Support — L1', skills: ['English', 'Marathi'],
    channelIds: ['facebook', 'instagram', 'whatsapp'],
    permissions: ['Response Dashboard'],
    signature: 'Thanks,\nGauri',
  },
  {
    id: 'u8', firstName: 'Harsh', lastName: 'Patel', username: 'harsh_tl', email: 'harsh.patel@brand.com',
    role: 'Team Lead', color: '#0891b2', brands: 5, active: true,
    gender: 'Male', contact: '+91 99304 56677', supervisorAdmin: false,
    brandList: [{ name: 'Flipkart', color: '#2874f0' }, { name: 'Tata Cliq', color: '#2563eb' }, { name: 'Myntra', color: '#e91e63' }],
    team: 'Escalations', skills: ['English', 'Hindi', 'Billing'],
    channelIds: ['twitter', 'facebook', 'email', 'gmb'],
    permissions: ['Response Dashboard', 'Analytics'],
    signature: 'Regards,\nHarsh Patel · Team Lead',
  },
  {
    id: 'u9', firstName: 'Ishita', lastName: 'Verma', username: 'ishita_ro', email: 'ishita.verma@brand.com',
    role: 'Read-Only Supervisor', color: '#db2777', brands: 7, active: false,
    gender: 'Female', contact: '+91 90041 78899', supervisorAdmin: false,
    brandList: [{ name: 'Amazon', color: '#ff9900' }, { name: 'Nike', color: '#0f172a' }],
    team: 'War Room', skills: ['English'],
    channelIds: ['twitter', 'facebook', 'instagram', 'youtube'],
    permissions: ['Response Dashboard', 'Reports'],
    signature: 'Regards,\nIshita',
  },
  {
    id: 'u10', firstName: 'Jatin', lastName: 'Malhotra', username: 'jatin_cc', email: 'jatin.malhotra@brand.com',
    role: 'Customer Care', color: '#16a34a', brands: 3, active: true,
    gender: 'Male', contact: '+91 98766 90011', supervisorAdmin: false,
    brandList: [{ name: 'Air India', color: '#c8102e' }, { name: 'Swiggy', color: '#fc8019' }],
    team: 'Customer Support — L2', skills: ['English', 'Hindi', 'Refunds'],
    channelIds: ['facebook', 'instagram', 'email'],
    permissions: ['Response Dashboard'],
    signature: 'Warm regards,\nJatin',
  },
  {
    id: 'u11', firstName: 'Kavya', lastName: 'Reddy', username: 'kavya_brand', email: 'kavya.reddy@brand.com',
    role: 'Brand Account', color: '#ea580c', brands: 4, active: true,
    gender: 'Female', contact: '+91 95551 23344', supervisorAdmin: false,
    brandList: [{ name: 'Myntra', color: '#e91e63' }, { name: 'Tata Cliq', color: '#2563eb' }],
    team: 'Social Media', skills: ['English', 'Telugu'],
    channelIds: ['instagram', 'facebook', 'twitter', 'linkedin'],
    permissions: ['Response Dashboard', 'Reports'],
    signature: 'Cheers,\nKavya Reddy',
  },
  {
    id: 'u12', firstName: 'Lakshay', lastName: 'Bansal', username: 'lakshay_cfg', email: 'lakshay.bansal@brand.com',
    role: 'Account Configurator', color: '#2563eb', brands: 11, active: true,
    gender: 'Male', contact: '+91 97001 45566', supervisorAdmin: true,
    brandList: [{ name: 'Amazon', color: '#ff9900' }, { name: 'Flipkart', color: '#2874f0' }, { name: 'Nike', color: '#0f172a' }],
    team: 'War Room', skills: ['English', 'Technical', 'Hindi'],
    channelIds: ['twitter', 'facebook', 'instagram', 'email', 'playstore', 'gmb', 'reddit'],
    permissions: ['Response Dashboard', 'Account Settings', 'Analytics', 'Reports'],
    signature: 'Best,\nLakshay Bansal · Configurator',
  },
  {
    id: 'u13', firstName: 'Meera', lastName: 'Joshi', username: 'meera_sup', email: 'meera.joshi@brand.com',
    role: 'Supervisor Agent', color: '#7c3aed', brands: 8, active: true,
    gender: 'Female', contact: '+91 98202 67788', supervisorAdmin: true,
    brandList: [{ name: 'Zomato', color: '#ef4444' }, { name: 'Swiggy', color: '#fc8019' }, { name: 'Myntra', color: '#e91e63' }],
    team: 'Escalations', skills: ['English', 'Hindi', 'Escalations'],
    channelIds: ['twitter', 'facebook', 'instagram', 'email', 'whatsapp'],
    permissions: ['Response Dashboard', 'Account Settings', 'Analytics', 'Reports'],
    signature: 'Regards,\nMeera Joshi · Supervisor',
  },
  {
    id: 'u14', firstName: 'Nikhil', lastName: 'Agarwal', username: 'nikhil_agent', email: 'nikhil.agarwal@brand.com',
    role: 'Agent', color: '#0d9488', brands: 1, active: false,
    gender: 'Male', contact: '+91 99305 88990', supervisorAdmin: false,
    brandList: [{ name: 'Tata Cliq', color: '#2563eb' }],
    team: 'Customer Support — L1', skills: ['English'],
    channelIds: ['facebook', 'email'],
    permissions: ['Response Dashboard'],
    signature: 'Thanks,\nNikhil',
  },
  {
    id: 'u15', firstName: 'Priya', lastName: 'Sharma', username: 'priya_tl', email: 'priya.sharma@brand.com',
    role: 'Team Lead', color: '#c026d3', brands: 6, active: true,
    gender: 'Female', contact: '+91 90042 11223', supervisorAdmin: false,
    brandList: [{ name: 'Nike', color: '#0f172a' }, { name: 'Amazon', color: '#ff9900' }, { name: 'Air India', color: '#c8102e' }],
    team: 'Social Media', skills: ['English', 'Hindi', 'Onboarding'],
    channelIds: ['twitter', 'facebook', 'instagram', 'gmb'],
    permissions: ['Response Dashboard', 'Analytics'],
    signature: 'Regards,\nPriya Sharma · Team Lead',
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
   Platform permissions — seven tonal groups (1:1 with Your Profile)
   Each group → capabilities → individual child permissions.
   =================================================================== */
export type PermissionRisk = 'Sensitive' | 'High risk';

export interface PermissionCapability {
  id: string;
  name: string;
  note: string;
  risk?: PermissionRisk;
  /** Individual permissions toggled under the capability. */
  children: string[];
}

export interface PermissionGroup {
  id: string;
  name: string;
  /** Material Symbols Rounded glyph. */
  icon: string;
  tone: 'blue' | 'teal' | 'indigo' | 'amber' | 'violet' | 'green' | 'slate';
  description: string;
  capabilities: PermissionCapability[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: 'insights',
    name: 'Insights & Reporting',
    icon: 'bar_chart',
    tone: 'blue',
    description: 'Dashboards, widgets, reports, and sharing controls.',
    capabilities: [
      { id: 'dashboard-work', name: 'Dashboard work', note: 'Create dashboards and add custom widgets.',
        children: ['Create Dashboard', 'Custom Widgets'] },
      { id: 'dashboard-sharing', name: 'Dashboard sharing', note: 'Public links remain separate because they expose data outside the team.', risk: 'Sensitive',
        children: ['Share Dashboard', 'Share Dashboard with Internal Team', 'Share Dashboard as Public Link'] },
      { id: 'reports', name: 'Reports', note: 'Create reports and update report templates.',
        children: ['Create Report', 'Edit Report Template'] },
    ],
  },
  {
    id: 'social-inbox',
    name: 'Social Inbox Operations',
    icon: 'forum',
    tone: 'teal',
    description: 'Ticket lifecycle, response, moderation, and profile access.',
    capabilities: [
      { id: 'ticket-lifecycle', name: 'Ticket lifecycle', note: 'Supervisor style controls for ticket status and urgency.',
        children: ['Create New Ticket', 'Reopen Ticket', 'Ticket Escalation', 'Change Ticket Priority', 'Make Non-actionable to Actionable'] },
      { id: 'assignment-classification', name: 'Assignment and classification', note: 'Ownership, categories, notes, and bulk selection.',
        children: ['Allow Assignment', 'Assign Mention / Ticket Category', 'Edit Notes', 'Multiple Selection of Mentions/Tickets'] },
      { id: 'reply-assist', name: 'Reply and agent assist', note: 'Agent response tools, translation, email, and AI disposition.',
        children: ['Reply', 'Translate', 'Chat Section', 'Send Emails to LocoBuzz Users', 'Allow AI Disposition'] },
      { id: 'network-actions', name: 'Social network actions', note: 'Channel-native engagement actions.',
        children: ['Allow Like', 'Allow Retweet', 'Block/Unblock', 'Follow/Unfollow', 'Mute/Unmute'] },
      { id: 'moderation-delete', name: 'Moderation and deletion', note: 'Deleting from LocoBuzz and deleting from social media are kept separate.', risk: 'High risk',
        children: ['Allow Hide/Unhide', 'Allow Delete from LocoBuzz', 'Allow Delete from Social Media'] },
      { id: 'customer-profile', name: 'Customer profile and privacy', note: 'Sensitive customer data and CRM/profile controls.', risk: 'Sensitive',
        children: ['Allow to View Masked Data', 'Edit Personal Details', 'CRM Integration', 'Mark Influencer'] },
      { id: 'workspace-setup', name: 'Inbox workspace setup', note: 'Workspace configuration for inbox tabs.',
        children: ['Tab Creation'] },
    ],
  },
  {
    id: 'brand-listening',
    name: 'Brand, Listening & Taxonomy Setup',
    icon: 'apartment',
    tone: 'indigo',
    description: 'Brand setup, channels, listening keywords, categories, and competitors.',
    capabilities: [
      { id: 'brand-admin', name: 'Brand administration', note: 'Brand CRUD actions. Delete remains destructive.', risk: 'High risk',
        children: ['Add Brand', 'Edit Brand', 'Delete Brand'] },
      { id: 'channel-admin', name: 'Channel administration', note: 'Connections and listening data collection settings.',
        children: ['Add Channel', 'Pause Channel Listening', 'Edit Sub-Channel Data Collection', 'Enable Historic Data Collection'] },
      { id: 'keyword-admin', name: 'Keyword administration', note: 'Real-time and historic listening keyword setup.',
        children: ['Add Real Time Keywords', 'Add Historic Keywords', 'Pause Keyword Listening'] },
      { id: 'category-taxonomy', name: 'Category and taxonomy', note: 'Category structure, imports, catch-all, and strict checking.',
        children: ['Create New Category', 'Enable/Disable Skip Strict Checking', 'Import Excel', 'Change Catch-All Category', 'Create Upper Category'] },
      { id: 'competitors', name: 'Competitor setup', note: 'Map competitors for comparison views.',
        children: ['Map New Competitors'] },
    ],
  },
  {
    id: 'governance',
    name: 'Governance, Users & Teams',
    icon: 'verified_user',
    tone: 'amber',
    description: 'User access, MFA, reassignment, and team administration.',
    capabilities: [
      { id: 'user-admin', name: 'User administration', note: 'User CRUD actions and access status.', risk: 'High risk',
        children: ['Add User', 'Edit User', 'Delete User', 'User Enable/Disable'] },
      { id: 'security-reassignment', name: 'Security and reassignment', note: 'Security policy and ticket ownership controls.', risk: 'Sensitive',
        children: ['MFA Access', 'Ticket Re-Assignment Enable/Disable'] },
      { id: 'team-management', name: 'Team management', note: 'Team CRUD actions.',
        children: ['Create Team', 'Edit Team', 'Delete Team'] },
    ],
  },
  {
    id: 'automation',
    name: 'Automation & Notifications',
    icon: 'notifications',
    tone: 'violet',
    description: 'Alerts, viral alerts, and token expiry recipients.',
    capabilities: [
      { id: 'alerts', name: 'Alerts', note: 'Create, pause, edit, and delete alert rules.',
        children: ['Create New Alert', 'Play/Pause Alerts', 'Edit Alerts', 'Delete Alerts'] },
      { id: 'viral-alerts', name: 'Viral alerts', note: 'Create, pause, edit, and delete viral alert rules.',
        children: ['Create Viral Alert', 'Play/Pause Viral Alerts', 'Edit Viral Alerts', 'Delete Viral Alerts'] },
      { id: 'token-expiry', name: 'Token expiry recipients', note: 'Recipient list for token expiry emails.',
        children: ['Edit Token Expiry Recipients'] },
    ],
  },
  {
    id: 'response-rules',
    name: 'Response, Publishing & Rules',
    icon: 'layers',
    tone: 'green',
    description: 'Publishing approvers, formulas, and actionability rules.',
    capabilities: [
      { id: 'approval-routing', name: 'Approval routing', note: 'Publishing approval users.',
        children: ['Manage Publishing Approvers'] },
      { id: 'engagement-formula', name: 'Engagement formula', note: 'Create, edit, and delete formulas.',
        children: ['Create Formula', 'Edit Formula', 'Delete Formula'] },
      { id: 'actionability-rules', name: 'Actionability rules', note: 'Actionable, non-actionable, and custom response rules.',
        children: ['Edit Actionable', 'Edit Non-actionable', 'Add/Edit Customized'] },
    ],
  },
  {
    id: 'quota',
    name: 'Quotas & Data Limits',
    icon: 'database',
    tone: 'slate',
    description: 'Quota increase requests for data consumption.',
    capabilities: [
      { id: 'quota-request', name: 'Quota requests', note: 'Request-only permission. It does not change quota instantly.',
        children: ['More Quota Request'] },
    ],
  },
];

/**
 * Default permission-group ids pre-selected per role id.
 * Mirrors the role-driven posture of the real dialog (Agent = inbox-only,
 * Supervisor / Configurator = broad access, etc.).
 */
export const ROLE_DEFAULT_GROUPS: Record<number, string[]> = {
  1: ['social-inbox'],                                                  // Agent
  9: ['insights', 'social-inbox'],                                      // Team Lead
  2: ['insights', 'social-inbox'],                                      // Customer Care
  8: ['social-inbox', 'response-rules'],                                // Brand Account
  6: ['social-inbox'],                                                  // Read-Only Supervisor
  3: PERMISSION_GROUPS.map(g => g.id),                                  // Supervisor Agent — all
  7: PERMISSION_GROUPS.map(g => g.id),                                  // Account Configurator — all
};
