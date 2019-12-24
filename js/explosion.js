class Explosion
{
    constructor(x, y, dx, dy, explosionType)
    {
        this.y = y;
        this.x = x;
        this.dx = dx;
        this.dy = dy;
        this.type = explosionType;
        this.explosionTimer = 0;
        this.explosionSprite = EXPLOSION_SPRITE[this.type];
        this.explosionFrameCount = this.explosionSprite.length;
        this.nextExplosionFrame = 0;
        this.toDelete = false;

    }

    update()
    {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw()
    {

        if (this.nextExplosionFrame < this.explosionFrameCount && this.toDelete !== true)
        {
            CONTEXT.drawImage(
              EXPLOSION_SPRITE_SHEET[this.type],
              this.explosionSprite[this.nextExplosionFrame].sx, this.explosionSprite[this.nextExplosionFrame].sy,
              this.explosionSprite[this.nextExplosionFrame].sw, this.explosionSprite[this.nextExplosionFrame].sh,
              this.x - this.explosionSprite[this.nextExplosionFrame].w / 2, this.y - this.explosionSprite[this.nextExplosionFrame].h / 2,
              this.explosionSprite[this.nextExplosionFrame].w, this.explosionSprite[this.nextExplosionFrame].h
            );
        }
        else
        {
            this.nextExplosionFrame = 0;
            this.toDelete = true;
        }

        if (this.explosionTimer > EXPLOSION_FRAME_INTERVAL)
        {
            this.explosionTimer = 0;
            this.nextExplosionFrame++;
        }

        this.explosionTimer++;
    }
}