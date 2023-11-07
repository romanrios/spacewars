import { Container, Text } from "pixi.js";
import { Tween } from "tweedle.js";
import { Manager } from "../utils/Manager";



export class TitleText extends Container {

    constructor(random: boolean) {
        super();
        function randomColor() {
            const resultados = ["0x0bffe6", "0xffd080", "0xff9e7d", "0xfe546f", "0xFFFFFF"];
            const indiceAleatorio = Math.floor(Math.random() * resultados.length);
            if (random) {
                return resultados[indiceAleatorio];
            } else { return "0x0bffe6" }
        }

        const textTitle = new Text("", { fontFamily: "PressStart2P", fontSize: 90, align: "center", fill: randomColor() });
        textTitle.anchor.set(0.5)
        textTitle.position.set(Manager.width / 2, Manager.height / 2);
        textTitle.eventMode = "static";
        textTitle.cursor = "pointer";
        this.addChild(textTitle);

        this.animateText(textTitle);

    }


    private async updateTextWithDelay(text: Text, newText: string, delay: number): Promise<void> {
        return new Promise((resolve) => {
            new Tween(text)
                .to({}, delay)
                .start()
                .onComplete(() => {
                    text.text = newText;
                    resolve();
                });
        });
    }

    private async animateText(text: Text) {
        await this.updateTextWithDelay(text, "S", 100);
        await this.updateTextWithDelay(text, "SP", 100);
        await this.updateTextWithDelay(text, "SPC", 100);
        await this.updateTextWithDelay(text, "SPC\nW", 100);
        await this.updateTextWithDelay(text, "SPC\nWR", 100);
        await this.updateTextWithDelay(text, "SPC\nWRS", 100);
        await this.updateTextWithDelay(text, "SP C\nWRS", 100);
        await this.updateTextWithDelay(text, "SP C \nWRS", 100);
        await this.updateTextWithDelay(text, "SP C \nW RS", 100);
        await this.updateTextWithDelay(text, "SP0C \nW RS", 100);
        await this.updateTextWithDelay(text, "SP1C \nW RS", 100);
        await this.updateTextWithDelay(text, "SP2C \nW RS", 100);
        await this.updateTextWithDelay(text, "SP3C \nW RS", 100);
        await this.updateTextWithDelay(text, "SP4C0\nW RS", 100);
        await this.updateTextWithDelay(text, "SP0C1\nW RS", 100);
        await this.updateTextWithDelay(text, "SP1C2\nW RS", 100);
        await this.updateTextWithDelay(text, "SP2C3\nW RS", 100);
        await this.updateTextWithDelay(text, "SP3C3\nW0RS", 100);
        await this.updateTextWithDelay(text, "SP4C3\nW1RS", 100);
        await this.updateTextWithDelay(text, "SP4C3\nW2RS", 100);
        await this.updateTextWithDelay(text, "SP4C3\nW3RS", 100);
        await this.updateTextWithDelay(text, "SP4C3\nW4RS", 100);
    }
}