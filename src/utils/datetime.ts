export function formatDateToCustomFormat(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();

  return `${day} ${month} ${hours}:${minutes}`;
}