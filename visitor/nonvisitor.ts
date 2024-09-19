export {};
abstract class Node {
    abstract exportXML(): string;
    constructor(public children: Node[]) {}
    protected childrenXML(): string {
        return this.children.map((c) => c.exportXML()).join("");
    }
}
class House extends Node {
    constructor(private nbrWindows: number, children: Node[]) {
        super(children);
    }
    exportXML(): string {
        return `<house nbWindows=${
            this.nbrWindows
        }>${this.childrenXML()}</house>`;
    }
}

class Usine extends Node {
    constructor(private nbrMachine: number, children: Node[]) {
        super(children);
    }
    exportXML(): string {
        return `<usine nbrMachine=${
            this.nbrMachine
        }>${this.childrenXML()}</usine>`;
    }
}
