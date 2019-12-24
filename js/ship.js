class Ship
{
    newX;
    newY;

    constructor(x, y, dx, dy)
    {
        this.y = y;
        this.x = x;
        this.dx = dx;
        this.dy = dy;
        this.bulletList = [];
        this.destroyed = false;
        this._mouseMoveListener();
    }

    draw()
    {
        if(this.destroyed !== true)
        {
            CONTEXT.drawImage(SPRITE_SHEET,
              SHIP_SPRITE.sx, SHIP_SPRITE.sy,
              SHIP_SPRITE.sw, SHIP_SPRITE.sh,
              this.x,
              this.y,
              SHIP_SPRITE.w, SHIP_SPRITE.h);
        }
    }

    collidesWith(object)
    {
        return (
          this.x > object.x
          &&
          this.x < object.x + object.w
          &&
          this.y < object.y + object.h
          &&
          this.y > object.y
        );
    }

    destroy()
    {
        this.destroyed = true;
    }

    _move(event)
    {
        this.newX = event.offsetX - SHIP_SPRITE.w / 2;
        this.newY = event.offsetY - SHIP_SPRITE.h / 2;

        if (this.newX <= 0)
        {
            this.newX = 0;
        }
        else if (this.newX + SHIP_SPRITE.w >= STAGE.x)
        {
            this.newX = STAGE.x - SHIP_SPRITE.w;
        }

        if (this.newY + SHIP_SPRITE.h >= STAGE.y)
        {
            this.newY = STAGE.y - SHIP_SPRITE.h;
        }
        else if (this.newY <= 0)
        {
            this.newY = 0;
        }

        this.x = this.newX;
        this.y = this.newY;
        this.dx = event.movementX;
        this.dy = event.movementY;
    }

    _fireBullet()
    {
        // Fire sound
        new Audio(FIRE_SOUND).play().then(() =>
        {
            // Generate bullet
            this.bulletList.push(new Bullet(this.x + SHIP_SPRITE.w / 2 - BULLET_SPRITE.w / 2, this.y - SHIP_SPRITE.h / 2 - BULLET_SPRITE.h / 2, 0, BULLET_SPEED));
        });

        return true;
    }

    _mouseMoveListener()
    {
        let self = this;
        CANVAS.addEventListener('mousemove', function (event)
        {
            self._move(event);
        });
    }
}