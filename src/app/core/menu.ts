export interface NavItem {
  label: string;
  icon: string;        // Material Symbols Rounded ligature
  route: string;
  badge?: string;      // e.g. "999+"
}

/**
 * Primary left-rail navigation — the featured top-level menus shown directly
 * on the rail (as in the live CX Suite). The rest live under "more".
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Tickets',        icon: 'confirmation_number', route: '/social-inbox',  badge: '91' },
  { label: 'Mentions',       icon: 'alternate_email',     route: '/mention-inbox', badge: '999+' },
  { label: 'Analytics',      icon: 'bar_chart',           route: '/analytics' },
  { label: 'Reports',        icon: 'description',         route: '/reports' },
  { label: 'Chat With Data', icon: 'smart_toy',           route: '/chat-with-data' },
];

/** Overflow menus, revealed by the "more" (grid) rail button. */
export const MORE_ITEMS: NavItem[] = [
  { label: 'Social Scheduling', icon: 'calendar_month', route: '/social-schedule' },
  { label: 'UGC',               icon: 'collections',    route: '/ugc' },
  { label: 'Export Data',       icon: 'download',       route: '/export-data' },
  { label: 'Bulk Actions',      icon: 'checklist',      route: '/bulk-action' },
  { label: 'Campaign',          icon: 'campaign',       route: '/campaign' },
  { label: 'Miscellaneous',     icon: 'more_horiz',     route: '/miscellaneous' },
];

/** All rail-reachable menus (used for label/icon lookups). */
export const ALL_NAV_ITEMS: NavItem[] = [...NAV_ITEMS, ...MORE_ITEMS];
