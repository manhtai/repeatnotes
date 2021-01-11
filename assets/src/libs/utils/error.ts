// Return [firstErrorMessage, { field: errorMessage }]
export const parseResponseErrors = (err: any) => {
  const errors = err.response?.body?.error?.errors;

  if (errors) {
    const parsedErrors = Object.entries(errors)
      .map(([k, v]) => ({[k]: Array.isArray(v) ? v[0] : v}))
      .reduce((a, b) => ({...a, ...b}), {});
    const [firstField, firstError] = Object.entries(parsedErrors)[0];
    const firstErrorMessage = `${firstField} ${firstError}`;
    return [firstErrorMessage, parsedErrors];
  }
  return [err.response?.body?.error?.message || 'Server error', null];
};
