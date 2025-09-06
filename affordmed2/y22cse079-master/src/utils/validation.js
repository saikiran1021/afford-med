export function validateUrl(url) {
  return /^https?:\/\/.+$/.test(url);
}

export function validateValidity(val) {
  const num = Number(val);
  return !isNaN(num) && num >= 1;
}

export function validateShortcode(code) {
  return !code || (/^[a-zA-Z0-9]{3,15}$/.test(code));
}
