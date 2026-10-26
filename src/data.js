export const links = {
  github: 'https://github.com/YouBTech01',
  youtube: 'https://youtube.com/@You_B_Tech',
  instagram: 'https://www.instagram.com/youbtech_code',
  telegram: 'https://t.me/YouBTech',
  telegramCoding: 'https://t.me/You_B_Tech_Coding',
  website: 'https://ybtshop.com',
  maps: 'https://www.google.com/maps/place/Madhya+Pradesh',
  repos: 'https://github.com/YouBTech01?tab=repositories',
  // Set to a form backend URL (e.g. a Formspree endpoint) to show a contact form.
  formEndpoint: '',
}

export const nav = [
  { id: 'home', label: 'Home', icon: 'solar:home-2-linear' },
  { id: 'about', label: 'About', icon: 'solar:user-circle-linear' },
  { id: 'focus', label: 'Focus', icon: 'solar:moon-stars-linear' },
  { id: 'skills', label: 'Skills', icon: 'solar:widget-5-linear' },
  { id: 'projects', label: 'Projects', icon: 'solar:clapperboard-play-linear' },
  { id: 'channel', label: 'Channel', icon: 'solar:videocamera-record-linear' },
  { id: 'social', label: 'Social', icon: 'solar:users-group-rounded-linear' },
  { id: 'contact', label: 'Contact', icon: 'solar:letter-linear' },
]

export const roles = ['Developer', 'YouTuber', 'Tech Creator', 'App Builder']

// iOS system colours for the small app-icon tiles
export const ios = {
  blue: '#0a84ff',
  green: '#30d158',
  orange: '#ff9f0a',
  pink: '#ff375f',
  purple: '#bf5af2',
  teal: '#40c8e0',
  red: '#ff453a',
  indigo: '#5e5ce6',
}

export const hobbies = [
  { icon: 'solar:gamepad-linear', label: 'Gaming', color: ios.green },
  { icon: 'solar:book-2-linear', label: 'Reading', color: ios.orange },
  { icon: 'solar:music-notes-linear', label: 'Music', color: ios.pink },
  { icon: 'solar:pallete-2-linear', label: 'Art', color: ios.purple },
  { icon: 'solar:code-linear', label: 'Coding', color: ios.blue },
]

// Focus areas, shown like iOS Focus / Settings rows
export const focus = [
  { icon: 'solar:smartphone-linear', label: 'Mobile & cross-platform apps', color: ios.blue },
  { icon: 'solar:rocket-2-linear', label: 'Technology & digital innovation', color: ios.indigo },
  { icon: 'solar:cpu-bolt-linear', label: 'Artificial intelligence', color: ios.purple },
  { icon: 'solar:play-circle-linear', label: 'YouTube & EdTech content', color: ios.red },
  { icon: 'solar:pallete-2-linear', label: 'UI/UX design', color: ios.pink },
  { icon: 'solar:plug-circle-linear', label: 'API integration', color: ios.teal },
  { icon: 'solar:cart-large-2-linear', label: 'E-commerce app development', color: ios.orange },
  { icon: 'solar:gamepad-linear', label: 'Gaming, reading & music', color: ios.green },
]

// Skill meters: the real values supplied by Brajendra. (The original site's bars used different
// numbers than its labels.) Edit here to change them.
export const levels = [
  { name: 'Flutter', group: 'Development', value: 21, color: ios.blue },
  { name: 'Android native', group: 'Development', value: 57, color: ios.blue },
  { name: 'Python', group: 'Development', value: 23, color: ios.blue },
  { name: 'Tech tutorials', group: 'Content', value: 95, color: ios.orange },
  { name: 'AI & prompt engineering', group: 'Content', value: 85, color: ios.orange },
  { name: 'Frontend', group: 'Web', value: 45, color: ios.green },
  { name: 'Backend', group: 'Web', value: 71, color: ios.green },
]

export const reminders = [
  'Launched an e-commerce app with user and order management',
  'Grew You B Tech to 7,362,860 total views',
  'Hands-on with Flutter, HTML, CSS and JavaScript',
]

// Skill folders: tap to open. `apps` are shown as app icons, `notes` as short captions.
export const skills = [
  {
    title: 'Development',
    apps: [
      { name: 'Flutter', icon: 'logos:flutter-icon' },
      { name: 'Android', icon: 'logos:android-icon' },
      { name: 'Kotlin', icon: 'logos:kotlin-icon' },
      { name: 'Java', icon: 'logos:java' },
      { name: 'Python', icon: 'logos:python' },
    ],
    notes: [
      ['Flutter', 'Cross-platform apps, UI/UX design, backend integration'],
      ['Android native', 'Java, Kotlin, native app development'],
      ['Python', 'Automation, web scraping, data science'],
    ],
  },
  {
    title: 'Web',
    apps: [
      { name: 'HTML5', icon: 'logos:html-5' },
      { name: 'CSS3', icon: 'logos:css-3' },
      { name: 'JavaScript', icon: 'logos:javascript' },
      { name: 'Responsive', icon: 'solar:smartphone-linear' },
      { name: 'APIs', icon: 'solar:plug-circle-linear' },
      { name: 'Databases', icon: 'solar:database-linear' },
    ],
    notes: [
      ['Frontend', 'HTML5, CSS3, JavaScript, responsive design'],
      ['Backend', 'API integration, database management, security'],
    ],
  },
  {
    title: 'Content',
    apps: [
      { name: 'Tutorials', icon: 'solar:clapperboard-play-linear' },
      { name: 'AI Tools', icon: 'solar:cpu-bolt-linear' },
      { name: 'No-code', icon: 'solar:widget-5-linear' },
    ],
    notes: [
      ['Tech tutorials', 'Educational content, programming tutorials, tech reviews'],
      ['AI & prompt engineering', 'AI tools, prompt crafting, no-code solutions'],
    ],
  },
]

const gh = (name) => `https://github.com/YouBTech01/${name}`

// Top repositories from https://github.com/YouBTech01?tab=repositories, most-starred first
// (stars and forks are a snapshot from 26 Oct 2026). Descriptions come from the repo or from the
// owner's own description of it. Personal-config, secret-holding and security-tool repos are left out.
export const projects = [
  {
    name: 'HTML AI Chatbot',
    repo: 'HTML-Ai-Chatbot',
    description: 'A web chatbot with an interactive chat interface and AI integration.',
    language: 'HTML',
    logo: 'logos:html-5',
    color: '#e34c26',
    topics: ['ai', 'chatbot', 'html'],
    stars: 53,
    forks: 30,
    url: gh('HTML-Ai-Chatbot'),
  },
  {
    name: 'E-commerce App with AI',
    repo: 'E-commerce-App-with-AI',
    description: 'Shopping interfaces with AI-assisted features.',
    language: 'JavaScript',
    logo: 'logos:javascript',
    color: '#f1e05a',
    topics: ['ecommerce', 'ai', 'javascript'],
    stars: 20,
    forks: 12,
    url: gh('E-commerce-App-with-AI'),
  },
  {
    name: 'Shopify-Inspired Clothing Store',
    repo: 'Shopify-Dawn-inspired-clothing-e-commerce-platform',
    description: 'A storefront focused on product presentation and modern UI.',
    language: 'JavaScript',
    logo: 'logos:javascript',
    color: '#f1e05a',
    topics: ['storefront', 'ui', 'javascript'],
    stars: 19,
    forks: 3,
    url: gh('Shopify-Dawn-inspired-clothing-e-commerce-platform'),
  },
  {
    name: 'AI Email Automation Agent',
    repo: 'AI-Email-Automation-Agent',
    description: 'AI-assisted email workflows with controlled automation.',
    language: 'Python',
    logo: 'logos:python',
    color: '#3572a5',
    topics: ['ai', 'automation', 'python'],
    stars: 14,
    forks: 3,
    url: gh('AI-Email-Automation-Agent'),
  },
  {
    name: 'Steps Tracker App',
    repo: 'steps-tracker-app',
    description: 'A Flutter app for tracking your daily steps.',
    language: 'Dart',
    logo: 'logos:flutter-icon',
    color: '#00b4ab',
    topics: ['flutter', 'dart', 'mobile'],
    stars: 10,
    forks: 2,
    url: gh('steps-tracker-app'),
  },
  {
    name: 'Personal Dashboard App',
    repo: 'Personal-Dashboard-App-Your-All-in-One-Productivity-Hub',
    description: 'A feature-rich Flutter app to boost productivity and manage everyday life.',
    language: 'Dart',
    logo: 'logos:flutter-icon',
    color: '#00b4ab',
    topics: ['flutter', 'productivity', 'dart'],
    stars: 7,
    forks: 5,
    url: gh('Personal-Dashboard-App-Your-All-in-One-Productivity-Hub'),
  },
]

// The last reel: the channel is where the other 50+ complex projects are built step by step.
export const moreProjects = {
  count: 50,
  line: 'Built step by step on the You B Tech channel.',
}

export const social = [
  { name: 'YouTube', icon: 'simple-icons:youtube', to: 90000, suffix: '+', unit: 'subscribers', url: links.youtube, bg: '#ff0033' },
  {
    name: 'Instagram',
    icon: 'simple-icons:instagram',
    to: 50,
    suffix: '+',
    unit: 'followers',
    url: links.instagram,
    bg: 'linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)',
  },
  { name: 'Telegram', icon: 'simple-icons:telegram', to: 11000, suffix: '+', unit: 'members', url: links.telegram, bg: '#229ed9' },
  { name: 'GitHub', icon: 'simple-icons:github', to: 550, suffix: '+', unit: 'followers', url: links.github, bg: '#24292f' },
  { name: 'Coding Community', icon: 'simple-icons:telegram', text: 'Telegram group for coders', url: links.telegramCoding, bg: '#1d8fc4' },
  { name: 'Website', icon: 'solar:global-linear', text: 'ybtshop.com', url: links.website, bg: ios.blue },
]

export const connect = [
  { label: 'Instagram', icon: 'simple-icons:instagram', url: links.instagram },
  { label: 'GitHub', icon: 'simple-icons:github', url: links.github },
  { label: 'YouTube', icon: 'simple-icons:youtube', url: links.youtube },
  { label: 'Telegram', icon: 'simple-icons:telegram', url: links.telegram },
]
