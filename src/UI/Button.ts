import { Container, FederatedPointerEvent, Sprite, Texture } from "pixi.js";

export class Button extends Container {
    private sprite: Sprite;

    constructor(spriteString: string, alpha: number, callback: (event: FederatedPointerEvent) => void) {
        super();

        this.sprite = Sprite.from(spriteString);
        this.sprite.anchor.set(0.5);
        this.scale.set(4);
        this.addChild(this.sprite);
        this.alpha = alpha;
        this.eventMode = "static";
        this.cursor = "pointer";
        this.on("pointerover", () => this.alpha = 1)
        this.on("pointerout", () => this.alpha = alpha)
        this.on("pointertap", callback)

    }

    changeTexture(texture: Texture) {
        this.sprite.texture = texture;
    }

}