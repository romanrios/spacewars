import { Graphics, Rectangle, Sprite } from "pixi.js";
import { IHitbox } from "./IHitbox";
import { PhysicsContainer } from "../utils/PhysicsContainer";

export class Platform extends PhysicsContainer implements IHitbox {
    private hitbox: Graphics;

    constructor() {
        super();

        const platform = Sprite.from("platform.png");
        platform.y = -25
        this.addChild(platform);                
        
        this.hitbox = new Graphics();
        this.hitbox.beginFill(0x00FFFF,0.0001);
        this.hitbox.drawRect(0,-25,300,50);
        this.hitbox.endFill;
        this.addChild(this.hitbox);        
    }


    public getHitbox(): Rectangle
    {
        return this.hitbox.getBounds()
    }

}