import * as math from 'mathjs';

export default {
  add(num1, num2) {
    return math.add(math.bignumber(num1), math.bignumber(num2));
  },
  subtract(num1, num2) {
    return math.subtract(math.bignumber(num1), math.bignumber(num2));
  },
  multiply(num1, num2) {
    return math.multiply(
      math.bignumber(num1),
      math.bignumber(num2),
    ) as math.BigNumber;
  },
  divide(num1, num2) {
    return math.divide(
      math.bignumber(num1),
      math.bignumber(num2),
    ) as math.BigNumber;
  },
  toBigNumber(num) {
    return math.bignumber(num);
  },
};
