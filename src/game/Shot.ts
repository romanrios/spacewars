import { Graphics, Rectangle, Sprite } from "pixi.js";
import { PhysicsContainer } from "../utils/PhysicsContainer";
import { IHitbox } from "./IHitbox";
import { Tween } from "tweedle.js";
import { IScene } from "../utils/IScene";
import { Player } from "./Player";

export class Shot extends PhysicsContainer implements IHitbox {

    private hitbox: Graphics;
    public tween: Tween<this>;
    private parentScene: any;
    private shot: any;

    constructor(spread: number, parent: IScene) {
        super();

        this.parentScene = parent;

        if (Player.SHOOT_SIZE == "small") {
            this.shot = Sprite.from("shot_small.png");
        } else if (Player.SHOOT_SIZE == "medium") {
            this.shot = Sprite.from("shot_medium.png");
        } else {
            this.shot = Sprite.from("shot_large.png");
        }

        this.shot.scale.set(6);
        this.shot.anchor.set(0.5);
        this.position.set(this.parentScene.player.x, this.parentScene.player.y);
        this.addChild(this.shot);

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0xFF00FF);
        this.hitbox.visible = false;
        this.hitbox.drawRect(-this.shot.width / 2 - 3, -this.shot.height / 2 - 3, this.shot.width + 6, this.shot.height + 6);
        this.hitbox.endFill;
        this.addChild(this.hitbox);

        this.tween = new Tween(this)
            .to({ x: this.parentScene.player.x + spread, y: this.y - 1500 }, 2200)
            .start()
    }

    getHitbox(): Rectangle {
        return this.hitbox.getBounds()
    }

}