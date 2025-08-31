import clsx from 'clsx';
import { memo } from 'react';

function Cell({ children, highlighted }: { children: React.ReactNode; highlighted: boolean }) {
  return (
    <div
      className={clsx(
        'col-span-1 flex place-content-center rounded-sm px-2 py-1 transition-colors duration-700',
        highlighted && 'bg-green-300/30'
      )}>
      <span className="text-sm">{children}</span>
    </div>
  );
}

export default memo(Cell);
