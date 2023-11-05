import { Graphics, Rectangle, Sprite } from "pixi.js";
import { PhysicsContainer } from "../utils/PhysicsContainer";
import { IHitbox } from "./IHitbox";
import { Tween } from "tweedle.js";

export class Enemy extends PhysicsContainer implements IHitbox {

    private hitbox: Graphics;
    public tween: Tween<this>;

    constructor() {
        super();

        const sprite = Sprite.from(`enemy0${String(Math.floor(Math.random() * 4) + 1)}.png`)
        sprite.scale.set(6);
        this.addChild(sprite);

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0xFF00FF, 0.5);
        this.hitbox.visible = false;
        this.hitbox.drawRect(0, 0, 8, 8);
        this.hitbox.endFill;
        this.hitbox.scale.set(6);
        this.addChild(this.hitbox);

        this.x = Math.random() * 660 + 20;
        this.y = -50;



        this.tween = new Tween(this)
            .to({ x: Math.random() * 660 + 20, y: this.y + 1400 }, Math.random() * 2500 + 2500)
            .start()

    }



    public override update(deltaMS: number) {
        super.update(deltaMS / 1000);
    }


    getHitbox(): Rectangle {
        return this.hitbox.getBounds()
    }





}