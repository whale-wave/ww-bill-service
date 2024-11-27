import * as math from 'mathjs';

type MathType = math.BigNumber | number | string;

class MathHelper {
  add(num1: MathType, num2: MathType) {
    return math.add(this.toBigNumber(num1), this.toBigNumber(num2));
  }

  subtract(num1: MathType, num2: MathType) {
    return math.subtract(this.toBigNumber(num1), this.toBigNumber(num2));
  }

  multiply(num1: MathType, num2: MathType) {
    return math.multiply(this.toBigNumber(num1), this.toBigNumber(num2)) as math.BigNumber;
  }

  divide(num1: MathType, num2: MathType) {
    return math.divide(this.toBigNumber(num1), this.toBigNumber(num2)) as math.BigNumber;
  }

  toBigNumber(num: MathType) {
    return math.bignumber(num);
  }
}

export function fillZero(num: number) {
  return num < 10 ? `0${num}` : num;
}

export const mathHelper = new MathHelper();
