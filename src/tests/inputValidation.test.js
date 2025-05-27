import { validateProductForm } from '../utils/validation';

const validForm = {
  name: 'Baju',
  supplier: 'Supplier A',
  quantity: 10,
  purchasePrice: 5000,
  date: '2024-05-01'
};

describe('Validasi Input Form', () => {
  it('valid jika semua field diisi benar', () => {
    expect(validateProductForm(validForm)).toBe(true);
  });

  it('invalid jika nama terlalu pendek', () => {
    const form = { ...validForm, name: 'A' };
    expect(validateProductForm(form)).toBe(false);
  });

  it('invalid jika jumlah <= 0', () => {
    const form = { ...validForm, quantity: 0 };
    expect(validateProductForm(form)).toBe(false);
  });
});
