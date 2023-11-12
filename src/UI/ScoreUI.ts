import { Container, BitmapText } from "pixi.js";
import { Manager } from "../utils/Manager";


export class ScoreUI extends Container {

    public score: number = 0;
    public text: BitmapText;

    constructor() {
        super()

        this.text = new BitmapText("SCORE 0", { fontName: "PressStart2P", fontSize: 30, align: "center" });
        this.text.anchor.set(0.5)
        this.text.position.set(Manager.width / 2, 50);
        this.addChild(this.text);

    }
}