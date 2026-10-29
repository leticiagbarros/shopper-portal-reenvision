import type { Category } from '../../data/places';

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

export const ArrowLeft = () => (
  <svg {...base}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const Plus = () => (
  <svg {...base}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Check = () => (
  <svg {...base}>
    <path d="m5 12.500 4.500 4.500L19 7.500" />
  </svg>
);

export const Search = () => (
  <svg {...base}>
    <circle cx="11" cy="11" r="6.500" />
    <path d="m20 20-4.200-4.200" />
  </svg>
);

export const Trash = () => (
  <svg {...base} width={22} height={22}>
    <path d="M4 7h16M9 7V4.500h6V7M6.500 7l.8 12.500h9.400L17.500 7M10 11v5.500M14 11v5.500" />
  </svg>
);

export const Menu = () => (
  <svg {...base}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const ChevronDown = () => (
  <svg {...base} width={14} height={14} strokeWidth={2.500}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const Sparkle = () => (
  <svg {...base} strokeWidth={1.8}>
    <path d="M12 3l1.900 5.100L19 10l-5.100 1.900L12 17l-1.900-5.100L5 10l5.100-1.900L12 3Z" />
    <path d="M18.500 15.500l.7 1.800 1.800.7-1.800.7-.7 1.800-.7-1.800-1.800-.7 1.800-.7.7-1.800Z" />
  </svg>
);

export const Send = () => (
  <svg {...base}>
    <path d="M12 19V5M5.500 11.500 12 5l6.500 6.500" />
  </svg>
);

export const ExternalLink = () => (
  <svg {...base} width={18} height={18}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

export const Book = () => (
  <svg {...base} strokeWidth={1.8}>
    <path d="M5 4.500A1.500 1.500 0 0 1 6.500 3H19v15H6.500A1.500 1.500 0 0 0 5 19.500v-15Z" />
    <path d="M5 19.500A1.500 1.500 0 0 0 6.500 21H19v-3M9.500 8h6M9.500 11.500h4" />
  </svg>
);

export const Scale = () => (
  <svg {...base} strokeWidth={1.8}>
    <path d="M12 4v16M7 20h10M5 7h14" />
    <path d="M5 7l-2.500 6a3 3 0 0 0 5 0L5 7ZM19 7l-2.500 6a3 3 0 0 0 5 0L19 7Z" />
  </svg>
);

export const Help = () => (
  <svg {...base} strokeWidth={1.8}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.500 9.500a2.500 2.500 0 1 1 3.600 2.200c-.7.400-1.100.9-1.100 1.800M12 16.800v.1" />
  </svg>
);

export const Directions = () => (
  <svg {...base} width={16} height={16} strokeWidth={2.200}>
    <path d="M12 3 21 12l-9 9-9-9 9-9Z" />
    <path d="M8.500 14v-2.500a1.500 1.500 0 0 1 1.500-1.500h5M13 7.500 15.500 10 13 12.500" />
  </svg>
);

export const QrCode = () => (
  <svg {...base} width={26} height={26} strokeWidth={1.800}>
    <rect x="3.500" y="3.500" width="6.500" height="6.500" rx="1" />
    <rect x="14" y="3.500" width="6.500" height="6.500" rx="1" />
    <rect x="3.500" y="14" width="6.500" height="6.500" rx="1" />
    <path d="M14 14h2.500v2.500H14zM19 14h1.500M14 19.500h2.500M19 17.500v3" />
  </svg>
);

export const Bell = () => (
  <svg {...base}>
    <path d="M6 16V11a6 6 0 1 1 12 0v5l1.500 2h-15L6 16Z" />
    <path d="M10 21a2 2 0 0 0 4 0" />
  </svg>
);

export const Bag = () => (
  <svg {...base} strokeWidth={1.8}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V7a3 3 0 0 1 6 0v1" />
  </svg>
);

const Gem = () => (
  <svg {...base} strokeWidth={1.8}>
    <path d="M6 3h12l3.500 5.500L12 21 2.500 8.500 6 3Z" />
    <path d="M2.500 8.500h19M9.500 3 8 8.500 12 21l4-12.500L14.500 3" />
  </svg>
);

const Storefront = () => (
  <svg {...base} strokeWidth={1.8}>
    <path d="M5 21V4.500A1.500 1.500 0 0 1 6.500 3h11A1.500 1.500 0 0 1 19 4.500V21M3 21h18" />
    <path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-4h4v4" />
  </svg>
);

const Lipstick = () => (
  <svg {...base} strokeWidth={1.8}>
    <path d="M8.500 21v-7h7v7zM9.500 14l.8-4h3.400l.8 4M10.500 10V5.500a1.500 1.500 0 0 1 3 0V10" />
  </svg>
);

const Gift = () => (
  <svg {...base} strokeWidth={1.8}>
    <path d="M4 10.500h16V20H4zM3 7h18v3.500H3zM12 7v13" />
    <path d="M12 7c-1 0-3.500-.5-3.500-2.200S10.500 3 12 7Zm0 0c1 0 3.500-.5 3.500-2.200S13.500 3 12 7Z" />
  </svg>
);

const CATEGORY_ICONS: Record<Category, () => JSX.Element> = {
  Luxury: Gem,
  'Department store': Storefront,
  'Shopping mall': () => <Bag />,
  Beauty: Lipstick,
  Souvenirs: Gift,
};

export function CategoryIcon({ category }: { category: Category }) {
  const Icon = CATEGORY_ICONS[category];
  return <Icon />;
}

export const BAG_SVG =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/></svg>';
