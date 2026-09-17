/**
 * Centralized currency formatting utility for Indian Rupee (INR / ₹)
 * Formats numbers into Indian Numbering System (e.g. ₹50, ₹1,000, ₹1,00,000)
 */
export const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
