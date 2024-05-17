import { InitGame, MovePupu } from '../initgame';
import * as gamegrid from '../gamegrid';
import * as gridobject from '../gridobject';

// Mock the entire gamegrid and gridobject modules
jest.mock('../gamegrid');
jest.mock('../gridobject');

describe('InitGame function', () => {
    beforeEach(() => {
        // Clear all instances and calls to the mocked functions before each test
        jest.clearAllMocks();
    });

    it('should call initGrid with correct arguments', () => {
        InitGame();
        expect(gamegrid.initGrid).toHaveBeenCalledWith(8, 8);
    });

    it('should call getNewGridObject with correct arguments', () => {
        InitGame();
        expect(gridobject.getNewGridObject).toHaveBeenCalledWith('pupu');
    });

    it('should call addToGrid with correct arguments', () => {
        const mockPupu = { name: 'pupu' };
        gridobject.getNewGridObject.mockReturnValue(mockPupu);
        InitGame();
        expect(gamegrid.addToGrid).toHaveBeenCalledWith(mockPupu, 0, 0);
    });

    it('should call addToGrid with correct arguments', () => {
        const mockPupu = { name: 'pupu' };
        gridobject.getNewGridObject.mockReturnValue(mockPupu);
        InitGame();
        MovePupu(mockPupu, 0, 1)
        expect(gamegrid.moveGridObjectToDir).toHaveBeenCalledWith(mockPupu, 0, 1);
    });
});

