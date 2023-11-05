import { Container, Rectangle, Sprite } from "pixi.js";
import { IHitbox } from "./IHitbox";
import { Tween } from "tweedle.js";

export class Item extends Container implements IHitbox {

    collision = false;

    constructor() {

        super();

        const botones = ["boton1.png", "boton2.png", "boton3.png", "boton4.png", "boton5.png", "boton6.png"];

        const boton = Sprite.from(botones[Math.floor(Math.random() * 5.99)])
        boton.anchor.set(0.5);

        this.addChild(boton);

        new Tween(boton)
            .to({ angle: 360 }, 3000)
            .start()
            .repeat(Infinity);

        new Tween(boton)
            .to({ y: boton.y - 50 }, Math.random()*1000+2000)
            .start()
            .yoyo(true)
            .repeat(Infinity)




    }




    public getHitbox(): Rectangle {
        return this.getBounds()
    }
}