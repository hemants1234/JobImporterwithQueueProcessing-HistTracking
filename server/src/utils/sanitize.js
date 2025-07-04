function isValidDate(value) {
  return value instanceof Date && !isNaN(value.getTime());
}

function deepSanitize(obj) {
  if (Array.isArray(obj)) {
    return obj.map(deepSanitize);
  }

  if (obj && typeof obj === 'object' && !(obj instanceof Date)) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip MongoDB-sensitive keys
      if (key.includes('$') || key.includes('.')) continue;

      const sanitizedValue = deepSanitize(value);

      // Skip undefined or invalid nested values
      if (sanitizedValue !== undefined) {
        result[key] = sanitizedValue;
      }
    }
    return result;
  }

  // Special case: handle Date validation
  if (obj instanceof Date) {
    return isValidDate(obj) ? obj : undefined;
  }

  return obj;
}

module.exports = { deepSanitize };
