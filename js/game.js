const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const spawnFrame = 30;
const stage = {x: 600, y: 600};
let timer = 0;

const backgroundImage = new Image();
backgroundImage.src = 'img/space.png';

// Load the asteroid tileset
const gameTileset = new Image();
gameTileset.src = 'img/sheet.png';

// Mouse Listeners
document.addEventListener('mousemove', mouseMove, false)


const ship = { sx: 0, sy: 942, sw: 112, sh: 74, h: 40, w: 60 };

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

        // Remove the asteroids that are out of bounds.
        if (asteroidList[i].x + asteroidList[i].w < 0 || asteroidList[i].x > 600 || asteroidList[i].y > 600) asteroidList.splice(i, 1);
    }
}

function draw()
{
    // Draw background
    context.drawImage(backgroundImage, 0, 0, 600, 600);

    // Draw Ship
    context.drawImage(gameTileset,
      ship.sx, ship.sy,
      ship.sw, ship.sh,
      ship.x,
      ship.y,
      ship.w, ship.h);

    for (let i in asteroidList)
    {
        // Draw asteroids
        context.drawImage(
          gameTileset, //The image file
          asteroidList[i].sx, asteroidList[i].sy, //The source x and y position
          asteroidList[i].sw, asteroidList[i].sh, //The source width and height
          asteroidList[i].x, asteroidList[i].y, //The destination x and y position
          asteroidList[i].w, asteroidList[i].h //The destination height and width
        );
    }
}

function mouseMove(event)
{
    ship.x = event.offsetX - ship.w / 2;
    ship.y = event.offsetY - ship.h / 2;
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


