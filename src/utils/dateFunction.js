const getMonthsByquater = (quater) => {
  switch (quater) {
    case 1:
      return [1, 2, 3];
    case 2:
      return [4, 5, 6];
    case 3:
      return [7, 8, 9];
    case 4:
      return [10, 11, 12];
    default:
      break;
  }
};
const getDaysByMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};
const getQuaterByMonth = (month) => {
  return parseInt((month - 1) / 3);
};
export const dateFunction = {
  getMonthsByquater,
  getDaysByMonth,
  getQuaterByMonth,
};
