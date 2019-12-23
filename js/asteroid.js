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