class Ship
{
    newX;
    newY;
    launcherSide = 'left';

    constructor(startX, startY, shipType, shipLevel)
    {
        this.shipType = shipType;
        this.shipLevel = shipLevel;
        this.shipSprite = SHIP_SPRITE[this.shipType][this.shipLevel];
        this.x = startX / 2 - this.shipSprite.w / 2;
        this.y = startY - this.shipSprite.h - 5;
        this.radius = (this.shipSprite.w + this.shipSprite.h) / 4 //TODO
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
              this.shipSprite.sx, this.shipSprite.sy,
              this.shipSprite.sw, this.shipSprite.sh,
              this.x,
              this.y,
              this.shipSprite.w, this.shipSprite.h);
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
        this.newX = event.offsetX - this.shipSprite.w / 2;
        this.newY = event.offsetY - this.shipSprite.h / 2;

        if (this.newX <= 0)
        {
            this.newX = 0;
        }
        else if (this.newX + this.shipSprite.w >= STAGE.x)
        {
            this.newX = STAGE.x - this.shipSprite.w;
        }

        if (this.newY + this.shipSprite.h >= STAGE.y)
        {
            this.newY = STAGE.y - this.shipSprite.h;
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
        this.bulletList.push(new Bullet(this.x, this.y, 0, BULLET_SPEED, this.shipSprite, this.launcherSide));
        this.launcherSide = this.launcherSide === 'left' ? 'right' : 'left';

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