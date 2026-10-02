import type { ReactNode } from 'react';

interface IngredientRowProps {
  icon: ReactNode;
  name: string;
  note?: string;
  amount: string;
  percent: string;
}

export function IngredientRow({ icon, name, note, amount, percent }: IngredientRowProps) {
  return (
    <li className="ingredient-row">
      {icon}
      <span className="ingredient-row__name">
        <span>{name}</span>
        {note && <span className="ingredient-row__note">{note}</span>}
      </span>
      <span className="ingredient-row__amount">{amount}</span>
      <span className="ingredient-row__percent">{percent}</span>
    </li>
  );
}
