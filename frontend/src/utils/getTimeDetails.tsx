type ReturnValue = {
  start_date: string;
  start_time: string;
  ended: boolean;
};

export const getTimeDetails = (dateTimeString: string): ReturnValue => {
  const dateObj = new Date(dateTimeString);
  const localTimeString = dateObj
    .toLocaleString("en-IN", {
      hour12: false,
    })
    .split(", ");
  const time = localTimeString[1].split(":");
  const date = localTimeString[0].split("/");
  return {
    start_date: `${date[2]}-${date[1]}-${date[0]}`,
    start_time: `${time[0]}:${time[1]}`,
    ended: dateObj < new Date(),
  };
};
