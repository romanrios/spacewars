import { Container, Text } from "pixi.js";
import { Manager } from "../utils/Manager";
import { SceneTitle } from "../scenes/SceneTitle";

export class GameOver extends Container {
    constructor() {
        super()

        const text = new Text("G4M3\n0V3R", { fontFamily: "PressStart2P", fontSize: 80, align: "center", fill: 0xFFFFFF });
        text.anchor.set(0.5)
        text.position.set(Manager.width / 2, Manager.height / 2);
        this.addChild(text);


        const text2 = new Text("[ OK ]", { fontFamily: "PressStart2P", fontSize: 30, align: "center", fill: 0xFFFFFF });
        text2.anchor.set(0.5)
        text2.position.set(Manager.width / 2, Manager.height / 2 + 300);
        text2.eventMode="static";
        text2.cursor="pointer";
        text2.on("pointerup",()=>Manager.changeScene(new SceneTitle))
        this.addChild(text2);

    }
}