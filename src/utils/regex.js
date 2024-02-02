export const isValidEmail = email => {
  // Simple email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidText = text => {
  // Simple text validation regex
  const textRegex = /^[a-zA-Z]+$/;
  return textRegex.test(text);
};

export const isValidAlphaNumeric = text => {
  // Simple text validation regex
  const textRegex = /^[a-zA-Z0-9]+$/;
  return textRegex.test(text);
};
