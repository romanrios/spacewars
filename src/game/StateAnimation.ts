import { AnimatedSprite, Container, Texture } from "pixi.js";
import { IScene } from "../utils/IScene";

export class StateAnimation extends Container implements IScene {

    private states: Map<string, AnimatedSprite> = new Map();

    private animContainer: Container = new Container();

    constructor() {
        super();
        this.addChild(this.animContainer);
    }

    public playState(stateName: string, restarAnim: boolean = false) {
        this.animContainer.removeChildren();
        const currentState = this.states.get(stateName);
        if (currentState) {
            this.animContainer.addChild(currentState);
            if (restarAnim) {
                currentState.gotoAndPlay(0);
            }
        }
        else {
            console.error("Esa animación no existe!")
        }
    }

    public addState(stateName: string, frames: Texture[] | string[], animationSpeed: number = 0.2, loop: boolean = true) {
        const texArray: Texture[] = [];
        for (const tex of frames) {
            if (typeof tex == "string") {
                texArray.push(Texture.from(tex));
            }
            else {
                texArray.push(tex);
            }
        }
        const tempAnim: AnimatedSprite = new AnimatedSprite(texArray);
        tempAnim.anchor.set(0.5,0.5); // AGREGADO
        tempAnim.animationSpeed = animationSpeed;
        tempAnim.loop = loop;
        tempAnim.play();
        this.states.set(stateName, tempAnim);
    }

    update(_deltaTime: number, _deltaFrame: number): void {
        for (const state of this.states.values()) {
            state.update(_deltaFrame);
        }
    }

}

