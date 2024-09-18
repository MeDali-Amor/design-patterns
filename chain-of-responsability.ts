export {};

type Request1 = string;
type Response1 = number;

interface Handler {
    (x: Request1, next: (x: Request1) => Response1): Response1;
}

type FF = (next: (x: Request1) => Response1) => (x: Request1) => Response1;
type DISP = (x: Request1) => Response1;
type FF2 = (next: DISP) => DISP;
interface Handler2 {
    (next: (x: Request1) => Response1): (x: Request1) => Response1;
}

interface Handlers {
    handlers: Handler[];
    handle(this: Handlers, x: Request1): Response1;
}

const handle = (r: Request1, handlers: Handler[]): Response1 => {
    if (!handlers.length) throw Error("");
    const [firstHandler, ...restOfHandlers] = handlers;
    return firstHandler(r, (x) => handle(x, restOfHandlers));
};

// const handlers: Handlers = {
//   handlers: [],
//   handle(x) {
//     this.handlers[0](x, () => han);
//   },
// };

const handers: Handler[] = [
    (x, next) => {
        console.log("start");
        return next("http://" + x) ** 2;
    },
    (x, next) => {
        return x.length;
    },
    (x) => {
        return x.length;
    },
];

type Reducer<State, Action> = (state: State, action: Action) => State;
const combine =
    <States extends object, Action = unknown>(reducers: {
        [P in keyof States]: Reducer<States[P], Action>;
    }): Reducer<States, Action> =>
    (state, action) =>
        Object.fromEntries(
            Object.entries(state).map(([k, state]) => [
                k,
                (reducers[k as keyof States] as any)(state, action),
            ])
        ) as States;

type Store<out State, in Action> = {
    getState: () => State;
    dispatch: (action: Action) => void;
};

const createStore = <State, Action>(
    initialState: State,
    reducer: Reducer<State, Action>,
    ...middlewares: Middleware<State, Action>[]
): Store<State, Action> => {
    let state = initialState;
    const getState = () => state;

    const initialDipatch = (action: Action) => {
        state = reducer(initialState, action);
    };
    const dispatch = middlewares.reduce(
        (disp, middleware) => middleware(disp, getState),
        initialDipatch
    );
    return {
        getState,
        dispatch,
    };
};

type Middleware<S, A, A2 = A> = (
    dispatch: Dispatcher<A>,
    getState: () => S
) => Dispatcher<A2>;
const middleware = <S, A, A2>(
    store: Store<S, A>,
    m: Middleware<S, A, A2>
): Store<S, A2> => {
    const { dispatch, getState } = store;
    return { getState, dispatch: m(dispatch, getState) };
};

type Thunk<S, A> = (dispatch: Dispatcher<A>, getState: () => S) => void;
const thunk =
    <S, A>(): Middleware<S, A, Exclude<A, Function> | Thunk<S, A>> =>
    (dispatch, getState) =>
    (action) => {
        const isF = (x: Exclude<A, Function> | Thunk<S, A>): x is Thunk<S, A> =>
            typeof x === "function";
        if (isF(action)) {
            action(dispatch, getState);
        } else {
            dispatch(action);
        }
    };

type Dispatcher<A> = (x: A) => void;

// type F = <T>(x: T)=>T
// const f: F = (x) => x
// type F2<T> = (x: T) => T;
// const f2: F2<number> =

const count =
    (name: string): Reducer<number, { type: string }> =>
    (state, action) =>
        action.type === `INC_${name}` ? state + 1 : state;

const red = combine<{ x: number; y: number }, { type: string }>({
    x: count("X"),
    y: count("Y"),
});

const s1 = createStore({ x: 0, y: 0 }, red);
const store = middleware(s1, thunk());
const doubleX: Thunk<
    {
        x: number;
        y: number;
    },
    {
        type: string;
    }
> = (dispatch, getState) => {
    const { x } = getState();
    for (let i = 0; i < x; i++) dispatch({ type: "INC_X" });
};
store.dispatch({ type: "INC_X" });
store.dispatch({ type: "INC_X" });
store.dispatch({ type: "INC_Y" });
store.dispatch(doubleX);
console.log(store.getState());
