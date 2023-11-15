import { Container, BitmapText, Texture } from "pixi.js";
import { Manager } from "../utils/Manager";
import { sound } from "@pixi/sound";
import { Button } from "./Button";
import { SceneTitle } from "../scenes/SceneTitle";
import { Player } from "../game/Player";

export class ButtonPause extends Container {
    private buttonPause: Button;
    private container: Container;
    private parentScene: any;

    constructor(parent: any) {
        super();

        this.parentScene = parent;


        this.container = new Container();

        const textPause = new BitmapText("GAME PAUSED", { fontName: "PressStart2P", fontSize: 25, align: "center" });
        textPause.anchor.set(0.5)
        textPause.position.set(Manager.width / 2, Manager.height / 2);
        this.container.addChild(textPause);

        this.buttonPause = new Button("pause_start.png", 0.8, () => {
            this.pauseGame();
        });
        this.buttonPause.scale.set(4);
        this.buttonPause.position.set(670, 50);
        this.addChild(this.buttonPause);


        const buttonBack = new Button("back.png", 0.5, () => {
            this.parentScene.removeKeyboardPauseListener();
            Player.SHOOT_MULTIPLY = "normal";
            Player.SHOOT_DELAY = Player.NORMAL_SHOOT_DELAY;
            Player.SHOOT_SIZE = "small";
            Manager.changeScene((new SceneTitle(false)));
            Manager.PAUSED = false;
        });
        buttonBack.scale.set(4);
        buttonBack.position.set(50, 50);
        this.addChild(buttonBack);


        const fullscreen = new Button("fullscreen.png", 0.5, () => {
            if (!document.fullscreenElement) {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });
        fullscreen.position.set(50, 150);
        this.container.addChild(fullscreen);

        const buttonMute = new Button("unmuted.png", 0.5, () => {
            if (!Manager.MUTED) {
                sound.muteAll();
                Manager.MUTED = true;
                buttonMute.changeTexture(Texture.from("muted.png"))
            } else {
                sound.unmuteAll();
                Manager.MUTED = false;
                buttonMute.changeTexture(Texture.from("unmuted.png"))
            }
        })
        buttonMute.position.set(50, 250);
        this.container.addChild(buttonMute);
        if (Manager.MUTED) {
            buttonMute.changeTexture(Texture.from("muted.png"))
        }


    }

    pauseGame() {
        if (!Manager.PAUSED) {
            Manager.PAUSED = true;
            sound.pause("SongLevel");
            sound.play("PauseStartSound", { volume: 0.5, singleInstance: true });
            this.buttonPause.changeTexture(Texture.from("pause_end.png"));
            this.addChild(this.container);
        } else {
            sound.play("PauseEndSound", { volume: 0.5, singleInstance: true });
            Manager.PAUSED = false;
            sound.resume("SongLevel");
            this.buttonPause.changeTexture(Texture.from("pause_start.png"));
            this.removeChild(this.container);
        }
    }


}