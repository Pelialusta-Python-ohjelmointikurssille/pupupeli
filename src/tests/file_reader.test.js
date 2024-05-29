import{ tryGetFileAsText } from "../file_reader.js"

describe('tryGetFileAsText', () => {
    test('should return pelaaja.py string', () => {
        const expectedOutput = `import js

class Pelaaja:
    def __init__(self, name="pupu"):
        self.__name = name
        self.__directions =  ["oikea", "vasen", "ylös", "alas"]

    def liiku(self, direction: str):
        if direction in self.__directions:
            js.runCommand("move", direction)

pupu = Pelaaja()`;

        let fileReadMessage = tryGetFileAsText('../python/pelaaja.py');

        expect(fileReadMessage.isSuccess).toEqual(true);
        expect(fileReadMessage.result).toEqual(expectedOutput);
    });

    test('should return error fetching file', () => {
        const expectedOutput = `Error fetching file: a.py`;

        let fileReadMessage = tryGetFileAsText('../python/a.py');

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
