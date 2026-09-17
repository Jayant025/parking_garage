export const billingService = {
  /**
   * Calculates the exact parking fee based on entry and exit timestamps and pricing configuration.
   * Billing Rule:
   * - chargedHours = Math.ceil(durationMinutes / 60) (minimum 1 hour)
   * - fee = chargedHours <= 1 ? firstHourRate : firstHourRate + (chargedHours - 1) * additionalHourRate
   * - totalSubtotal = MIN(fee, dailyMaximumCap)
   * - taxAmount = 8% municipal tax
   * - totalFee = subtotal + taxAmount
   */
  calculateFee: (entryTime, exitTime = new Date(), pricingConfig) => {
    const start = new Date(entryTime);
    const end = new Date(exitTime);

    const durationMs = Math.max(0, end.getTime() - start.getTime());
    const durationMinutes = Math.max(1, Math.round(durationMs / (1000 * 60)));

    // Ceiling rounding for partial hours
    const chargedHours = Math.max(1, Math.ceil(durationMinutes / 60));

    const firstHourRate = pricingConfig?.firstHourRate ?? 10;
    const additionalHourRate = pricingConfig?.additionalHourRate ?? 8;
    const dailyMaxCap = pricingConfig?.dailyMaxCap ?? 40;

    let subtotal = 0;
    if (chargedHours <= 1) {
      subtotal = firstHourRate;
    } else {
      subtotal = firstHourRate + (chargedHours - 1) * additionalHourRate;
    }

    // Apply Daily Maximum Cap
    let capStatus = 'Not Exceeded';
    if (subtotal > dailyMaxCap) {
      subtotal = dailyMaxCap;
      capStatus = 'Cap Applied';
    }

    const taxAmount = Math.round(subtotal * 0.08 * 100) / 100;
    const totalFee = Math.round((subtotal + taxAmount) * 100) / 100;

    return {
      durationMinutes,
      chargedHours,
      firstHourRate,
      additionalHourRate,
      dailyMaxCap,
      capStatus,
      subtotal,
      taxAmount,
      totalFee,
    };
  },
};
