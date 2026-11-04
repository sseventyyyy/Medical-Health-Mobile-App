export const isEmail = (v: string): boolean => /^\S+@\S+\.\S+$/.test(v.trim());

export const isPhone = (v: string): boolean =>
  /^\+?\d{7,15}$/.test(v.replace(/[\s()-]/g, ''));

export const isStrongPassword = (v: string): boolean => v.length >= 8;

/** "12072000" → "12 / 07 / 2000" */
export const formatDob = (raw: string): string => {
  const d = raw.replace(/\D/g, '').slice(0, 8);
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean).join(' / ');
};