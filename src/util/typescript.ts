export const throwIfNotNever = (x: never) => {
  if (!!x) {
    throw new TypeError(`Expected value ${x} to be of type "never"`);
  }
  return x;
};
