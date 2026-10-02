import type { ReactNode } from 'react';

interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function icon(paths: ReactNode, defaultStrokeWidth = 2) {
  return function Icon({ size = 24, strokeWidth = defaultStrokeWidth, className }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        className={className}
      >
        {paths}
      </svg>
    );
  };
}

export const PizzaIcon = icon(
  <>
    <path d="M12 3 3.5 19.5c5.7 2 11.3 2 17 0z" />
    <circle cx="11" cy="13" r="1.1" />
    <circle cx="14.5" cy="17" r="1.1" />
    <circle cx="8.8" cy="17.4" r="1" />
  </>,
);
export const ResetIcon = icon(
  <>
    <path d="M21 12a9 9 0 1 1-3-6.7" />
    <path d="M21 4v5h-5" />
  </>,
  2.2,
);
export const BackIcon = icon(
  <>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </>,
  2.2,
);
export const ChevronDownIcon = icon(<path d="m6 9 6 6 6-6" />, 2.2);
export const ChevronUpIcon = icon(<path d="m18 15-6-6-6 6" />, 2.2);
export const PencilIcon = icon(
  <>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </>,
  2.2,
);
export const ShareIcon = icon(
  <>
    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
    <path d="M12 3v12" />
    <path d="m7 8 5-5 5 5" />
  </>,
  2.2,
);
export const ClockIcon = icon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>,
);
export const TimerIcon = icon(
  <>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2 2" />
    <path d="M10 2h4" />
  </>,
  2.2,
);
export const DoughIcon = icon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 10c1.5-1 3-1 4 0s2.5 1 4 0" />
    <path d="M8 14.5c1.5-1 3-1 4 0s2.5 1 4 0" />
  </>,
);
export const DoughBallIcon = icon(<path d="M6 20h12l1.5-8a7.5 7.5 0 0 0-15 0z" />, 2.2);
export const BallsIcon = icon(
  <>
    <circle cx="7" cy="8" r="3" />
    <circle cx="17" cy="8" r="3" />
    <circle cx="12" cy="16" r="3" />
  </>,
  2.2,
);
export const PercentIcon = icon(
  <>
    <path d="M19 5 5 19" />
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </>,
);
export const InfoIcon = icon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 8h.01" />
  </>,
);
export const WheatIcon = icon(
  <>
    <path d="M12 21V8" />
    <path d="M12 8c-2-1-3-3-3-5 2 0 3 2 3 5z" />
    <path d="M12 8c2-1 3-3 3-5-2 0-3 2-3 5z" />
    <path d="M12 13c-2-1-3.5-3-3.5-5 2 .5 3.5 2.5 3.5 5z" />
    <path d="M12 13c2-1 3.5-3 3.5-5-2 .5-3.5 2.5-3.5 5z" />
    <path d="M12 18c-2-1-3.5-3-3.5-5 2 .5 3.5 2.5 3.5 5z" />
    <path d="M12 18c2-1 3.5-3 3.5-5-2 .5-3.5 2.5-3.5 5z" />
  </>,
  1.8,
);
export const DropIcon = icon(<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />, 1.8);
export const ShakerIcon = icon(
  <>
    <path d="M8 9h8l1 12H7z" />
    <path d="M8 9c0-3 1.8-6 4-6s4 3 4 6" />
    <path d="M11 6h.01M13 6h.01" />
  </>,
  1.8,
);
export const YeastIcon = icon(
  <>
    <path d="M12 3c2 1.5 4.5 1 6 3s.5 4.5 1.5 6.5-1 4.5-3 5.5-4 2-6.5 1-5-1.5-5.5-4 1-4 .5-6.5S8 4 12 3z" />
    <circle cx="10" cy="10" r=".8" />
    <circle cx="14" cy="13" r=".8" />
    <circle cx="10.5" cy="15.5" r=".8" />
  </>,
);
export const SnowflakeIcon = icon(
  <>
    <path d="M12 2v20" />
    <path d="m4.9 4.9 14.2 14.2" />
    <path d="M2 12h20" />
    <path d="m4.9 19.1 14.2-14.2" />
  </>,
);
export const HouseIcon = icon(
  <>
    <path d="M3 11 12 4l9 7" />
    <path d="M5 10v10h14V10" />
    <path d="M10 20v-5h4v5" />
  </>,
);
export const CalculatorIcon = icon(
  <>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M8 7h8" />
    <path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
  </>,
);
export const BookIcon = icon(
  <>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" />
    <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
  </>,
);
export const CheckIcon = icon(<path d="M20 6 9 17l-5-5" />, 2.6);
