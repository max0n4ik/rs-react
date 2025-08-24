import type { JSX } from 'react';
import { useFormsStore } from '../store/FormsStore';
import Card from './Card';

export default function CardList(): JSX.Element {
  const cards = useFormsStore((state) => state.history);
  const latestByForm = useFormsStore((state) => state.latestByForm);
  const fieldChanges = useFormsStore((state) => state.fieldChanges);
  if (cards.length === 0) {
    return <div></div>;
  }

  return (
    <div className="flex max-w-[1260px] gap-2 bg-transparent overflow-x-scroll mb-5">
      {[...cards].reverse().map((card) => {
        const latestSubmissionForOrigin = latestByForm[card.origin];
        const shouldHighlight = latestSubmissionForOrigin && latestSubmissionForOrigin.id === card.id;

        const highlightMap = shouldHighlight ? fieldChanges[card.origin] : {};

        return <Card key={card.id} card={card} highlight={highlightMap || {}} />;
      })}
    </div>
  );
}
