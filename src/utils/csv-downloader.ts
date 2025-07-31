type CardProps = {
  id: number;
  name: string;
  image?: string;
};

const createCSV = (cards: CardProps[]): string => {
  const header = 'id,name,image_url';

  if (cards.length === 0) {
    return header;
  }

  const rows = cards
    .map((card) => `${card.id},"${card.name}",${card.image}`)
    .join('\n');

  return `${header}\n${rows}`;
};

export const downloadCSV = (cards: CardProps[]) => {
  const csvContent = createCSV(cards);

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', 'selected_cards.csv');

  link.click();

  URL.revokeObjectURL(url);
};
