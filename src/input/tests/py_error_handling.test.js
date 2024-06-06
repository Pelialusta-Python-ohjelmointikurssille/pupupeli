import { extractErrorDetails, translateErrorType } from '../py_error_handling';

describe('extractErrorDetails', () => {
    it('should extract line number and translate error type correctly', () => {
        const errorMessage = `Traceback (most recent call last):
  File "example.py", line 1, in <module>
    import something
ModuleNotFoundError: No module named 'something'`;

        const result = extractErrorDetails(errorMessage);
        expect(result).toEqual({ text: "Yritit käyttää moduulia, jota ei löydy. Tarkista moduulin nimi", line: "1" });
    });

    it('should return default message if error type cannot be translated', () => {
        const errorMessage = `Traceback (most recent call last):
  File "example.py", line 2, in <module>
    some_function()
SomeUnknownError: This is an unknown error`;

        const result = extractErrorDetails(errorMessage);
        expect(result).toEqual({ text: "SomeUnknownError: This is an unknown error", line: "2" });
    });

    it('should return unknown line if no line number is found', () => {
        const errorMessage = `Some error message without a line number
Another line of error message`;

        const result = extractErrorDetails(errorMessage);
        expect(result).toEqual({ text: "Some error message without a line number\nAnother line of error message", line: "Tuntematon rivi" });
    });

    it('should handle syntax errors correctly', () => {
        const errorMessage = `Traceback (most recent call last):
  File "example.py", line 10
    if True print("Hello")
          ^
SyntaxError: invalid syntax`;

        const result = extractErrorDetails(errorMessage);
        expect(result).toEqual({ text: "Koodistasi löytyy kirjoitusvirhe", line: "10" });
    });
});

describe('translateErrorType', () => {
    it('should translate SyntaxError correctly', () => {
        const errorType = "SyntaxError: invalid syntax";
        const result = translateErrorType(errorType);
        expect(result).toBe("Koodistasi löytyy kirjoitusvirhe");
    });

    it('should translate ValueError correctly', () => {
        const errorType = "ValueError: Virheellinen suunta";
        const result = translateErrorType(errorType);
        expect(result).toBe("Antamasi suunta ei ole kirjoitettu oikein");
    });

    it('should translate IndexError correctly', () => {
        const errorType = "IndexError: list index out of range";
        const result = translateErrorType(errorType);
        expect(result).toBe("Yritit käyttää listan kohtaa, jota ei ole olemassa. Tarkista listan pituus ja yritä uudelleen");
    });

    it('should translate NameError correctly', () => {
        const errorType = "NameError: name 'foo' is not defined";
        const result = translateErrorType(errorType);
        expect(result).toBe("Käytit nimeä, jota ei ole määritelty. Tarkista kirjoitusvirheet");
    });

    it('should translate ModuleNotFoundError correctly', () => {
        const errorType = "ModuleNotFoundError: No module named 'foo'";
        const result = translateErrorType(errorType);
        expect(result).toBe("Yritit käyttää moduulia, jota ei löydy. Tarkista moduulin nimi");
    });

    it('should translate IndentationError correctly', () => {
        const errorType = "IndentationError: expected an indented block";
        const result = translateErrorType(errorType);
        expect(result).toBe("Tarkista, että jätät rivin alkuun tyhjää tilaa");
    });

    it('should translate TypeError correctly', () => {
        const errorType = "TypeError: unsupported operand type(s) for +: 'int' and 'str'";
        const result = translateErrorType(errorType);
        expect(result).toBe("Tarkista, että käyttämäsi arvot ovat oikeaa tyyppiä");
    });

    it('should return original error type if no translation found', () => {
        const errorType = "SomeUnknownError: This is an unknown error";
        const result = translateErrorType(errorType);
        expect(result).toBe("SomeUnknownError: This is an unknown error");
    });
});

