export type SupportedDateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';

const normalize = (input: string): string => {
  if (!input) return '';
  const s = input.includes('T') ? input.slice(0, 10) : input;
  return s;
};

export const formatDate = (dateString: string, format: SupportedDateFormat = 'DD/MM/YYYY'): string => {
  const normalized = normalize(dateString);
  if (!normalized) return '';
  const parts = normalized.split('-');
  if (parts.length !== 3) {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return applyFormat(dd, mm, yyyy, format);
  }
  const [yyyy, mm, dd] = parts;
  return applyFormat(dd, mm, yyyy, format);
};

const applyFormat = (dd: string, mm: string, yyyy: string, format: SupportedDateFormat): string => {
  switch (format) {
    case 'DD/MM/YYYY':
      return `${dd}/${mm}/${yyyy}`;
    case 'MM/DD/YYYY':
      return `${mm}/${dd}/${yyyy}`;
    case 'YYYY-MM-DD':
      return `${yyyy}-${mm}-${dd}`;
    default:
      return `${dd}/${mm}/${yyyy}`;
  }
};


