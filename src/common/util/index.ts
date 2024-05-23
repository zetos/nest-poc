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

export { findSubstringInArray };
