export {};
abstract class Node extends Object {
    constructor(public children: Node[]) {
        super();
    }
    abstract accept<T>(visitor: NodeVisitor<T>): T;
}
class House extends Node {
    constructor(readonly nbrWindows: number, children: Node[]) {
        super(children);
    }
    accept<T>(visitor: NodeVisitor<T>): T {
        return visitor.visitHouse(this);
    }
}

class Usine extends Node {
    constructor(readonly nbrMachine: number, children: Node[]) {
        super(children);
    }
    accept<T>(visitor: NodeVisitor<T>): T {
        return visitor.visitUsine(this);
    }
}

const exportNode = (node: Node): string => {
    return node.accept({ visitHouse: exportHouse, visitUsine: exportUsine });
};
const exportChildren = (node: Node): string => {
    return node.children.map(exportNode).join("");
};
const exportUsine = (usine: Usine): string => {
    return `<usine nbrMachine=${usine.nbrMachine}>${exportChildren(
        usine
    )}</usine>`;
};

const exportHouse = (house: House): string => {
    return `<house nbWindows=${house.nbrWindows}>${exportChildren(
        house
    )}</house>`;
};

type NodeVisitor<T> = {
    visitUsine(usine: Usine): T;
    visitHouse(house: House): T;
};
