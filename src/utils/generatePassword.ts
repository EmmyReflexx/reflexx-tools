interface PasswordOptions {
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

/**
 * Generates a cryptographically secure password using Web Crypto API
 * @param length - Password length (must be > 0)
 * @param options - Character type options
 * @returns Generated password string
 * @throws Error if no character types selected or length is invalid
 */
export function generatePassword(length: number, options: PasswordOptions): string {
  // Character sets
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Build the character pool based on options
  let charPool = "";
  if (options.lowercase) charPool += lowercaseChars;
  if (options.uppercase) charPool += uppercaseChars;
  if (options.numbers) charPool += numberChars;
  if (options.symbols) charPool += symbolChars;

  // Validate: at least one character type must be selected
  if (charPool.length === 0) {
    throw new Error("At least one character type must be selected");
  }

  // Validate length
  if (length <= 0) {
    throw new Error("Password length must be greater than 0");
  }

  // Use Web Crypto API for cryptographically secure random numbers
  // This is more secure than Math.random() for password generation
  const randomBytes = new Uint32Array(length);
  crypto.getRandomValues(randomBytes);

  // Generate the password using secure random values
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % charPool.length;
    password += charPool[randomIndex];
  }

  return password;
}

/**
 * Extended version that guarantees at least one character from each selected type
 * This ensures the password meets all selected criteria
 */
export function generatePasswordGuaranteed(
  length: number,
  options: PasswordOptions
): string {
  // Validate first
  if (length <= 0) {
    throw new Error("Password length must be greater than 0");
  }

  const selectedTypes: string[] = [];
  if (options.lowercase) selectedTypes.push("abcdefghijklmnopqrstuvwxyz");
  if (options.uppercase) selectedTypes.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if (options.numbers) selectedTypes.push("0123456789");
  if (options.symbols) selectedTypes.push("!@#$%^&*()_+-=[]{}|;:,.<>?");

  if (selectedTypes.length === 0) {
    throw new Error("At least one character type must be selected");
  }

  // If length is less than number of selected types, fall back to regular generation
  if (length < selectedTypes.length) {
    return generatePassword(length, options);
  }

  // Build full character pool
  const charPool = selectedTypes.join("");

  // Generate secure random values
  const randomBytes = new Uint32Array(length);
  crypto.getRandomValues(randomBytes);

  // Start with one character from each selected type
  const passwordArray: string[] = [];
  for (let i = 0; i < selectedTypes.length; i++) {
    const charSet = selectedTypes[i];
    const randomIndex = randomBytes[i] % charSet.length;
    passwordArray.push(charSet[randomIndex]);
  }

  // Fill the rest with random characters from the full pool
  for (let i = selectedTypes.length; i < length; i++) {
    const randomIndex = randomBytes[i] % charPool.length;
    passwordArray.push(charPool[randomIndex]);
  }

  // Shuffle the array to avoid predictable pattern (selected types first)
  // Fisher-Yates shuffle using secure random
  const shuffleBytes = new Uint32Array(passwordArray.length);
  crypto.getRandomValues(shuffleBytes);

  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = shuffleBytes[i] % (i + 1);
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  return passwordArray.join("");
}

/**
 * Calculates the entropy of a password in bits
 * Useful for displaying password strength
 */
export function calculateEntropy(password: string): number {
  if (!password) return 0;

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32; // Approximate for symbols

  if (poolSize === 0) return 0;

  return Math.log2(Math.pow(poolSize, password.length));
}

/**
 * Estimates password strength based on entropy
 */
export function getPasswordStrength(password: string): {
  score: 1 | 2 | 3 | 4 | 5;
  label: string;
  color: string;
} {
  const entropy = calculateEntropy(password);

  if (entropy < 28) {
    return { score: 1, label: "Very Weak", color: "text-red-500" };
  } else if (entropy < 35) {
    return { score: 2, label: "Weak", color: "text-red-400" };
  } else if (entropy < 50) {
    return { score: 3, label: "Fair", color: "text-yellow-500" };
  } else if (entropy < 70) {
    return { score: 4, label: "Good", color: "text-green-400" };
  } else {
    return { score: 5, label: "Strong", color: "text-green-500" };
  }
}