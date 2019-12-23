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