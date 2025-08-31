const numberFormatter = new Intl.NumberFormat();

export const formatNumber = (value: number | null | undefined): string => {
  if (value == null || !Number.isFinite(value)) return 'N/A';
  return numberFormatter.format(value);
};

export const formatDecimal = (value: number | null | undefined, decimals: number = 6): string => {
  if (value == null || !Number.isFinite(value)) return 'N/A';
  const d = Math.max(0, Math.min(20, Math.trunc(decimals)));
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(value);
};

export const formatYear = (value: number | null | undefined): string => {
  if (value == null || isNaN(value)) return 'N/A';
  return value.toString();
};
