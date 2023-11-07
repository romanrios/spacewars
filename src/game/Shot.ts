import { Graphics, Rectangle, Sprite } from "pixi.js";
import { PhysicsContainer } from "../utils/PhysicsContainer";
import { IHitbox } from "./IHitbox";
import { Tween } from "tweedle.js";
import { Scene1 } from "../scenes/Scene1";

export class Shot extends PhysicsContainer implements IHitbox {

    private hitbox: Graphics;
    public tween: Tween<this>;

    constructor(spread: number) {
        super();

        const shot = Sprite.from("shot.png");
        shot.scale.set(6);
        shot.anchor.set(0.5);
        this.position.set(Scene1.player.x, Scene1.player.y);
        this.addChild(shot);

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0xFF00FF, 0.01);
        // this.hitbox.visible = false;
        this.hitbox.drawRect(-4, -4, 8, 8);
        this.hitbox.endFill;
        this.hitbox.scale.set(6);
        this.addChild(this.hitbox);

        this.tween = new Tween(this)
            .to({ x: Scene1.player.x + spread, y: this.y - 1500 }, 2200)
            .start()
    }

    getHitbox(): Rectangle {
        return this.hitbox.getBounds()
    }

}