const findSubstringInArray = (
  str: string,
  arr: string[],
  i = 0,
): string | null =>
  i > arr.length
    ? null
    : ~str.indexOf(arr[i])
      ? arr[i]
      : findSubstringInArray(str, arr, i + 1);

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const retry = async <T>(fun: () => Promise<T>, i = 0): Promise<T> => {
  try {
    return fun();
  } catch (err) {
    if (i < 3) {
      await sleep(500);
      return retry(fun, i + 1);
    } else {
      throw err;
    }
  }
};

export { findSubstringInArray, sleep, retry };
