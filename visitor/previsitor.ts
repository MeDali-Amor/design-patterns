export {};
abstract class Node {
    constructor(public children: Node[]) {}
}
class House extends Node {
    constructor(readonly nbrWindows: number, children: Node[]) {
        super(children);
    }
}

class Usine extends Node {
    constructor(readonly nbrMachine: number, children: Node[]) {
        super(children);
    }
}
