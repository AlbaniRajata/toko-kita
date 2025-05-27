export const validateProductForm = (form) => {
  return (
    form.name?.length >= 2 &&
    form.supplier?.length >= 2 &&
    form.quantity > 0 &&
    form.purchasePrice >= 0 &&
    !!form.date
  );
};
