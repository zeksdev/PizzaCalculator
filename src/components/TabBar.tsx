import { strings } from '../strings';
import { BookIcon, CalculatorIcon } from './icons';

export type Tab = 'calculator' | 'recipe';

export function TabBar({ active }: { active: Tab }) {
  return (
    <nav className="tab-bar" aria-label={strings.mainNavigation}>
      <a className="tab-bar__tab" href="#/" aria-current={active === 'calculator' ? 'page' : undefined}>
        <CalculatorIcon />
        {strings.tabCalculator}
      </a>
      <a className="tab-bar__tab" href="#/recept" aria-current={active === 'recipe' ? 'page' : undefined}>
        <BookIcon />
        {strings.tabRecipe}
      </a>
    </nav>
  );
}
