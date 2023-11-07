import { Container, FederatedPointerEvent, Sprite } from "pixi.js";

export class Button extends Container {


    constructor(spriteString: string, callback: (event: FederatedPointerEvent) => void) {
        super();

        const sprite = Sprite.from(spriteString);
        this.scale.set(4);
        this.addChild(sprite);
        this.alpha = 0.8;
        this.eventMode = "static";
        this.cursor = "pointer";
        this.on("pointerover", () => this.alpha = 1)
        this.on("pointerout", () => this.alpha = 0.8)
        this.on("pointerup", callback)

    }



}