class Bullet
{
    constructor(startX, startY, startDx, startDy, shipSprite, launcherSide)
    {
        this._setBulletStartPoints(startX, startY, shipSprite, launcherSide)
        this.dx = startDx;
        this.dy = startDy;
        this.centerX = startX + shipSprite.w / 2 - BULLET_SPRITE.w /2;
        this.launcherSide = launcherSide;
    }

    update()
    {
        // The bullet should not deviate from the center.
        if (this.launcherSide === 'left')
        {
            if (this.x >= this.centerX)
            {
                this.dx = 0;
            }
        }
        else
        {
            if (this.x <= this.centerX)
            {
                this.dx = 0;
            }
        }

        this.x += this.dx;
        this.y -= this.dy;

        console.log(this.centerX);
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
        return this.x + BULLET_SPRITE.w < 0 || this.x > STAGE.width || this.y < 0;
    }

    hit(target)
    {

        return (
          (this.x >= target.x || (this.x + BULLET_SPRITE.w) >= target.x)
          &&
          (this.x <= target.x + target.w)
          &&
          this.y <= target.y + target.h
          &&
          this.y >= target.y
        );
    }

    _setBulletStartPoints(startX, startY, shipSprite, launcherSide)
    {
        let launcherCenterX = shipSprite.launchers.small[launcherSide].sx + shipSprite.launchers.small[launcherSide].sw / 2;

        // Calculate bullet launch points
        this.x = startX + launcherCenterX - shipSprite.sx - BULLET_SPRITE.w / 2;
        this.y = startY + (shipSprite.launchers.small[launcherSide].sy - shipSprite.sy) - BULLET_SPRITE.h;

    }
}