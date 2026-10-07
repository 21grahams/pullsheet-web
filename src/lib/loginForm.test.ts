import { describe, expect, it } from 'vitest';

import { validateLogin } from './loginForm';

describe('validateLogin', () => {
  it('needs both fields', () => {
    expect(validateLogin('', '')).toEqual({ email: 'Enter your email', password: 'Enter your password' });
  });
  it('rejects emails without a name, @ and domain', () => {
    for (const bad of ['graham', 'graham@', '@gmail.com', 'graham@gmail', 'gra ham@gmail.com']) {
      expect(validateLogin(bad, 'x').email).toBe('Enter a valid email');
    }
  });
  it('accepts a normal email, ignoring surrounding spaces', () => {
    expect(validateLogin(' me@example.com ', 'hunter22')).toEqual({});
  });
});
