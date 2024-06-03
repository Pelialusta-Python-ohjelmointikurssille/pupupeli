import exp from "constants";
import { tryGetFileAsText } from "../file_reader.js"
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
