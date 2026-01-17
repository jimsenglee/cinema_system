/**
 * Formatting utilities following DRY principles
 * Centralized location for all formatting logic
 */

/**
 * Format price in Malaysian Ringgit
 * @param amount - The amount to format
 * @param currency - Currency symbol (default: "RM")
 */
export const formatPrice = (amount: number, currency: string = "RM"): string => {
  const formatted = amount.toFixed(2);
  return `${currency} ${formatted}`;
};

/**
 * Format date to readable string
 * @param date - Date string or Date object
 * @param format - Format type: 'short', 'long', 'time', 'full'
 */
export const formatDate = (
  date: string | Date,
  format: 'short' | 'long' | 'time' | 'full' = 'short'
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
    case 'long':
      return d.toLocaleDateString('en-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    case 'time':
      return d.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: true });
    case 'full':
      return `${formatDate(d, 'long')} at ${formatDate(d, 'time')}`;
    default:
      return d.toLocaleDateString('en-MY');
  }
};

/**
 * Format movie duration in minutes to hours and minutes
 * @param minutes - Duration in minutes
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

/**
 * Format phone number
 * @param phone - Phone number string
 */
export const formatPhone = (phone: string): string => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Format as +60 12-345 6789
  if (digits.startsWith('60')) {
    const countryCode = digits.slice(0, 2);
    const areaCode = digits.slice(2, 4);
    const part1 = digits.slice(4, 7);
    const part2 = digits.slice(7, 11);
    return `+${countryCode} ${areaCode}-${part1} ${part2}`;
  }
  
  return phone;
};

/**
 * Format seat label from row and number
 * @param row - Row letter
 * @param number - Seat number
 */
export const formatSeatLabel = (row: string, number: number): string => {
  return `${row}${number}`;
};

/**
 * Format seats array to readable string
 * @param seats - Array of seat labels
 */
export const formatSeats = (seats: string[]): string => {
  if (seats.length === 0) return 'No seats selected';
  if (seats.length === 1) return seats[0];
  if (seats.length === 2) return seats.join(' and ');
  
  const last = seats[seats.length - 1];
  const rest = seats.slice(0, -1).join(', ');
  return `${rest} and ${last}`;
};

/**
 * Format points with thousand separator
 * @param points - Points number
 */
export const formatPoints = (points: number): string => {
  return points.toLocaleString('en-MY');
};

/**
 * Format percentage
 * @param value - Decimal value (0-1)
 * @param decimals - Number of decimal places
 */
export const formatPercentage = (value: number, decimals = 0): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Format file size
 * @param bytes - File size in bytes
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param date - Date string or Date object
 */
export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(d, 'short');
};

/**
 * Format countdown timer from seconds
 * @param seconds - Total seconds remaining
 */
export const formatCountdownTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
