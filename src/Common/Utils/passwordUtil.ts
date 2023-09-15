import bcrypt from 'bcrypt';

export async function hash(input: string): Promise<string> {
  return bcrypt.hash(input, 5);
}

export async function compare(
  inputValue: string,
  hashedValue: string,
): Promise<boolean> {
  return bcrypt.compare(inputValue, hashedValue);
}
