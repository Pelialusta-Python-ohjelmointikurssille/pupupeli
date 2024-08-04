// At the top of your test file, before any imports that might cause the issue
jest.mock('../ui/ui.js', () => ({
    onTaskComplete: jest.fn().mockImplementation(() => {
      // Provide a mock implementation if necessary
      console.log('Mock onTaskComplete called');
    }),
    // Mock other exports from ui.js as needed
  }));
  
import { onTaskComplete } from "../ui/ui.js";
// Your test code follows

jest.mock('../util/globals.js', () => ({
    task: {
      getConditions: jest.fn().mockReturnValue([]),
      getMultipleChoiceQuestions: jest.fn().mockReturnValue([]),
    },
    getMultipleChoiceCorrect: jest.fn().mockReturnValue(false),
    collectibles: {
      current: 0,
      total: 0,
    },
  }));

import { task, getMultipleChoiceCorrect } from "../util/globals.js";

import { isAllConditionsCleared } from '../clear_conditions.js';

describe('allConditionsCleared tests', () => {
    beforeEach(() => {
        // Resetting the mocks before each test
        jest.clearAllMocks();
        global.conditionsNotCleared = [];
        
        // Ensure global.task is defined before mocking its methods
        global.task = {
          getMultipleChoiceQuestions: jest.fn().mockReturnValue(),
          // Add other methods of global.task here if needed
        };

        global.otherConditions = jest.fn(); // Initialize the mock function
      
        // Initialize and mock global.conditionChecker
        global.conditionChecker = jest.fn().mockReturnValue(false);

        // Initialize and mock global.collectibles
        global.collectibles = {
          current: 0,
          total: 0,
        };

        // Initialize and mock global.getMultipleChoiceCorrect
        global.getMultipleChoiceCorrect = jest.fn().mockReturnValue(false);
      });
  
    test('should return false when multiple choice questions are not correctly answered', () => {
      task.getMultipleChoiceQuestions.mockReturnValue(["a","b","c"]); // Simulate at least one multiple choice question
      global.getMultipleChoiceCorrect.mockReturnValue(false); // Simulate incorrect answer
  
      const result = isAllConditionsCleared();
      console.log(result);
      expect(result).toBe(false);
    });
  
    test('should handle a mix of conditions not being met', () => {
      task.getMultipleChoiceQuestions.mockReturnValue([{}]); // Simulate at least one multiple choice question
      global.getMultipleChoiceCorrect.mockReturnValue(false); // Incorrect multiple choice answer
      global.conditionChecker.mockImplementation(() => false); // Other conditions not cleared
      global.collectibles.current = 9; // Not all collectibles collected
      global.collectibles.total = 10;
  
      const result = isAllConditionsCleared();
      expect(result).toBe(false);
      // Since multiple choice question is incorrect, conditionsNotCleared should not include collectibles condition
      expect(global.conditionsNotCleared).not.toContain("conditionCollectAllCollectibles");
    });
  
    test('should return true when there are no conditions to clear', () => {
      task.getMultipleChoiceQuestions.mockReturnValue([]); // No multiple choice questions
      global.conditionChecker.mockImplementation(() => true); // All other conditions are cleared
      global.collectibles.current = 10; // All collectibles are collected
      global.collectibles.total = 10;
  
      const result = isAllConditionsCleared();
      expect(result).toBe(true);
    });
  });