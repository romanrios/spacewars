import { Container, Text } from "pixi.js";
import { Manager } from "../utils/Manager";


export class ScoreUI extends Container {

    public score : number = 0;
    public text: Text;

    constructor() {
        super()

        this.text = new Text("SCORE 0", { fontFamily: "PressStart2P", fontSize: 30, align: "center", fill: 0xFFFFFF });
        this.text.anchor.set(0.5)
        this.text.position.set(Manager.width / 2, 50);
        this.addChild(this.text);

    }
}