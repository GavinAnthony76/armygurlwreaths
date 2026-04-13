export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `AGW-${year}-${random}`;
}
