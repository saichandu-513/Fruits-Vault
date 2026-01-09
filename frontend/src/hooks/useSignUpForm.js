import { useState, useCallback } from 'react';

export function useSignUpForm(initialValues = { firstName: '', lastName: '', email: '', password: '', phone: '' }) {
  const [form, setForm] = useState(initialValues);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((event, onSubmit) => {
    event.preventDefault();
    if (typeof onSubmit === 'function') {
      onSubmit(form);
    }
  }, [form]);

  return { form, setForm, handleChange, handleSubmit };
}


