export interface TicketFolder {
  label: string;
  count: number;
  alert?: number;        // red "(n)" prefix
  children?: TicketFolder[];
  active?: boolean;
}

export const TICKET_FOLDERS: TicketFolder[] = [
  { label: 'All Tickets', count: 1397 },
  { label: 'Unassigned Tickets', count: 1288 },
  {
    label: 'Active Tickets', count: 1380, active: true,
    children: [
      { label: 'Open', count: 1370 },
      { label: 'On Hold', count: 6, alert: 1 },
      { label: 'Pending', count: 2 },
      { label: 'Awaiting TL Approval', count: 2 },
    ],
  },
  {
    label: 'Completed Tickets', count: 24,
    children: [
      { label: 'Awaiting', count: 5, alert: 3 },
      { label: 'Awaiting From Customer', count: 1 },
      { label: 'Closed Tickets', count: 18 },
    ],
  },
];

export interface Ticket {
  id: string;
  name: string;
  handle?: string;
  avatarColor: string;
  initials: string;
  channel: string;        // e.g. "Messages", "Direct Messages"
  network: 'facebook' | 'x' | 'instagram';
  brand: string;
  assignee?: string;
  comments: number;
  priority: 'Urgent' | 'High' | 'Normal';
  sla: 'Breached' | 'Within SLA';
  age: string;            // e.g. "1 day"
  remaining?: string;     // e.g. "6 Days Remaining"
  message: string;
  tags?: { label: string; tone: 'moderation' | 'category' }[];
  group?: number;         // participant count
}

export const TICKETS: Ticket[] = [
  {
    id: '...966656', name: 'Amrita C', avatarColor: '#7c4dff', initials: 'AC',
    channel: 'Messages', network: 'facebook', brand: 'Brandacca1', assignee: 'singlestore1',
    comments: 7, priority: 'Urgent', sla: 'Breached', age: '1 day', remaining: '6 Days Remaining',
    message:
      'This is shocking and shameful. Despite toilets inside hotel and a public toilet just 100 meters, ' +
      'your workers are still urinating in open spaces and dumping garbage in the park, citizens come to run. ' +
      "A slap in the face of the community. who's responsibility?",
  },
  {
    id: '...844800', name: 'Loco Adi', avatarColor: '#26a69a', initials: 'LA',
    channel: 'Messages', network: 'facebook', brand: 'Brandacca1', assignee: 'singlestore1',
    comments: 1, priority: 'Urgent', sla: 'Breached', age: '1 day', remaining: '6 Days Remaining',
    message:
      'I have ordered from Zomato today. 11/02/2026 from ya taj hotel Ayodhya nagar nagpur but in the name ' +
      'of biryani they are selling yellow rice and bone peice only charging rupees 250. i want refund of this ' +
      'order now otherwise i will go consumer court',
  },
  {
    id: '...281664', name: 'User Account A', handle: '@UserAccA1', avatarColor: '#ec407a', initials: 'A',
    channel: 'Direct Messages', network: 'x', brand: 'Taj hotels', assignee: 'Asish Locobuzz brand',
    comments: 17, priority: 'Urgent', sla: 'Within SLA', age: '1 day', group: 10,
    message: 'locokumar444 hiiiii',
    tags: [
      { label: 'Moderation', tone: 'moderation' },
      { label: 'UnCategorized', tone: 'category' },
      { label: 'UnCategorized', tone: 'category' },
    ],
  },
  {
    id: '...774512', name: 'Niraj Bothe', handle: '@Bothe_niraj', avatarColor: '#5c6bc0', initials: 'N',
    channel: 'Direct Messages', network: 'x', brand: 'Loco Buzz...', assignee: 'Niraj Bothe',
    comments: 5, priority: 'Urgent', sla: 'Within SLA', age: '1 day', group: 3,
    message:
      'Hi team, I raised a complaint last week regarding my booking and still have not received any update. ' +
      'Please escalate this on priority.',
  },
];
