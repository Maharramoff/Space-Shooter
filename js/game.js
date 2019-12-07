const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const backgroundImage = new Image();
backgroundImage.src = 'img/space.png';

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

function update()
{

}

function draw()
{
    context.drawImage(backgroundImage, 0, 0, 600, 600);
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
          // Əgər heç bir brauzer dəstəkləməsə, köhnə metod istifadə edirik.
          function (callback, element)
          {
              window.setTimeout(callback, 1000 / 60);
          };
    })();
}


