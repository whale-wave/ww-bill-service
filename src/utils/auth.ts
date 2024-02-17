export const generateNumber = (len: number) => {
  if (len < 1) len = 1;

  let num = Math.floor(Math.random() * 9 + 1);
  for (let i = 0; i < len - 1; i++) {
    num = num * 10 + Math.floor(Math.random() * 10);
  }

  return num;
};
