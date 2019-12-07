const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const backgroundImage = new Image();
backgroundImage.src = 'img/space.png';

// Load the asteroid tileset
const gameTileset = new Image();
gameTileset.src = 'img/sheet.png';

window.onload = function ()
{
    game();
}

function game()
{
    update();
    draw();
    requestAnimationFrame(game);
}

let asteroids = [
    { x: 0, y: 250, sx: 0, sy: 618, sw: 119, sh: 97, dx: 10, dy: 20, h: 45, w: 55 },
    { x: 0, y: 250, sx: 326, sy: 549, sw: 99, sh: 95, dx: 5, dy: 10, h: 53, w: 55 },
];

function update()
{
    for (let i in asteroids)
    {
        asteroids[i].x += asteroids[i].dx;
        asteroids[i].y += asteroids[i].dy;

        // Asteroid bounds
        if (asteroids[i].x + asteroids[i].w >= 600 || asteroids[i].x <= 0) asteroids[i].dx = -asteroids[i].dx;
        if (asteroids[i].y + asteroids[i].h >= 600 || asteroids[i].y <= 0) asteroids[i].dy = -asteroids[i].dy;
    }

}

function draw()
{
    // Draw background
    context.drawImage(backgroundImage, 0, 0, 600, 600);

    for (let i in asteroids)
    {
        // Draw asteroids
        context.drawImage(
          gameTileset, //The image file
          asteroids[i].sx, asteroids[i].sy, //The source x and y position
          asteroids[i].sw, asteroids[i].sh, //The source width and height
          asteroids[i].x, asteroids[i].y, //The destination x and y position
          asteroids[i].h, asteroids[i].w //The destination height and width
        );
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
              window.setTimeout(callback, 1000 / 60);
          };
    })();
}


