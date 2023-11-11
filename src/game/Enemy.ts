import { Graphics, Rectangle, Sprite } from "pixi.js";
import { PhysicsContainer } from "../utils/PhysicsContainer";
import { IHitbox } from "./IHitbox";
import { Tween } from "tweedle.js";
import { sound } from "@pixi/sound";
import { IScene } from "../utils/IScene";

export class Enemy extends PhysicsContainer implements IHitbox {

    private hitbox: Graphics;
    public tween: any;
    private sprite: any;
    private type: string = ""
    private canShoot = false;
    private parentScene: any;   



    constructor(type: string, parent: IScene) {
        super();
        
        this.parentScene = parent;

        this.type = type;
        this.hitbox = new Graphics();
        this.hitbox.beginFill(0xFF00FF, 0.5);

        if (type == "enemy") {
            this.sprite = Sprite.from(`enemy0${String(Math.floor(Math.random() * 4) + 1)}.png`)
            this.hitbox.drawRect(0, 0, 8, 8);
            this.x = Math.random() * 900 - 100;
            this.y = -50;

            if (Math.random() < 0.4) {
                this.canShoot = true;
            }

        } else if (type == "enemy_shot") {
            this.sprite = Sprite.from("enemy_shot.png");
            this.hitbox.drawRect(0, 0, 3, 3);

        }



        this.sprite.scale.set(6);
        this.addChild(this.sprite);
        this.hitbox.visible = false;
        this.hitbox.endFill;
        this.hitbox.scale.set(6);
        this.addChild(this.hitbox);



        if (type == "enemy") {
            this.tween = new Tween(this)
                .to({ x: Math.random() * 900 - 100, y: this.y + 1400 }, Math.random() * 6000 + 2500)
                .start()
        }





    }

    private shootCooldown = 0;

    public override update(deltaMS: number) {
        super.update(deltaMS / 1000);
        this.shootCooldown += deltaMS;

        if (this.type == "enemy" && this.shootCooldown > Math.random() * 6000 + 1000 && this.canShoot) {
            {
                sound.play("Pew", { volume: 0.3, singleInstance: true });
                const enemyShot = new Enemy("enemy_shot", this);
                this.parent.addChild(enemyShot);
                enemyShot.x = this.x + 4 * 6;
                enemyShot.y = this.y + 8 * 6;

                this.parentScene.addShotToEnemiesArray(enemyShot);

                this.shootCooldown = 0;
                enemyShot.tween = new Tween(enemyShot)
                    .to({ x: Math.random() * 900 - 100, y: this.y + 1400 }, Math.random() * 3000 + 1800)
                    .start()

            }
        }


    }



    getHitbox(): Rectangle {
        return this.hitbox.getBounds()
    }





}