export type LoginErrors = Partial<Record<'email' | 'password', string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};
  const e = email.trim();
  if (!e) errors.email = 'Enter your email';
  else if (!EMAIL.test(e)) errors.email = 'Enter a valid email';
  if (!password) errors.password = 'Enter your password';

  return errors;
}
