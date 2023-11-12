import { BitmapText, Container } from "pixi.js";
import { getDatabase, ref, orderByChild, onValue, query } from 'firebase/database';
import { Manager } from "../utils/Manager";
import { SceneTitle } from "../scenes/SceneTitle";
import { Easing, Tween } from "tweedle.js";

export class HighScore extends Container {
    private scoresArray: any;
    private tablaPuntuaciones: any;

    constructor() {
        super()

        // Obtiene una referencia a la ubicación de los puntajes
        const database = getDatabase();
        const puntajesRef = ref(database, 'puntajes');

        // Realiza una consulta para obtener los puntajes ordenados por puntaje (en orden descendente)
        const consultaPuntajes = query(puntajesRef, orderByChild('puntaje')); // Obtener los últimos 10 puntajes

        // Escucha cambios en la consulta
        onValue(consultaPuntajes, (snapshot) => {
            // La variable "snapshot" contiene los datos de la consulta
            if (snapshot.exists()) {
                this.scoresArray = [];

                // Itera a través de los registros de puntajes
                snapshot.forEach((childSnapshot) => {
                    const puntaje = childSnapshot.val();
                    this.scoresArray.push(puntaje);
                });
            }

            this.scoresArray.sort((a: any, b: any) => Number(b.puntaje) - Number(a.puntaje));
            this.scoresArray = this.scoresArray.slice(0, 20);
            // Arreglos para almacenar nombres y puntuaciones

            if (this.tablaPuntuaciones) {
                this.removeChild(this.tablaPuntuaciones);
            }

            this.tablaPuntuaciones = new Container();
            const espaciadoVertical = 50;
            const marginTop = 27;
            const fontSize = 22;
            const fontFamily = "PressStart2P";

            this.scoresArray.forEach((puntuacion: any, indice: any) => {
                const color = this.randomColor()

                const nombreFormateado = this.formatName(puntuacion.nombre);

                const filaNombres = new BitmapText(
                    `${indice + 1}. ${nombreFormateado}`, {
                    fontName: fontFamily,
                    fontSize: fontSize,
                    tint: color,
                });
                filaNombres.position.set(0, indice * espaciadoVertical + marginTop);

                const filaPuntos = new BitmapText(
                    `${puntuacion.puntaje}`, {
                    fontName: fontFamily,
                    fontSize: fontSize,
                    tint: color,
                });

                filaPuntos.anchor.x = 1;
                filaPuntos.position.set(505, indice * espaciadoVertical + marginTop)

                const filaContainer = new Container();
                filaContainer.addChild(filaNombres);
                filaContainer.addChild(filaPuntos);
                this.tablaPuntuaciones.addChild(filaContainer);

                new Tween(filaContainer)
                    .to({ x: Math.random() * (-30) + 15 }, 1000)
                    .start()
                    .yoyo(true)
                    .easing(Easing.Quadratic.Out)
                    .repeat(Infinity)




            });

            this.tablaPuntuaciones.position.set(110, 200);
            this.addChild(this.tablaPuntuaciones);

            const textHighScores = new BitmapText("HIGH\nSCORES", { fontName: "PressStart2P", fontSize: 42, align: "center", /*lineHeight: 55*/ });
            textHighScores.anchor.set(0.5)
            textHighScores.position.set(Manager.width / 2, 130);
            this.addChild(textHighScores);

            SceneTitle.highestScore.text = "HIGH SCORE\n" + String(this.scoresArray[0].nombre) + "\n" + String(this.scoresArray[0].puntaje);

        });

    }


    private randomColor() {
        const resultados = ["0x0bffe6", "0xffd080", "0xff9e7d", "0xfe546f", "0xfffdff", "0x01cbcf"];
        const indiceAleatorio = Math.floor(Math.random() * resultados.length);
        return resultados[indiceAleatorio];
    }



    private formatName(nombre: string): string {
    const maxLength = 14;
    const currentLength = nombre.length;

    if (currentLength < maxLength) {
        const dots = ' '+ '.'.repeat(maxLength - currentLength - 1); // -1 para dejar espacio en lugar de un punto
        return `${nombre}${dots}`;
    } else {
        return nombre.substring(0, maxLength); // Limita la longitud a 15 caracteres
    }
}
}