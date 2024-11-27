import { mathHelper } from './math';

describe('math', () => {
  it('add', () => {
    expect(mathHelper.add(1, 2).toNumber()).toBe(3);
  });

  it('subtract', () => {
    expect(mathHelper.subtract(3, 2).toNumber()).toBe(1);
  });

  it('multiply', () => {
    expect(mathHelper.multiply(2, 3).toNumber()).toBe(6);
  });

  it('divide', () => {
    expect(mathHelper.divide(6, 3).toNumber()).toBe(2);
  });
});
