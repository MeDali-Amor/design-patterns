export {};

type Reducer<State> = (state: State, action: unknown) => State;
type Middleware<States> = (store: {
    getState: () => States;
    dispatch: (action: unknown) => void;
}) => (next: (action: unknown) => void) => (action: unknown) => void;

// Combines multiple reducers into one
const combine =
    <States extends object>(reducers: {
        [P in keyof States]: Reducer<States[P]>;
    }): Reducer<States> =>
    (state, action) => {
        const newState: Partial<States> = {};
        for (const key in reducers) {
            newState[key] = reducers[key](state[key], action);
        }
        return newState as States;
    };

// Apply middleware
const applyMiddleware =
    <States extends object>(middleware: Middleware<States>[]) =>
    (store: {
        getState: () => States;
        dispatch: (action: unknown) => void;
    }) => {
        // Wrapping the dispatch function with middleware
        let dispatch = store.dispatch;
        middleware
            .slice()
            .reverse()
            .forEach((mw) => {
                dispatch = mw(store)(dispatch);
            });
        return { ...store, dispatch }; // Return the store with the enhanced dispatch function
    };

// Example store creation function
const createStore = <States extends object>(
    rootReducer: Reducer<States>,
    initialState: States,
    middleware: Middleware<States>[] = []
) => {
    let state = initialState;

    // Store object
    const store = {
        getState: () => state,
        dispatch: (action: unknown) => {
            state = rootReducer(state, action); // Call the reducer
        },
    };

    // Enhance store with middleware
    return applyMiddleware(middleware)(store);
};

// Example usage

// Reducers
const countReducer: Reducer<number> = (state = 0, action) => {
    if (action === "INCREMENT") return state + 1;
    return state;
};

const nameReducer: Reducer<string> = (state = "", action) => {
    if (action === "SET_NAME") return action.payload;
    return state;
};

// Middleware example (Logger)
const loggerMiddleware: Middleware<{ count: number; name: string }> =
    (store) => (next) => (action) => {
        console.log("Previous state:", store.getState());
        console.log("Action:", action);
        next(action); // Pass the action to the next middleware/reducer
        console.log("Next state:", store.getState());
    };

// Combine reducers
const rootReducer = combine({ count: countReducer, name: nameReducer });

// Create store with middleware
const store = createStore(rootReducer, { count: 0, name: "" }, [
    loggerMiddleware,
]);

// Dispatching actions
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "SET_NAME", payload: "John" });
