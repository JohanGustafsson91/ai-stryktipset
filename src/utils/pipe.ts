export const pipe = (...functions: Function[]) => (...args: unknown[]) =>
  functions.reduce(
    (acc, curr, i) => (i === 0 ? curr(...acc) : curr(acc)),
    args
  );
