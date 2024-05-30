export class Grid {
    constructor(width, height) {
        this.doubleArray = this.CreateDoubleArray(width, height);
        this.objects = [];
        this.width = width;
        this.height = height;

    };

    addToGrid(gridObject, x, y) {
        this.doubleArray[x][y].entities.push(gridObject);
        gridObject.cell = this.doubleArray[x][y];
    }
    moveGridObjectToDir(gridObject, direction) {
        if (gridObject == null) return false;
        let dirVector = Vector2.FromDirection(direction);
        let newX = gridObject.cell.x + dirVector.x;
        let newY = gridObject.cell.y + dirVector.y;
        if (boundaryCheck(newX, newY) == false) return false; 
        removeFromGrid(gridObject);
        addToGrid(gridObject, newX, newY);
        return true;
    }
    boundaryCheck(x, y) {
        if (x < 0 | x >= grid.length) return false;
        if (y < 0 | y >= grid[0].length) return false;
        return true;
    }
    addToGrid(gridObject, x, y) {
        grid[x][y].entities.push(gridObject);
        gridObject.cell = grid[x][y];
    }
    removeFromGrid(gridObject) {
        let x = gridObject.cell.x;
        let y = gridObject.cell.y;
        let cell = grid[x][y];
        let index = cell.entities.indexOf(gridObject);
        cell.entities.splice(index, 1);
        gridObject.cell = null;
    }
    CreateDoubleArray(width, height) {
        //js doesn't have double arrays T:Tommi
        let newGrid = [];
        for (let x = 0; x < width; x++) {
            newGrid[x] = [];
            for (let y = 0; y < height; y++) {
                newGrid[x][y] = new Cell(x, y);
            }
        }
        return newGrid;
    }

};