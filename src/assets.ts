import { ResolverManifest } from "pixi.js";

export const manifest: ResolverManifest = {
    bundles: [
        {
            name: "mainScene",
            assets:
            {
                Background: "background.png",
                Ship: "ship.png",
                Ship_left: "ship_left.png",
                Ship_right: "ship_right.png",
                Shot: "shot.png",
                Enemy01: "enemy01.png",
                Enemy02: "enemy02.png",
                Enemy03: "enemy03.png",
                Enemy04: "enemy04.png",

                Font: "PressStart2P.ttf",

                SongTitle: "naves_song_title.mp3",
                SongLevel: "naves_song_level.mp3",
                GameOver: "gameover.mp3",
                EnemyKilled: "enemy_killed.mp3",

            }
        }
    ]
}