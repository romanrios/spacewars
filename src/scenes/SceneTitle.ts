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
import { Player } from "../game/Player";


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

        const configFontsize = 16;

        sound.stopAll();
        sound.play("SongTitle", { volume: 0.6, loop: true, singleInstance: true });


        // BG & CONTAINER
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



        // HIGHSCORE
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


        // TITLE
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



        // PLAY
        const buttonPlay = new Graphics();
        buttonPlay.beginFill(0xFFFFFF, 0.0001);
        buttonPlay.drawRect(-200, -50, 400, 100);
        buttonPlay.position.set(Manager.width / 2, 750);
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




        // MOVE CONTROL
        const buttonMove = new Graphics();
        buttonMove.beginFill(0xFFFFFF, 0.001)
        buttonMove.drawRect(-150, -35, 300, 70)
        buttonMove.position.set(Manager.width / 2, 890);
        buttonMove.eventMode = "static";
        buttonMove.cursor = "pointer";

        const buttonMoveText = new BitmapText("MOVE CONTROL\n[ ABSOLUTE ]", { fontName: "PressStart2P", fontSize: configFontsize, align: "center", /*lineHeight: 32*/ });
        buttonMoveText.anchor.set(0.5)
        buttonMoveText.alpha = 0.6;
        buttonMove.addChild(buttonMoveText);

        buttonMove.on("pointertap", () => {
            if (Player.MOVEMENT_TYPE == "absolute") {
                buttonMoveText.text = "MOVE CONTROL\n[ RELATIVE ]";
                Player.MOVEMENT_TYPE = "relative";
                buttonOffset.visible = false;
            } else {
                buttonMoveText.text = "MOVE CONTROL\n[ ABSOLUTE ]";
                Player.MOVEMENT_TYPE = "absolute";
                buttonOffset.visible = true;
            }
        });
        if (Player.MOVEMENT_TYPE == "relative") {
            buttonMoveText.text = "MOVE CONTROL\n[ RELATIVE ]";
        }

        containerFront.addChild(buttonMove);






        // SHIP SPEED
        const buttonSpeed = new Graphics();
        buttonSpeed.beginFill(0xFFFFFF, 0.001)
        buttonSpeed.drawRect(-150, -35, 300, 70)
        buttonSpeed.position.set(Manager.width / 2, 990);
        buttonSpeed.eventMode = "static";
        buttonSpeed.cursor = "pointer";
        const buttonSpeedText = new BitmapText("SHIP SPEED\n[ HIGH ]", { fontName: "PressStart2P", fontSize: configFontsize, align: "center", /*lineHeight: 32*/ });
        buttonSpeedText.anchor.set(0.5)
        buttonSpeedText.alpha = 0.6;
        buttonSpeed.addChild(buttonSpeedText);

        buttonSpeed.on("pointertap", () => {
            if (Player.SHIP_SPEED == "medium") {
                buttonSpeedText.text = "SHIP SPEED\n[ HIGH ]";
                Player.SHIP_SPEED = "high";
                Player.KEYBOARD_SPEED = 700;
            } else if (Player.SHIP_SPEED == "high") {
                buttonSpeedText.text = "SHIP SPEED\n[ LOW ]";
                Player.SHIP_SPEED = "low";
                Player.KEYBOARD_SPEED = 300;
            } else {
                buttonSpeedText.text = "SHIP SPEED\n[ MEDIUM ]";
                Player.SHIP_SPEED = "medium";
                Player.KEYBOARD_SPEED = 500;
            }
        }
        );

        if (Player.SHIP_SPEED == "medium") {
            buttonSpeedText.text = "SHIP SPEED\n[ MEDIUM ]";
        } else if (Player.SHIP_SPEED == "high") {
            buttonSpeedText.text = "SHIP SPEED\n[ HIGH ]";
        } else {
            buttonSpeedText.text = "SHIP SPEED\n[ LOW ]";
        }

        containerFront.addChild(buttonSpeed);







        // OFFSET
        const buttonOffset = new Graphics();
        buttonOffset.beginFill(0xFFFFFF, 0.001)
        buttonOffset.drawRect(-150, -35, 300, 70)
        buttonOffset.position.set(Manager.width / 2, 1090);
        buttonOffset.eventMode = "static";
        buttonOffset.cursor = "pointer";
        const buttonOffsetText = new BitmapText("OFFSET\n[ MEDIUM ]", { fontName: "PressStart2P", fontSize: configFontsize, align: "center", /*lineHeight: 32*/ });
        buttonOffsetText.anchor.set(0.5)
        buttonOffsetText.alpha = 0.6;
        buttonOffset.addChild(buttonOffsetText);

        buttonOffset.on("pointertap", () => {
            if (Player.OFFSET == "medium") {
                buttonOffsetText.text = "VERTICAL OFFSET\n[ HIGH ]";
                Player.OFFSET = "high";
            } else if (Player.OFFSET == "high") {
                buttonOffsetText.text = "VERTICAL OFFSET\n[ OFF ]";
                Player.OFFSET = "off";
            } else if (Player.OFFSET == "off") {
                buttonOffsetText.text = "VERTICAL OFFSET\n[ LOW ]";
                Player.OFFSET = "low";
            } else {
                buttonOffsetText.text = "VERTICAL OFFSET\n[ MEDIUM ]";
                Player.OFFSET = "medium";
            }
        }
        );

        if (Player.OFFSET == "medium") {
            buttonOffsetText.text = "VERTICAL OFFSET\n[ MEDIUM ]";
        } else if (Player.OFFSET == "high") {
            buttonOffsetText.text = "VERTICAL OFFSET\n[ HIGH ]";
        } else if (Player.OFFSET == "off") {
            buttonOffsetText.text = "VERTICAL OFFSET\n[ OFF ]";
        } else {
            buttonOffsetText.text = "VERTICAL OFFSET\n[ LOW ]";
        }
        if (Player.MOVEMENT_TYPE == "relative") {
            buttonOffset.visible = false;
        }

        containerFront.addChild(buttonOffset);




        // FULLSCREEN
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
        fullscreen.position.set(60, 60);
        containerFront.addChild(fullscreen);



        // MUTE
        const buttonMute = new Button("unmuted.png", 0.8, () => {
            if (!Manager.MUTED) {
                sound.muteAll();
                Manager.MUTED = true;
                buttonMute.changeTexture(Texture.from("muted.png"))
            } else {
                sound.unmuteAll();
                Manager.MUTED = false;
                buttonMute.changeTexture(Texture.from("unmuted.png"))
            }
        });
        buttonMute.position.set(60, 150);
        containerFront.addChild(buttonMute);

        if (Manager.MUTED) {
            buttonMute.changeTexture(Texture.from("muted.png"))
        }



        // CREDITS
        const textCredits = new BitmapText("© 2023 ROMAN RIOS", { fontName: "PressStart2P", fontSize: 18, align: "center", });
        textCredits.anchor.set(0.5)
        textCredits.position.set(Manager.width / 2 - 2, Manager.height - 50);
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


