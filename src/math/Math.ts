function linspace (start: number, end: number, N: number): Array<number> {
  const values: Array<number> = [];
  const interval = (end - start) / (N - 1);
  for (let i = 1; i < N; i++) {
    values.push(start + interval * i);
  }
  return values;
}

export { linspace };
