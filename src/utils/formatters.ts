const numberFormatter = new Intl.NumberFormat();

export const formatNumber = (value: number | null | undefined): string => {
  if (value == null || isNaN(value)) return 'N/A';
  return numberFormatter.format(value);
};

export const formatDecimal = (value: number | null | undefined, decimals: number = 6): string => {
  if (value == null || isNaN(value)) return 'N/A';
  return Number(value).toFixed(decimals);
};

export const formatYear = (value: number | null | undefined): string => {
  if (value == null || isNaN(value)) return 'N/A';
  return value.toString();
};
