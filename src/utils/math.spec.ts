import math from './math';

describe('math', () => {
  it('add', () => {
    expect(math.add(1, 2).toNumber()).toBe(3);
  });

  it('subtract', () => {
    expect(math.subtract(3, 2).toNumber()).toBe(1);
  });

  it('multiply', () => {
    expect(math.multiply(2, 3).toNumber()).toBe(6);
  });

  it('divide', () => {
    expect(math.divide(6, 3).toNumber()).toBe(2);
  });
});
