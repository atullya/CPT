export const formatDate = (dateString: string): string => {
  if (!dateString) return '–';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '–';
  }
};

export const calculateDaysSince = (dateString: string): string => {
  try {
    const created = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} Day${diffDays !== 1 ? 's' : ''}`;
  } catch {
    return '–';
  }
};

export const isValidDate = (dateString: string): boolean => {
  return !isNaN(Date.parse(dateString));
};

export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '–';
  try {
    return new Date(dateString).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '–';
  }
};

export const getDateTimestamp = (dateString: string): number => {
  return new Date(dateString).getTime();
};