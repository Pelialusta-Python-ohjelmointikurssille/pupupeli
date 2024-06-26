import { 
    createCharacterBunnySkin,
    createCollectibleCarrotSkin,
    createObstacleRockSkin,
    createBackgroundGrassSkin,
    createSpeechBubbleBunnySkin,
    createCharacterRobotSkin,
    createCollectibleWrenchSkin,
    createObstacleWellSkin,
    createBackgroundMetalSkin,
    createSpeechBubbleRobotSkin,
    createQuestionCollectibleBunnySkin,
    createQuestionCollectibleRobotSkin
} from '../entity_skins/factories/entity_skin_factories.js';

const assets = {
    characters: {
        bunny_down: 'bunny_down.png',
        bunny_up: 'bunny_up.png',
        bunny_left: 'bunny_left.png',
        bunny_right: 'bunny_right.png',
        robot_down: 'robot_down.png',
        robot_up: 'robot_up.png',
        robot_left: 'robot_left.png',
        robot_right: 'robot_right.png'
    },
    collectibles: {
        carrot: 'carrot.png',
        wrench: 'wrench.png',
        question: 'question.png'
    },
    obstacles: {
        rock: 'rock.png',
        well: 'well.png'
    },
    backgrounds: {
        grass: 'grass.png',
        metal: 'metal.png'
    },
    ui: {
        speech_bubble: 'speech_bubble.png'
    }
};

jest.mock('../entity_skins/entity_skin.js', () => {
    return {
        EntitySkin: jest.fn().mockImplementation((skinName, theme, skinOptions) => {
            return { skinName, theme, skinOptions };
        })
    };
});

describe('Skin creation functions', () => {
    const theme = 'default';

    test('createCharacterBunnySkin creates the correct skin', () => {
        const skinName = 'bunnySkin';
        const skin = createCharacterBunnySkin(skinName, theme, assets);
        expect(skin).toEqual({
            skinName,
            theme,
            skinOptions: {
                defaultTexture: assets.characters.bunny_down,
                upTexture: assets.characters.bunny_up,
                downTexture: assets.characters.bunny_down,
                leftTexture: assets.characters.bunny_left,
                rightTexture: assets.characters.bunny_right
            }
        });
    });

    test('createCollectibleCarrotSkin creates the correct skin', () => {
        const skinName = 'carrotSkin';
        const skin = createCollectibleCarrotSkin(skinName, theme, assets);
        expect(skin).toEqual({
            skinName,
            theme,
            skinOptions: {
                defaultTexture: assets.collectibles.carrot,
            }
        });
    });

    test('createObstacleRockSkin creates the correct skin', () => {
        const skinName = 'rockSkin';
        const skin = createObstacleRockSkin(skinName, theme, assets);
        expect(skin).toEqual({
            skinName,
            theme,
            skinOptions: {
                defaultTexture: assets.obstacles.rock,
            }
        });
    });

    test('createBackgroundGrassSkin creates the correct skin', () => {
        const skinName = 'grassSkin';
        const skin = createBackgroundGrassSkin(skinName, theme, assets);
        expect(skin).toEqual({
            skinName,
            theme,
            skinOptions: {
                defaultTexture: assets.backgrounds.grass,
            }
        });
    });

    test('createSpeechBubbleBunnySkin creates the correct skin', () => {
        const skinName = 'speechBubbleBunnySkin';
        const skin = createSpeechBubbleBunnySkin(skinName, theme, assets);
        expect(skin).toEqual({
            skinName,
            theme,
            skinOptions: {
                defaultTexture: assets.ui.speech_bubble,
            }
        });
    });

    test('createCharacterRobotSkin creates the correct skin', () => {
        const skinName = 'robotSkin';
        const skin = createCharacterRobotSkin(skinName, theme, assets);
        expect(skin).toEqual({
            skinName,
            theme,
            skinOptions: {
                defaultTexture: assets.characters.robot_down,
                upTexture: assets.characters.robot_up,
                downTexture: assets.characters.robot_down,
                leftTexture: assets.characters.robot_left,
                rightTexture: assets.characters.robot_right
            }
        });
    });

    test('createCollectibleWrenchSkin creates the correct skin', () => {
        const skinName = 'wrenchSkin';
        const skin = createCollectibleWrenchSkin(skinName, theme, assets);
        expect(skin).toEqual({
            skinName,
            theme,
            skinOptions: {
                defaultTexture: assets.collectibles.wrench,
            }
        });
    });

    test('createObstacleWellSkin creates the correct skin', () => {
        const skinName = 'wellSkin';
        const skin = createObstacleWellSkin(skinName, theme, assets);
        expect(skin).toEqual({
            skinName,
            theme,
            skinOptions: {
                defaultTexture: assets.obstacles.well,
            }
        });
    });

    test('createBackgroundMetalSkin creates the correct skin', () => {
        const skinName = 'metalSkin';
        const skin = createBackgroundMetalSkin(skinName, theme, assets);
        expect(skin).toEqual({
            skinName,
            theme,
            skinOptions: {
                defaultTexture: assets.backgrounds.metal,
            }
        });
    });

    test('createSpeechBubbleRobotSkin creates the correct skin', () => {
        const skinName = 'speechBubbleRobotSkin';
        const skin = createSpeechBubbleRobotSkin(skinName, theme, assets);
        expect(skin).toEqual({
            skinName,
            theme,
            skinOptions: {
                defaultTexture: assets.ui.speech_bubble,
            }
        });
    });

    test('createQuestionCollectibleBunnySkin creates the correct skin', () => {
        const skinName = 'questionBunnySkin';
        const skin = createQuestionCollectibleBunnySkin(skinName, theme, assets);
        expect(skin).toEqual({
            skinName,
            theme,
            skinOptions: {
                defaultTexture: assets.collectibles.question,
            }
        });
    });

    test('createQuestionCollectibleRobotSkin creates the correct skin', () => {
        const skinName = 'questionRobotSkin';
        const skin = createQuestionCollectibleRobotSkin(skinName, theme, assets);
        expect(skin).toEqual({
            skinName,
            theme,
            skinOptions: {
                defaultTexture: assets.collectibles.question,
            }
        });
    });
});
