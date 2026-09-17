export const normalizePlate = (plate) => {
  if (!plate || typeof plate !== 'string') return '';
  // Remove all non-alphanumeric characters and convert to UPPERCASE
  return plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
};
