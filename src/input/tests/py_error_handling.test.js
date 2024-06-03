// py_error_handling.test.js
import { extractErrorDetails } from '../../input/py_error_handling.js';

describe('extractErrorDetails', () => {
  test('should extract details from a standard error message', () => {
    const errorMessage = `Traceback (most recent call last):
  File "example.py", line 2, in <module>
    main()
  File "example.py", line 5, in main
    raise ValueError("An error occurred")
ValueError: An error occurred`;

    const expectedOutput = { text: '    raise ValueError("An error occurred")', line: '5' };
    const actualOutput = extractErrorDetails(errorMessage);
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('should extract details from an error message with multiple file references', () => {
    const errorMessage = `Traceback (most recent call last):
  File "example.py", line 2, in <module>
    main()
  File "another_example.py", line 10, in main
    function()
  File "another_example.py", line 20, in function
    raise TypeError("Another error occurred")
TypeError: Another error occurred`;

    const expectedOutput = { text: '    raise TypeError("Another error occurred")', line: '20' };
    const actualOutput = extractErrorDetails(errorMessage);
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('should return the given error message for a malformed error message', () => {
    const errorMessage = `This is a malformed error message without proper file and line references`;

    const expectedOutput = { text: "This is a malformed error message without proper file and line references", line: "Unknown Line" };
    const actualOutput = extractErrorDetails(errorMessage);
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('should empty error for an empty error message', () => {
    const errorMessage = ``;

    const expectedOutput = { text: "", line: "Unknown Line" };
    const actualOutput = extractErrorDetails(errorMessage);
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('should extract error details correctly', () => {
    const errorMessage = 'File "<stdin>", line 1\n    print(a)\nNameError: name \'a\' is not defined\n ' ;
    const result = extractErrorDetails(errorMessage);
    expect(result).toEqual({ text: 'NameError: name \'a\' is not defined', line: '1' });
  });

  test('should return the error message if no match found', () => {
    const errorMessage = 'An unknown error occurred';
    const result = extractErrorDetails(errorMessage);
    expect(result).toEqual({ text: 'An unknown error occurred', line: 'Unknown Line' });
  });
  // Test so that only line is defined
  test('should extract error details correctly', () => {
      const errorMessage = 'File "<stdin>", line 1\n    print(a)\nNameError: name \'a\' is not defined\n ' ;
      const result = extractErrorDetails(errorMessage);
      expect(result).toEqual({ text: 'NameError: name \'a\' is not defined', line: '1' });
  });
  test('should return corrrect line if error is virheellinen suunta', () => {
      const errorMessage = 'File "<stdin>", line 1\n File "<stdin>", line 2\n File "<stdin>", line 3\n print(a)\nValueError: Virheellinen suunta\n' ;
      const result = extractErrorDetails(errorMessage);
      expect(result).toEqual({ text: 'ValueError: Virheellinen suunta', line: '2' });
  });
});
