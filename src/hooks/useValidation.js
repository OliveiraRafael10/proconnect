// Hook personalizado para validação de formulários
import { useState, useCallback } from 'react';

export const useValidation = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validações específicas
  const validators = {
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) return 'Email é obrigatório';
      if (!emailRegex.test(value)) return 'Email inválido';
      return null;
    },
    
    nome: (value) => {
      if (!value) return 'Nome é obrigatório';
      if (value.length < 2) return 'Nome deve ter pelo menos 2 caracteres';
      return null;
    },
    
    telefone: (value) => {
      const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      if (!value) return 'Telefone é obrigatório';
      if (!phoneRegex.test(value)) return 'Telefone inválido';
      return null;
    },
    
    cep: (value) => {
      const cepRegex = /^\d{5}-\d{3}$/;
      if (!value) return 'CEP é obrigatório';
      if (!cepRegex.test(value)) return 'CEP inválido';
      return null;
    },
    
    required: (value) => {
      if (!value || value.trim() === '') return 'Este campo é obrigatório';
      return null;
    }
  };

  const validateField = useCallback((name, value) => {
    const validator = validators[name];
    if (validator) {
      return validator(value);
    }
    return null;
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validar campo em tempo real
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(values).forEach(key => {
      const error = validateField(key, values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return isValid;
  }, [values, validateField]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues,
    isValid: Object.keys(errors).length === 0
  };
};
