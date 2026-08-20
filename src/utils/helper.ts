export function formatCategory(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export function formatPaymentMode(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
}

export function formatDateHeader(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  // @ts-ignore
  const date = new Date(year, month - 1, day);
  const today = new Date();

  if (getDateKey(today) === value) return 'Today';

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (getDateKey(yesterday) === value) return 'Yesterday';

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
