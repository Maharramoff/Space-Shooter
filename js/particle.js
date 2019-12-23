class Particle
{
    constructor(x, y, dx, dy, livetime, alpha, particleindex)
    {
        this.y = y;
        this.x = x;
        this.dx = dx;
        this.dy = dy;
        this.lt = livetime;
        this.al = alpha;
        this.index = particleindex;
    }

    update()
    {
        this.x += this.dx;
        this.y += this.dy;

        // Decrease particle live time by dispose speed
        this.lt -= PARTICLE_FADEOUT_SPEED;

        // Decrease particle opacity
        if (this.lt % 10 <= 1)
        {
            this.al -= 0.1;
        }
    }

    liveTimeEnded()
    {
        return this.lt <= 0;
    }

    draw()
    {
        CONTEXT.save();
        CONTEXT.globalAlpha = this.al;
        CONTEXT.drawImage(
          SPRITE_SHEET,
          PARTICLE_SPRITE[this.index].sx, PARTICLE_SPRITE[this.index].sy,
          PARTICLE_SPRITE[this.index].sw, PARTICLE_SPRITE[this.index].sh,
          this.x, this.y,
          PARTICLE_SPRITE[this.index].w, PARTICLE_SPRITE[this.index].h
        );
        CONTEXT.restore();
    }
}