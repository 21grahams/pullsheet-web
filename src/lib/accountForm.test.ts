import { describe, expect, it } from 'vitest';
import type { RetailerAccount } from '../api/types';
import { emptyAccountForm, formFromAccount, toAccountInput, validateAccountForm } from './accountForm';

const account = (loop: string): RetailerAccount => ({
  id: 1,
  retailer: 'Target',
  label: 'Main',
  email: 'a@b.com',
  cardLast2: '34',
  phoneLast4: '5678',
  loop,
  notes: '',
});

describe('formFromAccount', () => {
  it('reads old TRUE/FALSE loop values as Yes/No', () => {
    expect(formFromAccount(account('TRUE')).loop).toBe('Yes');
    expect(formFromAccount(account('yes')).loop).toBe('Yes');
    expect(formFromAccount(account('FALSE')).loop).toBe('No');
    expect(formFromAccount(account('')).loop).toBe('No');
  });
});

describe('validateAccountForm', () => {
  it('needs a retailer and a label', () => {
    expect(validateAccountForm(emptyAccountForm())).toBe('Enter a retailer');
    expect(validateAccountForm({ ...emptyAccountForm(), retailer: 'Target' })).toBe('Enter an account label');
    expect(validateAccountForm({ ...emptyAccountForm(), retailer: 'Target', label: 'Main' })).toBeNull();
  });
});

describe('toAccountInput', () => {
  it('trims every field', () => {
    const input = toAccountInput({ ...formFromAccount(account('Yes')), label: ' Main ', notes: ' hi \n' });
    expect(input).toEqual({
      label: 'Main',
      email: 'a@b.com',
      cardLast2: '34',
      phoneLast4: '5678',
      loop: 'Yes',
      notes: 'hi',
    });
  });
});
