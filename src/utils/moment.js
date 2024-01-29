import moment from 'moment';

export const getDateTime = input => {
  const data = moment(input).local().format('DD-MM-YYYY hh:mm:ss A');
  const [date, time] = data.split(' ');
  return {date, time};
};

export const getDate = date => {
  const momentDate = moment(date);
  const data = moment(momentDate).local().format('DD-MM-YYYY');
  return data;
};
