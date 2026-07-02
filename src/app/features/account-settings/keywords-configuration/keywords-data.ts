import { BRAND_ICONS } from '../channel-data';

/** Visual metadata for a channel chip shown against a query. */
export interface ChannelMeta {
  label: string;
  bg: string;         // soft pill background
  fg: string;         // logo / text colour
  svg?: string;       // real brand-logo path (BRAND_ICONS)
  icon?: string;      // Material Symbols glyph fallback
}

/** Channel catalog used by both the listing chips and the Add-Keywords picker. */
export const CHANNELS: Record<string, ChannelMeta> = {
  twitter:   { label: 'Twitter',           bg: '#e9f5fe', fg: '#0f1419', svg: BRAND_ICONS['twitter'] },
  youtube:   { label: 'Youtube',           bg: '#ffeaea', fg: '#ff0000', svg: BRAND_ICONS['youtube'] },
  reddit:    { label: 'Reddit',            bg: '#fff0e8', fg: '#ff4500', svg: BRAND_ICONS['reddit'] },
  forums:    { label: 'Discussion Forums', bg: '#e7f7ee', fg: '#1f9d5a', icon: 'forum' },
  news:      { label: 'News',              bg: '#eef2ff', fg: '#4f46e5', icon: 'newspaper' },
  blogs:     { label: 'Blogs',             bg: '#f3edff', fg: '#7c3aed', icon: 'rss_feed' },
  instagram: { label: 'Instagram',         bg: '#fdecf3', fg: '#e1306c', svg: BRAND_ICONS['instagram'] },
  facebook:  { label: 'Facebook',          bg: '#e8f0fe', fg: '#1877f2', svg: BRAND_ICONS['facebook'] },
  linkedin:  { label: 'LinkedIn',          bg: '#e8f1fb', fg: '#0a66c2', svg: BRAND_ICONS['linkedin'] },
  tiktok:    { label: 'TikTok',            bg: '#f0f0f3', fg: '#010101', svg: BRAND_ICONS['tiktok'] },
  quora:     { label: 'Quora',             bg: '#fdeaea', fg: '#b92b27', icon: 'quiz' },
  pantip:    { label: 'Pantip',            bg: '#e7f7ee', fg: '#1f9d5a', icon: 'forum' },
  complaint: { label: 'Complaint Websites', bg: '#fff4e5', fg: '#f59e0b', icon: 'priority_high' },
};

/** All statuses a real-time query can be in, with their visual treatment. */
export type QueryStatus = 'Collecting data' | 'Approval pending' | 'Data Collection Pause';

/** A single keyword-token group inside a query, e.g. (jio OR jiohotstar). */
export interface QueryTerm { text: string; }

/** One row in the Real Time Queries table. */
export interface RealTimeQuery {
  id: string;
  name: string;                 // Keywords group name
  terms: QueryTerm[];           // keyword pills
  connector: 'AND' | 'OR';      // joiner shown between pills
  channels: string[];           // CHANNELS keys ([] = NA)
  createdOn: string;
  vault: string;                // 'NA' in the prototype
  status: QueryStatus;
  historicSince?: number;       // days of historic back-fill (undefined = real-time only)
}

export const REAL_TIME_QUERIES: RealTimeQuery[] = [
  {
    id: 'q1', name: 'testDup',
    terms: [{ text: 'india' }], connector: 'AND',
    channels: ['twitter'], createdOn: 'May 16, 2026', vault: 'NA', status: 'Approval pending',
  },
  {
    id: 'q2', name: 'testkeyword',
    terms: [{ text: 'locobuzz' }, { text: 'locobuzz1' }], connector: 'AND',
    channels: ['youtube'], createdOn: 'May 06, 2026', vault: 'NA', status: 'Collecting data',
  },
  {
    id: 'q3', name: 'test quora',
    terms: [{ text: 'india' }], connector: 'AND',
    channels: [], createdOn: 'Jan 16, 2026', vault: 'NA', status: 'Collecting data',
  },
  {
    id: 'q4', name: 'Jio reddit testing',
    terms: [{ text: 'jio OR jiohotstar OR jiohome' }], connector: 'OR',
    channels: ['reddit'], createdOn: 'Dec 04, 2025', vault: 'NA', status: 'Data Collection Pause',
    historicSince: 30,
  },
  {
    id: 'q5', name: 'keytest11',
    terms: [{ text: 'locoshaiwaztestloco' }], connector: 'AND',
    channels: ['youtube'], createdOn: 'Nov 26, 2025', vault: 'NA', status: 'Collecting data',
  },
  {
    id: 'q6', name: 'testing',
    terms: [{ text: 'amrit' }, { text: 'Geographic:"in"' }], connector: 'AND',
    channels: ['forums', 'news', 'blogs'], createdOn: 'Aug 22, 2025', vault: 'NA', status: 'Collecting data',
    historicSince: 14,
  },
  {
    id: 'q7', name: 'testing',
    terms: [{ text: 'amrit' }, { text: 'Geographic:"in"' }], connector: 'AND',
    channels: ['forums', 'news', 'blogs'], createdOn: 'Aug 22, 2025', vault: 'NA', status: 'Collecting data',
  },
  {
    id: 'q8', name: 'testing',
    terms: [{ text: 'amrit' }, { text: 'Geographic:"in"' }], connector: 'AND',
    channels: ['forums', 'news', 'blogs'], createdOn: 'Aug 22, 2025', vault: 'NA', status: 'Collecting data',
  },
  {
    id: 'q9', name: 'testing',
    terms: [{ text: 'amrit' }, { text: 'Geographic:"in"' }], connector: 'AND',
    channels: ['forums', 'news', 'blogs'], createdOn: 'Aug 21, 2025', vault: 'NA', status: 'Collecting data',
    historicSince: 90,
  },
  {
    id: 'q10', name: 'testing',
    terms: [{ text: 'amrit' }, { text: 'Geographic:"in"' }], connector: 'AND',
    channels: ['forums', 'news', 'blogs'], createdOn: 'Aug 21, 2025', vault: 'NA', status: 'Collecting data',
  },
];

/** Brands available in the top-left brand switcher (prototype). */
export const KW_BRANDS = [
  '1 97 QA TEst brand',
  'Locobuzz',
  'Nike India',
  'Jio Platforms',
];
