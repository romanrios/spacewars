import { Graphics, Rectangle } from "pixi.js";
import { PhysicsContainer } from "../utils/PhysicsContainer";
import { Keyboard } from "../utils/Keyboard";
import { IHitbox } from "./IHitbox";
import { StateAnimation } from "./StateAnimation";

export class Player extends PhysicsContainer implements IHitbox {

    public static KEYBOARD_SPEED: number = 700;
    public static NORMAL_SHOOT_DELAY: number = 650;
    public static SHOOT_DELAY: number = Player.NORMAL_SHOOT_DELAY;
    public static SHOOT_MULTIPLY: string = "normal";
    public static SHOOT_SIZE: string = "small";
    
    public static MOVEMENT_TYPE: string = "absolute";
    public static OFFSET: string = "medium";
    public static SHIP_SPEED: string = "high";

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

    private prevPositionX: number = 0;
    // private currentAnimation: string = "idle";
    private animationTimer: number = 0;
    private animationThreshold: number = 200; // Umbral de tiempo en milisegundos
    private resetTimer() {
        this.animationTimer = 0;
    }

    public override update(deltaMS: number) {

        // Calcula la velocidad x
        const velocityX = (this.x - this.prevPositionX) / (deltaMS / 1000);

        // Almacena la posición actual como la posición anterior para el próximo ciclo
        this.prevPositionX = this.x;

        // Actualiza el temporizador
        this.animationTimer += deltaMS;

        // Cambia a las animaciones left o right
        if (velocityX > 300) {
            this.playState("right", true);
            this.resetTimer();
        } else if (velocityX < -300) {
            this.playState("left", true);
            this.resetTimer();
        }

        // Cambia a la animación idle si ha pasado suficiente tiempo desde el último cambio
        if (this.animationTimer > this.animationThreshold) {
            this.playState("idle", true);
        }

        super.update(deltaMS / 1000);
        //this.robotAnimated.update(deltaMS / (1000 / 60), 0)

        if (Keyboard.state.get("ArrowRight")) {
            this.speed.x = Player.KEYBOARD_SPEED;

        } else if (Keyboard.state.get("ArrowLeft")) {
            this.speed.x = -Player.KEYBOARD_SPEED;

        }

        if (Keyboard.state.get("ArrowDown")) {
            this.speed.y = Player.KEYBOARD_SPEED;
        } else if (Keyboard.state.get("ArrowUp")) {
            this.speed.y = -Player.KEYBOARD_SPEED;
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

        // if (this.speed.x > 0) {
        //     this.shipAnimated.playState("right", true);
        // } else if (this.speed.x < 0) {
        //     this.shipAnimated.playState("left", true);
        // } else {
        //     this.shipAnimated.playState("idle", true);
        // }
    }



    private resetSpeedandAnimation(): void {
        this.speed.x = 0;
        this.speed.y = 0;
    }

    public getHitbox(): Rectangle {
        return this.hitbox.getBounds()
    }






    public playState(state: string, value: boolean) {
        this.shipAnimated.playState(state, value);
    }
}