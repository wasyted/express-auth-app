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
    formattedDate = `hace ${seconds}s`;
    return formattedDate;
  } else if (minutes < 60) {
    formattedDate =  `hace ${minutes}m`;
    return formattedDate;
  } else if (hours < 24) {
    formattedDate =  `hace ${hours}h`;
    return formattedDate;
  } else if (days < 30) {
    formattedDate =  `hace ${days}D`;
    return formattedDate;
  } else {
    formattedDate =  `hace ${months}M`;
    return formattedDate;
  }
}

module.exports = timeAgo;