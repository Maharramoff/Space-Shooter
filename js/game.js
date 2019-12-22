const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const spawnFrame = 30;
const bulletExplosionFrame = 5;
const particlesLiveTime = 100;
const particlesDisposeSpeed = 3;
const bulletSpeed = 15;
const scoreFactor = 2;
const STAGE = { x: 600, y: 600 };
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
const bulletExplosion = [
    { sx: 603, sy: 600, sw: 46, sh: 46, h: 46, w: 46 },
    { sx: 581, sy: 661, sw: 46, sh: 46, h: 46, w: 46 },
];
const particle = [
    //{ sx: 283, sy: 453, sw: 44, sh: 39, h: 44, w: 39 },
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
        canvas.addEventListener('mousemove', function(event){
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

// Gameplay variables
let ship = new Ship(STAGE.x / 2 - SHIP_SPRITE.w / 2, STAGE.y - SHIP_SPRITE.h - 10);
let asteroidList = [];
let bulletList = [];
let bulletExplosionList = [];
let particleList = [];
let timer = 0;
let particlesDisposeFrames = 0;
let alpha = 1;
let particleLength = particle.length;
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
        bulletExplosionList = [];
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
                if(bulletList[b].hit(asteroidList[i]))
                {
                    // Bullet explosion
                    bulletExplosionList.push({ x: bulletList[b].x, y: bulletList[b].y });

                    // Particles
                    let particleObjects = [];

                    for (let p = 0; p < particleLength; p++)
                    {
                        particleObjects.push(
                          {
                              x : bulletList[b].x,
                              y : bulletList[b].y,
                              dx: (particle[p].w / 10) * Math.cos((p * 360 / particleLength) * (Math.PI / 180)),
                              dy: (particle[p].w / 10) * Math.sin((p * 360 / particleLength) * (Math.PI / 180)),
                              lt: particlesLiveTime,
                              al: alpha,
                          }
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

    for (let b in bulletList)
    {
        // Bullet physics
        bulletList[b].update();

        // Remove the bullets that are out of stage.
        if (bulletList[b].outOfBounds()) bulletList.splice(b, 1);
    }

    for (let p in particleList)
    {

        // Əgər hissənin listi boş deyilsə
        if (particleList[p].filter(function (value) { return value !== undefined }).length)
        {
            for (let j in particleList[p])
            {
                if (particleList[p][j] !== undefined)
                {
                    // Particle physics
                    particleList[p][j].x += particleList[p][j].dx;
                    particleList[p][j].y += particleList[p][j].dy;
                    particleList[p][j].lt -= particlesDisposeSpeed;

                    if (particleList[p][j].lt % 10 <= 1)
                    {
                        particleList[p][j].al -= 0.1;
                    }

                    // Remove the particles if live time ended
                    if (particleList[p][j].lt <= 0)
                    {
                        particleList[p][j] = undefined;
                    }

                    // Remove the particles that are out of stage.
                    //if (particleList[p][j].x + particle[j].w < 0 || particleList[p][j].x > 600 || particleList[p][j].y > 600 || particleList[p][j].y + particle[j].h < 0) particleList[p][j] = undefined;
                }
            }
        }
        else
        {
            particleList.splice(p, 1);
        }
    }
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

    //context.drawImage(backgroundImage, 0, 0, 600, 600);

    // Draw bullet explosions
    for (let e in bulletExplosionList)
    {
        context.drawImage(
          SPRITE_SHEET,
          bulletExplosion[0].sx, bulletExplosion[0].sy,
          bulletExplosion[0].sw, bulletExplosion[0].sh,
          bulletExplosionList[e].x - bulletExplosion[0].w / 2, bulletExplosionList[e].y - bulletExplosion[0].h / 2,
          bulletExplosion[0].w, bulletExplosion[0].h
        );

        context.drawImage(
          SPRITE_SHEET,
          bulletExplosion[1].sx, bulletExplosion[1].sy,
          bulletExplosion[1].sw, bulletExplosion[1].sh,
          bulletExplosionList[e].x - bulletExplosion[1].w / 2, bulletExplosionList[e].y - bulletExplosion[1].h / 2,
          bulletExplosion[1].w, bulletExplosion[1].h
        );
    }

    // Draw particles
    for (let p in particleList)
    {
        for (let j in particleList[p])
        {
            if (particleList[p][j] !== undefined)
            {
                context.save();
                context.globalAlpha = particleList[p][j].al;
                context.drawImage(
                  SPRITE_SHEET,
                  particle[j].sx, particle[j].sy,
                  particle[j].sw, particle[j].sh,
                  particleList[p][j].x, particleList[p][j].y,
                  particle[j].w, particle[j].h
                );
                context.restore();
            }
        }
    }

    // Draw asteroid
    for (let i in asteroidList)
    {
        asteroidList[i].draw();
    }

    // Draw Ship
    ship.draw();

    for (let b in bulletList)
    {
        // Draw bullets
        bulletList[b].draw();
    }
}

let newX, newY;

function mouseMove(event)
{
    newX = event.offsetX - SHIP_SPRITE.w / 2;
    newY = event.offsetY - SHIP_SPRITE.h / 2;

    if (newX <= 0)
    {
        newX = 0;
    }
    else if (newX + SHIP_SPRITE.w >= STAGE.x)
    {
        newX = STAGE.x - SHIP_SPRITE.w;
    }

    if (newY + SHIP_SPRITE.h >= STAGE.y)
    {
        newY = STAGE.y - SHIP_SPRITE.h;
    }
    else if (newY <= 0)
    {
        newY = 0;
    }

    ship.x = newX;
    ship.y = newY;
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
              window.setTimeout(callback, 1000 / 60);
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

