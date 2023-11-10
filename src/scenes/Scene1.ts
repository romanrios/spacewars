import { Container, Point, Text } from "pixi.js";
import { IScene } from "../utils/IScene";
import { Manager } from "../utils/Manager";
import { Player } from "../game/Player";
import { Enemy } from "../game/Enemy";
import { checkCollision } from "../game/IHitbox";
import { Shot } from "../game/Shot";
import { GameOver } from "../UI/GameOver";
import { ScoreUI } from "../UI/ScoreUI";
import { sound } from "@pixi/sound";
import { Item } from "../game/Item";
import { Background } from "../game/Background";
import { Easing, Tween } from "tweedle.js";
import { Explosion } from "../game/Explosion";
import { Button } from "../UI/Button";
// import { SceneTitle } from "./SceneTitle";


export class Scene1 extends Container implements IScene {


    public static player: Player;
    public static score: ScoreUI;
    public static enemies: Enemy[] = [];
    public static world: Container;

    private background: Background;
    private background1: Background;
    private background2: Background;
    private enemyNumber: number = 0;
    private enemySpawnTime: number = 0;
    private enemyMaxSpawnTime: number = 5000;
    private itemSpawnTime: number = 0;
    private shots: Shot[] = [];
    private items: Item[] = [];
    private canShoot: boolean = true;
    private gameover: boolean = false;
    private isDragging: boolean = false;
    private midEnemy: boolean = true;
    private buttonPauseStart: Button;
    private buttonPauseEnd: Button;
    private isOnPauseButton: boolean = false;
    private textPause: any;
    lastPosition: any;

    constructor() {
        super();

        sound.stopAll();
        sound.play("SongLevel", { volume: 0.3, loop: true, singleInstance: true });

        Scene1.world = new Container();
        this.addChild(Scene1.world);

        this.background = new Background("background.png");
        Scene1.world.addChild(this.background)

        this.background1 = new Background("background1.png");
        Scene1.world.addChild(this.background1)

        this.background2 = new Background("background2.png");
        Scene1.world.addChild(this.background2)


        // PAUSE GAME
        this.textPause = new Text("GAME PAUSED", { fontFamily: "PressStart2P", fontSize: 25, align: "center", fill: 0xFFFFFF });
        this.textPause.anchor.set(0.5)
        this.textPause.position.set(Manager.width / 2, Manager.height / 2);
        this.textPause.visible = false;
        this.addChild(this.textPause);

        this.buttonPauseStart = new Button("pause_start.png", () => {
            Manager.paused = true;
            sound.pause("SongLevel");
            sound.play("PauseStartSound", { volume: 0.5, singleInstance: true });
            this.buttonPauseStart.visible = false;
            this.buttonPauseEnd.visible = true;
            this.textPause.visible = true;
        });
        this.buttonPauseStart.on("pointerdown", () => { this.isOnPauseButton = true })
            .on("pointerupoutside", () => { this.isOnPauseButton = false })
        this.buttonPauseStart.scale.set(4);
        this.buttonPauseStart.position.set(50, 50);
        this.addChild(this.buttonPauseStart);

        this.buttonPauseEnd = new Button("pause_end.png", () => {
            sound.play("PauseEndSound", { volume: 0.5, singleInstance: true });
            Manager.paused = false;
            sound.resume("SongLevel");
            this.buttonPauseStart.visible = true;
            this.buttonPauseEnd.visible = false;
            this.textPause.visible = false;
            this.isOnPauseButton = false;
        });
        this.buttonPauseEnd.visible = false;
        this.buttonPauseEnd.scale.set(4);
        this.buttonPauseEnd.position.set(50, 50);
        this.addChild(this.buttonPauseEnd);







        Scene1.player = new Player();
        Scene1.player.position.set(Manager.width / 2, Manager.height + 200)
        Scene1.player.scale.set(6);
        Scene1.world.addChild(Scene1.player);

        new Tween(Scene1.player)
            .to({ y: 1100 }, 600)
            .start()
            .easing(Easing.Quadratic.Out)
            .onComplete(() => { this.eventMode = "static" })

        Scene1.score = new ScoreUI();
        this.addChild(Scene1.score);



        // TOUCH CONTROL ABSOLUTE

        // this.on('pointerdown', (event) => {

        //     if (!this.isOnPauseButton) {
        //         this.isDragging = true;
        //         const newPosition = event.getLocalPosition(this.parent);
        //         const currentX = Scene1.player.x;
        //         const currentY = Scene1.player.y;
        //         const distanceX = newPosition.x - currentX;
        //         const distanceY = newPosition.y - currentY;
        //         const speed = 1;
        //         const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        //         const time = distance / speed;

        //         let tweenActive = false;
        //         const tween = new Tween(Scene1.player)
        //             .to({ x: newPosition.x, y: newPosition.y }, time)
        //             .start()
        //             .onStart(() => {
        //                 tweenActive = true;
        //             })
        //             .onUpdate(() => {
        //                 if (!tweenActive || !this.isDragging) {
        //                     tween.stop()
        //                 }
        //             })
        //     }

        // });

        // this.on('pointermove', (event) => {
        //     if (this.isDragging && !this.isOnPauseButton) {
        //         const newPosition = event.getLocalPosition(this.parent);
        //         const currentX = Scene1.player.x;
        //         const currentY = Scene1.player.y;
        //         const distanceX = newPosition.x - currentX;
        //         const distanceY = newPosition.y - currentY;
        //         const speed = 1;
        //         const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        //         const time = distance / speed;

        //         let tweenActive = false;
        //         const tween = new Tween(Scene1.player)
        //             .to({ x: newPosition.x, y: newPosition.y }, time)
        //             .start()
        //             .onStart(() => {
        //                 tweenActive = true;
        //             })
        //             .onUpdate(() => {
        //                 if (!tweenActive) {
        //                     tween.stop()
        //                 }
        //             })
        //     }
        // });

        // this.on('pointerup', () => {
        //     this.isDragging = false;
        // });


        // TOUCH CONTROL RELATIVE


        let initialTouchPosition: Point = new Point();

        // ...

        this.on('pointerdown', (event) => {
            if (!this.isOnPauseButton) {
                // El jugador tocó la pantalla, comienza a seguir el dedo del jugador
                this.isDragging = true;
                initialTouchPosition = event.getLocalPosition(this.parent);
            }
        });

        this.on('pointermove', (event) => {
            // Si el jugador está arrastrando el dedo, mueve la nave en la dirección del desplazamiento
            if (this.isDragging && !this.isOnPauseButton) {
                const currentTouchPosition = event.getLocalPosition(this.parent);
                const distanceX = currentTouchPosition.x - initialTouchPosition.x;
                const distanceY = currentTouchPosition.y - initialTouchPosition.y;
                const speed = 0.8;

                // Aplica el desplazamiento relativo a la posición actual de la nave
                Scene1.player.x += distanceX * speed;
                Scene1.player.y += distanceY * speed;

                // Actualiza la posición inicial para el próximo movimiento relativo
                initialTouchPosition = currentTouchPosition;
            }
        });

        this.on('pointerup', () => {
            // El jugador dejó de tocar la pantalla, detén el seguimiento del dedo
            this.isDragging = false;
        });
    }

















    public update(_deltaTime: number, _deltaFrame: number) {

        this.itemSpawnTime += _deltaTime;
        this.enemySpawnTime += _deltaTime;
        Scene1.player.update(_deltaTime);

        this.background.y += _deltaTime * 0.3;
        this.background.y %= Manager.height;

        this.background1.y += _deltaTime * 0.35;
        this.background1.y %= Manager.height;

        this.background2.y += _deltaTime * 0.4;
        this.background2.y %= Manager.height;



        //ITEMS
        if (this.itemSpawnTime > Math.random() * 30000 + 15000) {
            const item = new Item(Math.random() * 6 + 1);
            Scene1.world.addChild(item);
            this.items.push(item);
            this.itemSpawnTime = 0;
        }

        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];

            if (item.y >= Manager.height) {
                this.items.splice(i, 1);
                item.tween.stop();
                item.tween2.stop();
                item.destroy();
            } else if (checkCollision(item, Scene1.player) && !this.gameover) {
                sound.play("Item", { volume: 0.4, singleInstance: true });
                this.items.splice(i, 1);
                item.tween.stop();
                item.tween2.stop();
                item.destroy();
                if (item.id <= 6) {
                    Player.SHOOT_DELAY *= 0.97;
                } else if (Player.SHOOT_STYLE == "normal") {
                    Player.SHOOT_STYLE = "double";
                    Player.SHOOT_DELAY /= 0.7;
                } else if (Player.SHOOT_STYLE == "double") {
                    Player.SHOOT_STYLE = "triple";
                    Player.SHOOT_DELAY /= 0.7;
                } else {
                    Player.SHOOT_DELAY *= 0.97;
                }
            }

        }






        // ENEMIES
        if (this.enemySpawnTime > this.enemyMaxSpawnTime / 2 && this.midEnemy) {
            const enemy = new Enemy("enemy");
            Scene1.world.addChild(enemy);
            Scene1.enemies.push(enemy);
            this.midEnemy = false;



        }

        if (this.enemySpawnTime > Math.random() * 8000 + 2000 + this.enemyMaxSpawnTime) {
            for (let i = 0; i < ((Math.random() * 10 + Math.floor(this.enemyNumber / 3))); i++) {
                const enemy = new Enemy("enemy");
                Scene1.world.addChild(enemy);
                Scene1.enemies.push(enemy);
            }
            this.enemySpawnTime = 0;
            this.enemyMaxSpawnTime *= 0.97;
            this.enemyNumber++;
            this.midEnemy = true;
        }

        for (let i = Scene1.enemies.length - 1; i >= 0; i--) {
            const enemy = Scene1.enemies[i];
            enemy.update(_deltaTime);


            if (enemy.y >= Manager.height) {
                Scene1.enemies.splice(i, 1);
                enemy.tween.stop();
                enemy.destroy();
            }

            // GAME OVER
            if (checkCollision(enemy, Scene1.player) && !this.gameover) {

                for (let i = 0; i < 15; i++) {
                    const explosionGameOver = new Explosion();
                    explosionGameOver.x = Scene1.player.x + i * Math.random() * (-20) + 20;
                    explosionGameOver.y = Scene1.player.y + i * Math.random() * (-20) + 20;
                    Scene1.world.addChild(explosionGameOver);
                }

                this.removeChild(Scene1.score);
                this.removeChild(this.buttonPauseStart);
                sound.stopAll();
                sound.play("GameOver", { volume: 0.6, singleInstance: true });
                Scene1.world.removeChild(Scene1.player);
                this.gameover = true;
                const gameover = new GameOver();
                this.addChild(gameover);
                Player.SHOOT_STYLE = "normal";
                Player.SHOOT_DELAY = Player.NORMAL_SHOOT_DELAY;
            }

        }




        // SHOOTING
        if (this.canShoot && !this.gameover) {

            setTimeout(() => { this.canShoot = true }, Player.SHOOT_DELAY);
            this.canShoot = false;

            if (Player.SHOOT_STYLE == "normal" || Player.SHOOT_STYLE == "triple") {
                const shot = new Shot(0);
                shot.position.set(Scene1.player.x, Scene1.player.y - 20);
                Scene1.world.addChild(shot);
                this.shots.push(shot);
            }

            if (Player.SHOOT_STYLE == "double") {
                const shotL = new Shot(-100);
                shotL.position.set(Scene1.player.x, Scene1.player.y - 20);
                Scene1.world.addChild(shotL);
                this.shots.push(shotL);

                const shotR = new Shot(100);
                shotR.position.set(Scene1.player.x, Scene1.player.y - 20);
                Scene1.world.addChild(shotR);
                this.shots.push(shotR);
            }

            if (Player.SHOOT_STYLE == "triple") {
                const shotL = new Shot(-200);
                shotL.position.set(Scene1.player.x, Scene1.player.y - 20);
                Scene1.world.addChild(shotL);
                this.shots.push(shotL);

                const shotR = new Shot(200);
                shotR.position.set(Scene1.player.x, Scene1.player.y - 20);
                Scene1.world.addChild(shotR);
                this.shots.push(shotR);
            }

        }


        for (let i = this.shots.length - 1; i >= 0; i--) {
            const shot = this.shots[i];

            if (shot.y < 0) {
                // Elimina el disparo si sale de la pantalla
                this.shots.splice(i, 1);
                shot.tween.stop();
                shot.destroy();
            }

            for (let j = Scene1.enemies.length - 1; j >= 0; j--) {
                const enemy = Scene1.enemies[j];
                if (checkCollision(enemy, shot)) {

                    sound.play("EnemyKilled", { volume: 0.9, singleInstance: true })
                    const explosion = new Explosion();
                    explosion.x = enemy.x + 4 * 6;
                    explosion.y = enemy.y + 4 * 6;
                    this.addChild(explosion);

                    // Elimina el disparo y el enemigo
                    this.shots.splice(i, 1);
                    Scene1.enemies.splice(j, 1);

                    // Detiene y destruye el disparo
                    shot.tween.stop();
                    shot.destroy();

                    // Detiene y destruye el enemigo
                    enemy.tween.stop();
                    enemy.destroy();

                    //SCORE
                    Scene1.score.score += 100;
                    Scene1.score.text.text = "SCORE " + String(Scene1.score.score);

                    // Sale del bucle interno ya que el disparo colisionó con un enemigo
                    break;
                }
            }
        }




        // LIMITS
        const marginX = Scene1.player.width / 2;
        const marginY = Scene1.player.height / 2;

        if (Scene1.player.x > Manager.width - marginX) {
            Scene1.player.x = Manager.width - marginX;
        } else if (Scene1.player.x < 0 + marginX) {
            Scene1.player.x = 0 + marginX;
        }

        if (Scene1.player.y > Manager.height - marginY) {
            Scene1.player.y = Manager.height - marginY;
        } else if (Scene1.player.y < 0 + marginY) {
            Scene1.player.y = 0 + marginY;
        }


    }

}
