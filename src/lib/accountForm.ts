import type { AccountInput } from '../api';
import type { RetailerAccount } from '../api/types';

export interface AccountFormValues {
  retailer: string;
  label: string;
  email: string;
  cardLast2: string;
  phoneLast4: string;
  loop: 'Yes' | 'No';
  notes: string;
}

export const emptyAccountForm = (): AccountFormValues => ({
  retailer: '',
  label: '',
  email: '',
  cardLast2: '',
  phoneLast4: '',
  loop: 'No',
  notes: '',
});

export function formFromAccount(a: RetailerAccount): AccountFormValues {
  return {
    retailer: a.retailer,
    label: a.label,
    email: a.email,
    cardLast2: a.cardLast2,
    phoneLast4: a.phoneLast4,
    // Old sheet rows may say TRUE/FALSE instead of Yes/No.
    loop: /^(yes|true)$/i.test(a.loop.trim()) ? 'Yes' : 'No',
    notes: a.notes,
  };
}

export function validateAccountForm(f: AccountFormValues): string | null {
  if (!f.retailer.trim()) return 'Enter a retailer';
  if (!f.label.trim()) return 'Enter an account label';
  return null;
}

export function toAccountInput(f: AccountFormValues): AccountInput {
  return {
    label: f.label.trim(),
    email: f.email.trim(),
    cardLast2: f.cardLast2.trim(),
    phoneLast4: f.phoneLast4.trim(),
    loop: f.loop,
    notes: f.notes.trim(),
  };
}
