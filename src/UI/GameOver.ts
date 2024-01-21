import { Container, BitmapText } from "pixi.js";
import { Manager } from "../utils/Manager";
import { agregarPuntaje } from "../utils/firebaseConfig";
import { Scene1 } from "../scenes/Scene1";
import { Button } from "./Button";
import { SceneTitle } from "../scenes/SceneTitle";

const TextInput = require('pixi-text-input')

export class GameOver extends Container {

    private buttonOk: Button;

    private input: typeof TextInput;

    constructor() {
        super()

        const text = new BitmapText("G4M3\n0V3R", { fontName: "PressStart2P", fontSize: 70, align: "center", tint: this.randomColor() });
        text.anchor.set(0.5)
        text.position.set(Manager.width / 2, 480);
        this.addChild(text);

        const textScore = new BitmapText("YOUR SCORE IS\n\n" + String(Scene1.score.score), { fontName: "PressStart2P", fontSize: 30, align: "center", tint: this.randomColor() });
        textScore.anchor.set(0.5)
        textScore.position.set(Manager.width / 2, 660);
        this.addChild(textScore);

        this.buttonOk = new Button("ok.png", 0.8, () => {
            agregarPuntaje(this.input.text, String(Scene1.score.score));
            document.body.removeChild(this.input.htmlInput);
            Manager.changeScene(new SceneTitle(true));
        });
        this.buttonOk.scale.set(6);
        this.buttonOk.position.set(Manager.width / 2 + 100, 950);
        this.buttonOk.eventMode = "none";
        this.buttonOk.alpha = 0.3;
        this.addChild(this.buttonOk);

        const buttonBack = new Button("back.png", 0.8, () => {
            document.body.removeChild(this.input.htmlInput);
            Manager.changeScene((new SceneTitle(false)))
        });
        buttonBack.scale.set(6);
        buttonBack.position.set(Manager.width / 2 - 100, 950);
        this.addChild(buttonBack);

        // this.input = new Input({
        //     maxLength: 15,
        //     placeholder: "ENTER YOUR NAME",
        //     align: "center",
        //     bg: new Graphics()
        //         .beginFill(0xFFFFFF, 0.0001)
        //         .lineStyle(3, 0xFFFFFF)
        //         .drawRect(0, 0, 500, 70),
        //     textStyle: {
        //         fill: 0xFFFFFF,
        //         fontSize: 30,
        //         fontFamily: "PressStart2P"
        //     },
        // });

        // this.input.position.set(Manager.width / 2 - this.input.width / 2, 770);

        // this.input.onChange.connect(
        //     () => {
        //         if (this.input.value == "") {
        //             this.buttonOk.alpha = 0.3;
        //             this.buttonOk.eventMode = "none";
        //             this.buttonOk.cursor = "none";
        //         } else {
        //             this.buttonOk.alpha = 1;
        //             this.buttonOk.eventMode = "static";
        //             this.buttonOk.cursor = "pointer";
        //             const uppercaseText = this.input.value.toUpperCase();
        //             this.input.value = uppercaseText;
        //         }
        //     }
        // )
        // this.input.onEnter.connect(() => {
        //     if (typeof document.activeElement !== "undefined") {
        //         (document.activeElement as HTMLElement).blur();
        //     }
        // }
        // )
        // this.addChild(this.input);

        this.input = new TextInput({
            input: {
                align: 'center',
                fontSize: '30px',
                padding: '12px',
                width: '500px',
                color: '#FFFFFF',
                fontFamily: "PressStart2P",
                textAlign: "center",
            },
            box: {
                default: { stroke: { color: 0xFFFFFF, width: 3 } },
            }
        })

        this.input.maxLength = 15;
        this.input.placeholder = 'ENTER YOUR NAME'
        this.input.position.set(Manager.width / 2, Manager.height / 2 + 170);
        this.input.pivot.set(this.input.width / 2, this.input.height / 2);
        this.addChild(this.input)

        this.input.eventMode = "static";
        this.input.on("pointertap", () => {
            this.input.focus();
        })

        this.input.on('input', (text: string) => {
            if (this.input.text == "") {
                this.buttonOk.alpha = 0.3;
                this.buttonOk.eventMode = "none";
                this.buttonOk.cursor = "none";
            } else {
                this.buttonOk.alpha = 1;
                this.buttonOk.eventMode = "static";
                this.buttonOk.cursor = "pointer";
                this.input.text = text.toUpperCase();
            }
        });
    }

    private randomColor() {
        const resultados = ["0x0bffe6", "0xffd080", "0xff9e7d", "0xfe546f", "0xfffdff", "0x01cbcf"];
        const indiceAleatorio = Math.floor(Math.random() * resultados.length);
        return resultados[indiceAleatorio];
    }
}