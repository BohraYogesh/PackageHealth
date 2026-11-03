export const formatDate = (value) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
export const shortName = (value = '') => (value.length > 26 ? `${value.slice(0, 23)}…` : value);
