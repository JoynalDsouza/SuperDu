import {
  getDateTime,
  getDate,
  getMonth,
  getYear,
  getYearsBetween,
} from '../moment';

describe('moment', () => {
  it('take snapshot of getDateTime', () => {
    expect(getDateTime).toMatchSnapshot();
  });

  it('take snapshot of getDate', () => {
    expect(getDate).toMatchSnapshot();
  });

  it('take snapshot of getMonth', () => {
    expect(getMonth).toMatchSnapshot();
  });

  it('take snapshot of getYear', () => {
    expect(getYear).toMatchSnapshot();
  });

  it('take snapshot of getYearsBetween', () => {
    expect(getYearsBetween).toMatchSnapshot();
  });
});

describe('getDateTime', () => {
  it('should return date and time', () => {
    const input = new Date('2021-08-01T12:00:00Z');
    const output = getDateTime(input);
    expect(output).toEqual({date: '01-08-2021', time: '05:30:00 PM'});
  });
});

describe('getDate', () => {
  it('should return date', () => {
    const input = new Date('2021-08-01T12:00:00Z');
    const output = getDate(input);
    expect(output).toEqual('01-08-2021');
  });
});

describe('getMonth', () => {
  it('should return month', () => {
    const input = new Date('2021-08-01T12:00:00Z');
    const output = getMonth(input);
    expect(output).toEqual('8');
  });
  it('should return nothing when no input is passed', () => {
    const output = getMonth();
    expect(output).toEqual(1);
  });
});

describe('getYear', () => {
  it('should return year', () => {
    const input = new Date('2021-08-01T12:00:00Z');
    const output = getYear(input);
    expect(output).toEqual('2021');
  });
});

describe('getYearsBetween', () => {
  it('should return years between', () => {
    const startDate = new Date('2021-08-01T12:00:00Z');
    const endDate = new Date('2023-08-01T12:00:00Z');
    const output = getYearsBetween(startDate, endDate);
    expect(output).toEqual([{name: '2021'}, {name: '2022'}, {name: '2023'}]);
  });
});
