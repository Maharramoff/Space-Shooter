const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const spawnFrame = 30;
const stage = { x: 600, y: 600 };
const bulletSpeed = 20;

// Background image
const backgroundImage = new Image();
backgroundImage.src = 'img/space.png';

// Load the sprite sheet
const spriteSheet = new Image();
spriteSheet.src = 'img/sheet.png';

// Mouse Listeners
document.addEventListener('mousemove', mouseMove, false)
document.addEventListener('mousedown', mouseClick, false)

// Entities coordinates
const ship = { sx: 0, sy: 942, sw: 112, sh: 74, h: 40, w: 60 };
const bullet = { sx: 856, sy: 602, sw: 9, sh: 37, h: 37, w: 9 };

const asteroids = [
    { sx: 0, sy: 618, sw: 119, sh: 97, h: 45, w: 55 },
    { sx: 326, sy: 549, sw: 99, sh: 95, h: 53, w: 55 },
    { sx: 224, sy: 748, sw: 100, sh: 84, h: 46, w: 55 },
];

window.onload = function ()
{
    ship.x = stage.x / 2 - ship.w / 2;
    ship.y = stage.y - ship.h - 10;
    game();
}

function game()
{
    update();
    draw();
    requestAnimationFrame(game);
}

let asteroidList = [];
let bulletList   = [];
let timer = 0;

function update()
{
    timer++;

    if (timer % spawnFrame === 0)
    {
        let genObject = {
            x : Math.random() * 600,
            y : -50,
            dx: Math.random() * 2 - 1,
            dy: Math.random() * 2 + 2,
        };

        let randomAsteroid = asteroids[Math.floor(Math.random() * asteroids.length)];

        asteroidList.push({ ...randomAsteroid, ...genObject });
    }

    for (let i in asteroidList)
    {
        // Asteroids physics
        asteroidList[i].x += asteroidList[i].dx;
        asteroidList[i].y += asteroidList[i].dy;

        // Remove the asteroids that are out of stage.
        if (asteroidList[i].x + asteroidList[i].w < 0 || asteroidList[i].x > 600 || asteroidList[i].y > 600) asteroidList.splice(i, 1);
    }

    for (let b in bulletList)
    {
        // Bullet physics
        bulletList[b].x += bulletList[b].dx;
        bulletList[b].y -= bulletList[b].dy;

        // Remove the bullets that are out of stage.
        if (bulletList[b].x + bulletList[b].w < 0 || bulletList[b].x > 600 || bulletList[b].y > 600) bulletList.splice(b, 1);
    }
}

function draw()
{
    // Draw background
    context.drawImage(backgroundImage, 0, 0, 600, 600);

    // Draw Ship
    context.drawImage(spriteSheet,
      ship.sx, ship.sy,
      ship.sw, ship.sh,
      ship.x,
      ship.y,
      ship.w, ship.h);

    for (let i in asteroidList)
    {
        // Draw asteroids
        context.drawImage(
          spriteSheet, //The image file
          asteroidList[i].sx, asteroidList[i].sy, //The source x and y position
          asteroidList[i].sw, asteroidList[i].sh, //The source width and height
          asteroidList[i].x, asteroidList[i].y, //The destination x and y position
          asteroidList[i].w, asteroidList[i].h //The destination height and width
        );
    }

    for (let b in bulletList)
    {
        // Draw bullets
        context.drawImage(
          spriteSheet,
          bullet.sx, bullet.sy,
          bullet.sw, bullet.sh,
          bulletList[b].x, bulletList[b].y,
          bullet.w, bullet.h
        );
    }
}

function mouseMove(event)
{
    ship.x = event.offsetX - ship.w / 2;
    ship.y = event.offsetY - ship.h / 2;
}

function mouseClick(event)
{
    bulletList.push(
      {
          x : ship.x + ship.w / 2 - bullet.w / 2,
          y : ship.y - ship.h / 2 - bullet.h / 2,
          dx: 0,
          dy: bulletSpeed,
      });
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


