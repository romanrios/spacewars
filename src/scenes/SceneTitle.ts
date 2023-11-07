import { Container, Text } from "pixi.js";
import { IScene } from "../utils/IScene";
import { Manager } from "../utils/Manager";
import { Enemy } from "../game/Enemy";
import { Scene1 } from "./Scene1";
import { sound } from "@pixi/sound";
import { Background } from "../game/Background";
import { Tween } from "tweedle.js";
import { Button } from "../UI/Button";
import { TitleText } from "../UI/TitleText";


export class SceneTitle extends Container implements IScene {

    private background: Background;
    private background1: Background;
    private background2: Background;
    private enemies: Enemy[] = [];
    private elapsedTime: number = 0;

    constructor() {
        super();

        sound.stopAll();
        sound.play("SongTitle", { volume: 0.5, loop: true, singleInstance: true });

        this.background = new Background("background.png");
        this.addChild(this.background)

        this.background1 = new Background("background1.png");
        this.addChild(this.background1)

        this.background2 = new Background("background2.png");
        this.addChild(this.background2)

        const text = new Text("HIGH-SCORE\n12300", { fontFamily: "PressStart2P", fontSize: 25, align: "center", fill: 0xFFFFFF, lineHeight: 35 });
        text.anchor.set(0.5)
        text.position.set(Manager.width / 2, 70);
        this.addChild(text);

        const fullscreen = new Button("fullscreen.png", () => {
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
        fullscreen.position.set(270, 1030);
        this.addChild(fullscreen);

        const unmuted = new Button("unmuted.png", () => {
            sound.muteAll();
            Manager.muted = true;
            muted.visible = true;
            unmuted.visible = false;
        });
        unmuted.position.set(385, 1030);
        this.addChild(unmuted);

        const muted = new Button("muted.png", () => {
            sound.unmuteAll();
            Manager.muted = false;
            muted.visible = false;
            unmuted.visible = true;
        });
        muted.visible = false;
        muted.position.set(385, 1030);
        this.addChild(muted);

        if (Manager.muted) {
            muted.visible = true;
            unmuted.visible = false;
        }

        const createText = (random: boolean) => {
            const textTitle = new TitleText(random);
            textTitle.eventMode = "static";
            textTitle.on("pointerup", () => {
                this.removeChild(textTitle);
                textTitle.destroy();
                createText(true);
            })
            this.addChild(textTitle);
        }
        createText(false);





        const textPlay = new Text("[ PL4Y ]", { fontFamily: "PressStart2P", fontSize: 30, align: "center", fill: 0xFFFFFF });
        textPlay.anchor.set(0.5)
        textPlay.position.set(Manager.width / 2, 890);
        textPlay.eventMode = "static";
        textPlay.cursor = "pointer";
        textPlay.on("pointerup", () => Manager.changeScene(new Scene1))
        this.addChild(textPlay);

        const textPlayTween = new Tween(textPlay)
            .to({}, 300)
            .start()
            .onComplete(() => {
                textPlay.text = "[      ]";
                new Tween(textPlay)
                    .to({}, 200)
                    .start()
                    .onComplete(() => {
                        textPlay.text = "[ PL4Y ]";
                        textPlayTween.start();
                    })
            })




        const textCredits = new Text("© 2023 Román Ríos", { fontFamily: "PressStart2P", fontSize: 18, align: "center", fill: 0xFFFFFF });
        textCredits.anchor.set(0.5)
        textCredits.position.set(Manager.width / 2 - 2, Manager.height - 100);
        textCredits.eventMode = "static";
        textCredits.cursor = "pointer";
        textCredits.on("pointerup", () => {
            window.open("https://romanrios.github.io", "_blank");
        });
        this.addChild(textCredits);


    }


    public update(_deltaTime: number, _deltaFrame: number) {



        this.elapsedTime += _deltaTime;

        this.background.y += _deltaTime * 0.3;
        this.background.y %= Manager.height;

        this.background1.y += _deltaTime * 0.35;
        this.background1.y %= Manager.height;

        this.background2.y += _deltaTime * 0.4;
        this.background2.y %= Manager.height;

        // ENEMIES
        if (this.elapsedTime > Math.random() * 2000 + 1000) {
            const enemy = new Enemy();
            enemy.x = Math.random() * 680 + 20;
            this.addChild(enemy);
            this.enemies.push(enemy);
            this.elapsedTime = 0;
        }
    }








}


