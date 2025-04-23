
export default function formatCurrency(amountInCents, currency='usd') {
    const amount = amountInCents / 100;
  
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
  