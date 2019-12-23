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