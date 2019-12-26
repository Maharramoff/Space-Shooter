class Bullet
{
    constructor(startX, startY, startDx, startDy, shipSprite, launcherSide)
    {
        this._setBulletStartPoints(startX, startY, shipSprite, launcherSide)
        this.dx = startDx;
        this.dy = startDy;
        this.centerX = startX + shipSprite.w / 2 - BULLET_SPRITE.radius;
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
    }

    draw()
    {
        CONTEXT.beginPath();
        CONTEXT.arc(this.x + BULLET_SPRITE.radius, this.y + BULLET_SPRITE.radius, BULLET_SPRITE.radius, 0, 2 * Math.PI, false);
        CONTEXT.fillStyle = 'yellow';
        CONTEXT.fill();
        CONTEXT.lineWidth = 4;
        CONTEXT.strokeStyle = 'red';
        CONTEXT.stroke();
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
        this.x = startX + launcherCenterX - shipSprite.sx - BULLET_SPRITE.radius;
        this.y = startY + (shipSprite.launchers.small[launcherSide].sy - shipSprite.sy) - BULLET_SPRITE.h;

    }
}