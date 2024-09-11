type Tree<T> = {
    value: T;
    left?: Tree<T>;
    right?: Tree<T>;
};
//3 1 2 5 4
const t: Tree<number> = {
    value: 3,
    left: {
        value: 1,
        right: {
            value: 2,
        },
    },
    right: {
        value: 5,
        left: {
            value: 4,
        },
    },
};

interface Iter<T> {
    next: () => T;
    hasMore: () => boolean;
}

const iterArray = <T>(arr: T[]): Iter<T> => {
    let i = 0;
    return {
        next: () => {
            if (i >= arr.length) {
                throw new Error("out of bound");
            }
            return arr[i++];
        },
        hasMore: () => i < arr.length,
    };
};

const runIterator = <T>(iter: Iter<T>, consume: (x: T) => void) => {
    while (iter.hasMore()) consume(iter.next());
};

const depthIterator = <T>(tree: Tree<T>): Iter<T> => {
    const root = [tree];
    return {
        next: () => {
            if (root.length === 0) {
                throw new Error("out of bound");
            }
            const node = root.pop()!;
            if (node?.right) {
                root.push(node.right);
            }
            if (node?.left) {
                root.push(node.left);
            }
            return node.value;
        },
        hasMore: () => root.length > 0,
    };
};
const dfs = <T>(tree: Tree<T>): Iterable<T> => ({
    [Symbol.iterator]: () => iterToIterator(depthIterator(tree)),
});
const bfs = <T>(tree: Tree<T>): Iterable<T> => ({
    [Symbol.iterator]: () => iterToIterator(breadthIterator(tree)),
});
const breadthIterator = <T>(tree: Tree<T>): Iter<T> => {
    const root = [tree]; //queue
    return {
        next: () => {
            if (root.length === 0) {
                throw new Error("out of bound");
            }
            const node = root.shift()!;
            if (node?.left) {
                root.push(node.left);
            }
            if (node?.right) {
                root.push(node.right);
            }

            return node.value;
        },
        hasMore: () => root.length > 0,
    };
};

// runIterator(iterArray([4, 4, 3, 4]), console.log);
// BFS 3 1 5 2 4
// DFS 3 1 2 5 4
// runIterator(depthIterator(t), console.log);
// runIterator(breadthIterator(t), console.log);

type IIRes<T> = { done: false; value: T } | { done: true; value: undefined };
type II<T> = {
    next(): IIRes<T>;
};
const iterToIterator = <T>(x: Iter<T>): Iterator<T> => {
    return {
        next: () =>
            x.hasMore()
                ? {
                      done: false,
                      value: x.next(),
                  }
                : {
                      done: true,
                      value: undefined,
                  },
    };
};

for (const x of dfs(t)) {
    console.log(x);
}
