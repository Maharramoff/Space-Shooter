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
        this.radius = (SHIP_SPRITE.w + SHIP_SPRITE.h) / 4 //TODO
        this.bulletList = [];
        this.destroyed = false;
        this._mouseMoveListener();
        this.fireSound = new Audio(FIRE_SOUND);
        this.shipBoomSound = new Audio(SHIP_BOOM_SOUND);
    }

    draw()
    {
        if (this.destroyed !== true)
        {
            CONTEXT.drawImage(SHIP_SPRITE_SHEET,
              SHIP_SPRITE.sx, SHIP_SPRITE.sy,
              SHIP_SPRITE.sw, SHIP_SPRITE.sh,
              this.x,
              this.y,
              SHIP_SPRITE.w, SHIP_SPRITE.h);
        }
    }

    collidesWith(object)
    {
        return this.distanceBetween(object) < (this.radius + object.radius);
    }

    distanceBetween(object)
    {
        return Math.sqrt(Math.pow(this.x - object.x, 2) + Math.pow(this.y - object.y, 2));
    }

    destroy()
    {
        this.destroyed = true;
        Helper.playSound(this.shipBoomSound);
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
        Helper.playSound(this.fireSound);

        // Generate bullet
        this.bulletList.push(new Bullet(this.x + SHIP_SPRITE.w / 2 - BULLET_SPRITE.w / 2, this.y - SHIP_SPRITE.h / 2 - BULLET_SPRITE.h / 2, 0, BULLET_SPEED));

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