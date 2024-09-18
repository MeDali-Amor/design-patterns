type Expression<in Ctx, out T> = {
    eval: (ctx: Ctx) => T;
};

const constant = <T>(x: T): Expression<unknown, T> => {
    return {
        eval: () => x,
    };
};

const sum = <Ctx>(
    x: Expression<Ctx, number>,
    y: Expression<Ctx, number>
): Expression<Ctx, number> => {
    return {
        eval: (ctx) => x.eval(ctx) + y.eval(ctx),
    };
};
const mult = <Ctx>(
    x: Expression<Ctx, number>,
    y: Expression<Ctx, number>
): Expression<Ctx, number> => {
    return {
        eval: (ctx) => x.eval(ctx) * y.eval(ctx),
    };
};

const ee = sum(constant(1), constant(1));

type A = { x: 1 };
type B = { x: 1; y: 1 };

// 3x+2y {x:7, y:12}
// 3 *  2 + 4

const x: Expression<{ x: number }, number> = {
    eval: (ctx) => ctx.x,
};
const y: Expression<{ y: number }, number> = {
    eval: (ctx) => ctx.y,
};
const exp = sum<{ x: number; y: number }>(
    mult(constant(2), x),
    mult(constant(3), y)
);

console.log(exp.eval({ x: 7, y: 12 }));
