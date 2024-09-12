type Iter1<T> = () =>
    | { done: true }
    | { done: false; value: T; next: Iter1<T> };

const iterArray1 = <T>(arr: T[]) => {
    const iterArray =
        (i = 0): Iter1<T> =>
        () =>
            i < arr.length
                ? { done: false, value: arr[i], next: iterArray(i + 1) }
                : { done: true };
    return iterArray;
};

const runIterator1 = <T>(iter: Iter1<T>, consume: (x: T) => void) => {
    const res = iter();
    if (res.done) return;
    const { next, value } = res;
    consume(value);
    runIterator1(next, consume);
};
