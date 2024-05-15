class GridObject {
    constructor(name) {
        this.name = name;
        this.cell = null;
    }

    toString() {
        return this.name;
    }
}

export function getNewGridObject(name) {
    return new GridObject(name);
}