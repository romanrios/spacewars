import { Container, Point } from "pixi.js";
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
import { ButtonPause } from "../UI/ButtonPause";


export class Scene1 extends Container implements IScene {

    public static score: ScoreUI;

    public enemies: Enemy[] = [];
    public player: Player;

    private world: Container;
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
    private isOnPauseButton: boolean = false;
    private buttonPause: ButtonPause;

    constructor() {
        super();

        sound.stopAll();
        sound.play("SongLevel", { volume: 0.3, loop: true, singleInstance: true });

        this.world = new Container();
        this.addChild(this.world);

        this.background = new Background("background.png");
        this.world.addChild(this.background)

        this.background1 = new Background("background1.png");
        this.world.addChild(this.background1)

        this.background2 = new Background("background2.png");
        this.world.addChild(this.background2)


        // PAUSE GAME
        this.buttonPause = new ButtonPause();
        this.addChild(this.buttonPause);
        this.buttonPause.eventMode = "static"
        this.buttonPause.on("pointerdown", () => { this.isOnPauseButton = true })
            .on("pointerup", () => { this.isOnPauseButton = false })
            .on("pointerupoutside", () => { this.isOnPauseButton = false })


        this.player = new Player();
        this.player.position.set(Manager.width / 2, Manager.height + 200)
        this.player.scale.set(6);
        this.world.addChild(this.player);

        new Tween(this.player)
            .to({ y: 1100 }, 600)
            .start()
            .easing(Easing.Quadratic.Out)
            .onComplete(() => { this.eventMode = "static" })

        Scene1.score = new ScoreUI();
        this.addChild(Scene1.score);




        // TOUCH CONTROL ABSOLUTE 

        if (Manager.movementType == "absolute") {

            const speed = 20;
            let targetPosition: { x: number; y: number } | null = null;

            this.on('pointerdown', (event) => {
                if (!this.isOnPauseButton) {
                    this.isDragging = true;
                    targetPosition = event.getLocalPosition(this.parent);
                    updatePosition(); // Inicia el bucle de animación
                }
            });

            this.on('pointermove', (event) => {
                if (this.isDragging && !this.isOnPauseButton) {
                    targetPosition = event.getLocalPosition(this.parent);
                    targetPosition.y -= 35; // OFFSET
                }
            });

            this.on('pointerup', () => {
                this.isDragging = false;
            });

            const updatePosition = () => {
                if (this.isDragging && targetPosition && !Manager.paused && Manager.movementType == "absolute") {
                    const deltaX = targetPosition.x - this.player.x;
                    const deltaY = targetPosition.y - this.player.y;
                    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                    if (distance > 0) {
                        const ratio = Math.min(speed / distance, 1);
                        this.player.x += deltaX * ratio;
                        this.player.y += deltaY * ratio;
                    }

                    requestAnimationFrame(updatePosition); // Solicitud de la próxima actualización
                }
            };

            updatePosition(); // Inicia el bucle de animación al principio
        }




        // TOUCH CONTROL RELATIVE

        if (Manager.movementType == "relative") {

            let initialTouchPosition: Point = new Point();
            this.on('pointerdown', (event) => {
                if (!this.isOnPauseButton && !Manager.paused) {
                    this.isDragging = true;
                    initialTouchPosition = event.getLocalPosition(this.parent);
                }
            });
            this.on('pointermove', (event) => {
                if (this.isDragging && !this.isOnPauseButton) {
                    const currentTouchPosition = event.getLocalPosition(this.parent);
                    const distanceX = currentTouchPosition.x - initialTouchPosition.x;
                    const distanceY = currentTouchPosition.y - initialTouchPosition.y;
                    const speed = 1;
                    this.player.x += distanceX * speed;
                    this.player.y += distanceY * speed;
                    initialTouchPosition = currentTouchPosition;
                }
            });
            this.on('pointerup', () => {
                this.isDragging = false;
            });

        }



    }

















    public update(_deltaTime: number, _deltaFrame: number) {

        this.itemSpawnTime += _deltaTime;
        this.enemySpawnTime += _deltaTime;
        this.player.update(_deltaTime);

        this.background.y += _deltaTime * 0.3;
        this.background.y %= Manager.height;

        this.background1.y += _deltaTime * 0.35;
        this.background1.y %= Manager.height;

        this.background2.y += _deltaTime * 0.4;
        this.background2.y %= Manager.height;



        //ITEMS
        if (this.itemSpawnTime > Math.random() * 30000 + 15000) {
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
            } else if (checkCollision(item, this.player) && !this.gameover) {
                sound.play("Item", { volume: 0.4, singleInstance: true });
                this.items.splice(i, 1);
                item.tween.stop();
                item.tween2.stop();
                item.destroy();
                if (item.id <= 6) {
                    Player.SHOOT_DELAY *= 0.95;
                } else if (Player.SHOOT_STYLE == "normal") {
                    Player.SHOOT_STYLE = "double";
                    Player.SHOOT_DELAY /= 0.8;
                } else if (Player.SHOOT_STYLE == "double") {
                    Player.SHOOT_STYLE = "triple";
                    Player.SHOOT_DELAY /= 0.8;
                } else {
                    Player.SHOOT_DELAY *= 0.95;
                }
            }

        }






        // ENEMIES
        if (this.enemySpawnTime > this.enemyMaxSpawnTime / 2 && this.midEnemy) {
            const enemy = new Enemy("enemy", this);
            this.world.addChild(enemy);
            this.enemies.push(enemy);
            this.midEnemy = false;



        }

        if (this.enemySpawnTime > Math.random() * 8000 + 2000 + this.enemyMaxSpawnTime) {
            for (let i = 0; i < ((Math.random() * 10 + Math.floor(this.enemyNumber / 3))); i++) {
                const enemy = new Enemy("enemy", this);
                this.world.addChild(enemy);
                this.enemies.push(enemy);
            }
            this.enemySpawnTime = 0;
            this.enemyMaxSpawnTime *= 0.97;
            this.enemyNumber++;
            this.midEnemy = true;
        }

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(_deltaTime);


            if (enemy.y >= Manager.height) {
                this.enemies.splice(i, 1);
                enemy.tween.stop();
                enemy.destroy();
            }

            // GAME OVER
            if (checkCollision(enemy, this.player) && !this.gameover) {

                for (let i = 0; i < 15; i++) {
                    const explosionGameOver = new Explosion();
                    explosionGameOver.x = this.player.x + i * Math.random() * (-20) + 20;
                    explosionGameOver.y = this.player.y + i * Math.random() * (-20) + 20;
                    this.world.addChild(explosionGameOver);
                }

                this.removeChild(Scene1.score);
                this.removeChild(this.buttonPause);
                sound.stopAll();
                sound.play("GameOver", { volume: 0.6, singleInstance: true });
                this.world.removeChild(this.player);
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
                const shot = new Shot(0, this);
                shot.position.set(this.player.x, this.player.y - 20);
                this.world.addChild(shot);
                this.shots.push(shot);
            }

            if (Player.SHOOT_STYLE == "double") {
                const shotL = new Shot(-100, this);
                shotL.position.set(this.player.x, this.player.y - 20);
                this.world.addChild(shotL);
                this.shots.push(shotL);

                const shotR = new Shot(100, this);
                shotR.position.set(this.player.x, this.player.y - 20);
                this.world.addChild(shotR);
                this.shots.push(shotR);
            }

            if (Player.SHOOT_STYLE == "triple") {
                const shotL = new Shot(-200, this);
                shotL.position.set(this.player.x, this.player.y - 20);
                this.world.addChild(shotL);
                this.shots.push(shotL);

                const shotR = new Shot(200, this);
                shotR.position.set(this.player.x, this.player.y - 20);
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

                    sound.play("EnemyKilled", { volume: 0.9, singleInstance: true })
                    const explosion = new Explosion();
                    explosion.x = enemy.x + 4 * 6;
                    explosion.y = enemy.y + 4 * 6;
                    this.addChild(explosion);

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
                    Scene1.score.score += 100;
                    Scene1.score.text.text = "SCORE " + String(Scene1.score.score);

                    // Sale del bucle interno ya que el disparo colisionó con un enemigo
                    break;
                }
            }
        }




        // LIMITS
        const marginX = this.player.width / 2;
        const marginY = this.player.height / 2;

        if (this.player.x > Manager.width - marginX) {
            this.player.x = Manager.width - marginX;
        } else if (this.player.x < 0 + marginX) {
            this.player.x = 0 + marginX;
        }

        if (this.player.y > Manager.height - marginY) {
            this.player.y = Manager.height - marginY;
        } else if (this.player.y < 0 + marginY) {
            this.player.y = 0 + marginY;
        }


    }

    public addShotToEnemiesArray(shot: Enemy) {
        this.enemies.push(shot);
    }

}
