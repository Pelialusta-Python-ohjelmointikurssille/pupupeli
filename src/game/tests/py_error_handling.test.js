import { extractErrorDetails } from '../../input/py_error_handling';

describe('py_error_handling.js', () => {
  it('should extract error details correctly', () => {
    const errorMessage = 'File "<stdin>", line 1\n    print(a)\nNameError: name \'a\' is not defined\n ' ;
    const result = extractErrorDetails(errorMessage);
    expect(result).toEqual({ type: 'NameError: name \'a\' is not defined', line: '1' });
  });

  it('should return unknown error details if no match found', () => {
    const errorMessage = 'An unknown error occurred';
    const result = extractErrorDetails(errorMessage);
    expect(result).toEqual({ type: 'Unknown Error', line: 'Unknown Line' });
  });
  // Test so that only line is defined
    it('should extract error details correctly', () => {
        const errorMessage = 'File "<stdin>", line 1\n    print(a)\nNameError: name \'a\' is not defined\n ' ;
        const result = extractErrorDetails(errorMessage);
        expect(result).toEqual({ type: 'NameError: name \'a\' is not defined', line: '1' });
    });
});