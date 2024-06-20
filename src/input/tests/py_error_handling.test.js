import { extractErrorDetails, translateErrorType, setCurrentLine, getCurrentLine } from '../py_error_handling';

describe('extractErrorDetails', () => {
    test('should extract line number and translate error type', () => {
        const errorMessage = `
            Traceback (most recent call last):
              File "script.py", line 4, in <module>
                main()
              File "script.py", line 5, in main
                raise ValueError('Virheellinen suunta')
            ValueError: Virheellinen suunta
        `;
        const result = extractErrorDetails(errorMessage);
        expect(result).toEqual({
            text: 'Antamasi suunta ei ole kirjoitettu oikein',
            line: '2'
        });
    });

    test('should handle unknown error types', () => {
        const errorMessage = `
            Traceback (most recent call last):
              File "script.py", line 2, in <module>
                main()
              File "script.py", line 7, in main
                raise UnknownError('Tuntematon virhe')
            UnknownError: Tuntematon virhe
        `;
        const result = extractErrorDetails(errorMessage);
        expect(result).toEqual({
            text: 'UnknownError: Tuntematon virhe',
            line: '5'
        });
    });

    test('should handle missing line number', () => {
        const errorMessage = `
            Traceback (most recent call last):
              File "script.py", line 2, in <module>
                main()
              File "script.py", line 7, in main
                raise UnknownError('Tuntematon virhe')
            UnknownError: Tuntematon virhe
        `;
        const result = extractErrorDetails(errorMessage);
        expect(result.line).toBe('5');
    });

    test('should handle errors without file reference', () => {
        const errorMessage = `
            Traceback (most recent call last):
                raise SyntaxError('invalid syntax')
            SyntaxError: invalid syntax
        `;
        const result = extractErrorDetails(errorMessage);
        expect(result).toEqual({
            text: 'Koodistasi löytyy kirjoitusvirhe',
            line: 'Tuntematon rivi'
        });
    });
});

describe('translateErrorType', () => {
    test('should translate SyntaxError', () => {
        const errorType = 'SyntaxError: invalid syntax';
        const result = translateErrorType(errorType);
        expect(result).toBe('Koodistasi löytyy kirjoitusvirhe');
    });

    test('should translate ValueError', () => {
        const errorType = 'ValueError: Virheellinen suunta';
        const result = translateErrorType(errorType);
        expect(result).toBe('Antamasi suunta ei ole kirjoitettu oikein');
    });

    test('should translate IndexError', () => {
        const errorType = 'IndexError: list index out of range';
        const result = translateErrorType(errorType);
        expect(result).toBe('Yritit käyttää listan kohtaa, jota ei ole olemassa. Tarkista listan pituus ja yritä uudelleen');
    });

    test('should handle unknown error types', () => {
        const errorType = 'UnknownError: tuntematon virhe';
        const result = translateErrorType(errorType);
        expect(result).toBe('UnknownError: tuntematon virhe');
    });

    test('should handle NameError', () => {
        const errorType = 'NameError: name "foo" is not defined';
        const result = translateErrorType(errorType);
        expect(result).toBe('Käytit nimeä, jota ei ole määritelty. Tarkista kirjoitusvirheet');
    });

    test('should handle ModuleNotFoundError', () => {
        const errorType = 'ModuleNotFoundError: No module named "foo"';
        const result = translateErrorType(errorType);
        expect(result).toBe('Yritit käyttää moduulia, jota ei löydy. Tarkista moduulin nimi');
    });

    test('should handle IndentationError', () => {
        const errorType = 'IndentationError: expected an indented block';
        const result = translateErrorType(errorType);
        expect(result).toBe('Tarkista, että jätät rivin alkuun tyhjää tilaa');
    });

    test('should handle TypeError', () => {
        const errorType = 'TypeError: unsupported operand type(s)';
        const result = translateErrorType(errorType);
        expect(result).toBe('Tarkista, että käyttämäsi arvot ovat oikeaa tyyppiä');
    });
});

describe('Line handling', () => {
    it('should set and get the current line correctly', () => {
        setCurrentLine(5);
        expect(getCurrentLine()).toBe(5);

        setCurrentLine(10);
        expect(getCurrentLine()).toBe(10);
    });
});



