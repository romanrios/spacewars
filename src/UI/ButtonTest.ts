import { Container, Sprite, Texture, utils } from "pixi.js";

export class ButtonTest extends Container {

    private def: Texture;
    private down: Texture;
    private over: Texture;
    private spr: Sprite;

    public readonly buttonEvents: utils.EventEmitter = new utils.EventEmitter();

    constructor(def: Texture, down: Texture, over: Texture) {
        super();
        this.def = def;
        this.down = down;
        this.over = over;

        this.spr = Sprite.from(def);
        this.spr.anchor.set(0.5);
        this.addChild(this.spr);

        this.spr.eventMode = 'static';
        this.spr.on("pointerdown", this.onPointerDown, this);
        this.spr.on("pointerup", this.onPointerUp, this);
        this.spr.on("pointerover", this.onPointerOver, this);
        this.spr.on("pointerout", this.onPointerOut, this);

    }

    private onPointerDown(): void {
        this.spr.texture = this.down;
    }

    private onPointerUp(): void {
        this.buttonEvents.emit("buttonClick");
        this.spr.texture = this.def;
    }

    private onPointerOver(): void {
        this.spr.texture = this.over;
    }

    private onPointerOut(): void {
        this.spr.texture = this.def;
    }

}