import { BRAND_ICONS } from '../../channel-data';

/** An inner sub-channel toggle (retweets, replies, comments). */
export interface InnerOption { id: string; label: string; icon: string; }

/** A channel the listener can collect from, plus how it behaves. */
export interface ListenerChannel {
  id: string;
  label: string;
  desc: string;               // short catalog blurb
  note: string;               // italic explanation shown when selected
  color: string;              // icon-tile brand colour
  svg?: string;               // real brand-logo path (BRAND_ICONS)
  icon?: string;              // Material Symbols glyph fallback
  letter?: string;            // letter-avatar fallback (Quora Q, Pantip P)
  premium?: boolean;
  hasVault?: boolean;         // Facebook needs a saved page list
  orOnly?: boolean;           // only "match any" applies (IG, TikTok, Reddit, Quora)
  usesTags?: boolean;         // Pantip — tags instead of a query
  inner?: InnerOption[];      // retweets / replies / comments
  reach: number;              // contribution to estimated reach / day
  listKey: string;            // maps back to the listing CHANNELS key

  // ---- capability reference (from the Locobuzz capabilities doc) ----------
  freq: string;               // how often we fetch data
  historic: string;           // historic back-fill availability
  capture: string[];          // what we can capture
  respond: string;            // can we respond?
}

const RETWEETS: InnerOption = { id: 'retweets', label: 'Include retweets', icon: 'repeat' };
const REPLIES:  InnerOption = { id: 'replies',  label: 'Include replies',  icon: 'chat_bubble' };
const COMMENTS: InnerOption = { id: 'comments', label: 'Include comments', icon: 'mode_comment' };

/** Facebook vault presets (saved lists of public pages we crawl). */
export const FB_VAULTS = ['Global Owned Pages', 'Competitor Watch', 'Retail Partners'];

/** Full channel catalog, in display order (matches the picker grid). */
export const LISTENER_CHANNELS: ListenerChannel[] = [
  {
    id: 'twitter', label: 'X / Twitter', desc: 'Public posts, retweets & replies',
    note: "We'll listen to public posts on X in real time.",
    color: '#000000', svg: BRAND_ICONS['twitter'], inner: [RETWEETS, REPLIES],
    reach: 6800, listKey: 'twitter',
    freq: 'Real-time via webhook streaming, with a backup sweep every 5–25 min.',
    historic: 'Real-time back-fill for keyword history.',
    capture: ['Tagged mentions', 'Tweet replies', 'Public tweets (keyword)', 'Retweets'],
    respond: 'Yes — reply to mentions, replies & DMs.',
  },
  {
    id: 'facebook', label: 'Facebook', desc: 'Public pages, via a Vault',
    note: 'Facebook needs a Vault — a saved list of public pages we crawl.',
    color: '#1877f2', svg: BRAND_ICONS['facebook'], hasVault: true, inner: [COMMENTS],
    reach: 5200, listKey: 'facebook',
    freq: 'Webhooks in real-time, plus daily / weekly / monthly backup sweeps.',
    historic: 'Real-time back-fill for keyword history.',
    capture: ['Comments on brand posts', 'Tagged posts', 'Page reviews', 'Reels', 'Inbox / Messenger'],
    respond: 'Yes — on owned pages listed in a Vault.',
  },
  {
    id: 'instagram', label: 'Instagram', desc: 'Hashtag-based listening',
    note: "Instagram listens to hashtags — we'll match any tag you add.",
    color: '#e1306c', svg: BRAND_ICONS['instagram'], orOnly: true,
    reach: 4300, listKey: 'instagram',
    freq: 'Webhooks + backup; hashtag posts collected 4x/day.',
    historic: 'Keyword back-fill 4x/day (3AM, 9AM, 3PM, 9PM).',
    capture: ['Comments on brand posts', 'DMs', 'Tagged posts', 'Reels', 'Stories', 'Hashtag posts'],
    respond: 'Yes on owned handles; hashtag posts are listen-only.',
  },
  {
    id: 'youtube', label: 'YouTube', desc: 'Videos, descriptions & comments',
    note: "We'll match keywords in video titles, descriptions and comments.",
    color: '#ff0000', svg: BRAND_ICONS['youtube'], inner: [COMMENTS],
    reach: 2600, listKey: 'youtube',
    freq: 'Posts 4x/day, comments every 2 hours, keyword posts 1x/day.',
    historic: 'Real-time back-fill (up to 1 year).',
    capture: ['Comments on brand videos', 'Keyword / hashtag posts', 'Shorts', 'Channel videos'],
    respond: 'Yes — reply to video comments.',
  },
  {
    id: 'tiktok', label: 'TikTok', desc: 'Short videos & captions',
    note: 'TikTok matches any of your keywords across captions.',
    color: '#010101', svg: BRAND_ICONS['tiktok'], orOnly: true, inner: [COMMENTS, REPLIES],
    reach: 3100, listKey: 'tiktok',
    freq: 'Continuous (always-on service); keyword & hashtag based.',
    historic: 'Limited — recent captions & comments.',
    capture: ['Short videos', 'Captions', 'Comments', 'Replies'],
    respond: 'Listen-only for public keyword / hashtag.',
  },
  {
    id: 'reddit', label: 'Reddit', desc: 'Subreddit posts & comments',
    note: 'Reddit matches any of your keywords across public subreddits.',
    color: '#ff4500', svg: BRAND_ICONS['reddit'], orOnly: true, inner: [COMMENTS],
    reach: 2200, listKey: 'reddit',
    freq: 'Once a day (9 AM) across public subreddits.',
    historic: 'Up to the last 30 days.',
    capture: ['Subreddit posts', 'Comments'],
    respond: 'Listen-only (public subreddits).',
  },
  {
    id: 'quora', label: 'Quora', desc: 'Questions and answers',
    note: 'Quora matches any of your keywords across questions and answers.',
    color: '#b92b27', letter: 'Q', orOnly: true,
    reach: 900, listKey: 'quora',
    freq: 'Crawled a few times daily via Webz.io.',
    historic: 'Up to the last 30 days.',
    capture: ['Questions', 'Answers'],
    respond: 'Listen-only.',
  },
  {
    id: 'pantip', label: 'Pantip', desc: 'Thai forum — Tags, Rooms & Clubs',
    note: 'Pantip uses Tags instead of a normal query — add the tags you care about.',
    color: '#1f9d5a', letter: 'P', usesTags: true, inner: [COMMENTS],
    reach: 700, listKey: 'pantip',
    freq: 'Crawled daily — Thai forum Tags, Rooms & Clubs.',
    historic: 'Up to the last 30 days.',
    capture: ['Threads', 'Comments', 'Tags / Rooms / Clubs'],
    respond: 'Listen-only.',
  },
  {
    id: 'complaint', label: 'Complaint Websites', desc: 'Consumer complaint reviews',
    note: "We'll collect complaint-site reviews matching your query.",
    color: '#f59e0b', icon: 'priority_high',
    reach: 2400, listKey: 'complaint',
    freq: '2x/day (9 AM, 9 PM) via Webz.io.',
    historic: 'Up to the last 30 days.',
    capture: ['Consumer complaints', 'Reviews'],
    respond: 'Listen-only.',
  },
  {
    id: 'premium-forums', label: 'Premium Forums', desc: 'Curated premium forum threads',
    note: 'Premium source — richer signal, higher-quality forum threads.',
    color: '#7c3aed', icon: 'diamond', premium: true,
    reach: 800, listKey: 'forums',
    freq: '3x/day (every 8 hours) — curated premium sources.',
    historic: 'Keyword back-fill up to the last 30 days.',
    capture: ['Forum threads', 'Comments'],
    respond: 'Listen-only (premium).',
  },
  {
    id: 'premium-news', label: 'Premium News', desc: 'Vetted news outlets',
    note: 'Premium source — vetted news outlets with structured metadata.',
    color: '#4f46e5', icon: 'diamond', premium: true,
    reach: 1100, listKey: 'news',
    freq: '2x/day (9 AM, 9 PM) — vetted news outlets.',
    historic: 'Keyword back-fill up to the last 30 days.',
    capture: ['News articles', 'Structured metadata'],
    respond: 'Listen-only (premium).',
  },
  {
    id: 'premium-blogs', label: 'Premium Blogs', desc: 'Long-form editorial coverage',
    note: 'Premium source — long-form editorial coverage.',
    color: '#d21fce', icon: 'diamond', premium: true,
    reach: 900, listKey: 'blogs',
    freq: '2x/day (9 AM, 9 PM) — long-form editorial blogs.',
    historic: 'Keyword back-fill up to the last 30 days.',
    capture: ['Blog posts', 'Editorial coverage'],
    respond: 'Listen-only (premium).',
  },
];

/** Country / language autocomplete pools (prototype). */
export const COUNTRY_POOL = [
  'United States', 'United Kingdom', 'India', 'Canada', 'Australia', 'Germany',
  'France', 'Brazil', 'Japan', 'Singapore', 'Thailand', 'United Arab Emirates',
];
export const LANGUAGE_POOL = [
  'English', 'Hindi', 'Spanish', 'French', 'German', 'Portuguese', 'Thai', 'Japanese', 'Arabic',
];
