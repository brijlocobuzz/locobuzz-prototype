export interface AccountNavItem {
  label: string;
  icon: string;
  route?: string;       // leaf slug under /account-settings
  expandable?: boolean;
  children?: AccountNavItem[];
}

/**
 * Left navigation for the Account Settings screen.
 * Mapped from the "Accounts" (menuId 10) group of the CX Suite menu config,
 * grouped by its section parents (Account Settings, Listening Settings, etc.).
 */
export const ACCOUNT_NAV: AccountNavItem[] = [
  { label: 'Your Profile', icon: 'person', route: 'your-profile' },

  {
    label: 'Account Settings', icon: 'manage_accounts', expandable: true,
    children: [
      {
        label: 'Data Consumption', icon: 'data_usage', expandable: true,
        children: [
          { label: 'Consumption', icon: 'fiber_manual_record', route: 'data-consumption/consumption' },
          { label: 'Consumption Alert', icon: 'fiber_manual_record', route: 'data-consumption/consumption-alert' },
        ],
      },
      { label: 'Manage Brands', icon: 'storefront', route: 'manage-brands' },
      { label: 'Manage Users', icon: 'group', route: 'manage-users' },
    ],
  },

  {
    label: 'Listening Settings', icon: 'graphic_eq', expandable: true,
    children: [
      { label: 'Alerts Manager', icon: 'notifications', route: 'alerts-manager' },
      { label: 'Channel Configuration', icon: 'settings_input_component', route: 'channel-configuration' },
      { label: 'Keywords Configuration', icon: 'key', route: 'keywords-configuration' },
      { label: 'Category Mapping', icon: 'category', route: 'category-mapping' },
      { label: 'Competitors', icon: 'groups', route: 'competitors' },
      { label: 'Alert', icon: 'notifications_active', route: 'alert' },
      { label: 'Publish Setting', icon: 'send', route: 'publish-setting' },
      { label: 'Location Profile', icon: 'location_on', route: 'location-profile' },
      { label: 'Token Management', icon: 'vpn_key', route: 'token-management' },
    ],
  },

  {
    label: 'Adv. Listening Settings', icon: 'tune', expandable: true,
    children: [
      { label: 'Custom Formulas', icon: 'functions', route: 'custom-formulas' },
      { label: 'Logical Grouping', icon: 'account_tree', route: 'logical-grouping' },
      { label: 'Notification', icon: 'campaign', route: 'notification' },
      { label: 'Influencer Configuration', icon: 'star', route: 'influencer-configuration' },
      { label: 'Token Expiry Alert', icon: 'timer', route: 'token-expiry-alert' },
      { label: 'Translate API', icon: 'translate', route: 'translate-api' },
    ],
  },

  {
    label: 'Response Management', icon: 'support_agent', expandable: true,
    children: [
      { label: 'Actionable / Non Actionable', icon: 'rule', route: 'actionable-nonactionable' },
      { label: 'Queue Configuration', icon: 'queue', route: 'queue-configuration' },
      { label: 'Canned Responses', icon: 'quickreply', route: 'canned-responses' },
      { label: 'Agent Signature', icon: 'draw', route: 'agent-signature' },
      { label: 'SLA Breach', icon: 'timer_off', route: 'sla-breach' },
      { label: 'Autoclosure Settings', icon: 'lock_clock', route: 'autoclosure-settings' },
      { label: 'Personal Details Settings', icon: 'badge', route: 'personal-details-settings' },
      { label: 'Survey Form', icon: 'assignment', route: 'survey-form' },
      { label: 'Custom Ticket Fields', icon: 'dynamic_form', route: 'custom-ticket-fields' },
    ],
  },

  {
    label: 'Adv. Response Management', icon: 'engineering', expandable: true,
    children: [
      { label: 'Agent Queue Management', icon: 'headset_mic', route: 'agent-queue-management' },
      { label: 'Priority Configuration', icon: 'priority_high', route: 'priority-configuration' },
      { label: 'Language Filter', icon: 'filter_alt', route: 'language-filter' },
      { label: 'Email Setting', icon: 'mail', route: 'email-setting' },
      { label: 'Escalation Emails', icon: 'outgoing_mail', route: 'escalation-emails' },
      { label: 'Holiday Calendar', icon: 'event', route: 'holiday-calendar' },
      { label: 'UGC Settings', icon: 'collections', route: 'ugc-settings' },
      { label: 'Messaging Window Settings', icon: 'chat', route: 'messaging-window-settings' },
      { label: 'Create Manual Ticket', icon: 'add_box', route: 'create-manual-ticket' },
      { label: 'Advance Ticket Setting', icon: 'settings_suggest', route: 'advance-ticket-setting' },
      { label: 'Ticket Disposition', icon: 'fact_check', route: 'ticket-disposition' },
      { label: 'Reply Tag User Setting', icon: 'alternate_email', route: 'reply-tag-user-setting' },
    ],
  },

  {
    label: 'Response Teams', icon: 'diversity_3', expandable: true,
    children: [
      { label: 'Manage Agent Skills', icon: 'psychology', route: 'manage-agent-skills' },
      { label: 'Team Management', icon: 'groups_2', route: 'team-management' },
      { label: 'Maker Checker', icon: 'verified', route: 'maker-checker' },
    ],
  },

  {
    label: 'Premium Features', icon: 'workspace_premium', expandable: true,
    children: [
      { label: 'Feedback / Survey Form', icon: 'reviews', route: 'feedback-nps' },
      { label: 'Viral Alerts', icon: 'trending_up', route: 'viral-alerts' },
      { label: 'CRM Integration', icon: 'hub', route: 'crm-integration' },
      { label: 'AI Ticket Intelligence', icon: 'auto_awesome', route: 'ai-ticket-intelligence' },
      { label: 'Response Genie', icon: 'auto_fix_high', route: 'response-genie' },
      { label: 'WorkFlow Automation', icon: 'schema', route: 'workflow-automation' },
      { label: 'Signal Sense', icon: 'sensors', route: 'signal-sense' },
      { label: 'Agent IQ', icon: 'insights', route: 'agent-iq' },
      { label: 'Aspect Group Management', icon: 'workspaces', route: 'aspect-group-management' },
      { label: 'Credit System', icon: 'paid', route: 'credit-system' },
    ],
  },
];
