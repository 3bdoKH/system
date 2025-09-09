/**
 * Format a date string or Date object to a localized format
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "";

  const defaultOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("ar-SA", {
      ...defaultOptions,
      ...options,
    }).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

/**
 * Format a number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: SAR)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = "SAR") => {
  if (amount === undefined || amount === null) return "";

  try {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: currency,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `${amount} ${currency}`;
  }
};
