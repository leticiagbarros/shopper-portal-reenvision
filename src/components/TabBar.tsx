import type { ReactNode } from 'react';

export type TabId = 'refunds' | 'trips' | 'tax-free' | 'profile';

interface Tab {
  id: TabId;
  label: string;
  icon: ReactNode;
}

const svgProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const TABS: Tab[] = [
  {
    id: 'refunds',
    label: 'My refunds',
    icon: (
      <svg {...svgProps}>
        <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
        <path d="M9.5 8h5M9.5 12h5" />
      </svg>
    ),
  },
  {
    id: 'trips',
    label: 'My trips',
    icon: (
      <svg {...svgProps}>
        <rect x="4.500" y="7" width="15" height="13" rx="3" />
        <path d="M9 7V5a1.500 1.500 0 0 1 1.500-1.500h3A1.500 1.500 0 0 1 15 5v2M9 11v5M15 11v5" />
      </svg>
    ),
  },
  {
    id: 'tax-free',
    label: 'Tax Free',
    icon: (
      <svg {...svgProps}>
        <path d="M5 8h14l-1 12H6L5 8Z" />
        <path d="M9 8V7a3 3 0 0 1 6 0v1" />
        <path d="m9.500 15.500 5-5" />
        <circle cx="9.800" cy="11" r=".6" fill="currentColor" />
        <circle cx="14.200" cy="15" r=".6" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: (
      <svg {...svgProps}>
        <circle cx="12" cy="8" r="3.500" />
        <path d="M5 20c.8-3.500 3.600-5.500 7-5.500s6.200 2 7 5.500" />
      </svg>
    ),
  },
];

// Displacement map: R/G encode x/y offsets, neutral (128) in the middle, pushed outward at the edges.
const LENS_MAP = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" preserveAspectRatio="none">
<defs>
<linearGradient id="x" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#ff0000"/><stop offset="0.12" stop-color="#800000"/><stop offset="0.88" stop-color="#800000"/><stop offset="1" stop-color="#000000"/></linearGradient>
<linearGradient id="y" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#00ff00"/><stop offset="0.3" stop-color="#008000"/><stop offset="0.7" stop-color="#008000"/><stop offset="1" stop-color="#000000"/></linearGradient>
</defs>
<rect width="100" height="100" fill="#000"/>
<rect width="100" height="100" fill="url(#x)" style="mix-blend-mode:screen"/>
<rect width="100" height="100" fill="url(#y)" style="mix-blend-mode:screen"/>
<rect width="100" height="100" fill="#000080" style="mix-blend-mode:screen"/>
</svg>`,
)}`;

export function TabBar({
  active,
  hidden = false,
  onChange,
}: {
  active: TabId;
  hidden?: boolean;
  onChange: (id: TabId) => void;
}) {
  const activeIndex = TABS.findIndex((t) => t.id === active);

  return (
    <nav className={`tabbar${hidden ? ' is-hidden' : ''}`} aria-label="Main" aria-hidden={hidden}>
      <svg className="tabbar__defs" width="0" height="0" aria-hidden="true">
        <filter
          id="liquid-glass"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feImage href={LENS_MAP} preserveAspectRatio="none" result="map" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feDisplacementMap
            in="blur"
            in2="map"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <span
        className="tabbar__pill"
        aria-hidden="true"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`tabbar__item${tab.id === active ? ' is-active' : ''}`}
          aria-current={tab.id === active ? 'page' : undefined}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
