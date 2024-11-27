import math, { MathType } from 'mathjs';

export default {
  add<T extends MathType>(num1: T, num2: T) {
    return math.add(num1, num2);
  },
  subtract<T extends MathType>(num1: T, num2: T) {
    return math.subtract(num1, num2);
  },
  multiply<T extends MathType>(num1: T, num2: T) {
    return math.multiply(num1, num2);
  },
  divide<T extends MathType>(num1: T, num2: T) {
    return math.divide(num1, num2);
  },
  toBigNumber(num: string | number) {
    return math.bignumber(num);
  },
};

export function fillZero(num: number) {
  return num < 10 ? `0${num}` : num;
}
