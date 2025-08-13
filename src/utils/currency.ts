export const formatMYR = (amount: number): string => {
  return new Intl.NumberFormat('ms-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatMYRCompact = (amount: number): string => {
  if (amount >= 1000000) {
    return `RM${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `RM${(amount / 1000).toFixed(1)}K`;
  }
  return formatMYR(amount);
};