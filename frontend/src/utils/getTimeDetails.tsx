type ReturnValue = {
  start_date: string;
  start_time: string;
  ended: boolean;
};

export const getTimeDetails = (dateTimeString: string): ReturnValue => {
  const dateObj = new Date(dateTimeString);
  const localTimeString = dateObj
    .toLocaleString(Intl.DateTimeFormat().resolvedOptions().locale, {
      hour12: false,
    })
    .split(", ");
  const time = localTimeString[1].split(":");
  return {
    start_date: localTimeString[0],
    start_time: `${time[0]}:${time[1]}`,
    ended: dateObj < new Date(),
  };
};
