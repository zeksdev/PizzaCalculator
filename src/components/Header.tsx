import type { ReactNode } from 'react';
import { strings } from '../strings';
import { BackIcon, PizzaIcon } from './icons';

interface HeaderProps {
  title: string;
  /** Shows a back link instead of the logo. */
  backHref?: string;
  action?: ReactNode;
}

export function Header({ title, backHref, action }: HeaderProps) {
  return (
    <header className="header">
      {backHref ? (
        <a className="icon-button" href={backHref} aria-label={strings.backToCalculator}>
          <BackIcon size={20} />
        </a>
      ) : (
        <span className="header__logo">
          <PizzaIcon size={20} />
        </span>
      )}
      <h1 className="header__title">{title}</h1>
      {action ?? <span />}
    </header>
  );
}
