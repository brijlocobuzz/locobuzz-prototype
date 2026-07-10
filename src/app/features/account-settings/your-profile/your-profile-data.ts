/**
 * Data for the "Your Profile" (My Profile) screen.
 *
 * The permission grouping below is a 1:1 port of the shared LocoBuzz
 * Permissions prototype — same seven sections, the same capabilities, and
 * the same child permissions in the same order. Icons are mapped from the
 * prototype's lucide set onto the Material Symbols Rounded used across this
 * app, and `tone` drives the per-section accent colour.
 */

export type PermissionRisk = 'Sensitive' | 'High risk';

export interface PermissionCapability {
  id: string;
  name: string;
  note: string;
  risk?: PermissionRisk;
  /** Individual permissions shown as chips under the capability. */
  children: string[];
  /** Whether this capability is granted to the Agent role (Admin gets all). */
  agent?: boolean;
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
      {
        id: 'dashboard-work',
        name: 'Dashboard work',
        note: 'Create dashboards and add custom widgets.',
        agent: true,
        children: ['Create Dashboard', 'Custom Widgets'],
      },
      {
        id: 'dashboard-sharing',
        name: 'Dashboard sharing',
        note: 'Public links remain separate because they expose data outside the team.',
        risk: 'Sensitive',
        children: ['Share Dashboard', 'Share Dashboard with Internal Team', 'Share Dashboard as Public Link'],
      },
      {
        id: 'reports',
        name: 'Reports',
        note: 'Create reports and update report templates.',
        agent: true,
        children: ['Create Report', 'Edit Report Template'],
      },
    ],
  },
  {
    id: 'social-inbox',
    name: 'Social Inbox Operations',
    icon: 'forum',
    tone: 'teal',
    description: 'Ticket lifecycle, response, moderation, and profile access.',
    capabilities: [
      {
        id: 'ticket-lifecycle',
        name: 'Ticket lifecycle',
        note: 'Supervisor style controls for ticket status and urgency.',
        agent: true,
        children: ['Create New Ticket', 'Reopen Ticket', 'Ticket Escalation', 'Change Ticket Priority', 'Make Non-actionable to Actionable'],
      },
      {
        id: 'assignment-classification',
        name: 'Assignment and classification',
        note: 'Ownership, categories, notes, and bulk selection.',
        agent: true,
        children: ['Allow Assignment', 'Assign Mention / Ticket Category', 'Edit Notes', 'Multiple Selection of Mentions/Tickets'],
      },
      {
        id: 'reply-assist',
        name: 'Reply and agent assist',
        note: 'Agent response tools, translation, email, and AI disposition.',
        agent: true,
        children: ['Reply', 'Translate', 'Chat Section', 'Send Emails to LocoBuzz Users', 'Allow AI Disposition'],
      },
      {
        id: 'network-actions',
        name: 'Social network actions',
        note: 'Channel-native engagement actions.',
        agent: true,
        children: ['Allow Like', 'Allow Retweet', 'Block/Unblock', 'Follow/Unfollow', 'Mute/Unmute'],
      },
      {
        id: 'moderation-delete',
        name: 'Moderation and deletion',
        note: 'Deleting from LocoBuzz and deleting from social media are kept separate.',
        risk: 'High risk',
        children: ['Allow Hide/Unhide', 'Allow Delete from LocoBuzz', 'Allow Delete from Social Media'],
      },
      {
        id: 'customer-profile',
        name: 'Customer profile and privacy',
        note: 'Sensitive customer data and CRM/profile controls.',
        risk: 'Sensitive',
        children: ['Allow to View Masked Data', 'Edit Personal Details', 'CRM Integration', 'Mark Influencer'],
      },
      {
        id: 'workspace-setup',
        name: 'Inbox workspace setup',
        note: 'Workspace configuration for inbox tabs.',
        children: ['Tab Creation'],
      },
    ],
  },
  {
    id: 'brand-listening',
    name: 'Brand, Listening & Taxonomy Setup',
    icon: 'apartment',
    tone: 'indigo',
    description: 'Brand setup, channels, listening keywords, categories, and competitors.',
    capabilities: [
      {
        id: 'brand-admin',
        name: 'Brand administration',
        note: 'Brand CRUD actions. Delete remains destructive.',
        risk: 'High risk',
        children: ['Add Brand', 'Edit Brand', 'Delete Brand'],
      },
      {
        id: 'channel-admin',
        name: 'Channel administration',
        note: 'Connections and listening data collection settings.',
        children: ['Add Channel', 'Pause Channel Listening', 'Edit Sub-Channel Data Collection', 'Enable Historic Data Collection'],
      },
      {
        id: 'keyword-admin',
        name: 'Keyword administration',
        note: 'Real-time and historic listening keyword setup.',
        children: ['Add Real Time Keywords', 'Add Historic Keywords', 'Pause Keyword Listening'],
      },
      {
        id: 'category-taxonomy',
        name: 'Category and taxonomy',
        note: 'Category structure, imports, catch-all, and strict checking.',
        children: ['Create New Category', 'Enable/Disable Skip Strict Checking', 'Import Excel', 'Change Catch-All Category', 'Create Upper Category'],
      },
      {
        id: 'competitors',
        name: 'Competitor setup',
        note: 'Map competitors for comparison views.',
        children: ['Map New Competitors'],
      },
    ],
  },
  {
    id: 'governance',
    name: 'Governance, Users & Teams',
    icon: 'verified_user',
    tone: 'amber',
    description: 'User access, MFA, reassignment, and team administration.',
    capabilities: [
      {
        id: 'user-admin',
        name: 'User administration',
        note: 'User CRUD actions and access status.',
        risk: 'High risk',
        children: ['Add User', 'Edit User', 'Delete User', 'User Enable/Disable'],
      },
      {
        id: 'security-reassignment',
        name: 'Security and reassignment',
        note: 'Security policy and ticket ownership controls.',
        risk: 'Sensitive',
        children: ['MFA Access', 'Ticket Re-Assignment Enable/Disable'],
      },
      {
        id: 'team-management',
        name: 'Team management',
        note: 'Team CRUD actions.',
        children: ['Create Team', 'Edit Team', 'Delete Team'],
      },
    ],
  },
  {
    id: 'automation',
    name: 'Automation & Notifications',
    icon: 'notifications',
    tone: 'violet',
    description: 'Alerts, viral alerts, and token expiry recipients.',
    capabilities: [
      {
        id: 'alerts',
        name: 'Alerts',
        note: 'Create, pause, edit, and delete alert rules.',
        children: ['Create New Alert', 'Play/Pause Alerts', 'Edit Alerts', 'Delete Alerts'],
      },
      {
        id: 'viral-alerts',
        name: 'Viral alerts',
        note: 'Create, pause, edit, and delete viral alert rules.',
        children: ['Create Viral Alert', 'Play/Pause Viral Alerts', 'Edit Viral Alerts', 'Delete Viral Alerts'],
      },
      {
        id: 'token-expiry',
        name: 'Token expiry recipients',
        note: 'Recipient list for token expiry emails.',
        children: ['Edit Token Expiry Recipients'],
      },
    ],
  },
  {
    id: 'response-rules',
    name: 'Response, Publishing & Rules',
    icon: 'layers',
    tone: 'green',
    description: 'Publishing approvers, formulas, and actionability rules.',
    capabilities: [
      {
        id: 'approval-routing',
        name: 'Approval routing',
        note: 'Publishing approval users.',
        children: ['Manage Publishing Approvers'],
      },
      {
        id: 'engagement-formula',
        name: 'Engagement formula',
        note: 'Create, edit, and delete formulas.',
        children: ['Create Formula', 'Edit Formula', 'Delete Formula'],
      },
      {
        id: 'actionability-rules',
        name: 'Actionability rules',
        note: 'Actionable, non-actionable, and custom response rules.',
        children: ['Edit Actionable', 'Edit Non-actionable', 'Add/Edit Customized'],
      },
    ],
  },
  {
    id: 'quota',
    name: 'Quotas & Data Limits',
    icon: 'database',
    tone: 'slate',
    description: 'Quota increase requests for data consumption.',
    capabilities: [
      {
        id: 'quota-request',
        name: 'Quota requests',
        note: 'Request-only permission. It does not change quota instantly.',
        agent: true,
        children: ['More Quota Request'],
      },
    ],
  },
];

export interface Brand {
  id: string;
  name: string;
  domain: string;
}

/**
 * A large, realistic-looking brand catalogue for the "Manage brands" dialog.
 * The six real brands (with real ids + domains) keep the assigned-brands and
 * sidebar views intact; the rest are generated quirky test-brand names so the
 * list scrolls and the counter reads at real scale.
 */
const REAL_BRANDS: Brand[] = [
  { id: 'amazon', name: 'Amazon', domain: 'amazon.in' },
  { id: 'ajio', name: 'Ajio', domain: 'ajio.com' },
  { id: 'airindia', name: 'Air India', domain: 'airindia.com' },
  { id: 'myntra', name: 'Myntra', domain: 'myntra.com' },
  { id: 'zomato', name: 'Zomato', domain: 'zomato.com' },
  { id: 'tata', name: 'Tata Cliq', domain: 'tatacliq.com' },
];

const BRAND_SEED: string[] = [
  '1 97 QA TEst brand', '23AugustBrand', 'abc brand', 'acchcawalabug', 'ACT UAT',
  'Action', 'ActionabiltyTestBrand', 'Actiuonableeee', 'Ads Testing',
  'Ak test77', 'akakak', 'Akash Test', 'Akashauto1', 'Flipkart', 'Swiggy',
  'Nykaa', 'Ola Cabs', 'BigBasket', 'PhonePe', 'Paytm Retail', 'Croma',
  'Reliance Digital', 'Blinkit Demo', 'Zepto QA', 'Meesho Labs',
  'Urban Company', 'Lenskart Beta', 'BoAt Audio', 'Mamaearth',
  'Sugar Cosmetics', 'Wow Skin', 'CureFit', 'Cred Test', 'Groww Sandbox',
  'Zerodha UAT', 'Razorpay Demo', 'Dunzo Old',
];

const EXTRA_PREFIX = ['QA', 'UAT', 'Demo', 'Retail', 'Auto', 'Prod', 'Beta', 'Nova', 'Zeta', 'Acme', 'Metro', 'Prime', 'Insta', 'Hyper', 'Omni', 'Peak', 'Vivid', 'Urban', 'Bold', 'Swift'];
const EXTRA_BASE = ['Brand', 'Store', 'Labs', 'Cart', 'Mart', 'Care', 'Media', 'Group', 'Works', 'Hub', 'Line', 'Buzz', 'Wave', 'Point', 'Nest', 'Kart', 'Zone', 'Bay', 'Craft', 'Pulse'];

function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function buildBrands(): Brand[] {
  const names: string[] = [...BRAND_SEED];
  outer: for (let p = 0; p < EXTRA_PREFIX.length; p++) {
    for (let b = 0; b < EXTRA_BASE.length; b++) {
      names.push(`${EXTRA_PREFIX[p]} ${EXTRA_BASE[b]}`);
      if (REAL_BRANDS.length + names.length >= 363) break outer;
    }
  }
  const generated = names.map((name, i) => ({ id: `b${i}`, name, domain: `${slug(name)}.com` }));
  return [...REAL_BRANDS, ...generated].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
}

export const BRANDS: Brand[] = buildBrands();
