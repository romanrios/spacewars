import { Graphics, ObservablePoint, Rectangle } from "pixi.js";
import { PhysicsContainer } from "../utils/PhysicsContainer";
import { Keyboard } from "../utils/Keyboard";
import { IHitbox } from "./IHitbox";
import { StateAnimation } from "./StateAnimation";

export class Player extends PhysicsContainer implements IHitbox {

    public static readonly MOVE_SPEED = 350;
    public static NORMAL_SHOOT_DELAY: number = 700;
    public static SHOOT_DELAY: number = Player.NORMAL_SHOOT_DELAY;
    public static SHOOT_STYLE: string = "normal";

    private shipAnimated: StateAnimation;
    private hitbox: Graphics;

    constructor() {
        super();

        this.shipAnimated = new StateAnimation();

        this.shipAnimated.addState("idle", [
            ("ship.png"),
        ]);

        this.shipAnimated.addState("left", [
            ("ship_left.png"),
        ]);

        this.shipAnimated.addState("right", [
            ("ship_right.png"),
        ]);

        this.shipAnimated.playState("idle", true);

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0xFF00FF, 0.5);
        this.hitbox.visible = false;
        this.hitbox.drawRect(-4, -4, 8, 8);
        this.hitbox.endFill;

        this.addChild(this.shipAnimated);
        this.addChild(this.hitbox);
    }



    public override update(deltaMS: number) {
        super.update(deltaMS / 1000);
        //this.robotAnimated.update(deltaMS / (1000 / 60), 0)

        if (Keyboard.state.get("ArrowRight")) {
            this.speed.x = Player.MOVE_SPEED;

        } else if (Keyboard.state.get("ArrowLeft")) {
            this.speed.x = -Player.MOVE_SPEED;

        }

        if (Keyboard.state.get("ArrowDown")) {
            this.speed.y = Player.MOVE_SPEED;
        } else if (Keyboard.state.get("ArrowUp")) {
            this.speed.y = -Player.MOVE_SPEED;
        }


        Keyboard.up.on("ArrowLeft", () => {
            this.resetSpeedandAnimation();
        });

        Keyboard.up.on("ArrowRight", () => {
            this.resetSpeedandAnimation();
        });

        Keyboard.up.on("ArrowUp", () => {
            this.resetSpeedandAnimation();
        });

        Keyboard.up.on("ArrowDown", () => {
            this.resetSpeedandAnimation();
        });

        if (this.speed.x > 0) {
            this.shipAnimated.playState("right", true);
        } else if (this.speed.x < 0) {
            this.shipAnimated.playState("left", true);
        } else {
            this.shipAnimated.playState("idle", true);
        }
    }



    private resetSpeedandAnimation(): void {
        this.speed.x = 0;
        this.speed.y = 0;
    }

    public getHitbox(): Rectangle {
        return this.hitbox.getBounds()
    }

    public separate(overlap: Rectangle, platform: ObservablePoint<any>, platformSpeed: number) {
        if (overlap.width < overlap.height) {
            if (this.x > platform.x) {
                //this.x += overlap.width;
            } else if (this.x < platform.x) {
                //this.x -= overlap.width;
            }
        }
        else {

            if (this.y < platform.y && this.speed.y > 1) {
                this.y -= overlap.height;
                this.speed.y = 0;

                //
                this.x += platformSpeed;


                if (this.speed.x !== 0) {
                    this.shipAnimated.playState("run", false)
                }
                else {
                    this.shipAnimated.playState("idle", true)
                }

            } else if (this.y > platform.y) {
                // this.y += overlap.height;
                //  this.speed.y = 0;
            }
        }

    }




    public playState(state: string, value: boolean) {
        this.shipAnimated.playState(state, value);
    }
}