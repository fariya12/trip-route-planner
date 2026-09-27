import { validateEmail, validatePassword } from '../utils/validation';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface MockUser {
  readonly id: string;
  readonly email: string;
  readonly authentication: 'mock';
}

/** Assignment-only simulation. No real authentication, persistence or security guarantee. */
export async function mockLogin({ email, password }: LoginCredentials): Promise<MockUser> {
  const normalizedEmail = email.trim();
  const error = validateEmail(normalizedEmail) ?? validatePassword(password);
  if (error) throw new Error(error);
  await new Promise<void>((resolve) => setTimeout(resolve, 600));
  return { id: `mock:${normalizedEmail}`, email: normalizedEmail, authentication: 'mock' };
}
