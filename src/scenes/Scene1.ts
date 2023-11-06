import { Container, Sprite, Texture } from "pixi.js";
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


export class Scene1 extends Container implements IScene {
    public static player: Player;

    private bgContainer: Container;

    private enemyNumber: number = 0;
    private enemySpawnTime: number = 0;
    private enemyMaxSpawnTime: number = 7000;
    private itemSpawnTime: number = 0;
    private enemies: Enemy[] = [];
    private shots: Shot[] = [];
    private items: Item[] = [];
    private canShoot: boolean = true;
    private gameover: boolean = false;

    private isDragging: boolean = false;
    private score: ScoreUI;
    private world: Container;

    constructor() {
        super();

        sound.stopAll();
        sound.play("SongLevel", { volume: 0.6, loop: true, singleInstance: true });

        this.world = new Container();
        this.addChild(this.world);

        const bgTexture = Texture.from("./background.png");
        this.bgContainer = new Container();
        this.world.addChild(this.bgContainer);

        const background = Sprite.from(bgTexture)
        background.width = Manager.width;
        background.height = Manager.height;
        this.bgContainer.addChild(background);

        const background2 = Sprite.from(bgTexture)
        background2.width = Manager.width;
        background2.height = Manager.height;
        background2.y = -1280;
        this.bgContainer.addChild(background2);

        Scene1.player = new Player();
        Scene1.player.position.set(Manager.width / 2, Manager.height - 50)
        Scene1.player.scale.set(6);
        this.world.addChild(Scene1.player);

        this.score = new ScoreUI();
        this.addChild(this.score);

        // for touch control
        this.eventMode = "static";

        // TOUCH CONTROL
        this.on('pointerdown', () => {
            // El jugador tocó la pantalla, comienza a seguir el dedo del jugador
            this.isDragging = true;
        });

        this.on('pointermove', (event) => {
            // Si el jugador está arrastrando el dedo, mueve la nave hacia la posición del dedo
            if (this.isDragging) {
                const newPosition = event.data.getLocalPosition(this.parent);
                Scene1.player.x = newPosition.x;
                Scene1.player.y = newPosition.y;
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

        this.bgContainer.y += _deltaTime * 0.3;
        this.bgContainer.y %= Manager.height;



        //ITEMS
        if (this.itemSpawnTime > Math.random() * 20000 + 13000) {
            const item = new Item(Math.random() * 6 + 1);
            this.world.addChild(item);
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
                    Player.SHOOT_DELAY *= 0.95;
                } else if (Player.SHOOT_STYLE == "normal") {
                    Player.SHOOT_STYLE = "double";
                    Player.SHOOT_DELAY /= 0.9;
                } else if (Player.SHOOT_STYLE == "double") {
                    Player.SHOOT_STYLE = "triple";
                    Player.SHOOT_DELAY /= 0.9;
                } else {
                    Player.SHOOT_DELAY *= 0.9;
                }
            }

        }






        // ENEMIES
        if (this.enemySpawnTime > Math.random() * 10000 + 5000 + this.enemyMaxSpawnTime) {
            for (let i = 0; i < ((Math.random() * 10 + Math.floor(this.enemyNumber / 3))); i++) {
                const enemy = new Enemy();
                this.world.addChild(enemy);
                this.enemies.push(enemy);
            }
            this.enemySpawnTime = 0;
            this.enemyMaxSpawnTime *= 0.97;
            this.enemyNumber++;
        }

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];

            if (enemy.y >= Manager.height) {
                this.enemies.splice(i, 1);
                enemy.tween.stop();
                enemy.destroy();
            }

            // GAME OVER
            if (checkCollision(enemy, Scene1.player) && !this.gameover) {
                sound.stopAll();
                sound.play("GameOver", { volume: 0.6, singleInstance: true });
                this.world.removeChild(Scene1.player);
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
                this.world.addChild(shot);
                this.shots.push(shot);
            }

            if (Player.SHOOT_STYLE == "double") {
                const shotL = new Shot(-100);
                shotL.position.set(Scene1.player.x, Scene1.player.y - 20);
                this.world.addChild(shotL);
                this.shots.push(shotL);

                const shotR = new Shot(100);
                shotR.position.set(Scene1.player.x, Scene1.player.y - 20);
                this.world.addChild(shotR);
                this.shots.push(shotR);
            }

            if (Player.SHOOT_STYLE == "triple") {
                const shotL = new Shot(-200);
                shotL.position.set(Scene1.player.x, Scene1.player.y - 20);
                this.world.addChild(shotL);
                this.shots.push(shotL);

                const shotR = new Shot(200);
                shotR.position.set(Scene1.player.x, Scene1.player.y - 20);
                this.world.addChild(shotR);
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

            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                if (checkCollision(enemy, shot)) {
                    sound.play("EnemyKilled", { volume: 0.5, singleInstance: true })

                    // Elimina el disparo y el enemigo
                    this.shots.splice(i, 1);
                    this.enemies.splice(j, 1);

                    // Detiene y destruye el disparo
                    shot.tween.stop();
                    shot.destroy();

                    // Detiene y destruye el enemigo
                    enemy.tween.stop();
                    enemy.destroy();

                    //SCORE
                    this.score.score += 100;
                    this.score.text.text = "SCORE " + String(this.score.score);

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
