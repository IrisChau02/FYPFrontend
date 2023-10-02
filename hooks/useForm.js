import { useState } from 'react';

export default function useForm(getFreshModelObject) {
  const [values, setValues] = useState(getFreshModelObject());
  const [error, setErrors] = useState({});

  const handleInputChange = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  return {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange,
  };
}