export const ASSETS = {
    bundles: [
        {
            name: "characters",
            assets: [
                {
                    alias: "bunny_down",
                    src: "src/static/game_assets/characters/bunny_down.png"
                },
                {
                    alias: "bunny_right",
                    src: "src/static/game_assets/characters/bunny_right.png"
                },
                {
                    alias: "bunny_left",
                    src: "src/static/game_assets/characters/bunny_left.png"
                },
                {
                    alias: "bunny_up",
                    src: "src/static/game_assets/characters/bunny_up.png"
                },
                {
                    alias: "robot_down",
                    src: "src/static/game_assets/characters/robot_down.png"
                },
                {
                    alias: "robot_right",
                    src: "src/static/game_assets/characters/robot_right.png"
                },
                {
                    alias: "robot_left",
                    src: "src/static/game_assets/characters/robot_left.png"
                },
                {
                    alias: "robot_up",
                    src: "src/static/game_assets/characters/robot_up.png"
                }
            ]
        },
        {
            name: "backgrounds",
            assets: [
                {
                    alias: "grass",
                    src: "src/static/game_assets/backgrounds/background_grass.png"
                },
                {
                    alias: "metal",
                    src: "src/static/game_assets/backgrounds/background_metal.png"
                }
            ]
        },
        {
            name: "fonts",
            assets: [
                {
                    /*
                    Apache License
                    Version 2.0, January 2004
                    http://www.apache.org/licenses/
                    Mainly just placeholder font for testing font loading.
                    */
                    alias: "builtin_roboto_light",
                    src: "src/static/game_assets/fonts/Roboto-Light.ttf",
                    data: { family: 'Roboto Light' }

                }
            ]
        },
        {
            name: "collectibles",
            assets: [
                {
                    alias: "carrot",
                    src: "src/static/game_assets/collectibles/carrot.png"
                },
                {
                    alias: "wrench",
                    src: "src/static/game_assets/collectibles/wrench.png"
                },
                {
                    alias: "question",
                    src: "src/static/game_assets/collectibles/ask_collectible.png"
                }
            ]
        },
        {
            name: "obstacles",
            assets: [
                {
                    alias: "rock",
                    src: "src/static/game_assets/obstacles/rock.png"
                },
                {
                    alias: "well",
                    src: "src/static/game_assets/obstacles/well.png"
                }
            ]
        },
        {
            name: "ui",
            assets: [
                {
                    alias: "speech_bubble",
                    src: "src/static/game_assets/ui/speech_bubble.png"
                }
            ]
        },
        
    ]
}