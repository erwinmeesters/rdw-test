export function sortArray(arr: any, column: string, ascending = false) {
  arr = [...arr].sort((a, b) => {
    a = a[column];
    b = b[column];

    if (typeof a === 'string' && typeof b === 'string') {
      a = a.toLowerCase();
      b = b.toLowerCase();
    }

    return a > b ? 1 : b > a ? -1 : 0;
  });

  if (!ascending) {
    arr.reverse();
  }
  return arr;
}
