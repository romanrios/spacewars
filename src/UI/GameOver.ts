import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Manager } from "../utils/Manager";
import { SceneTitle } from "../scenes/SceneTitle";
import { agregarPuntaje } from "../utils/firebaseConfig";
import { Input } from "@pixi/ui";
import { Scene1 } from "../scenes/Scene1";

export class GameOver extends Container {

    private input: Input;
    private buttonOk: Sprite;

    constructor() {
        super()

        const text = new Text("G4M3\n0V3R", { fontFamily: "PressStart2P", fontSize: 70, align: "center", fill: this.randomColor() });
        text.anchor.set(0.5)
        text.position.set(Manager.width / 2, 480);
        this.addChild(text);


        const textScore = new Text("YOUR SCORE IS\n\n" + String(Scene1.score.score), { fontFamily: "PressStart2P", fontSize: 30, align: "center", fill: this.randomColor() });
        textScore.anchor.set(0.5)
        textScore.position.set(Manager.width / 2, 660);
        this.addChild(textScore);



        this.buttonOk = Sprite.from("ok.png");
        this.buttonOk.scale.set(6);
        this.buttonOk.anchor.set(0.5)
        this.buttonOk.position.set(Manager.width / 2 + 100, 950);
        this.buttonOk.alpha = 0.3;
        this.buttonOk.on("pointerup", () => {
            agregarPuntaje(this.input.value, String(Scene1.score.score));
            Manager.changeScene(new SceneTitle(true));
        })
        this.addChild(this.buttonOk);


        const buttonBack = Sprite.from("back.png");
        buttonBack.alpha = 0.8;
        buttonBack.scale.set(6);
        buttonBack.anchor.set(0.5)
        buttonBack.position.set(Manager.width / 2 - 100, 950);
        buttonBack.eventMode = "static";
        buttonBack.cursor = "pointer";
        buttonBack.on("pointerup", () => {
            Manager.changeScene((new SceneTitle(false)));
        })
        this.addChild(buttonBack);


        // HIGHSCORE

        this.input = new Input({
            maxLength: 15,
            placeholder: "ENTER YOUR NAME",
            align: "center",
            bg: new Graphics()
                .beginFill(0xFFFFFF, 0.0001)
                .lineStyle(3, 0xFFFFFF)
                .drawRect(0, 0, 500, 70),
            textStyle: {
                fill: 0xFFFFFF,
                fontSize: 30,
                fontFamily: "PressStart2P",

            },
        });



        this.input.position.set(Manager.width / 2 - this.input.width / 2, 770);

        this.input.onChange.connect(
            () => {
                if (this.input.value == "") {
                    this.buttonOk.alpha = 0.3;
                    this.buttonOk.eventMode = "none";
                    this.buttonOk.cursor = "none";
                } else {
                    this.buttonOk.alpha = 1;
                    this.buttonOk.eventMode = "static";
                    this.buttonOk.cursor = "pointer";
                    const uppercaseText = this.input.value.toUpperCase();
                    this.input.value = uppercaseText;
                }
            }
        )
        this.input.onEnter.connect(() => {
            if (typeof document.activeElement !== "undefined") {
                (document.activeElement as HTMLElement).blur();
            }
        }
        )

        this.addChild(this.input);



    }

    private randomColor() {
        const resultados = ["0x0bffe6", "0xffd080", "0xff9e7d", "0xfe546f", "0xfffdff", "0x01cbcf"];
        const indiceAleatorio = Math.floor(Math.random() * resultados.length);
        return resultados[indiceAleatorio];
    }
}

