import type { ReactNode } from 'react';

export function SummaryBar({ items }: { items: { icon: ReactNode; text: string }[] }) {
  return (
    <div className="summary-bar">
      {items.map(({ icon, text }) => (
        <span key={text} className="summary-bar__item">
          {icon}
          {text}
        </span>
      ))}
    </div>
  );
}
