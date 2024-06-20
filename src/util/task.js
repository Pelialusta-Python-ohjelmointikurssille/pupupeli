/**
 * Represents a task of the course. Can be created from a json file using the fromJSON method.
 * @param {string} description - The description of the task
 * @param {string} editorCode - Pre-loaded code in the editor, if there is
 * @param {array} multipleChoiceQuestions - Objects of multiple choice options and correct answer
 * @param {array} grid - A double array of numbers representing grid objects in their positions. Also gives implicit grid size.
 * @param {array} conditions - Objects of requirements for a task as true or false
 * @class
 * @classdesc Represents a task of the course
 * @property {string} description - The description of the task
 * @property {string} editorCode - Pre-loaded code in the editor, if there is
 * @property {array} multipleChoiceQuestions - Objects of multiple choice options and correct answer
 * @property {array} grid - A double array of numbers representing grid objects in their positions. Also gives implicit grid size.
 * @property {array} conditions - Objects of requirements for a task as true or false
 * @returns {Task} - An object representing a task
 */
export class Task {
    constructor(taskType, title, enableAddRemove, description, editorCode, multipleChoiceQuestions, grid, conditions) {
        this.taskType = taskType;
        this.title = title;
        this.enableAddRemove = enableAddRemove;
        this.description = description;
        this.editorCode = editorCode;
        this.multipleChoiceQuestions = multipleChoiceQuestions;
        this.grid = grid;
        this.conditions = conditions;
    }

    /**
     * From given json, gives properties to object
     * @param {json} json 
     */
    fromJSON(json) {
        for (let key in json) {
            if (Object.prototype.hasOwnProperty.call(json, key) && Object.prototype.hasOwnProperty.call(this, key)) {
                this[key] = json[key];
            }
        }
    }

    /**
     * Create Task object from json. Calls (the other) fromJSON to give properties
     * @param {json} json 
     * @returns {Task} - An object representing a task
     */
    static fromJSON(json) {
        const task = new Task();
        task.fromJSON(json);
        return task;
    }

    /**
     * Returns player start position object with properties {x, y}
     * @returns {object} {x, y} player start position
     */
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

    /**
     * Returns grid dimensions
     * @returns {object} {width, height} of grid
     */
    getGridDimensions() {
        return {width:this.grid[0].length, height: this.grid.length};
    }

    /**
     * Returns amount of collectibles
     * @returns {number} Amount of collectibles
     */
    getTotalCollectibles() {
        let collectibles = 0;

        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid[x].length; y++) {
                collectibles += this.grid[x][y] === 2 ? 1 : 0;
            }
        }

        return collectibles;
    }

    /**
     * Return task description
     * @returns {string} description - The description of the task
     */
    getDescription() {
        return this.description;
    }

    /**
     * Return pre-loaded code in the editor, if there is
     * @returns {string} editorCode
     */
    getEditorCode() {
        let editorCodeString = "";

        this.editorCode.forEach((line) => {
            editorCodeString += line + "\n";
        })

        return editorCodeString;
    }

    /**
     * Returns objects of multiple choice options and correct answer
     * @returns {array} multipleChoiceQuestions objects
     */
    getMultipleChoiceQuestions() {
        return this.multipleChoiceQuestions;
    }

    /**
     *  Returns a double array of numbers representing grid objects in their positions. Also gives implicit grid size.
     * @returns {array} grid - Grid objects in double array
     */
    getGrid() {
        return this.grid;
    }

    /**
     * Returns array of only those conditions which are marked as true
     * @returns {array} conditions objects
     */
    getConditions() {
        return this.conditions.filter((condition) => condition.parameter !== false);
    }

    /**
     *  Retruns string of task's task type.
     * @returns {string} taskType
     */
    getTaskType() {
        return this.taskType;
    }

    /**
     *  Returns string of task title.
     * @returns {string} title
     */
    getTitle() {
        return this.title;
    }

    /**
     *  Returns true if addRemove is enabled, otherwise false.
     * @returns {boolean} enableAddRemove
     */
    getEnableAddRemove() {
        return this.EnableAddRemove;
    }
}