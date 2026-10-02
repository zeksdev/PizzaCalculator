import { CheckIcon } from './icons';

export function Toast({ message }: { message: string }) {
  return (
    <div className="toast" role="status">
      <CheckIcon size={20} className="toast__icon" />
      {message}
    </div>
  );
}
