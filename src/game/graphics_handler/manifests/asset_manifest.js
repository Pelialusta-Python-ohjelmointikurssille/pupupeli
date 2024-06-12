export const ASSETS = {
    bundles: [
        {
            name: "characters",
            assets: [
                {
                    alias: "bunny_down",
                    src: "src/static/game_assets/bunny_front.png"
                },
                {
                    alias: "bunny_right",
                    src: "src/static/game_assets/bunny_right.png"
                },
                {
                    alias: "bunny_left",
                    src: "src/static/game_assets/bunny_left.png"
                },
                {
                    alias: "bunny_up",
                    src: "src/static/game_assets/bunny_back.png"
                },
                {
                    alias: "robot_down",
                    src: "src/static/game_assets/robot_front.png"
                },
                {
                    alias: "robot_right",
                    src: "src/static/game_assets/robot_right.png"
                },
                {
                    alias: "robot_left",
                    src: "src/static/game_assets/robot_left.png"
                },
                {
                    alias: "robot_up",
                    src: "src/static/game_assets/robot_back.png"
                }
            ]
        },
        {
            name: "backgrounds",
            assets: [
                {
                    alias: "grass",
                    src: "src/static/game_assets/background_grass.png"
                },
                {
                    alias: "metal",
                    src: "src/static/game_assets/background_metal.png"
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
                    src: "src/static/game_assets/Roboto-Light.ttf",
                    data: { family: 'Roboto Light' }

                }
            ]
        },
        {
            name: "collectibles",
            assets: [
                {
                    alias: "carrot",
                    src: "src/static/game_assets/carrot.png"
                },
                {
                    alias: "wrench",
                    src: "src/static/game_assets/wrench.png"
                }
            ]
        },
        {
            name: "obstacles",
            assets: [
                {
                    alias: "rock",
                    src: "src/static/game_assets/Kivi3.png"
                },
                {
                    alias: "well",
                    src: "src/static/game_assets/well.png"
                }
            ]
        },
        {
            name: "ui",
            assets: [
                {
                    alias: "speechbubble_9slice",
                    src: "src/static/game_assets/speechbubblenineslice.png"
                }
            ]
        },
        
    ]
}