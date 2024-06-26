import exp from "constants";
import { tryGetFileAsJson, tryGetFileAsText, countForTaskFilesInDirectory, checkIfFileExists, countForChaptersInDirectory} from "../file_reader.js"
import XMLHttpRequestMock from "./mocks/XMLHttpRequestMock.js";

const fs = require('fs');
const path = require('path');

describe('tryGetFileAsText', () => {

    beforeAll(() => {
        global.XMLHttpRequest = XMLHttpRequestMock;
    });

    test('should return pelaaja.py string', () => {
        const expectedOutput = fs.readFileSync(path.resolve(__dirname, '../python/pelaaja.py'), 'utf8');
        let fileAsString = tryGetFileAsText(path.resolve(__dirname, '../python/pelaaja.py'), 'utf8');
        expect(fileAsString).toEqual(expectedOutput);
    });

    test('should return error fetching file', () => {
        const expectedOutput = new Error(`Error fetching file: ${path.resolve(__dirname, '../python/a.py')}`, 'utf8');
        expect(() => {
            let fileAsString = tryGetFileAsText(path.resolve(__dirname, '../python/a.py'), 'utf8');
        }).toThrow(expectedOutput);
    });

    test('should return error no file path given', () => {
        const expectedOutput = new Error(`No file path given`);
        expect(() => {
            let fileAsString = tryGetFileAsText();
        }).toThrow(expectedOutput);
    });
});

describe('tryGetFileAsJson', () => {
    beforeAll(() => {
        global.XMLHttpRequest = XMLHttpRequestMock;
    });

    test('should throw if path is invalid', () => {
        const expectedOutput = new Error(`Error fetching file: ${path.resolve(__dirname, './mocks/mock_tasks/notreal.json')}`, 'utf8');
        expect(() => {
            let result = tryGetFileAsJson(path.resolve(__dirname, './mocks/mock_tasks/notreal.json'), 'utf8');
        }).toThrow(expectedOutput);
    });

    test('should throw error no file path given', () => {
        const expectedOutput = new Error(`No file path given`);
        expect(() => {
            let result = tryGetFileAsJson();
        }).toThrow(expectedOutput);
    });

    test('mock 1 json should return correct data', () => {
        let expectedDescription = [
            "Aseta pupu liikkumaan oikeaan alareunaan. Saat pupun liikkumaan seuraavilla komennoilla:",
            "",
            "pupu.liiku(\"oikea\")",
            "pupu.liiku(\"alas\")",
            "pupu.liiku(\"vasen\")",
            "pupu.liiku(\"ylös\")"
          ];
        let expectedEditorCode = [
            "for i in range(7):",
            "\tpupu.liiku(\"oikea\")",
            "for i in range(7):",
            "\tpupu.liiku(\"alas\")"
          ];
        let expectedMultipleChoiceQuestions = [];
        let expectedGrid = [
            [0,1,1,1,1,1,1,2],
            [2,3,3,2,3,3,3,1],
            [1,1,1,1,1,1,3,1],
            [1,1,1,1,1,1,2,1],
            [1,1,1,1,1,1,3,1],
            [1,1,1,1,1,1,3,1],
            [1,1,1,1,1,3,1,3],
            [2,1,1,1,1,1,1,2]
          ];
        let expectedConditions = [];

        let result = tryGetFileAsJson(path.resolve(__dirname, './mocks/mock_tasks/mock_1.json'), 'utf8');

        expect(result.description).toEqual(expectedDescription);
        expect(result.editorCode).toEqual(expectedEditorCode);
        expect(result.multipleChoiceQuestions).toEqual(expectedMultipleChoiceQuestions);
        expect(result.grid).toEqual(expectedGrid);
        expect(result.conditions).toEqual(expectedConditions);
    });

    test('mock 2 json should return correct data', () => {
        let expectedDescription = [
            "Kuinka monta kertaa pupun pitää hypätä päästäkseen oikeaan alakulmaan mahdollisimman pienellä määrällä hyppyjä?"
          ];
        let expectedEditorCode = [];
        let expectedMultipleChoiceQuestions = [
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
          ];
        let expectedGrid = [
            [1,1,1,1,1,1,1,2],
            [2,3,3,2,3,3,3,1],
            [1,1,1,1,1,1,3,1],
            [1,1,1,1,1,1,2,1],
            [1,1,1,1,1,1,3,1],
            [1,1,1,1,1,1,3,1],
            [1,1,1,1,1,3,0,3],
            [2,1,1,1,1,1,1,2]
          ];
        let expectedConditions = [
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
          ];

        let result = tryGetFileAsJson(path.resolve(__dirname, './mocks/mock_tasks/mock_2.json'), 'utf8');

        expect(result.description).toEqual(expectedDescription);
        expect(result.editorCode).toEqual(expectedEditorCode);
        expect(result.multipleChoiceQuestions).toEqual(expectedMultipleChoiceQuestions);
        expect(result.grid).toEqual(expectedGrid);
        expect(result.conditions).toEqual(expectedConditions);
    });
});

describe('countForTaskFilesInDirectory', () => {
  beforeEach(() => {
      global.XMLHttpRequest = XMLHttpRequestMock;
  });

  test('should return file count 2', () => {
    const dirPath = path.resolve(__dirname, './mocks/mock_tasks/countfortaskfiles');
    const expectedOutput = 2;
    let fileNumber = countForTaskFilesInDirectory(dirPath).count;
    expect(fileNumber).toEqual(expectedOutput);
  });
});

describe('countForTaskFilesInDirectory', () => {
  beforeEach(() => {
      global.XMLHttpRequest = XMLHttpRequestMock;
  });

  test('should return instructionNumbers array with 1', () => {
    const dirPath = path.resolve(__dirname, './mocks/mock_tasks/countfortaskfiles');
    let fileInstructionNumbers = countForTaskFilesInDirectory(dirPath).instructionNumbers;
    expect(fileInstructionNumbers.length).toEqual(1);
    expect(fileInstructionNumbers[0]).toEqual(1);
  });
});

describe('checkIfFileExists', () => {
  beforeEach(() => {
      global.XMLHttpRequest = XMLHttpRequestMock;
  });

  test('should return null if doesnt exist', () => {
    const filePath = path.resolve(__dirname, './mocks/mock_tasks/countfortaskfiles/3.json');
    const expectedOutput = null;
    let result = checkIfFileExists(filePath);
    expect(result).toEqual(expectedOutput);
  });

  test('should return result if exists', () => {
    const filePath = path.resolve(__dirname, './mocks/mock_tasks/countfortaskfiles/2.json');
    const expectedOutput = { "taskType": "collectibles", "hi": "moi"};
    let result = checkIfFileExists(filePath);
    expect(result).not.toEqual(null);
    expect(result).toEqual(expectedOutput);
    expect(result.hi).toEqual("moi");
    expect(result).toEqual(expectedOutput);
    expect(result.taskType).toEqual("collectibles");
  });
});

describe('countForTaskFilesInDirectory', () => {
  beforeEach(() => {
      global.XMLHttpRequest = XMLHttpRequestMock;
  });

  test('should return file count 2', () => {
    const expectedOutput = 1;
    let fileNumber = countForChaptersInDirectory("test");
    expect(fileNumber).toEqual(expectedOutput);
  });
});