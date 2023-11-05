import { Container, Texture, TilingSprite, Text } from "pixi.js";
import { IScene } from "../utils/IScene";
import { Manager } from "../utils/Manager";
import { Player } from "../game/Player";
import { Enemy } from "../game/Enemy";
import { Scene1 } from "./Scene1";


export class SceneTitle extends Container implements IScene {
    public static player: Player;

    private background: TilingSprite;

    private enemies: Enemy[] = [];
    private elapsedTime: number = 0;



    constructor() {
        super();

        this.background = new TilingSprite(Texture.from("./background.png"));
        this.background.tileScale.set(6);
        this.background.width = Manager.width;
        this.background.height = Manager.height;
        this.addChild(this.background);

        

        const text = new Text("SP4C3\nW4RS", { fontFamily: "PressStart2P", fontSize: 90, align: "center", fill: 0xFFFFFF });
        text.anchor.set(0.5)
        text.position.set(Manager.width / 2, Manager.height / 2);
        this.addChild(text);


        const text2 = new Text("[ PL4Y ]", { fontFamily: "PressStart2P", fontSize: 30, align: "center", fill: 0xFFFFFF });
        text2.anchor.set(0.5)
        text2.position.set(Manager.width / 2, Manager.height / 2 + 300);
        text2.eventMode="static";
        text2.cursor="pointer";
        text2.on("pointerup",()=>Manager.changeScene(new Scene1))
        this.addChild(text2);


        const text3 = new Text("© 2023 Román Ríos", { fontFamily: "PressStart2P", fontSize: 18, align: "center", fill: 0xFFFFFF });
        text3.anchor.set(0.5)
        text3.position.set(Manager.width / 2-2, Manager.height - 100);
        text3.eventMode="static";
        text3.cursor="pointer";
        this.addChild(text3);


    }


    public update(_deltaTime: number, _deltaFrame: number) {

        this.elapsedTime += _deltaTime;

        this.background.tilePosition.y += _deltaTime * 0.5;
        this.background.tilePosition.y %= 1536;

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


