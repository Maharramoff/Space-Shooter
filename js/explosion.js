class Explosion
{
    constructor(x, y, dx, dy)
    {
        this.y = y;
        this.x = x;
        this.dx = dx;
        this.dy = dy;
        this.explosionTimer = 0;
        this.explosionFrameCount = EXPLOSION_SPRITE.length;
        this.nextExplosionFrame = 0;
        this.toDelete = false;
    }

    update()
    {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw(index)
    {

        CONTEXT.drawImage(
          EXPLOSION_SPRITE_SHEET,
          EXPLOSION_SPRITE[this.nextExplosionFrame].sx, EXPLOSION_SPRITE[this.nextExplosionFrame].sy,
          EXPLOSION_SPRITE[this.nextExplosionFrame].sw, EXPLOSION_SPRITE[this.nextExplosionFrame].sh,
          this.x - EXPLOSION_SPRITE[this.nextExplosionFrame].w / 2, this.y - EXPLOSION_SPRITE[this.nextExplosionFrame].h / 2,
          EXPLOSION_SPRITE[this.nextExplosionFrame].w, EXPLOSION_SPRITE[this.nextExplosionFrame].h
        );

        this.explosionTimer++;

        if(this.explosionTimer > EXPLOSION_FRAME_INTERVAL)
        {
            this.explosionTimer = 0;
            this.nextExplosionFrame++;
        }

        if(this.nextExplosionFrame > this.explosionFrameCount - 1)
        {
            this.nextExplosionFrame = 0;
            this.toDelete = true;
        }
    }
}