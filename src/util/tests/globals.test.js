import { taskIdentifier } from '../globals.js';

const mockTaskIdentifierGetter = jest.fn();
jest.mock('../globals.js', () => ({
  get taskIdentifier() {
    return mockTaskIdentifierGetter();
  },
}));

describe('taskIdentifier', () => {
    delete window.location
    window.location = new URL('https://localhost:8000/?task=2')
    let searchParams = new URLSearchParams(window.location.search);

    it('should return the task identifier', () => {
        expect(searchParams.get("task")).toBe(taskIdentifier);
    });
});