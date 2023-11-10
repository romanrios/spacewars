import { Application, Ticker } from "pixi.js";
import { IScene } from "./IScene";
import { Group } from "tweedle.js";

export class Manager {

    public static paused: boolean = false;
    public static muted: boolean = false;
    public static movementType: string = "absolute";


    private constructor() { /*this class is purely static. No constructor to see here*/ }

    // Safely store variables for our game
    private static app: Application;
    private static currentScene: IScene;

    // Width and Height are read-only after creation (for now)
    private static _width: number;
    private static _height: number;

    // With getters but not setters, these variables become read-only
    public static get width(): number {
        return Manager._width;
    }
    public static get height(): number {
        return Manager._height;
    }



    // Use this function ONCE to start the entire machinery
    public static initialize(width: number, height: number, background: number): void {

        // store our width and height
        Manager._width = width;
        Manager._height = height;

        // Create our pixi app
        Manager.app = new Application({
            view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: background,
            width: width,
            height: height,
            antialias: false,
            premultipliedAlpha: false,
            backgroundAlpha: 1
        });

        // eslint-disable-line ***PIXI DEV TOOLS***
        (globalThis as any).__PIXI_APP__ = Manager.app;



        // Screen resize
        window.addEventListener("resize", () => {
            const scaleX = window.innerWidth / this.app.screen.width;
            const scaleY = window.innerHeight / this.app.screen.height;
            const scale = Math.min(scaleX, scaleY);

            const gameWidth = Math.round(this.app.screen.width * scale);
            const gameHeight = Math.round(this.app.screen.height * scale);

            const marginHorizontal = Math.floor((window.innerWidth - gameWidth) / 2);
            const marginVertical = Math.floor((window.innerHeight - gameHeight) / 2);

            const appview = this.app.view as HTMLCanvasElement; // added for Pixi v7

            appview.style.width = gameWidth + "px";
            appview.style.height = gameHeight + "px";
            appview.style.marginLeft = marginHorizontal + "px";
            appview.style.marginRight = marginHorizontal + "px";
            appview.style.marginTop = marginVertical + "px";
            appview.style.marginBottom = marginVertical + "px";
        });

        window.dispatchEvent(new Event("resize"));

        // Add the ticker
        // Manager.app.ticker.add(Manager.update)
        Ticker.shared.add(Manager.update)


    }






    // Call this function when you want to go to a new scene
    public static changeScene(newScene: IScene): void {

        // Remove and destroy old scene... if we had one..
        if (Manager.currentScene) {
            Manager.app.stage.removeChild(Manager.currentScene);
            Manager.currentScene.destroy();
        }

        // Add the new one
        Manager.currentScene = newScene;
        Manager.app.stage.addChild(Manager.currentScene);
    }






    // This update will be called by a pixi ticker and tell the scene that a tick happened
    private static update(deltaFrame: number): void {

        // PAUSE THE GAME!
        if (!Manager.paused) {

        // Let the current scene know that we updated it...
        // Just for funzies, sanity check that it exists first.

            if (Manager.currentScene) {
                Manager.currentScene.update(Ticker.shared.deltaMS, deltaFrame);
                Group.shared.update(Ticker.shared.deltaMS,false); // for tweedle.js !! 

            }
            // as I said before, I HATE the "frame passed" approach. I would rather use `Manager.app.ticker.deltaMS`
        }
    }
}

