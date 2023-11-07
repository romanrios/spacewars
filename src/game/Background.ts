import { Container, Sprite, Texture } from "pixi.js";
import { IScene } from "../utils/IScene";
import { Manager } from "../utils/Manager";


export class Background extends Container implements IScene {

    private bgContainer: Container;

    constructor(sprite: string) {
        super();
        const bgTexture = Texture.from(sprite);
        this.bgContainer = new Container();
        this.addChild(this.bgContainer);

        const background = Sprite.from(bgTexture)
        background.width = Manager.width;
        background.height = Manager.height;
        this.bgContainer.addChild(background);

        const background2 = Sprite.from(bgTexture)
        background2.width = Manager.width;
        background2.height = Manager.height;
        background2.y = -Manager.height;
        this.bgContainer.addChild(background2);
    }




    update(_deltaTime: number, _deltaFrame: number): void {
    }


}