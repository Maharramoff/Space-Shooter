class Game
{
    constructor()
    {
        this.asteroidList = [];
        this.explosionList = [];
        this.particleList = [];
        this.timer = 0;
        this.particlesDisposeFrames = 0;
        this.alpha = 1;
        this.particleLength = PARTICLE_SPRITE.length;
        this.score = 0;
        this.bgImageY = 0;
        this.randomAsteroidIndex = null;
        this.gameRunning = false;
        this.gamePaused = false;
    }

    start()
    {
        if (this.gameRunning)
        {
            return false;
        }

        this.gameRunning = true;
        this._initShip();
        this._setMenu();
        this._mouseLeftClickListener();
        this._gameLoop();
    }

    pauseOrResumeGame()
    {
        if (this.gamePaused)
        {
            document.getElementById('game-paused').classList.remove('blink');
            requestAnimationFrame(() => this._gameLoop());
        }
        else
        {
            document.getElementById('game-paused').classList.add('blink');
        }

        this.gamePaused = !this.gamePaused;
    }

    _mouseLeftClick(event)
    {
        if (Helper.mouseLeftClick(event))
        {
            // Ship fires
            if (this.ship._fireBullet(event))
            {
                // Continue game animation if game paused
                if (this.gamePaused)
                {
                    this.pauseOrResumeGame();
                }
            }
        }
    }

    _gameLoop()
    {
        if (this.gamePaused)
        {
            return;
        }

        this._update();
        this._draw();
        requestAnimationFrame(() => this._gameLoop());
    }

    _update()
    {
        this.timer++;
        this.particlesDisposeFrames++;

        if (this.timer % ASTEROID_SPAWN_INTERVAL === 0)
        {
            this.randomAsteroidIndex = Math.floor(Math.random() * ASTEROID_SPRITE.length);

            this.asteroidList.push(new Asteroid(
              Math.random() * 600,
              -50,
              Helper.getRandomInt(-1, 1),
              Helper.getRandomInt(4, 6),
              this.randomAsteroidIndex
            ));
        }

        for (let i in this.asteroidList)
        {
            // Asteroids physics
            this.asteroidList[i].update();

            // Remove the asteroids that are out of stage.
            if (this.asteroidList[i].outOfBounds())
            {
                this.asteroidList.splice(i, 1);
            }

            // Check if target shot down
            for (let b in this.ship.bulletList)
            {
                if (this.asteroidList.hasOwnProperty(i) && this.ship.bulletList.hasOwnProperty(b))
                {
                    if (this.ship.bulletList[b].hit(this.asteroidList[i]))
                    {
                        // Target explosion
                        this.explosionList.push(new Explosion(
                          this.asteroidList[i].x + this.asteroidList[i].w / 2,
                          this.asteroidList[i].y,
                          this.asteroidList[i].dx,
                          this.asteroidList[i].dy,
                          'asteroid'
                        ));

                        // Particles
                        if (PARTICLE_ENABLED)
                        {
                            let particleObjects = [];

                            for (let p = 0; p < this.particleLength; p++)
                            {
                                particleObjects.push(new Particle(
                                  this.asteroidList[i].x + this.asteroidList[i].w / 2,
                                  this.asteroidList[i].y,
                                  this.asteroidList[i].dx + PARTICLE_SPEED * Math.cos((p * 360 / this.particleLength) * (Math.PI / 180)),
                                  this.asteroidList[i].dy + PARTICLE_SPEED * Math.sin((p * 360 / this.particleLength) * (Math.PI / 180)),
                                  PARTICLE_LIVETIME,
                                  this.alpha,
                                  p)
                                );
                            }

                            this.particleList.push(particleObjects);
                        }

                        // Remove collided elements
                        this.ship.bulletList.splice(b, 1);
                        this.asteroidList.splice(i, 1);

                        // Boom sound
                        new Audio(BOOM_SOUND).play().then(() => {});

                        // Update score
                        this._scoreUpdate();
                    }
                }
            }

            if (this.asteroidList.hasOwnProperty(i) && this.ship.collidesWith(this.asteroidList[i]) && this.ship.destroyed !== true)
            {
                // Ship explosion
                this.ship.destroy();
                this.explosionList.push(new Explosion(
                  this.ship.x + SHIP_SPRITE.w / 2,
                  this.ship.y,
                  this.asteroidList[i].dx / 1.5,
                  this.asteroidList[i].dy / 1.5,
                  'ship'
                ));
                this._gameOver();
            }
        }

        // Explosion physics
        for (let e in this.explosionList)
        {
            this.explosionList[e].update();

            // Clear explosion frame if delete flag is true
            if (this.explosionList[e].toDelete) this.explosionList.splice(e, 1);
        }

        // Bullet physics
        for (let b in this.ship.bulletList)
        {
            this.ship.bulletList[b].update();

            // Remove the bullets that are out of stage.
            if (this.ship.bulletList[b].outOfBounds()) this.ship.bulletList.splice(b, 1);
        }

        for (let p in this.particleList)
        {
            // If any defined value in current particle index
            if (Helper.countDefinedValues(this.particleList[p]))
            {
                for (let j in this.particleList[p])
                {
                    if (this.particleList[p][j] !== undefined)
                    {
                        // Particle physics
                        this.particleList[p][j].update();

                        // Remove the particles if live time ended
                        if (this.particleList[p][j].liveTimeEnded())
                        {
                            this.particleList[p][j] = undefined;
                        }
                    }
                }
            }
            else
            {
                this.particleList.splice(p, 1);
            }
        }

        if (this.timer > FRAME_RATE) this.timer = 0;
    }

    _draw()
    {
        // Draw background
        CONTEXT.drawImage(BACKGROUND_IMG, 0, this.bgImageY, 600, 600);
        CONTEXT.drawImage(BACKGROUND_IMG, 0, this.bgImageY - STAGE.y, 600, 600);

        // Update background height
        this.bgImageY += BACKGROUND_IMG_SCROLL_SPEED;

        // Reseting the images when the first image exits the screen
        if (this.bgImageY === STAGE.y)
        {
            this.bgImageY = 0;
        }

        // Draw explosions
        for (let e in this.explosionList)
        {
            this.explosionList[e].draw();
        }

        // Draw particles
        for (let p in this.particleList)
        {
            for (let j in this.particleList[p])
            {
                if (this.particleList[p][j] !== undefined)
                {
                    this.particleList[p][j].draw();
                }
            }
        }

        // Draw asteroids
        for (let i in this.asteroidList)
        {
            this.asteroidList[i].draw();
        }

        // Draw Ship
        this.ship.draw();

        // Draw bullets
        for (let b in this.ship.bulletList)
        {
            this.ship.bulletList[b].draw();
        }
    }

    _scoreUpdate()
    {
        this.score += SCORE_FACTOR;
        document.getElementById('game-score').innerText = '' + this.score;
    }

    _setMenu()
    {
        document.getElementById('game-starter').style.display = 'none';
        document.getElementById('game-stats').style.display = '';
        document.getElementById('game-score').innerText = '' + this.score;
    }

    _mouseLeftClickListener()
    {
        let self = this;

        CANVAS.addEventListener('mousedown', function (event)
        {
            self._mouseLeftClick(event);
        });
    }

    _initShip()
    {
        this.ship = new Ship(STAGE.x / 2 - SHIP_SPRITE.w / 2, STAGE.y - SHIP_SPRITE.h - 10);
    }

    _gameOver()
    {
        document.getElementById('game-over').style.display = '';
        this.gameRunning = false;
    }

}

