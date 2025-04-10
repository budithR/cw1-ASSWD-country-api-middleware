// Long date and time "March 27, 2025 at 12:14 PM"
const formatDateTime = (isoString) => {
    if (!isoString) return 'Never';
    
    const date = new Date(isoString);
    
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

export default formatDateTime;