import { BaseTexture, SCALE_MODES, settings } from "pixi.js";
import { Keyboard } from "./utils/Keyboard";
import { LoaderScene } from "./utils/LoaderScene";
import { Manager } from "./utils/Manager";

// Scale mode for all textures, will retain pixelation
BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
settings.ROUND_PIXELS = true;

Manager.initialize(720, 1280, 0x000000);
Keyboard.initialize();

// We no longer need to tell the scene the size because we can ask Manager!
const loady: LoaderScene = new LoaderScene();
Manager.changeScene(loady);

