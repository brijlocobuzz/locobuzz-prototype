// ---------------------------------------------------------------------------
// Mock data for the Social Scheduling → Manage Post screen.
// ---------------------------------------------------------------------------

export type PostNetwork = 'facebook' | 'instagram' | 'x' | 'linkedin' | 'youtube';

export type PostStatus =
  | 'published'
  | 'scheduled'
  | 'awaiting'
  | 'draft'
  | 'rejected'
  | 'partially'
  | 'failed'
  | 'deleted';

export type PostMediaType = 'image' | 'carousel' | 'video' | 'story' | 'document' | 'text';

export interface PostAccount {
  name: string;
  handle: string;
  followers: string;
  initials: string;
  avatarColor: string;
}

export interface PostStats {
  likes: string;
  comments: string;
  shares: string;
  impressions: string;
}

export interface SocialPost {
  id: string;
  brand: string;
  status: PostStatus;
  statusLabel: string;          // e.g. "Published Via Locobuzz"
  timestamp: string;            // e.g. "12 May 26, 10:42 AM" | "2 mins Remaining"
  network: PostNetwork;
  account: PostAccount;
  mediaType: PostMediaType;
  caption?: string;
  hashtags?: string[];
  mediaSeed?: string;           // picsum.photos seed
  mediaCount?: number;          // carousel slide count
  videoDuration?: string;
  error?: string;               // failure banner text
  breach?: string;              // e.g. "Scheduled Post Breached By: 18d 17h 22m"
  stats?: PostStats;
  labels?: string[];
  channels?: PostNetwork[];     // multi-channel scheduled posts
  postedBy: string;
  approvedBy?: string;
  statsUpdated?: string;
}

export interface NetworkMeta {
  label: string;
  color: string;
  glyph: string;                // Material Symbol ligature OR short text
  isIcon: boolean;              // true → render glyph with .msr
}

export const NETWORK_META: Record<PostNetwork, NetworkMeta> = {
  facebook:  { label: 'Facebook',  color: '#1877f2', glyph: 'f',            isIcon: false },
  instagram: { label: 'Instagram', color: '#e1306c', glyph: 'photo_camera', isIcon: true },
  x:         { label: 'X',         color: '#111827', glyph: 'close',        isIcon: true },
  linkedin:  { label: 'LinkedIn',  color: '#0a66c2', glyph: 'in',           isIcon: false },
  youtube:   { label: 'YouTube',   color: '#ff0033', glyph: 'play_arrow',   isIcon: true },
};

/** Applied filter values — empty array ⇒ that dimension is not filtered. */
export interface PostFilters {
  channels: PostNetwork[];
  profiles: string[];   // account handles
  members: string[];    // postedBy names
  labels: string[];
}

export const EMPTY_FILTERS: PostFilters = { channels: [], profiles: [], members: [], labels: [] };

export interface StatusTabDef {
  key: 'all' | PostStatus;
  label: string;
  icon: string;    // Material Symbols Rounded ligature
  color: string;   // status accent used in the rail
}

export const STATUS_TABS: StatusTabDef[] = [
  { key: 'all',       label: 'All Posts',           icon: 'stacks',            color: '#2563eb' },
  { key: 'awaiting',  label: 'Awaiting Approval',   icon: 'hourglass_top',     color: '#b45309' },
  { key: 'draft',     label: 'Drafts',              icon: 'edit_note',         color: '#64748b' },
  { key: 'rejected',  label: 'Rejected',            icon: 'block',             color: '#dc2626' },
  { key: 'scheduled', label: 'Scheduled',           icon: 'schedule',          color: '#b45309' },
  { key: 'published', label: 'Published',           icon: 'check_circle',      color: '#1f9d5a' },
  { key: 'partially', label: 'Partially Published', icon: 'incomplete_circle', color: '#7c3aed' },
  { key: 'failed',    label: 'Failed',              icon: 'error',             color: '#dc2626' },
  { key: 'deleted',   label: 'Deleted',             icon: 'delete',            color: '#94a3b8' },
];

export const POST_BRANDS = ['All Brands', 'Swiggy', 'AJIO', 'CSIR India'];

export const DURATION_OPTIONS = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Custom Range'];

const SWIGGY_FB: PostAccount = {
  name: 'Swiggy Mumbai', handle: '@swiggymum', followers: '6.8K',
  initials: 'S', avatarColor: '#f97316',
};

const SWIGGY_IG: PostAccount = {
  name: 'Swiggy Foods', handle: '@swiggyfoods', followers: '12.4K',
  initials: 'S', avatarColor: '#fb923c',
};

const AJIO_IG: PostAccount = {
  name: 'AJIO Life', handle: '@ajiolife', followers: '2.1M',
  initials: 'A', avatarColor: '#0ea5e9',
};

const CSIR_FB: PostAccount = {
  name: 'CSIR, India', handle: '@CSIR_IND', followers: '48.2K',
  initials: 'C', avatarColor: '#2563eb',
};

export const SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'p-101', brand: 'Swiggy', status: 'published',
    statusLabel: 'Published Via Locobuzz', timestamp: '12 May 26, 10:42 AM',
    network: 'facebook', account: SWIGGY_FB, mediaType: 'image',
    caption: '🍔 Cravings don’t wait, and neither should you. Get your favourite meals delivered fresh and fast with Swiggy.',
    hashtags: ['#Swiggy', '#FoodDelivery', '#HungryKya'],
    mediaSeed: 'burger-main',
    stats: { likes: '2k', comments: '8.3k', shares: '12k', impressions: '10k' },
    labels: ['Fast Delivery', 'Foodie', '+3'],
    postedBy: 'Aditi Supervisor', approvedBy: 'Rahul Rana', statsUpdated: '1 Day Ago',
  },
  {
    id: 'p-102', brand: 'Swiggy', status: 'scheduled',
    statusLabel: 'Scheduled Via Channel', timestamp: '2 mins Remaining',
    network: 'instagram', account: SWIGGY_IG, mediaType: 'carousel',
    caption: '📸 Capture every detail. Share every moment with the latest iPhone.',
    mediaSeed: 'phone-hand', mediaCount: 4,
    channels: ['facebook', 'instagram', 'instagram', 'x', 'x', 'linkedin', 'youtube'],
    stats: { likes: '2k', comments: '8.3k', shares: '12k', impressions: '10k' },
    labels: ['Fast Delivery', 'Foodie'],
    postedBy: 'Aditi Supervisor', statsUpdated: '1 Day Ago',
  },
  {
    id: 'p-103', brand: 'Swiggy', status: 'published',
    statusLabel: 'Published Via Locobuzz', timestamp: '12 May 26, 10:42 AM',
    network: 'facebook', account: SWIGGY_FB, mediaType: 'text',
    caption: '🍔 Cravings don’t wait, and neither should you.\n\nGet your favourite meals delivered fresh and fast with Swiggy. From midnight snacks to weekend feasts, we’ve got every craving covered.',
    hashtags: ['#Swiggy', '#FoodDelivery', '#HungryKya', '#OrderNow'],
    stats: { likes: '2k', comments: '8.3k', shares: '12k', impressions: '10k' },
    labels: [],
    postedBy: 'Aditi Supervisor', statsUpdated: '1 Day Ago',
  },
  {
    id: 'p-104', brand: 'Swiggy', status: 'failed',
    statusLabel: 'Publishing Failed', timestamp: '12 May 26, 9:50 AM',
    network: 'facebook', account: SWIGGY_FB, mediaType: 'image',
    caption: '🍔 Cravings don’t wait, and neither should you. Get your favourite meals delivered fresh and fast with Swiggy.',
    mediaSeed: 'burger-retry',
    error: 'Posting failed due to expired token. Please retry after reauthenticating.',
    stats: { likes: '2k', comments: '8.3k', shares: '12k', impressions: '10k' },
    labels: ['Fast Delivery'],
    postedBy: 'Aditi Supervisor', statsUpdated: '1 Day Ago',
  },
  {
    id: 'p-105', brand: 'Swiggy', status: 'awaiting',
    statusLabel: 'Awaiting Approval', timestamp: '11 May 26, 5:00 PM',
    network: 'facebook', account: SWIGGY_FB, mediaType: 'document',
    caption: '🍔 Cravings don’t wait, and neither should you. Get your favourite meals delivered fresh and fast with…',
    breach: 'Scheduled Post Breached By: 18d 17h 22m',
    stats: { likes: '2k', comments: '8.3k', shares: '12k', impressions: '10k' },
    labels: [],
    postedBy: 'Aditi Supervisor', statsUpdated: '1 Day Ago',
  },
  {
    id: 'p-106', brand: 'Swiggy', status: 'published',
    statusLabel: 'Published Via Locobuzz', timestamp: '11 May 26, 6:30 PM',
    network: 'facebook', account: SWIGGY_FB, mediaType: 'video',
    caption: '🍔 Cravings don’t wait, and neither should you. Get your favourite meals delivered fresh and fast with Swiggy.',
    mediaSeed: 'pizza-video', videoDuration: '0:45',
    stats: { likes: '2k', comments: '8.3k', shares: '12k', impressions: '10k' },
    labels: ['Fast Delivery', 'Foodie', '+3'],
    postedBy: 'Aditi Supervisor', approvedBy: 'Rahul Rana', statsUpdated: '1 Day Ago',
  },
  {
    id: 'p-107', brand: 'AJIO', status: 'published',
    statusLabel: 'Published From Social', timestamp: '6 Jul 26, 9:13 AM',
    network: 'instagram', account: AJIO_IG, mediaType: 'story',
    caption: 'New season, new drops. The AJIO All Stars sale is live — up to 70% off across 5000+ brands. ✨',
    hashtags: ['#AJIO', '#AllStarsSale'],
    mediaSeed: 'fashion-story',
    stats: { likes: '6k', comments: 'NA', shares: '1k', impressions: '22k' },
    labels: ['Sale', 'Fashion'],
    postedBy: 'Kishan Chaudhary', statsUpdated: '3 Hrs Ago',
  },
  {
    id: 'p-108', brand: 'CSIR India', status: 'published',
    statusLabel: 'Published From Social', timestamp: '7 Jul 26, 10:40 AM',
    network: 'facebook', account: CSIR_FB, mediaType: 'image',
    caption: 'CSIR Technology Showcase 49/100 — CSIR-CECRI’s Corrosion Inhibitor Solution offers an indigenous, cost-effective technology to protect steel reinforcement in reinforced concrete structures.',
    hashtags: ['#CSIR', '#MakeInIndia'],
    mediaSeed: 'infra-tech',
    stats: { likes: '34', comments: '14', shares: '4', impressions: '1.2k' },
    labels: ['Technology'],
    postedBy: 'CSIR Social Desk', statsUpdated: '1 Day Ago',
  },
  {
    id: 'p-109', brand: 'AJIO', status: 'draft',
    statusLabel: 'Draft', timestamp: 'Edited 5 Jul 26, 4:12 PM',
    network: 'x', account: { ...AJIO_IG, handle: '@ajio', name: 'AJIO' }, mediaType: 'text',
    caption: 'Monsoon fits, sorted. ☔ Layers, slides and everything in between — drop your monsoon essential in the comments.',
    hashtags: ['#AJIO', '#MonsoonStyle'],
    labels: [],
    postedBy: 'Kishan Chaudhary',
  },
  {
    id: 'p-110', brand: 'Swiggy', status: 'partially',
    statusLabel: 'Partially Published', timestamp: '10 May 26, 8:00 PM',
    network: 'linkedin', account: { ...SWIGGY_FB, name: 'Swiggy Corporate', handle: 'swiggy-in', followers: '890K' },
    mediaType: 'image',
    caption: 'We’re hiring across engineering, design and operations. Come build the future of food delivery with us. 🚀',
    hashtags: ['#SwiggyCareers', '#Hiring'],
    mediaSeed: 'office-team',
    channels: ['linkedin', 'x'],
    stats: { likes: '412', comments: '38', shares: '96', impressions: '18k' },
    labels: ['Careers'],
    postedBy: 'Aditi Supervisor', approvedBy: 'Rahul Rana', statsUpdated: '2 Days Ago',
  },
  {
    id: 'p-111', brand: 'Swiggy', status: 'rejected',
    statusLabel: 'Rejected', timestamp: '9 May 26, 11:20 AM',
    network: 'instagram', account: SWIGGY_IG, mediaType: 'image',
    caption: 'Flash deal! Flat 60% off on your next 3 orders. Tonight only. ⚡',
    mediaSeed: 'deal-flash',
    error: 'Rejected by Rahul Rana: “Discount value doesn’t match the approved campaign. Please fix and resubmit.”',
    labels: ['Promo'],
    postedBy: 'Aditi Supervisor',
  },
  {
    id: 'p-112', brand: 'AJIO', status: 'scheduled',
    statusLabel: 'Scheduled Via Locobuzz', timestamp: '14 Jul 26, 9:00 AM',
    network: 'youtube', account: { ...AJIO_IG, name: 'AJIO Studio', handle: '@ajiostudio', followers: '310K' },
    mediaType: 'video',
    caption: 'Behind the seams — how our stylists build a capsule wardrobe in under 10 minutes. Full video drops Monday.',
    mediaSeed: 'wardrobe-video', videoDuration: '8:12',
    labels: ['Styling', 'Series'],
    postedBy: 'Kishan Chaudhary', approvedBy: 'Meera Iyer',
  },
];
