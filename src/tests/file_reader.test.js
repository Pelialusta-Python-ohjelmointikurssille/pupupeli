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

        let fileReadMessage = tryGetFileAsText(path.resolve(__dirname, '../python/pelaaja.py'), 'utf8');

        expect(fileReadMessage.isSuccess).toEqual(true);
        expect(fileReadMessage.result).toEqual(expectedOutput);
    });

    test('should return error fetching file', () => {
        const expectedOutput = new Error(`Error fetching file: ${path.resolve(__dirname, '../python/a.py')}`, 'utf8');

        let fileReadMessage = tryGetFileAsText(path.resolve(__dirname, '../python/a.py'), 'utf8');

        expect(fileReadMessage.isSuccess).toEqual(false);
        expect(fileReadMessage.result).toEqual(expectedOutput);
    });

    test('should return error no file path given', () => {
        const expectedOutput = `No file path given`;

        let fileReadMessage = tryGetFileAsText();

        expect(fileReadMessage.isSuccess).toEqual(false);
        expect(fileReadMessage.result).toEqual(expectedOutput);
    });
});
