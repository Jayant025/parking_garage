/**
 * Utility for Level 1 - T4 Messy Rate Card Import, Cleaning & Normalization
 */

export const normalizeSpotType = (rawType) => {
  if (!rawType || typeof rawType !== 'string') return null;
  const clean = rawType.trim().toUpperCase();

  if (['COMPACT', 'COMPACT_SEDAN', 'SEDAN', 'MINI'].includes(clean)) {
    return 'COMPACT';
  }
  if (['STANDARD', 'STANDARD_SUV', 'SUV', 'TRUCK', 'CAR'].includes(clean)) {
    return 'STANDARD';
  }
  if (['EV', 'ELECTRIC', 'EV_FAST', 'CHARGING'].includes(clean)) {
    return 'EV';
  }

  return null;
};

export const cleanCurrencyString = (rawValue) => {
  if (rawValue === undefined || rawValue === null) return null;

  if (typeof rawValue === 'number') {
    return isNaN(rawValue) || rawValue < 0 ? null : rawValue;
  }

  if (typeof rawValue !== 'string') return null;

  let str = rawValue.trim();
  if (!str) return null;

  // Replace common messy currency strings/suffixes
  // Examples: ₹50, Rs 50, Rs. 50/-, 50 INR, 50 rupees, ₹50/hr, 50 per hour, /day
  str = str
    .replace(/₹/g, '')
    .replace(/Rs\.?/gi, '')
    .replace(/INR/gi, '')
    .replace(/rupees?/gi, '')
    .replace(/\/hr/gi, '')
    .replace(/per hour/gi, '')
    .replace(/\/day/gi, '')
    .replace(/per day/gi, '')
    .replace(/\/-/g, '')
    .replace(/,/g, '')
    .trim();

  const parsed = parseFloat(str);
  if (isNaN(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
};

/**
 * Parses raw messy rate card data (JSON array, JSON object, or CSV string)
 * Returns { success: boolean, cleanedTiers: [...], errors: [...] }
 */
export const cleanAndValidateRateCard = (rawData) => {
  const errors = [];
  let rawList = [];

  if (!rawData) {
    return { success: false, cleanedTiers: [], errors: ['Rate card input is required.'] };
  }

  // Handle object or array input
  if (typeof rawData === 'object') {
    if (Array.isArray(rawData)) {
      rawList = rawData;
    } else if (rawData.tiers && Array.isArray(rawData.tiers)) {
      rawList = rawData.tiers;
    } else {
      rawList = [rawData];
    }
  } else if (typeof rawData === 'string') {
    const trimmed = rawData.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        rawList = Array.isArray(parsed) ? parsed : parsed.tiers || [parsed];
      } catch (err) {
        return { success: false, cleanedTiers: [], errors: ['Invalid JSON format in rate card input.'] };
      }
    } else {
      // Parse CSV text
      const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) {
        return { success: false, cleanedTiers: [], errors: ['Rate card string is empty.'] };
      }

      // Check if first line is header
      const firstLine = lines[0].toLowerCase();
      const hasHeader = firstLine.includes('type') || firstLine.includes('hour') || firstLine.includes('rate');
      const dataLines = hasHeader ? lines.slice(1) : lines;

      rawList = dataLines.map((line, idx) => {
        const parts = line.split(',').map((p) => p.trim());
        return {
          vehicleType: parts[0] || '',
          firstHourRate: parts[1] || '',
          additionalHourRate: parts[2] || '',
          dailyMaxCap: parts[3] || '',
          evFeePerHour: parts[4] || '0',
          _line: idx + (hasHeader ? 2 : 1),
        };
      });
    }
  }

  if (rawList.length === 0) {
    return { success: false, cleanedTiers: [], errors: ['No valid rate entries found in rate card.'] };
  }

  const cleanedMap = new Map();

  rawList.forEach((item, index) => {
    const lineNum = item._line || index + 1;
    const rawType = item.vehicleType || item.spotType || item.type || item.VehicleType || item.SpotType;

    const normalizedType = normalizeSpotType(rawType);
    if (!normalizedType) {
      errors.push(`Entry #${lineNum}: Unrecognized or unsupported spot type "${rawType}". Supported: COMPACT, STANDARD, EV.`);
      return;
    }

    const firstHourRaw = item.firstHourRate ?? item.firstHour ?? item.first_hour_rate ?? item.first_hour;
    const additionalHourRaw = item.additionalHourRate ?? item.additionalHour ?? item.additional_hour_rate ?? item.additional_hour;
    const dailyMaxRaw = item.dailyMaxCap ?? item.dailyMax ?? item.daily_max_cap ?? item.daily_maximum ?? item.daily_max;
    const evFeeRaw = item.evFeePerHour ?? item.evFee ?? item.ev_fee_per_hour ?? 0;

    const firstHourRate = cleanCurrencyString(firstHourRaw);
    if (firstHourRate === null) {
      errors.push(`Entry #${lineNum} (${normalizedType}): Could not parse first hour rate "${firstHourRaw}". Must be a valid positive number.`);
    }

    const additionalHourRate = cleanCurrencyString(additionalHourRaw);
    if (additionalHourRate === null) {
      errors.push(`Entry #${lineNum} (${normalizedType}): Could not parse additional hour rate "${additionalHourRaw}". Must be a valid positive number.`);
    }

    const dailyMaxCap = cleanCurrencyString(dailyMaxRaw);
    if (dailyMaxCap === null) {
      errors.push(`Entry #${lineNum} (${normalizedType}): Could not parse daily maximum cap "${dailyMaxRaw}". Must be a valid positive number.`);
    }

    const evFeePerHour = cleanCurrencyString(evFeeRaw) ?? 0;

    if (firstHourRate !== null && additionalHourRate !== null && dailyMaxCap !== null) {
      cleanedMap.set(normalizedType, {
        vehicleType: normalizedType,
        name:
          normalizedType === 'COMPACT'
            ? 'Compact Sedan / Mini'
            : normalizedType === 'STANDARD'
            ? 'Standard SUV / Truck'
            : 'EV Fast Bay (Level 2 22kW)',
        firstHourRate,
        additionalHourRate,
        dailyMaxCap,
        evFeePerHour,
      });
    }
  });

  if (errors.length > 0) {
    return { success: false, cleanedTiers: [], errors };
  }

  const cleanedTiers = Array.from(cleanedMap.values());
  return { success: true, cleanedTiers, errors: [] };
};
