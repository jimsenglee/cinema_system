import { useState, useCallback, useMemo } from "react";

/**
 * Validation rule for a form field
 */
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message: string;
}

/**
 * Field configuration with validation rules
 */
export interface FieldConfig {
  [fieldName: string]: ValidationRule[];
}

/**
 * Form values (string keys and string values)
 */
export interface FormValues {
  [fieldName: string]: string;
}

/**
 * Form errors (string keys and string error messages)
 */
export interface FormErrors {
  [fieldName: string]: string;
}

/**
 * Custom hook for form validation
 * 
 * Features:
 * - Field-level validation with multiple rules
 * - Real-time validation on change/blur
 * - Form-level validation for submit
 * - Error message management
 * - Touched field tracking
 * 
 * @param fieldConfig Configuration object with validation rules per field
 * @param initialValues Initial form values
 * 
 * @example
 * const { values, errors, handleChange, handleSubmit, isValid } = useFormValidation({
 *   email: [
 *     { required: true, message: "Email is required" },
 *     { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" }
 *   ],
 *   password: [
 *     { required: true, message: "Password is required" },
 *     { minLength: 8, message: "Must be at least 8 characters" }
 *   ]
 * });
 */
export function useFormValidation(
  fieldConfig: FieldConfig,
  initialValues: FormValues = {}
) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  /**
   * Validate a single field against its rules
   */
  const validateField = useCallback((fieldName: string, value: string): string => {
    const rules = fieldConfig[fieldName];
    if (!rules) return "";

    for (const rule of rules) {
      // Required check
      if (rule.required && !value.trim()) {
        return rule.message;
      }

      // Skip other validations if field is empty and not required
      if (!value.trim()) continue;

      // Min length check
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message;
      }

      // Max length check
      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message;
      }

      // Pattern check
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message;
      }

      // Custom validation
      if (rule.custom && !rule.custom(value)) {
        return rule.message;
      }
    }

    return "";
  }, [fieldConfig]);

  /**
   * Validate all fields and return errors object
   */
  const validateAllFields = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    Object.keys(fieldConfig).forEach(fieldName => {
      const value = values[fieldName] || "";
      const error = validateField(fieldName, value);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    return newErrors;
  }, [fieldConfig, values, validateField]);

  /**
   * Handle input change with optional immediate validation
   */
  const handleChange = useCallback((fieldName: string, value: string, validateImmediately: boolean = false) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));

    // Validate immediately if requested or field was already touched
    if (validateImmediately || touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  }, [touched, validateField]);

  /**
   * Handle field blur (mark as touched and validate)
   */
  const handleBlur = useCallback((fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    const value = values[fieldName] || "";
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  }, [values, validateField]);

  /**
   * Handle form submission with full validation
   */
  const handleSubmit = useCallback((onSuccess: (values: FormValues) => void) => {
    return (e?: React.FormEvent) => {
      e?.preventDefault();

      // Mark all fields as touched
      const allTouched: { [key: string]: boolean } = {};
      Object.keys(fieldConfig).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);

      // Validate all fields
      const newErrors = validateAllFields();
      setErrors(newErrors);

      // If no errors, call success callback
      if (Object.keys(newErrors).length === 0) {
        onSuccess(values);
      }
    };
  }, [fieldConfig, values, validateAllFields]);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /**
   * Set a specific error manually
   */
  const setError = useCallback((fieldName: string, error: string) => {
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Set form values programmatically
   */
  const setFormValues = useCallback((newValues: FormValues) => {
    setValues(newValues);
  }, []);

  /**
   * Check if form is valid (no errors and all required fields filled)
   */
  const isValid = useMemo(() => {
    const allErrors = validateAllFields();
    return Object.keys(allErrors).length === 0;
  }, [validateAllFields]);

  /**
   * Check if a specific field has error and is touched
   */
  const getFieldError = useCallback((fieldName: string): string => {
    return touched[fieldName] ? errors[fieldName] || "" : "";
  }, [touched, errors]);

  return {
    values,
    errors,
    touched,
    isValid,
    
    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,
    
    // Utility methods
    validateField,
    validateAllFields,
    getFieldError,
    resetForm,
    setError,
    clearErrors,
    setFormValues,
  };
}
