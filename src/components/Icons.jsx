const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const BusIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="3" width="16" height="15" rx="3" />
    <path d="M4 11h16M8 21v-3M16 21v-3" />
    <circle cx="8" cy="14.5" r=".6" fill="currentColor" />
    <circle cx="16" cy="14.5" r=".6" fill="currentColor" />
  </svg>
);
export const UploadIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
  </svg>
);
export const ChevronIcon = (p) => (
  <svg {...base} width={16} height={16} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);
export const RouteIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="6" cy="18" r="2.2" />
    <circle cx="18" cy="6" r="2.2" />
    <path d="M8 18h6.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H16" />
  </svg>
);
export const WrenchIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.1L3.5 17.2a1.8 1.8 0 0 0 2.6 2.6l5.8-5.8a4 4 0 0 0 5.1-5.4l-2.6 2.6-2.2-.4-.4-2.2z" />
  </svg>
);
export const SearchIcon = (p) => (
  <svg {...base} width={16} height={16} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4-4" />
  </svg>
);
