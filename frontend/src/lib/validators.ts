/**
 * Validation utilities following DRY principles
 * Centralized location for all validation logic
 */

/**
 * Validate email format
 * @param email - Email address to validate
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

/**
 * Validate password strength
 * @param password - Password to validate
 */
export const validatePassword = (password: string): { 
  isValid: boolean; 
  error?: string;
  strength?: 'weak' | 'medium' | 'strong';
} => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters', strength: 'weak' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const strengthScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
  
  if (strengthScore < 2) {
    return { 
      isValid: false, 
      error: 'Password should contain uppercase, lowercase, numbers, and special characters',
      strength: 'weak' 
    };
  }
  
  const strength = strengthScore === 4 ? 'strong' : strengthScore === 3 ? 'medium' : 'weak';
  
  return { isValid: true, strength };
};

/**
 * Validate Malaysian phone number
 * @param phone - Phone number to validate
 */
export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Malaysian phone numbers: 10-11 digits (with or without country code)
  if (digits.length < 10 || digits.length > 13) {
    return { isValid: false, error: 'Please enter a valid Malaysian phone number' };
  }
  
  // Check if starts with 60 (country code) or 01 (mobile)
  if (!digits.startsWith('60') && !digits.startsWith('01')) {
    return { isValid: false, error: 'Phone number must start with +60 or 01' };
  }
  
  return { isValid: true };
};

/**
 * Validate credit card number (Luhn algorithm)
 * @param cardNumber - Credit card number
 */
export const validateCreditCard = (cardNumber: string): { 
  isValid: boolean; 
  error?: string;
  type?: 'visa' | 'mastercard' | 'amex' | 'unknown';
} => {
  if (!cardNumber) {
    return { isValid: false, error: 'Card number is required' };
  }
  
  const digits = cardNumber.replace(/\D/g, '');
  
  if (digits.length < 13 || digits.length > 19) {
    return { isValid: false, error: 'Invalid card number length' };
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) {
    return { isValid: false, error: 'Invalid card number' };
  }
  
  // Determine card type
  let type: 'visa' | 'mastercard' | 'amex' | 'unknown' = 'unknown';
  if (digits.startsWith('4')) type = 'visa';
  else if (digits.startsWith('5')) type = 'mastercard';
  else if (digits.startsWith('34') || digits.startsWith('37')) type = 'amex';
  
  return { isValid: true, type };
};

/**
 * Validate CVV/CVC
 * @param cvv - CVV number
 * @param cardType - Card type (amex requires 4 digits)
 */
export const validateCVV = (
  cvv: string, 
  cardType: 'amex' | 'other' = 'other'
): { isValid: boolean; error?: string } => {
  if (!cvv) {
    return { isValid: false, error: 'CVV is required' };
  }
  
  const requiredLength = cardType === 'amex' ? 4 : 3;
  
  if (cvv.length !== requiredLength) {
    return { isValid: false, error: `CVV must be ${requiredLength} digits` };
  }
  
  if (!/^\d+$/.test(cvv)) {
    return { isValid: false, error: 'CVV must contain only numbers' };
  }
  
  return { isValid: true };
};

/**
 * Validate expiry date (MM/YY format)
 * @param expiry - Expiry date string
 */
export const validateExpiryDate = (expiry: string): { isValid: boolean; error?: string } => {
  if (!expiry) {
    return { isValid: false, error: 'Expiry date is required' };
  }
  
  const parts = expiry.split('/');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Format should be MM/YY' };
  }
  
  const month = parseInt(parts[0]);
  const year = parseInt(parts[1]) + 2000;
  
  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Invalid month' };
  }
  
  const now = new Date();
  const expDate = new Date(year, month - 1);
  
  if (expDate < now) {
    return { isValid: false, error: 'Card has expired' };
  }
  
  return { isValid: true };
};

/**
 * Validate required field
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 */
export const validateRequired = (
  value: string | number | boolean | null | undefined,
  fieldName: string
): { isValid: boolean; error?: string } => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
};

/**
 * Validate minimum length
 * @param value - String to validate
 * @param minLength - Minimum length required
 * @param fieldName - Name of the field for error message
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string
): { isValid: boolean; error?: string } => {
  if (value.length < minLength) {
    return { 
      isValid: false, 
      error: `${fieldName} must be at least ${minLength} characters` 
    };
  }
  return { isValid: true };
};

/**
 * Validate maximum length
 * @param value - String to validate
 * @param maxLength - Maximum length allowed
 * @param fieldName - Name of the field for error message
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string
): { isValid: boolean; error?: string } => {
  if (value.length > maxLength) {
    return { 
      isValid: false, 
      error: `${fieldName} must not exceed ${maxLength} characters` 
    };
  }
  return { isValid: true };
};

/**
 * Validate number range
 * @param value - Number to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @param fieldName - Name of the field for error message
 */
export const validateRange = (
  value: number,
  min: number,
  max: number,
  fieldName: string
): { isValid: boolean; error?: string } => {
  if (value < min || value > max) {
    return { 
      isValid: false, 
      error: `${fieldName} must be between ${min} and ${max}` 
    };
  }
  return { isValid: true };
};

/**
 * Validate that two values match
 * @param value1 - First value
 * @param value2 - Second value
 * @param fieldName - Name of the field for error message
 */
export const validateMatch = (
  value1: string,
  value2: string,
  fieldName: string = "Values"
): { isValid: boolean; error?: string; errors?: string[] } => {
  if (value1 !== value2) {
    return { isValid: false, error: `${fieldName} do not match`, errors: [`${fieldName} do not match`] };
  }
  return { isValid: true };
};

/**
 * Check password strength and return score
 * Returns a score from 0-5 based on password characteristics
 * @param password - Password to check
 */
export const checkPasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length check
  if (password.length >= 6) strength += 1;
  if (password.length >= 8) strength += 1;
  
  // Character type checks
  if (/[A-Z]/.test(password)) strength += 1;  // Has uppercase
  if (/[0-9]/.test(password)) strength += 1;  // Has numbers
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;  // Has special characters
  
  return strength;
};

