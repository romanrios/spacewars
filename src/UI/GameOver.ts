import { Container, Text } from "pixi.js";
import { Manager } from "../utils/Manager";
import { SceneTitle } from "../scenes/SceneTitle";
// import { agregarPuntaje } from "../utils/firebaseConfig";
// import { Input } from "@pixi/ui";



export class GameOver extends Container {
    constructor() {
        super()

        const text = new Text("G4M3\n0V3R", { fontFamily: "PressStart2P", fontSize: 70, align: "center", fill: 0xFFFFFF });
        text.anchor.set(0.5)
        text.position.set(Manager.width / 2, Manager.height / 2);
        this.addChild(text);


        const text2 = new Text("[ OK ]", { fontFamily: "PressStart2P", fontSize: 30, align: "center", fill: 0xFFFFFF });
        text2.anchor.set(0.5)
        text2.position.set(Manager.width / 2, Manager.height / 2 + 300);
        text2.eventMode = "static";
        text2.cursor = "pointer";
        text2.on("pointerup", () => Manager.changeScene(new SceneTitle))
        this.addChild(text2);





        // HIGHSCORE

        // this.input = new Input({
        //     placeholder: "Ingresa tu nombre",
        //     align: "center",
        //     bg: new Graphics()
        //         .beginFill(0xFFFFFF)
        //         .drawRoundedRect(0, 0, 350, 50, 25),
        //     textStyle: {
        //         fill: 0x4D4D4D,
        //         fontSize: 25,
        //         fontFamily: "PressStart2P",
        //     },
        // });

        // this.input.position.set(Manager.width / 2 - this.input.width / 2, 450);

        // this.input.onChange.connect(
        //     () => {
        //         if (this.input.value == "") {
        //             this.button_play.alpha = 0.6;
        //             this.button_play.eventMode = "none";
        //         } else {
        //             this.button_play.alpha = 1;
        //             this.button_play.eventMode = "static";
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

        // this.button_play = new Button_pino("Enviar", "button_bg2.png");
        // this.button_play.position.set(735, 566);
        // this.button_play.eventMode = "none";
        // this.button_play.alpha = 0.8;
        // this.button_play.on("pointerup", () => {

        //     agregarPuntaje(this.input.value, this.score_text.text)

        //     const circlemask = new Graphics();
        //     circlemask.position.set(Manager.width / 2, Manager.height / 2);
        //     circlemask.beginFill(0x994466);
        //     circlemask.drawCircle(0, 0, 150);
        //     circlemask.scale.set(10);
        //     this.addChild(circlemask);

        //     this.parent.mask = circlemask;

        //     new Tween(circlemask)
        //         .to({ scale: { x: 0.05, y: 0.05 } }, 600)
        //         .easing(Easing.Quintic.Out)
        //         .start()
        //         .onComplete(() => {
        //             sound.stopAll();
        //             Manager.changeScene(new Scene_title("highscore"));
        //         })
        // })

        // this.addChild(this.button_play);

    }
}