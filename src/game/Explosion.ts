import { Container, Sprite, Texture } from "pixi.js";
import { Easing, Tween } from "tweedle.js";


export class Explosion extends Container {

    constructor() {
        super()

        const whitePixelTexture = Texture.from("white_pixel.png");

        for (let i = 0; i < 20; i++) {            

            const whitePixelSprite = Sprite.from(whitePixelTexture);
            whitePixelSprite.anchor.set(0.5);
            whitePixelSprite.scale.set(6);

            this.addChild(whitePixelSprite);

            new Tween(whitePixelSprite)
                .to({ x: this.x + Math.random() * (-300) + 150, y: this.y + Math.random() * (-300) + 100, alpha: 0 }, 1600)
                .start()
                .easing(Easing.Quintic.Out)
                .onComplete(() => this.destroy())
        }

    }


}
