const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const backgroundImage = new Image();
backgroundImage.src = 'img/space.png';

// Load the asteroid tileset
let gameTileset = new Image();
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

let asteroid = {x: 0, y: 250, dx: 1, dy: 2, h: 45, w: 55};

function update()
{
    asteroid.x += asteroid.dx;
    asteroid.y += asteroid.dy;

    // Asteroid bounds
    if (asteroid.x + asteroid.w >= 600 || asteroid.x <= 0) asteroid.dx = -asteroid.dx;
    if (asteroid.y + asteroid.h >= 600 || asteroid.y <= 0) asteroid.dy = -asteroid.dy;
}

function draw()
{
    // Draw background
    context.drawImage(backgroundImage, 0, 0, 600, 600);

    // Draw asteroids
    context.drawImage(
      gameTileset, //The image file
      0, 618, //The source x and y position
      119, 97, //The source height and width
      asteroid.x, asteroid.y, //The destination x and y position
      asteroid.h, asteroid.w //The destination height and width
    );



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


