import { Constants } from "../commonstrings.js";
import { Grid } from "../grid.js";
import { GridObject } from "../gridobject.js";

describe('GameMode testing from gameModes.js', () => {
    let grid;
    let player;

    beforeEach(() => {
        player = new GridObject("pupu");
        grid = new Grid(player, 2, 2);
        let collectible = new GridObject(Constants.COLLECTIBLE);
        grid.addToGrid(player, 0, 0);

        //Mock grid object jonnekkin tänne??!?!?

        grid.addToGrid(collectible, 0, 1);
        newGrid.saveCurrentStateForReset(); //Important!
        const collectibles = { total: 1, current: 0 };
        globals.collectibles.mockReturnValue(collectibles);
    });

    test('Can win game mode "GameModeGetCollectibles"', () => {
        let gameMode = new GameModeGetCollectibles(grid);
        gameMode.eventTarget.dispatchEvent = jest.fn();
        gameMode.eventTarget.addEventListener("victory", victory);
        expect(gameMode.eventTarget.dispatchEvent).toHaveBeenCalledWith(new Event("victory"));
    });


});
