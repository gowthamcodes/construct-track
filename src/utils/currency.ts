export function formatCurrency(amount: number) {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatCompactCurrency(amount: number) {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(1)}Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)}L`;
  if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(1)}K`;
  return `₹${Math.round(amount)}`;
}
