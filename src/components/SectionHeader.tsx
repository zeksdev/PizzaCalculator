import type { ReactNode } from 'react';

interface FormSectionHeaderProps {
  id?: string;
  icon: ReactNode;
  children: ReactNode;
}

/** Calculator section title: icon + title, no rule. */
export function FormSectionHeader({ id, icon, children }: FormSectionHeaderProps) {
  return (
    <h2 className="form-section-header" id={id}>
      {icon}
      {children}
    </h2>
  );
}

interface ListSectionHeaderProps {
  id?: string;
  children: ReactNode;
  action?: ReactNode;
}

/** List section title with an optional action, underlined by the accent rule. */
export function ListSectionHeader({ id, children, action }: ListSectionHeaderProps) {
  return (
    <div className="list-section-header">
      <h2 id={id}>{children}</h2>
      {action}
    </div>
  );
}
