import { Container, Rectangle, Sprite } from "pixi.js";
import { IHitbox } from "./IHitbox";
import { Easing, Tween } from "tweedle.js";
import { Player } from "./Player";

export class Item extends Container implements IHitbox {

    tween: Tween<this>;
    id: number;
    tween2: Tween<this>;

    constructor(id: number) {

        super();

        this.id = id;

        if (id <= 6) {
            const itemSprite = Sprite.from("speed.png");
            itemSprite.anchor.set(0.5);
            this.addChild(itemSprite);
        } else {
            if (Player.SHOOT_STYLE == "normal") {
                const itemSprite = Sprite.from("two.png");
                itemSprite.anchor.set(0.5);
                this.addChild(itemSprite);
            } else if (Player.SHOOT_STYLE == "double") {
                const itemSprite = Sprite.from("three.png");
                itemSprite.anchor.set(0.5);
                this.addChild(itemSprite);
            } else {
                const itemSprite = Sprite.from("speed.png");
                itemSprite.anchor.set(0.5);
                this.addChild(itemSprite);
            }
        }

        this.scale.set(6);
        this.x = Math.random() * 580 + 80;
        this.y = -50;

        this.tween = new Tween(this)
            .to({ y: this.y + 1400 }, 4000)
            .start()

        this.tween2 = new Tween(this)
            .to({ x: this.x - 50 }, 800)
            .start()
            .yoyo(true)
            .easing(Easing.Quartic.Out)
            .repeat(Infinity)
    }

    public getHitbox(): Rectangle {
        return this.getBounds()
    }
}