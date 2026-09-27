export function validateEmail(email: string): string | undefined {
  const normalized = email.trim();
  if (!normalized) return 'Email is required';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
    ? undefined : 'Please enter a valid email address';
}

export function validatePassword(password: string): string | undefined {
  if (password.length === 0) return 'Password is required';
  return password.length >= 6 ? undefined : 'Password must be at least 6 characters';
}
