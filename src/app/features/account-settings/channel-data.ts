export interface ChannelGroup {
  label: string;
  count?: number;
  expanded?: boolean;
  channels?: Channel[];
}

export interface Channel {
  label: string;
  icon: string;          // Material Symbols ligature
  color: string;
  count?: number;        // configured count
  expiredBadge?: number; // red "Expired: n"
  active?: boolean;
  empty?: boolean;       // shows hollow dot instead of count
}

export const CHANNEL_GROUPS: ChannelGroup[] = [
  {
    label: 'SOCIAL MEDIA', count: 7, expanded: true,
    channels: [
      { label: 'Facebook', icon: 'thumb_up', color: '#1877f2', count: 2, active: true },
      { label: 'Instagram', icon: 'photo_camera', color: '#e1306c', count: 3 },
      { label: 'X (Twitter)', icon: 'close', color: '#000000', count: 9, expiredBadge: 4 },
      { label: 'LinkedIn', icon: 'work', color: '#0a66c2', empty: true },
      { label: 'YouTube', icon: 'smart_display', color: '#ff0000', count: 1 },
      { label: 'TikTok', icon: 'music_note', color: '#010101', empty: true },
      { label: 'Facebook Groups', icon: 'groups', color: '#1877f2', empty: true },
    ],
  },
  { label: 'MESSAGING', count: 4 },
  { label: 'EMAIL', count: 1 },
  { label: 'REVIEW PLATFORMS', count: 9 },
  { label: 'E-COMMERCE', count: 1 },
  { label: 'WEB / NEWS', count: 4 },
  { label: 'ANALYTICS & MESSAGING API', count: 2 },
  { label: 'FORM', count: 1 },
];

export interface ChannelProfile {
  name: string;
  owner: string;
  initials: string;
  avatarColor: string;
  status: 'Owned' | 'Connected';
  addedOn: string;
  updatedOn: string;
  mentionTypes: string[];
  moreTypes: number;
}

export const FACEBOOK_PROFILES: ChannelProfile[] = [
  {
    name: 'Brandacca1', owner: 'Asish Locobuzz Brand', initials: 'B', avatarColor: '#7c4dff',
    status: 'Owned', addedOn: 'Jun 11, 2026 11:57 AM', updatedOn: 'Jun 26, 2026 6:07 PM',
    mentionTypes: ['User Comments', 'Messages'], moreTypes: 4,
  },
  {
    name: 'Locouser', owner: 'Nani R', initials: 'L', avatarColor: '#f0a020',
    status: 'Owned', addedOn: 'Jun 22, 2026 1:13 PM', updatedOn: 'Jun 26, 2026 6:07 PM',
    mentionTypes: ['User Comments', 'Messages'], moreTypes: 4,
  },
];
