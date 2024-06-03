export class Task {
    constructor(description, editorCode, multipleChoiceQuestions, grid, conditions) {
        this.description = description;
        this.editorCode = editorCode;
        this.multipleChoiceQuestions = multipleChoiceQuestions;
        this.grid = grid;
        this.conditions = conditions;
    }

    fromJSON(json) {
        for (let key in json) {
            if (json.hasOwnProperty(key) && this.hasOwnProperty(key)) {
                this[key] = json[key];
            }
        }
    }

    static fromJSON(json) {
        const task = new Task();
        task.fromJSON(json);
        return task;
    }

    getPlayerStartPosition() {
        let playerStartPosition;

        for (let x = 0; x < this.grid.length; x++) {
            if (playerStartPosition !== undefined) break;
            for (let y = 0; y < this.grid[x].length; y++) {
                if (playerStartPosition !== undefined) break;
                playerStartPosition = this.grid[x][y] === 0 ? { x: x, y: y } : undefined;
            }
        }

        return playerStartPosition;
    }

    getGridDimensions() {
        return {width:this.grid[0].length, height: this.grid.length};
    }

    getTotalCollectibles() {
        let collectibles = 0;

        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid[x].length; y++) {
                collectibles += this.grid[x][y] === 2 ? 1 : 0;
            }
        }

        return collectibles;
    }

    getDescription() {
        return this.description;
    }

    getEditorCode() {
        let editorCodeString = "";

        this.editorCode.forEach((line) => {
            editorCodeString += line + "\n";
        })

        return editorCodeString;
    }

    getMultipleChoiceQuestions() {
        return this.multipleChoiceQuestions;
    }

    getGrid() {
        return this.grid;
    }

    getConditions() {
        return this.conditions.filter((condition) => condition.parameter !== false);
    }
}