import { Task } from '../task.js';

describe('Task', () => {
    let grid = [
        [0,1,1,1,1,1,1,2],
        [2,3,3,2,3,3,3,1],
        [1,1,1,1,1,1,3,1],
        [1,1,1,1,1,1,2,1],
        [1,1,1,1,1,1,3,1],
        [1,1,1,1,1,1,3,1],
        [1,1,1,1,1,3,1,3],
        [2,1,1,1,1,1,1,2]
    ];
    let jsonData = {
        "taskType": "collectibles",
        "title": "testipupu",
        "enableAddRemove": false,
        "description": [
            "Aseta pupu liikkumaan oikeaan alareunaan. Saat pupun liikkumaan seuraavilla komennoilla:",
            "",
            "pupu.liiku(\"oikea\")",
            "pupu.liiku(\"alas\")",
            "pupu.liiku(\"vasen\")",
            "pupu.liiku(\"ylös\")"
        ],
        "editorCode": [
            "for i in range(7):",
            "\tpupu.liiku(\"oikea\")",
            "for i in range(7):",
            "\tpupu.liiku(\"alas\")"
        ],
        "multipleChoiceQuestions": [],
        "grid": [
            [0,1,1,1,1,1,1,2],
            [2,3,3,2,3,3,3,1],
            [1,1,1,1,1,1,3,1],
            [1,1,1,1,1,1,2,1],
            [1,1,1,1,1,1,3,1],
            [1,1,1,1,1,1,3,1],
            [1,1,1,1,1,3,1,3],
            [2,1,1,1,1,1,1,2]
        ],
        "conditions": []
    };

    describe('Task', () => {
        it('should set properties from JSON', () => {
            const task = new Task();
    
            const jsonData = {
                description: 'Test description',
                editorCode: ['console.log("Hello, world!");'],
                // Add more properties as needed
            };
    
            task.fromJSON(jsonData);
    
            expect(task.description).toEqual('Test description');
            expect(task.editorCode).toEqual(['console.log("Hello, world!");']);
            // Add more expectations as needed
        });
    
        it('should not set properties that do not exist on Task', () => {
            const task = new Task();
    
            const jsonData = {
                nonExistentProperty: 'This should not be set',
            };
    
            task.fromJSON(jsonData);
    
            expect(task.nonExistentProperty).toBeUndefined();
        });
    });

    it('should create a Task from JSON', () => {
        const task = Task.fromJSON(jsonData);

        expect(task.description).toEqual(jsonData.description);
        expect(task.editorCode).toEqual(jsonData.editorCode);
        expect(task.multipleChoiceQuestions).toEqual(jsonData.multipleChoiceQuestions);
        expect(task.grid).toEqual(jsonData.grid);
        expect(task.conditions).toEqual(jsonData.conditions);
        expect(task.getPlayerStartPosition()).toEqual({x: 0, y: 0});
        expect(task.getGridDimensions()).toEqual({width: 8, height: 8});
        expect(task.getTotalCollectibles()).toEqual(6);
        expect(task.getDescription()).toEqual(jsonData.description);
        expect(task.getEditorCode()).toEqual("for i in range(7):\n\tpupu.liiku(\"oikea\")\nfor i in range(7):\n\tpupu.liiku(\"alas\")\n");
        expect(task.getMultipleChoiceQuestions()).toEqual([]);
        expect(task.getGrid()).toEqual(grid);
        expect(task.getConditions()).toEqual([]);
    });
});

describe('Task', () => {
    let grid = [
        [1,1,1,1,1,1,1,2],
        [2,3,3,2,3,3,3,1],
        [1,1,1,1,1,1,3,1],
        [1,1,1,1,1,1,2,1],
        [1,1,1,1,1,1,3,1],
        [1,1,1,1,1,1,3,1],
        [1,1,1,1,1,3,0,3],
        [2,1,1,1,1,1,1,2]
    ];
    let jsonData = {
        "description": [
            "Kuinka monta kertaa pupun pitää hypätä päästäkseen oikeaan alakulmaan mahdollisimman pienellä määrällä hyppyjä?"
        ],
        "editorCode": [],
        "multipleChoiceQuestions": [
            {
                "question": "2",
                "isCorrectAnswer": true
            },
            {
                "question": "55",
                "isCorrectAnswer": false
            },
            {
                "question": "14",
                "isCorrectAnswer": false
            },
            {
                "question": "999999999999999999999999999999",
                "isCorrectAnswer": false
            }
        ],
        "grid": [
            [1,1,1,1,1,1,1,2],
            [2,3,3,2,3,3,3,1],
            [1,1,1,1,1,1,3,1],
            [1,1,1,1,1,1,2,1],
            [1,1,1,1,1,1,3,1],
            [1,1,1,1,1,1,3,1],
            [1,1,1,1,1,3,0,3],
            [2,1,1,1,1,1,1,2]
        ],
        "conditions": [
            {
                "condition": "conditionUsedWhile",
                "parameter": true
            },
            {
                "condition": "conditionUsedFor",
                "parameter": false
            },
            {
                "condition": "conditionUsedInput",
                "parameter": false
            },
            {
                "condition": "conditionMaxLines",
                "parameter": false
            }
        ]
    };

    it('should create a Task from JSON', () => {
        const task = Task.fromJSON(jsonData);

        expect(task.description).toEqual(jsonData.description);
        expect(task.editorCode).toEqual(jsonData.editorCode);
        expect(task.multipleChoiceQuestions).toEqual(jsonData.multipleChoiceQuestions);
        expect(task.grid).toEqual(jsonData.grid);
        expect(task.conditions).toEqual(jsonData.conditions);
        expect(task.getPlayerStartPosition()).toEqual({x: 6, y: 6});
        expect(task.getGridDimensions()).toEqual({width: 8, height: 8});
        expect(task.getTotalCollectibles()).toEqual(6);
        expect(task.getDescription()).toEqual(jsonData.description);
        expect(task.getEditorCode()).toEqual("");
        expect(task.getMultipleChoiceQuestions()).toEqual([
            {question: "2", isCorrectAnswer: true},
            {question: "55", isCorrectAnswer: false},
            {question: "14", isCorrectAnswer: false},
            {question: "999999999999999999999999999999", isCorrectAnswer: false}
        ]);
        expect(task.getGrid()).toEqual(grid);
        expect(task.getConditions()).toEqual([
            {condition: "conditionUsedWhile", parameter: true}
        ]);
    });
});