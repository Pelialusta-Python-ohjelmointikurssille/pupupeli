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

    const expectedOutput = { type: '    raise ValueError("An error occurred")', line: '5' };
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

    const expectedOutput = { type: '    raise TypeError("Another error occurred")', line: '20' };
    const actualOutput = extractErrorDetails(errorMessage);
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('should return unknown details for a malformed error message', () => {
    const errorMessage = `This is a malformed error message without proper file and line references`;

    const expectedOutput = { type: "Unknown Error", line: "Unknown Line" };
    const actualOutput = extractErrorDetails(errorMessage);
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('should return unknown details for an empty error message', () => {
    const errorMessage = ``;

    const expectedOutput = { type: "Unknown Error", line: "Unknown Line" };
    const actualOutput = extractErrorDetails(errorMessage);
    expect(actualOutput).toEqual(expectedOutput);
  });
});
