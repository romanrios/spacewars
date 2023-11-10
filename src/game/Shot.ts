import { Graphics, Rectangle, Sprite } from "pixi.js";
import { PhysicsContainer } from "../utils/PhysicsContainer";
import { IHitbox } from "./IHitbox";
import { Tween } from "tweedle.js";
import { IScene } from "../utils/IScene";

export class Shot extends PhysicsContainer implements IHitbox {

    private hitbox: Graphics;
    public tween: Tween<this>;
    private parentScene: any;

    constructor(spread: number, parent: IScene) {
        super();

        this.parentScene = parent;

        const shot = Sprite.from("shot.png");
        shot.scale.set(6);
        shot.anchor.set(0.5);
        this.position.set(this.parentScene.player.x, this.parentScene.player.y);
        this.addChild(shot);

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0xFF00FF, 0.0001);
        // this.hitbox.visible = false;
        this.hitbox.drawRect(-2, -3, 4, 6);
        this.hitbox.endFill;
        this.hitbox.scale.set(6);
        this.addChild(this.hitbox);

        this.tween = new Tween(this)
            .to({ x: this.parentScene.player.x + spread, y: this.y - 1500 }, 2200)
            .start()
    }

    getHitbox(): Rectangle {
        return this.hitbox.getBounds()
    }

}