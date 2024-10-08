import { getCurrentTheme } from "./globals.js";

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
    constructor(taskType, title, enableAddRemove, description, editorCode, multipleChoiceQuestions, codeBlocks, grid, conditions) {
        this.taskType = taskType;
        this.title = title;
        this.enableAddRemove = enableAddRemove;
        this.description = description;
        this.editorCode = editorCode;
        this.multipleChoiceQuestions = multipleChoiceQuestions;
        this.codeBlocks = codeBlocks;
        this.grid = grid;
        this.conditions = conditions;
    }

    /**
     * given a JSON object representing a task, creates a task object
     * @param {json} a json object representing a task
     */
    fromJSON(json) {
        // Reset task properties to default values
        this.taskType = '';
        this.title = '';
        this.enableAddRemove = false;
        this.description = '';
        this.editorCode = '';
        this.multipleChoiceQuestions = [];
        this.codeBlocks = [];
        this.grid = [];
        this.conditions = [];
    
        // Assign new values from JSON
        for (let key in json) {
            if (Object.prototype.hasOwnProperty.call(json, key) && Object.prototype.hasOwnProperty.call(this, key)) {
                this[key] = json[key];
            }
        }
    }

    /**
     * Create Task object from json. Calls (the other) fromJSON to give properties
     * @param {json} json json object representing a task
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
        const wordToReplace = "hahmo";
        const newWord = getCurrentTheme(); // replace with the word you want
        const regex = new RegExp(wordToReplace, 'gi'); // 'g' for global, 'i' for case-insensitive
    
        return this.description.map(line => line.replace(regex, newWord.toLowerCase()));
    }

    /**
     * Return pre-loaded code in the editor, if there is any. Replaces the string in "wordToReplace"
     * with the correct character depending on the theme.
     * @returns {string} editorCode - the code pre-loaded in the editor
     */
    getEditorCode() {
        let editorCodeString = "";

        this.editorCode.forEach((line) => {
            editorCodeString += line + "\n";
        })
        const wordToReplace = "hahmo";
        const newWord = getCurrentTheme(); // replace with the word you want
        const regex = new RegExp(wordToReplace, 'gi'); // 'g' for global, 'i' for case-insensitive
        return editorCodeString.replace(regex, newWord.toLowerCase());
    }

    /**
     * Returns a list of objects of multiple choice options and correct answer
     * @returns {Array[object]} multipleChoiceQuestions objects, for example [{ "question": "2", "isCorrectAnswer": true }]
    },
     */
    getMultipleChoiceQuestions() {
        return this.multipleChoiceQuestions;
    }

    /**
     *  Returns a double array of numbers representing grid objects in their positions. Also gives implicit grid size.
     * @returns {Array[int[]]} grid - Grid objects in double array
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
        return this.enableAddRemove;
    }
}