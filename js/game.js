const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const spawnFrame = 30;
const bulletExplosionFrame = 60;
const particlesLiveTime = 100;
const particlesDisposeSpeed = 3;
const bulletSpeed = 15;
const scoreFactor = 2;
const STAGE = { x: 600, y: 600 };
const FRAME_RATE = 60;
let gameStarted = false;

// Game will pause when paused == true
let gamePaused = false;

// Sounds
const boomSound = 'sound/boom.mp3';
const fireSound = 'sound/fire.mp3';

// Background image
const backgroundImage = new Image();
const bgImageSpeed = 3;
backgroundImage.src = 'img/space.png';

// Load the sprite sheet
const SPRITE_SHEET = new Image();
SPRITE_SHEET.src = 'img/sheet.png';

// Entities coordinates
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

const ASTEROID_SPRITES = [
    { sx: 0, sy: 618, sw: 119, sh: 97, h: 45, w: 55 },
    { sx: 326, sy: 549, sw: 99, sh: 95, h: 53, w: 55 },
    { sx: 224, sy: 748, sw: 100, sh: 84, h: 46, w: 55 },
];

class Asteroid
{
    constructor(x, y, dx, dy, spriteIndex)
    {
        let randomAsteroid = ASTEROID_SPRITES[spriteIndex];

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
        context.drawImage(
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
        context.drawImage(
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
        let self = this;
        canvas.addEventListener('mousemove', function (event)
        {
            self.move(event);
        });
    }

    update()
    {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw()
    {
        context.drawImage(SPRITE_SHEET,
          SHIP_SPRITE.sx, SHIP_SPRITE.sy,
          SHIP_SPRITE.sw, SHIP_SPRITE.sh,
          this.x,
          this.y,
          SHIP_SPRITE.w, SHIP_SPRITE.h);
    }

    move(event)
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
        this.lt -= particlesDisposeSpeed;

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
        context.save();
        context.globalAlpha = this.al;
        context.drawImage(
          SPRITE_SHEET,
          PARTICLE_SPRITE[this.index].sx, PARTICLE_SPRITE[this.index].sy,
          PARTICLE_SPRITE[this.index].sw, PARTICLE_SPRITE[this.index].sh,
          this.x, this.y,
          PARTICLE_SPRITE[this.index].w, PARTICLE_SPRITE[this.index].h
        );
        context.restore();
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
        context.drawImage(
          SPRITE_SHEET,
          EXPLOSION_SPRITE[index].sx, EXPLOSION_SPRITE[index].sy,
          EXPLOSION_SPRITE[index].sw, EXPLOSION_SPRITE[index].sh,
          this.x - EXPLOSION_SPRITE[index].w / 2, this.y - EXPLOSION_SPRITE[index].h / 2,
          EXPLOSION_SPRITE[index].w, EXPLOSION_SPRITE[index].h
        );
    }
}

// Gameplay variables
let ship = new Ship(STAGE.x / 2 - SHIP_SPRITE.w / 2, STAGE.y - SHIP_SPRITE.h - 10);
let asteroidList = [];
let bulletList = [];
let explosionList = [];
let particleList = [];
let timer = 0;
let particlesDisposeFrames = 0;
let alpha = 1;
let particleLength = PARTICLE_SPRITE.length;
let score = 0;
let bgImageY = 0;
let randomAsteroidIndex;

// Game constructor
function initGame()
{
    gameStarted = true;

    document.getElementById('game-starter').style.display = 'none';
    document.getElementById('game-stats').style.display = '';
    document.getElementById('game-score').innerText = '' + score;

    // Mouse Listeners
    canvas.addEventListener('mousedown', mouseLeftClick, false)

    game();
}

function pauseOrResumeGame()
{
    if (gamePaused)
    {
        document.getElementById('game-paused').classList.remove('blink');
        requestAnimationFrame(game);
    }
    else
    {
        document.getElementById('game-paused').classList.add('blink');
    }

    gamePaused = !gamePaused;
}

function resumeGame()
{
    pauseOrResumeGame();
}

function game()
{
    if (gamePaused)
    {
        return;
    }

    update();
    draw();
    requestAnimationFrame(game);
}

function update()
{
    timer++;
    particlesDisposeFrames++;

    if (timer % bulletExplosionFrame === 0)
    {
        explosionList = [];
    }

    if (timer % spawnFrame === 0)
    {
        randomAsteroidIndex = Math.floor(Math.random() * ASTEROID_SPRITES.length);

        asteroidList.push(new Asteroid(Math.random() * 600, -50, getRandomInt(-1, 1), getRandomInt(4, 6), randomAsteroidIndex));
    }

    for (let i in asteroidList)
    {
        // Asteroids physics
        asteroidList[i].update();

        // Remove the asteroids that are out of stage.
        if (asteroidList[i].outOfBounds())
        {
            asteroidList.splice(i, 1);
        }

        // Check if target shot down
        for (let b in bulletList)
        {
            if (asteroidList.hasOwnProperty(i) && bulletList.hasOwnProperty(b))
            {
                if (bulletList[b].hit(asteroidList[i]))
                {
                    // Bullet explosion
                    explosionList.push(new Explosion(asteroidList[i].x + asteroidList[i].w / 2, asteroidList[i].y + asteroidList[i].h / 2, asteroidList[i].dx, asteroidList[i].dy));

                    // Particles
                    let particleObjects = [];

                    for (let p = 0; p < particleLength; p++)
                    {
                        particleObjects.push(new Particle(
                          bulletList[b].x,
                          bulletList[b].y,
                          (PARTICLE_SPRITE[p].w / 10) * Math.cos((p * 360 / particleLength) * (Math.PI / 180)),
                          (PARTICLE_SPRITE[p].w / 10) * Math.sin((p * 360 / particleLength) * (Math.PI / 180)),
                          particlesLiveTime,
                          alpha,
                          p)
                        );
                    }

                    particleList.push(particleObjects);

                    // Remove collided elements
                    bulletList.splice(b, 1);
                    asteroidList.splice(i, 1);

                    // Boom sound
                    new Audio(boomSound).play().then(() => {});

                    // Update score
                    scoreUpdate();
                }
            }
        }
    }

    // Explosion physics
    for (let e in explosionList)
    {
        explosionList[e].update();
    }

    for (let b in bulletList)
    {
        // Bullet physics
        bulletList[b].update();

        // Remove the bullets that are out of stage.
        if (bulletList[b].outOfBounds()) bulletList.splice(b, 1);
    }

    for (let p in particleList)
    {
        // If any defined value in current particle index
        if (countDefinedValues(particleList[p]))
        {
            for (let j in particleList[p])
            {
                if (particleList[p][j] !== undefined)
                {
                    // Particle physics
                    particleList[p][j].update();

                    // Remove the particles if live time ended
                    if (particleList[p][j].liveTimeEnded())
                    {
                        particleList[p][j] = undefined;
                    }
                }
            }
        }
        else
        {
            particleList.splice(p, 1);
        }
    }

    if (timer > FRAME_RATE) timer = 0;
}

function countDefinedValues(array)
{
    return array.filter(function (value)
    {
        return value !== undefined
    }).length;
}

function draw()
{
    // Draw background
    context.drawImage(backgroundImage, 0, bgImageY, 600, 600);
    context.drawImage(backgroundImage, 0, bgImageY - STAGE.y, 600, 600);

    // Update background height
    bgImageY += bgImageSpeed;

    // Reseting the images when the first image exits the screen
    if (bgImageY === STAGE.y)
    {
        bgImageY = 0;
    }

    // Draw explosions
    for (let e in explosionList)
    {
        explosionList[e].draw(0);
        explosionList[e].draw(1);
    }

    // Draw particles
    for (let p in particleList)
    {
        for (let j in particleList[p])
        {
            if (particleList[p][j] !== undefined)
            {
                particleList[p][j].draw();
            }
        }
    }

    // Draw asteroids
    for (let i in asteroidList)
    {
        asteroidList[i].draw();
    }

    // Draw Ship
    ship.draw();

    // Draw bullets
    for (let b in bulletList)
    {
        bulletList[b].draw();
    }
}

function mouseLeftClick(evt)
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

    if (flag)
    {
        // Generate bullet
        bulletList.push(new Bullet(ship.x + SHIP_SPRITE.w / 2 - BULLET_SPRITE.w / 2, ship.y - SHIP_SPRITE.h / 2 - BULLET_SPRITE.h / 2, 0, bulletSpeed));

        // Fire sound
        new Audio(fireSound).play().then(() => {});
    }

    // Continue game animation if game paused
    if (gamePaused)
    {
        resumeGame();
    }

}

function scoreUpdate()
{
    score += scoreFactor;
    document.getElementById('game-score').innerText = '' + score;
}

function getRandomInt(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

// Game starts if enter key clicked
window.addEventListener('keydown', function (event)
{
    if (event.defaultPrevented)
    {
        return;
    }

    if (event.key !== undefined)
    {
        if (event.key === 'Enter')
        {
            // Check if game is not running
            if (!gameStarted)
            {
                initGame();
            }
        }
    }

}, true);

