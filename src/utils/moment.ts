import moment from 'moment';

export const getDateTime = input => {
  const data = moment(input?.toISOString())
    .local()
    .format('DD-MM-YYYY hh:mm:ss A');
  const [date, time, meridian] = data.split(' ');
  return {date, time: time + ' ' + meridian};
};

export const getDate = date => {
  if (date) {
    return moment(date?.toISOString()).local().format('DD-MM-YYYY');
  }
};

export const getMonth = date => {
  try {
    if (!date) return 1;
    const month = moment(date).format('M');
    return month;
  } catch (e) {
    return 1;
  }
};

export const getYear = date => {
  try {
    const year = moment(date).format('YYYY');
    return year;
  } catch (e) {
    return '';
  }
};

//output ex-: [{name: 2021}, {name: 2022}]
export const getYearsBetween = (startDate, endDate) => {
  try {
    const startYear = moment(startDate).year();
    const endYear = moment(endDate).year();

    const yearsArray = Array.from(
      {length: endYear - startYear + 1},
      (_, index) => {
        return {name: (startYear + index).toString()};
      },
    );
    return yearsArray;
  } catch (e) {}
};

export const getDaysBetweenDates = (
  dateString1: string | Date,
  dateString2: string | Date,
): number => {
  const date1 = moment(dateString1, 'YYYY-MM-DD');
  const date2 = moment(dateString2, 'YYYY-MM-DD');

  return date2.diff(date1, 'days');
};
