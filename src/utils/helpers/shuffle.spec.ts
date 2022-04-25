import shuffle from './shuffle';

describe('SHUFFLE util', () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  it('Не равен изначальному массиву', () => {
    const shuffledArray = shuffle<number>(array);
    expect(shuffledArray).not.toEqual(array);
  });

  it('Содержит одинаковые элементы', () => {
    const shuffledArray = shuffle<number>(array);
    expect(shuffledArray.length).toEqual(array.length);
    expect(shuffledArray.sort()).toEqual(array.sort());
  });

  it('Возвращает разные массивы', () => {
    const shuffledArray1 = shuffle<number>(array);
    const shuffledArray2 = shuffle<number>(array);
    expect(shuffledArray1).not.toEqual(shuffledArray2);
  });
});
