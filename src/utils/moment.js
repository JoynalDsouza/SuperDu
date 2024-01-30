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
  } else {
    return moment(new Date().toISOString()).local().format('DD-MM-YYYY');
  }
};
