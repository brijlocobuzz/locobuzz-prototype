export interface TicketFolder {
  label: string;
  count: number;
  icon?: string;
  alert?: number;        // red "(n)" prefix
  children?: TicketFolder[];
  active?: boolean;
}

export interface TeamMember {
  name: string;
  initials: string;
  avatarColor: string;
  online: boolean;
  assigned: number;
  capacity: number;
  active?: boolean;
}

export const MY_TEAM: TeamMember[] = [
  { name: 'Sarah', initials: 'S', avatarColor: '#c2185b', online: true, assigned: 12, capacity: 20 },
  { name: 'Marcus', initials: 'M', avatarColor: '#37474f', online: true, assigned: 4, capacity: 15, active: true },
  { name: 'Amanda', initials: 'A', avatarColor: '#f9a825', online: true, assigned: 4, capacity: 20 },
  { name: 'David', initials: 'D', avatarColor: '#5c6bc0', online: false, assigned: 0, capacity: 15 },
  { name: 'Priya', initials: 'P', avatarColor: '#8d6e63', online: false, assigned: 0, capacity: 20 },
  { name: 'Alex', initials: 'A', avatarColor: '#42a5f5', online: true, assigned: 0, capacity: 18 },
];

export const TICKET_FOLDERS: TicketFolder[] = [
  { label: 'All Tickets', count: 95, icon: 'confirmation_number' },
  { label: 'Unassigned Tickets', count: 6, icon: 'person_off' },
  {
    label: 'Active Tickets', count: 91, active: true, icon: 'folder_open',
    children: [
      { label: 'Open', count: 91 },
      { label: 'On Hold', count: 0 },
      { label: 'Pending', count: 0 },
    ],
  },
  {
    label: 'Completed Tickets', count: 6, icon: 'folder',
    children: [
      { label: 'Awaiting', count: 2, alert: 2 },
      { label: 'Awaiting From Customer', count: 0 },
      { label: 'Closed Tickets', count: 4 },
    ],
  },
];

export interface Ticket {
  id: string;
  name: string;
  handle?: string;
  avatarColor: string;
  initials: string;
  network: 'facebook' | 'x' | 'instagram';
  group: number;              // participant count
  account: string;            // account the mention/DM landed on
  accountInitial: string;
  accountColor: string;
  brandTag: string;           // compact brand label shown on the card
  comments: number;
  priority: 'Urgent' | 'High' | 'Normal';
  sla: 'Breached' | 'Within SLA';
  age: string;                // e.g. "20 hr", "1 day"
  messageMention?: string;    // leading "@handle" shown in blue
  messageText: string;
  moderator?: string;         // "@ Name" — the Mention Category element
  ticketCategory?: string;
  aspectGroup?: string;
  aspect?: string;
  sentiment: { emoji: string; label: string; tone: 'negative' | 'neutral' | 'positive' };
  tags?: { label: string; tone: 'moderation' | 'category' }[];
  assigneeInitials: string;
  assigneeColor: string;
  unassigned?: boolean;
}

export const TICKETS: Ticket[] = [
  {
    id: '...872704', name: 'Sahal Khan', handle: 'Sahalkhan222', avatarColor: '#2e7d6b', initials: 'S',
    network: 'x', group: 1, account: 'KB Testing Acc', accountInitial: 'K', accountColor: '#3f51b5',
    brandTag: '97 QA TEst Br...', comments: 1, priority: 'Urgent', sla: 'Breached', age: '20 hr',
    messageMention: '@BalaskarKi37178', messageText: 'test 1:19',
    moderator: 'Vidya Sagar', ticketCategory: 'UnCategorized',
    aspectGroup: 'Food Services Test', aspect: 'Design',
    sentiment: { emoji: '😠', label: 'Negative', tone: 'negative' },
    tags: [{ label: 'Moderation', tone: 'moderation' }],
    assigneeInitials: 'NL', assigneeColor: '#c2185b',
  },
  {
    id: '...083328', name: 'Lenskart Support', handle: 'LenskartSupport', avatarColor: '#1a237e', initials: 'LS',
    network: 'x', group: 353, account: 'KB Testing Acc', accountInitial: 'K', accountColor: '#3f51b5',
    brandTag: '97 QA TEst Br...', comments: 1, priority: 'Urgent', sla: 'Breached', age: '21 hr',
    messageMention: '@BalaskarKi37178 @KB', messageText: 'Acc reply as DM',
    moderator: 'Vidya Sagar', ticketCategory: 'UnCategorized',
    aspectGroup: 'Order Management', aspect: 'Refund',
    sentiment: { emoji: '😐', label: 'Neutral', tone: 'neutral' },
    tags: [{ label: 'Moderation', tone: 'moderation' }],
    assigneeInitials: 'DA', assigneeColor: '#e65100',
  },
  {
    id: '...923200', name: 'राहुल परब', handle: 'RahulParab9070', avatarColor: '#8d6e63', initials: 'RP',
    network: 'x', group: 5, account: 'Sheetal Arenakeri', accountInitial: 'S', accountColor: '#d84315',
    brandTag: '97 QA TEst Br...', comments: 1, priority: 'Urgent', sla: 'Breached', age: '21 hr',
    messageMention: '@SArenakeri0206', messageText: 'Reply 11111',
    moderator: 'Vidya Sagar', ticketCategory: 'UnCategorized',
    aspectGroup: 'Customer Experience', aspect: 'Support',
    sentiment: { emoji: '😠', label: 'Negative', tone: 'negative' },
    tags: [{ label: 'Moderation', tone: 'moderation' }],
    assigneeInitials: 'DA', assigneeColor: '#e65100',
  },
  {
    id: '...445210', name: 'Sheetal Arenkeri', handle: 'Arenkeri1997', avatarColor: '#607d8b', initials: 'S',
    network: 'x', group: 0, account: 'Sheetal Arenakeri', accountInitial: 'S', accountColor: '#607d8b',
    brandTag: '97 QA TEst Br...', comments: 1, priority: 'Urgent', sla: 'Within SLA', age: '1 day',
    messageMention: '@SArenakeri0206', messageText: 'Hi 8:38',
    moderator: 'Vidya Sagar', ticketCategory: 'UnCategorized',
    aspectGroup: 'Engagement', aspect: 'Greeting',
    sentiment: { emoji: '😊', label: 'Positive', tone: 'positive' },
    tags: [{ label: 'Moderation', tone: 'moderation' }],
    assigneeInitials: '', assigneeColor: '', unassigned: true,
  },
  {
    id: '...551209', name: 'Priya Sharma', handle: 'PriyaSharma22', avatarColor: '#8e24aa', initials: 'PS',
    network: 'x', group: 2, account: 'KB Testing Acc', accountInitial: 'K', accountColor: '#3f51b5',
    brandTag: '97 QA TEst Br...', comments: 1, priority: 'Urgent', sla: 'Within SLA', age: '2 hr',
    messageMention: '@PriyaSharma22', messageText: 'Order still not delivered',
    moderator: 'Vidya Sagar', ticketCategory: 'UnCategorized',
    aspectGroup: 'Order Management', aspect: 'Delivery',
    sentiment: { emoji: '😠', label: 'Negative', tone: 'negative' },
    tags: [{ label: 'Moderation', tone: 'moderation' }],
    assigneeInitials: '', assigneeColor: '', unassigned: true,
  },
  {
    id: '...551210', name: 'Rohit Verma', handle: 'RohitV_09', avatarColor: '#00897b', initials: 'RV',
    network: 'x', group: 0, account: 'KB Testing Acc', accountInitial: 'K', accountColor: '#3f51b5',
    brandTag: '97 QA TEst Br...', comments: 1, priority: 'Urgent', sla: 'Within SLA', age: '3 hr',
    messageMention: '@RohitV_09', messageText: 'Need invoice copy please',
    moderator: 'Vidya Sagar', ticketCategory: 'UnCategorized',
    aspectGroup: 'Billing', aspect: 'Invoice',
    sentiment: { emoji: '😐', label: 'Neutral', tone: 'neutral' },
    tags: [{ label: 'Moderation', tone: 'moderation' }],
    assigneeInitials: '', assigneeColor: '', unassigned: true,
  },
  {
    id: '...551211', name: 'Sneha Iyer', handle: 'SnehaIyer', avatarColor: '#d81b60', initials: 'SI',
    network: 'x', group: 1, account: 'Sheetal Arenakeri', accountInitial: 'S', accountColor: '#d84315',
    brandTag: '97 QA TEst Br...', comments: 1, priority: 'Urgent', sla: 'Breached', age: '4 hr',
    messageMention: '@SnehaIyer', messageText: 'Loved the new packaging!',
    moderator: 'Vidya Sagar', ticketCategory: 'UnCategorized',
    aspectGroup: 'Engagement', aspect: 'Packaging',
    sentiment: { emoji: '😊', label: 'Positive', tone: 'positive' },
    tags: [{ label: 'Moderation', tone: 'moderation' }],
    assigneeInitials: '', assigneeColor: '', unassigned: true,
  },
  {
    id: '...551212', name: 'Karan Mehta', handle: 'KaranMehta7', avatarColor: '#3949ab', initials: 'KM',
    network: 'x', group: 0, account: 'KB Testing Acc', accountInitial: 'K', accountColor: '#3f51b5',
    brandTag: '97 QA TEst Br...', comments: 1, priority: 'Urgent', sla: 'Breached', age: '5 hr',
    messageMention: '@KaranMehta7', messageText: 'App keeps crashing on checkout',
    moderator: 'Vidya Sagar', ticketCategory: 'UnCategorized',
    aspectGroup: 'Technical', aspect: 'App Stability',
    sentiment: { emoji: '😠', label: 'Negative', tone: 'negative' },
    tags: [{ label: 'Moderation', tone: 'moderation' }],
    assigneeInitials: '', assigneeColor: '', unassigned: true,
  },
  {
    id: '...551213', name: 'Anjali Nair', handle: 'AnjaliNair', avatarColor: '#6d4c41', initials: 'AN',
    network: 'x', group: 3, account: 'Sheetal Arenakeri', accountInitial: 'S', accountColor: '#d84315',
    brandTag: '97 QA TEst Br...', comments: 1, priority: 'Urgent', sla: 'Within SLA', age: '6 hr',
    messageMention: '@AnjaliNair', messageText: 'Can you confirm my exchange request?',
    moderator: 'Vidya Sagar', ticketCategory: 'UnCategorized',
    aspectGroup: 'Order Management', aspect: 'Exchange',
    sentiment: { emoji: '😐', label: 'Neutral', tone: 'neutral' },
    tags: [{ label: 'Moderation', tone: 'moderation' }],
    assigneeInitials: '', assigneeColor: '', unassigned: true,
  },
];
