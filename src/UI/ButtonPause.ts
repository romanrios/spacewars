import { Container, Text, Texture } from "pixi.js";
import { Manager } from "../utils/Manager";
import { sound } from "@pixi/sound";
import { Button } from "./Button";
import { SceneTitle } from "../scenes/SceneTitle";

export class ButtonPause extends Container {


    constructor() {
        super();

        const container = new Container();

        const textPause = new Text("GAME PAUSED", { fontFamily: "PressStart2P", fontSize: 25, align: "center", fill: 0xFFFFFF });
        textPause.anchor.set(0.5)
        textPause.position.set(Manager.width / 2, Manager.height / 2);
        container.addChild(textPause);

        const buttonPause = new Button("pause_start.png", 0.8, () => {
            if (!Manager.paused) {
                Manager.paused = true;
                sound.pause("SongLevel");
                sound.play("PauseStartSound", { volume: 0.5, singleInstance: true });
                buttonPause.changeTexture(Texture.from("pause_end.png"));
                this.addChild(container);
            } else {
                sound.play("PauseEndSound", { volume: 0.5, singleInstance: true });
                Manager.paused = false;
                sound.resume("SongLevel");
                buttonPause.changeTexture(Texture.from("pause_start.png"));
                this.removeChild(container);
            }
        });
        buttonPause.scale.set(4);
        buttonPause.position.set(670, 50);
        this.addChild(buttonPause);


        const buttonBack = new Button("back.png", 0.5, () => {
            Manager.changeScene((new SceneTitle(false)));
            Manager.paused = false;
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
        container.addChild(fullscreen);

        const buttonMute = new Button("unmuted.png", 0.5, () => {
            if (!Manager.muted) {
                sound.muteAll();
                Manager.muted = true;
                buttonMute.changeTexture(Texture.from("muted.png"))
            } else {
                sound.unmuteAll();
                Manager.muted = false;
                buttonMute.changeTexture(Texture.from("unmuted.png"))
            }
        })
        buttonMute.position.set(50, 250);
        container.addChild(buttonMute);
        if (Manager.muted) {
            buttonMute.changeTexture(Texture.from("muted.png"))
        }
    }


}