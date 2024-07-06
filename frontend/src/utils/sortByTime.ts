export const sortByTime = (a: string, b: string) => {
  const objA = new Date(a);
  const objB = new Date(b);
  if (objA > objB) return -1;
  else return 1;
};
