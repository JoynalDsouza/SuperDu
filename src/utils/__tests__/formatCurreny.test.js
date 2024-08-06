import {formatToINR} from '../formatCurrency';

describe('formatToINR', () => {
  it('take snapshot of formatToINR', () => {
    expect(formatToINR).toMatchSnapshot();
  });
  it('should return a formatted currency', () => {
    const value = 1000;
    expect(formatToINR(value)).toEqual('₹1,000.00');
  });

  it('should return a formatted currency with 0 value', () => {
    const value = 0;
    expect(formatToINR(value)).toEqual('₹0.00');
  });

  it('should return a formatted currency with undefined value', () => {
    const value = undefined;
    expect(formatToINR(value)).toEqual('₹0.00');
  });

  it('should return a formatted currency with null value', () => {
    const value = null;
    expect(formatToINR(value)).toEqual('₹0.00');
  });

  it('should return a formatted currency with string value', () => {
    const value = '1000';
    expect(formatToINR(value)).toEqual('₹1,000.00');
  });

  it('should return a formatted currency with number value', () => {
    const value = 1000;
    expect(formatToINR(value)).toEqual('₹1,000.00');
  });
});
