export const PASSWORD_POLICY_MESSAGE =
  "Password must be at least 8 characters and include at least 1 number and 1 special character, with no spaces.";

export const isPasswordValid = (password: string) =>
  password.length >= 8 &&
  /\d/.test(password) &&
  /[^A-Za-z0-9\s]/.test(password) &&
  !/\s/.test(password);
