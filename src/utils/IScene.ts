import { DisplayObject } from "pixi.js";

export interface IScene extends DisplayObject {
    update(_deltaTime: number, _deltaFrame: number): void;
}