import { Container, Graphics, Assets, Text } from "pixi.js";
import { manifest } from "../assets";
import { IScene } from "./IScene";
import { Manager } from "./Manager";
import { SceneTitle } from "../scenes/SceneTitle";

export class LoaderScene extends Container implements IScene {

    // for making our loader graphics...
    private loaderBar: Container;
    private loaderBarBoder: Graphics;
    private loaderBarFill: Graphics;
    private texty: Text;

    constructor() {
        super();

        const loaderBarWidth = Manager.width * 0.8;

        this.loaderBarFill = new Graphics();
        this.loaderBarFill.beginFill(0x555555, 1)
        this.loaderBarFill.drawRect(0, 0, loaderBarWidth, 70);
        this.loaderBarFill.endFill();
        this.loaderBarFill.scale.x = 0;

        this.loaderBarBoder = new Graphics();
        this.loaderBarBoder.lineStyle(5, 0xFFFFFF, 1);
        this.loaderBarBoder.drawRect(0, 0, loaderBarWidth, 70);

        this.loaderBar = new Container();
        this.loaderBar.addChild(this.loaderBarFill);
        this.loaderBar.addChild(this.loaderBarBoder);
        this.loaderBar.position.x = (Manager.width - this.loaderBar.width) / 2;
        this.loaderBar.position.y = (Manager.height - this.loaderBar.height) / 2;
        this.addChild(this.loaderBar);

        this.texty = new Text("", {fontSize:30, fill:0xFFFFFF});
        this.texty.anchor.set(0.5);
        this.texty.position.set(Manager.width/2,Manager.height/2);
        this.addChild(this.texty)

        this.initializeLoader().then(() => {
            this.gameLoaded();
        })
    }



    private async initializeLoader(): Promise<void>
    {
        await Assets.init({ manifest: manifest });
        const bundleIds =  manifest.bundles.map(bundle => bundle.name);
        await Assets.loadBundle(bundleIds, this.downloadProgress.bind(this));
    }



    private downloadProgress(progressRatio: number): void {
        this.loaderBarFill.scale.x = progressRatio;
    }



    private gameLoaded(): void {
        // Change scene to the game scene!
        Manager.changeScene(new SceneTitle());
    }


    
    public update(_framesPassed: number): void {
        // To be a scene we must have the update method even if we don't use it.
    }
}