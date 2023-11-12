import { Container, BitmapText, Texture, TilingSprite, Graphics } from "pixi.js";
import { IScene } from "../utils/IScene";
import { Manager } from "../utils/Manager";
import { Enemy } from "../game/Enemy";
import { Scene1 } from "./Scene1";
import { sound } from "@pixi/sound";
import { Tween } from "tweedle.js";
import { Button } from "../UI/Button";
import { TitleText } from "../UI/TitleText";
import { HighScore } from "../UI/HighScore";


export class SceneTitle extends Container implements IScene {

    private background: TilingSprite;
    private background1: TilingSprite;
    private background2: TilingSprite;
    private enemies: Enemy[] = [];
    private elapsedTime: number = 0;
    private containerBack: Container;
    public static highestScore: BitmapText;

    constructor(goToHighscore: boolean) {
        super();

        sound.stopAll();
        sound.play("SongTitle", { volume: 0.6, loop: true, singleInstance: true });

        this.containerBack = new Container();
        this.addChild(this.containerBack);


        this.background = new TilingSprite(Texture.from("background.png"), 720, 1280);
        this.background.tileScale.set(6);
        this.containerBack.addChild(this.background)

        this.background1 = new TilingSprite(Texture.from("background1.png"), 720, 1280);
        this.background1.tileScale.set(6);
        this.containerBack.addChild(this.background1)

        this.background2 = new TilingSprite(Texture.from("background2.png"), 720, 1280);
        this.background2.tileScale.set(6);
        this.containerBack.addChild(this.background2)

        const containerFront = new Container();
        this.addChild(containerFront);

        SceneTitle.highestScore = new BitmapText("HIGH SCORE\n", { fontName: "PressStart2P", fontSize: 20, align: "center" /*lineHeight: 30*/ });
        SceneTitle.highestScore.anchor.x = 0.5;
        SceneTitle.highestScore.alpha = 0.5;
        SceneTitle.highestScore.position.set(Manager.width / 2, 32);
        containerFront.addChild(SceneTitle.highestScore);

        const highscore = new HighScore();
        this.addChild(highscore);
        highscore.visible = false;

        const buttonHighscore = new Button("highscore.png", 0.8, () => {
            buttonBack.visible = true;
            containerFront.visible = false;
            highscore.visible = true;

        });
        buttonHighscore.scale.set(5);
        buttonHighscore.position.set(645, 70);
        containerFront.addChild(buttonHighscore);

        const buttonBack = new Button("back.png", 0.8, () => {
            buttonBack.visible = false;
            containerFront.visible = true;
            highscore.visible = false;
        });
        buttonBack.scale.set(5);
        buttonBack.position.set(645, 70);
        buttonBack.visible = false;
        this.addChild(buttonBack);

        if (goToHighscore) {
            buttonBack.visible = true;
            containerFront.visible = false;
            highscore.visible = true;
        }




        const fullscreen = new Button("fullscreen.png", 0.8, () => {
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
        fullscreen.position.set(300, 1060);
        containerFront.addChild(fullscreen);

        const buttonMute = new Button("unmuted.png", 0.8, () => {
            if (!Manager.muted) {
                sound.muteAll();
                Manager.muted = true;
                buttonMute.changeTexture(Texture.from("muted.png"))
            } else {
                sound.unmuteAll();
                Manager.muted = false;
                buttonMute.changeTexture(Texture.from("unmuted.png"))
            }
        });
        buttonMute.position.set(416, 1060);
        containerFront.addChild(buttonMute);

        if (Manager.muted) {
            buttonMute.changeTexture(Texture.from("muted.png"))
        }

        const createText = (random: boolean) => {
            const textTitle = new TitleText(random);
            textTitle.eventMode = "static";
            textTitle.on("pointertap", () => {
                containerFront.removeChild(textTitle);
                textTitle.destroy();
                createText(true);
            })
            containerFront.addChild(textTitle);
        }
        createText(false);



        const buttonPlay = new Graphics();
        buttonPlay.beginFill(0xFFFFFF, 0.001);
        buttonPlay.drawRect(-200, -50, 400, 100);
        buttonPlay.position.set(Manager.width / 2, 800);
        buttonPlay.eventMode = "static";
        buttonPlay.cursor = "pointer";

        const textPlay = new BitmapText("[ PL4Y ]", { fontName: "PressStart2P", fontSize: 30, align: "center" });
        textPlay.anchor.set(0.5)

        buttonPlay.on("pointertap", () => Manager.changeScene(new Scene1))
        buttonPlay.addChild(textPlay);
        containerFront.addChild(buttonPlay);

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



        const buttonMove = new Graphics();
        buttonMove.beginFill(0xFFFFFF, 0.001)
        buttonMove.drawRect(-150, -35, 300, 70)
        buttonMove.position.set(Manager.width / 2, 950);
        buttonMove.eventMode = "static";
        buttonMove.cursor = "pointer";

        const buttonMoveText = new BitmapText("MOVE CONTROL\n[ ABSOLUTE ]", { fontName: "PressStart2P", fontSize: 20, align: "center", /*lineHeight: 32*/ });
        buttonMoveText.anchor.set(0.5)
        buttonMoveText.alpha = 0.6;
        buttonMove.addChild(buttonMoveText);

        buttonMove.on("pointertap", () => {
            if (Manager.movementType == "absolute") {
                buttonMoveText.text = "MOVE CONTROL\n[ RELATIVE ]";
                Manager.movementType = "relative";
            } else {
                buttonMoveText.text = "MOVE CONTROL\n[ ABSOLUTE ]";
                Manager.movementType = "absolute";
            }
        });
        if (Manager.movementType == "relative") {
            buttonMoveText.text = "MOVE CONTROL\n[ RELATIVE ]";
        }

        containerFront.addChild(buttonMove);




        const textCredits = new BitmapText("© 2023 Román Ríos", { fontName: "PressStart2P", fontSize: 18, align: "center", });
        textCredits.anchor.set(0.5)
        textCredits.position.set(Manager.width / 2 - 2, Manager.height - 70);
        textCredits.eventMode = "static";
        textCredits.cursor = "pointer";
        textCredits.on("pointertap", () => {
            window.open("https://romanrios.github.io", "_blank");
        });
        containerFront.addChild(textCredits);


    }


    public update(_deltaTime: number, _deltaFrame: number) {



        this.elapsedTime += _deltaTime;

        this.background.tilePosition.y += _deltaTime * 0.3;
        this.background.tilePosition.y %= Manager.height;

        this.background1.tilePosition.y += _deltaTime * 0.35;
        this.background1.tilePosition.y %= Manager.height;

        this.background2.tilePosition.y += _deltaTime * 0.4;
        this.background2.tilePosition.y %= Manager.height;

        // ENEMIES
        if (this.elapsedTime > Math.random() * 2000 + 1000) {
            const enemy = new Enemy("enemy", this);
            enemy.x = Math.random() * 680 + 20;
            this.containerBack.addChild(enemy);
            this.enemies.push(enemy);
            this.elapsedTime = 0;
        }

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];

            if (enemy.y >= Manager.height) {
                this.enemies.splice(i, 1);
                enemy.tween.stop();
                enemy.destroy();
            }
        }

    }




}


