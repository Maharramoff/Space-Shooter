// Global constants
const CANVAS = document.getElementById('game');
const CONTEXT = CANVAS.getContext('2d');
const STAGE = { x: 600, y: 600 };

// Game defaults
const FRAME_RATE = 30;
const ASTEROID_SPAWN_INTERVAL = 30;
const EXPLOSION_LIVETIME = 30;
const PARTICLE_LIVETIME = 100;
const PARTICLE_FADEOUT_SPEED = 3;
const BULLET_SPEED = 15;
const SCORE_FACTOR = 2;

// Sounds
const BOOM_SOUND = 'sound/boom.mp3';
const FIRE_SOUND = 'sound/fire.mp3';

// Background image
const BACKGROUND_IMG = new Image();
const BACKGROUND_IMG_SCROLL_SPEED = 3;
BACKGROUND_IMG.src = 'img/space.png';

// Main sprite sheet
const SPRITE_SHEET = new Image();
SPRITE_SHEET.src = 'img/sheet.png';

// Sprites properties
const SHIP_SPRITE = { sx: 0, sy: 942, sw: 112, sh: 74, h: 40, w: 60 };
const BULLET_SPRITE = { sx: 856, sy: 602, sw: 9, sh: 37, h: 37, w: 9 };
const EXPLOSION_SPRITE = [
    { sx: 603, sy: 600, sw: 46, sh: 46, h: 46, w: 46 },
    { sx: 581, sy: 661, sw: 46, sh: 46, h: 46, w: 46 },
];
const PARTICLE_SPRITE = [
    { sx: 396, sy: 414, sw: 29, sh: 25, h: 29, w: 25 },
    { sx: 602, sy: 646, sw: 15, sh: 15, h: 15, w: 15 },
    { sx: 365, sy: 814, sw: 16, sh: 18, h: 16, w: 18 },
    { sx: 407, sy: 263, sw: 26, sh: 25, h: 26, w: 25 },
    { sx: 396, sy: 414, sw: 29, sh: 25, h: 29, w: 25 },
    { sx: 602, sy: 646, sw: 15, sh: 15, h: 15, w: 15 },
    { sx: 365, sy: 814, sw: 16, sh: 18, h: 16, w: 18 },
];

const ASTEROID_SPRITE = [
    { sx: 0, sy: 618, sw: 119, sh: 97, h: 45, w: 55 },
    { sx: 326, sy: 549, sw: 99, sh: 95, h: 53, w: 55 },
    { sx: 224, sy: 748, sw: 100, sh: 84, h: 46, w: 55 },
];

// Game objects
class Game
{
    constructor()
    {
        this.asteroidList = [];
        this.explosionList = [];
        this.particleList = [];
        this.timer = 0;
        this.particlesDisposeFrames = 0;
        this.alpha = 1;
        this.particleLength = PARTICLE_SPRITE.length;
        this.score = 0;
        this.bgImageY = 0;
        this.randomAsteroidIndex = null;
        this.gameStarted = false;
        this.gamePaused = false;
    }

    start()
    {

        if (this.gameStarted)
        {
            return false;
        }

        this.ship = new Ship(STAGE.x / 2 - SHIP_SPRITE.w / 2, STAGE.y - SHIP_SPRITE.h - 10);
        this.gameStarted = true;

        document.getElementById('game-starter').style.display = 'none';
        document.getElementById('game-stats').style.display = '';
        document.getElementById('game-score').innerText = '' + this.score;

        this._gameLoop();
    }

    pauseOrResumeGame()
    {
        if (this.gamePaused)
        {
            document.getElementById('game-paused').classList.remove('blink');
            requestAnimationFrame(() => this._gameLoop());
        }
        else
        {
            document.getElementById('game-paused').classList.add('blink');
        }

        this.gamePaused = !this.gamePaused;
    }

    _gameLoop()
    {
        if (this.gamePaused)
        {
            return;
        }

        this._update();
        this._draw();
        requestAnimationFrame(() => this._gameLoop());
    }

    _update()
    {
        this.timer++;
        this.particlesDisposeFrames++;

        if (this.timer % EXPLOSION_LIVETIME === 0)
        {
            this.explosionList = [];
        }

        if (this.timer % ASTEROID_SPAWN_INTERVAL === 0)
        {
            this.randomAsteroidIndex = Math.floor(Math.random() * ASTEROID_SPRITE.length);

            this.asteroidList.push(new Asteroid(Math.random() * 600, -50, Helper.getRandomInt(-1, 1), Helper.getRandomInt(4, 6), this.randomAsteroidIndex));
        }

        for (let i in this.asteroidList)
        {
            // Asteroids physics
            this.asteroidList[i].update();

            // Remove the asteroids that are out of stage.
            if (this.asteroidList[i].outOfBounds())
            {
                this.asteroidList.splice(i, 1);
            }

            // Check if target shot down
            for (let b in this.ship.bulletList)
            {
                if (this.asteroidList.hasOwnProperty(i) && this.ship.bulletList.hasOwnProperty(b))
                {
                    if (this.ship.bulletList[b].hit(this.asteroidList[i]))
                    {
                        // Bullet explosion
                        this.explosionList.push(new Explosion(this.asteroidList[i].x + this.asteroidList[i].w / 2, this.asteroidList[i].y + this.asteroidList[i].h / 2, this.asteroidList[i].dx, this.asteroidList[i].dy));

                        // Particles
                        let particleObjects = [];

                        for (let p = 0; p < this.particleLength; p++)
                        {
                            particleObjects.push(new Particle(
                              this.ship.bulletList[b].x,
                              this.ship.bulletList[b].y,
                              (PARTICLE_SPRITE[p].w / 10) * Math.cos((p * 360 / this.particleLength) * (Math.PI / 180)),
                              (PARTICLE_SPRITE[p].w / 10) * Math.sin((p * 360 / this.particleLength) * (Math.PI / 180)),
                              PARTICLE_LIVETIME,
                              this.alpha,
                              p)
                            );
                        }

                        this.particleList.push(particleObjects);

                        // Remove collided elements
                        this.ship.bulletList.splice(b, 1);
                        this.asteroidList.splice(i, 1);

                        // Boom sound
                        new Audio(BOOM_SOUND).play().then(() => {});

                        // Update score
                        this._scoreUpdate();
                    }
                }
            }
        }

        // Explosion physics
        for (let e in this.explosionList)
        {
            this.explosionList[e].update();
        }

        for (let b in this.ship.bulletList)
        {
            // Bullet physics
            this.ship.bulletList[b].update();

            // Remove the bullets that are out of stage.
            if (this.ship.bulletList[b].outOfBounds()) this.ship.bulletList.splice(b, 1);
        }

        for (let p in this.particleList)
        {
            // If any defined value in current particle index
            if (Helper.countDefinedValues(this.particleList[p]))
            {
                for (let j in this.particleList[p])
                {
                    if (this.particleList[p][j] !== undefined)
                    {
                        // Particle physics
                        this.particleList[p][j].update();

                        // Remove the particles if live time ended
                        if (this.particleList[p][j].liveTimeEnded())
                        {
                            this.particleList[p][j] = undefined;
                        }
                    }
                }
            }
            else
            {
                this.particleList.splice(p, 1);
            }
        }

        if (this.timer > FRAME_RATE) this.timer = 0;
    }

    _draw()
    {
        // Draw background
        CONTEXT.drawImage(BACKGROUND_IMG, 0, this.bgImageY, 600, 600);
        CONTEXT.drawImage(BACKGROUND_IMG, 0, this.bgImageY - STAGE.y, 600, 600);

        // Update background height
        this.bgImageY += BACKGROUND_IMG_SCROLL_SPEED;

        // Reseting the images when the first image exits the screen
        if (this.bgImageY === STAGE.y)
        {
            this.bgImageY = 0;
        }

        // Draw explosions
        for (let e in this.explosionList)
        {
            this.explosionList[e].draw(0);
            //this.explosionList[e].draw(1);
        }

        // Draw particles
        for (let p in this.particleList)
        {
            for (let j in this.particleList[p])
            {
                if (this.particleList[p][j] !== undefined)
                {
                    this.particleList[p][j].draw();
                }
            }
        }

        // Draw asteroids
        for (let i in this.asteroidList)
        {
            this.asteroidList[i].draw();
        }

        // Draw Ship
        this.ship.draw();

        // Draw bullets
        for (let b in this.ship.bulletList)
        {
            this.ship.bulletList[b].draw();
        }
    }

    _scoreUpdate()
    {
        this.score += SCORE_FACTOR;
        document.getElementById('game-score').innerText = '' + this.score;
    }
}

class Asteroid
{
    constructor(x, y, dx, dy, spriteIndex)
    {
        let randomAsteroid = ASTEROID_SPRITE[spriteIndex];

        this.y = y;
        this.x = x;
        this.dx = dx;
        this.dy = dy;
        this.sx = randomAsteroid.sx;
        this.sy = randomAsteroid.sy;
        this.sw = randomAsteroid.sw;
        this.sh = randomAsteroid.sh;
        this.h = randomAsteroid.h;
        this.w = randomAsteroid.w;
    }

    update()
    {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw()
    {
        CONTEXT.drawImage(
          SPRITE_SHEET, //The image file
          this.sx, this.sy, //The source x and y position
          this.sw, this.sh, //The source width and height
          this.x, this.y, //The destination x and y position
          this.w, this.h //The destination height and width
        );
    }

    outOfBounds()
    {
        return this.x + this.w < 0 || this.x > STAGE.x || this.y > STAGE.y;
    }
}

class Bullet
{
    constructor(x, y, dx, dy)
    {
        this.y = y;
        this.x = x;
        this.dx = dx;
        this.dy = dy;
    }

    update()
    {
        this.x += this.dx;
        this.y -= this.dy;
    }

    draw()
    {
        CONTEXT.drawImage(
          SPRITE_SHEET,
          BULLET_SPRITE.sx, BULLET_SPRITE.sy,
          BULLET_SPRITE.sw, BULLET_SPRITE.sh,
          this.x, this.y,
          BULLET_SPRITE.w, BULLET_SPRITE.h
        );
    }

    outOfBounds()
    {
        return this.x + BULLET_SPRITE.w < 0 || this.x > STAGE.x || this.y < 0;
    }

    hit(target)
    {
        return (
          this.x > target.x
          &&
          this.x < target.x + target.w
          &&
          this.y < target.y + target.h
          &&
          this.y > target.y
        );
    }
}

class Ship
{
    newX;
    newY;

    constructor(x, y, dx, dy)
    {
        this.y = y;
        this.x = x;
        this.dx = dx;
        this.dy = dy;
        this.bulletList = [];
        let self = this;

        CANVAS.addEventListener('mousedown', function (event)
        {
            self._fireBullet(event);
        });

        CANVAS.addEventListener('mousemove', function (event)
        {
            self._move(event);
        });
    }

    update()
    {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw()
    {
        CONTEXT.drawImage(SPRITE_SHEET,
          SHIP_SPRITE.sx, SHIP_SPRITE.sy,
          SHIP_SPRITE.sw, SHIP_SPRITE.sh,
          this.x,
          this.y,
          SHIP_SPRITE.w, SHIP_SPRITE.h);
    }

    _move(event)
    {
        this.newX = event.offsetX - SHIP_SPRITE.w / 2;
        this.newY = event.offsetY - SHIP_SPRITE.h / 2;

        if (this.newX <= 0)
        {
            this.newX = 0;
        }
        else if (this.newX + SHIP_SPRITE.w >= STAGE.x)
        {
            this.newX = STAGE.x - SHIP_SPRITE.w;
        }

        if (this.newY + SHIP_SPRITE.h >= STAGE.y)
        {
            this.newY = STAGE.y - SHIP_SPRITE.h;
        }
        else if (this.newY <= 0)
        {
            this.newY = 0;
        }

        this.x = this.newX;
        this.y = this.newY;
    }

    _fireBullet(event)
    {
        if (Helper.mouseLeftClick(event))
        {
            // Generate bullet
            this.bulletList.push(new Bullet(this.x + SHIP_SPRITE.w / 2 - BULLET_SPRITE.w / 2, this.y - SHIP_SPRITE.h / 2 - BULLET_SPRITE.h / 2, 0, BULLET_SPEED));

            // Fire sound
            new Audio(FIRE_SOUND).play().then(() => {});
        }
    }
}

class Particle
{
    constructor(x, y, dx, dy, livetime, alpha, particleindex)
    {
        this.y = y;
        this.x = x;
        this.dx = dx;
        this.dy = dy;
        this.lt = livetime;
        this.al = alpha;
        this.index = particleindex;
    }

    update()
    {
        this.x += this.dx;
        this.y += this.dy;

        // Decrease particle live time by dispose speed
        this.lt -= PARTICLE_FADEOUT_SPEED;

        // Decrease particle opacity
        if (this.lt % 10 <= 1)
        {
            this.al -= 0.1;
        }
    }

    liveTimeEnded()
    {
        return this.lt <= 0;
    }

    draw()
    {
        CONTEXT.save();
        CONTEXT.globalAlpha = this.al;
        CONTEXT.drawImage(
          SPRITE_SHEET,
          PARTICLE_SPRITE[this.index].sx, PARTICLE_SPRITE[this.index].sy,
          PARTICLE_SPRITE[this.index].sw, PARTICLE_SPRITE[this.index].sh,
          this.x, this.y,
          PARTICLE_SPRITE[this.index].w, PARTICLE_SPRITE[this.index].h
        );
        CONTEXT.restore();
    }
}

class Explosion
{
    constructor(x, y, dx, dy)
    {
        this.y = y;
        this.x = x;
        this.dx = dx;
        this.dy = dy;
    }

    update()
    {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw(index)
    {
        CONTEXT.drawImage(
          SPRITE_SHEET,
          EXPLOSION_SPRITE[index].sx, EXPLOSION_SPRITE[index].sy,
          EXPLOSION_SPRITE[index].sw, EXPLOSION_SPRITE[index].sh,
          this.x - EXPLOSION_SPRITE[index].w / 2, this.y - EXPLOSION_SPRITE[index].h / 2,
          EXPLOSION_SPRITE[index].w, EXPLOSION_SPRITE[index].h
        );
    }
}

class Helper
{
    static countDefinedValues(array)
    {
        return array.filter(function (value)
        {
            return value !== undefined
        }).length;
    }

    static mouseLeftClick(evt)
    {
        let flag = false;

        evt = evt || window.event;

        if ('buttons' in evt)
        {
            flag = evt.buttons === 1;
        }

        if (!flag)
        {
            let button = evt.which || evt.button;

            flag = button === 1;
        }

        return flag;
    }

    static getRandomInt(min, max)
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// requestAnimationFrame polyfill
if (!window.requestAnimationFrame)
{
    window.requestAnimationFrame = (function ()
    {
        return window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          // Old style method
          function (callback, element)
          {
              window.setTimeout(callback, 1000 / FRAME_RATE);
          };
    })();
}

let game = new Game();

