function timeAgo(date) {
  const currentDate = new Date();
  const pastDate = date;

  const timeDifference = currentDate - pastDate;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  let formattedDate;

  if (seconds < 60) {
    formattedDate = `${seconds}s ago`;
    return formattedDate;
  } else if (minutes < 60) {
    formattedDate =  `${minutes}m ago`;
    return formattedDate;
  } else if (hours < 24) {
    formattedDate =  `${hours}h ago`;
    return formattedDate;
  } else if (days < 30) {
    formattedDate =  `${days}D ago`;
    return formattedDate;
  } else {
    formattedDate =  `${months}M ago`;
    return formattedDate;
  }
}

module.exports = timeAgo;