import { ResolverManifest } from "pixi.js";

export const manifest: ResolverManifest = {
    bundles: [
        {
            name: "mainScene",
            assets:
            {
                SpriteSheet: "spritesheet.json",

                PressStart2P: "PressStart2P.fnt",
                FontTTF: "PressStart2P.ttf",

                SongTitle: "naves_song_title.mp3",
                SongLevel: "naves_song_level.mp3",
                GameOver: "gameover.mp3",
                EnemyKilled: "enemy_killed.mp3",
                Item: "item.mp3",
                PauseStartSound: "pause_start.mp3",
                PauseEndSound: "pause_end.mp3",
                Pew: "pew.mp3",

                // Background: "background.png",
                // Background1: "background1.png",
                // Background2: "background2.png",
                // Ship: "ship.png",
                // Ship_left: "ship_left.png",
                // Ship_right: "ship_right.png",
                // Enemy01: "enemy01.png",
                // Enemy02: "enemy02.png",
                // Enemy03: "enemy03.png",
                // Enemy04: "enemy04.png",
                // Two: "two.png",
                // Three: "three.png",
                // Speed: "speed.png",
                // Fullscreen: "fullscreen.png",
                // Muted: "muted.png",
                // Unmuted: "unmuted.png",
                // Back: "back.png",
                // Ok: "ok.png",
                // Highscore: "highscore.png",
                // PauseStartIcon: "pause_start.png",
                // PauseEndIcon: "pause_end.png",
                // ShotSmall: "shot_small.png",
                // ShotMedium: "shot_medium.png",
                // ShotLarge: "shot_large.png",
                // ShotSizePowerup: "shot_size_powerup.png",


            }
        }
    ]
}