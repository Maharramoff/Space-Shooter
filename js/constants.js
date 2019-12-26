// Global constants
const STAGE = { width: 750, height: 750 };
const CANVAS = document.getElementById('game');
const CONTEXT = CANVAS.getContext('2d');
CANVAS.width = STAGE.width;
CANVAS.height = STAGE.height;
// Game defaults
const FRAME_RATE = 30;
const ASTEROID_SPAWN_INTERVAL = 30;
const EXPLOSION_FRAME_INTERVAL = 10;
const PARTICLE_ENABLED = false;
const PARTICLE_LIVETIME = 100;
const PARTICLE_FADEOUT_SPEED = 3;
const PARTICLE_SCALE_FACTOR = 2.5;
const PARTICLE_SPEED = 1;
const BULLET_SPEED = 10;
const SCORE_FACTOR = 2;

// Sounds
const BOOM_SOUND = 'sound/asteroid-explosion.mp3';
const FIRE_SOUND = 'sound/fire.mp3';
const SHIP_BOOM_SOUND = 'sound/ship-explosion.mp3';
const GAME_OVER_SOUND = 'sound/game-over.mp3';

// Background image
const BACKGROUND_IMG = new Image();
const BACKGROUND_IMG_SCROLL_SPEED = 3;
BACKGROUND_IMG.src = 'img/space.png';

// Main sprite sheet
const SPRITE_SHEET = new Image();
SPRITE_SHEET.src = 'img/sheet.png';

// Ship sprite sheet
const SHIP_SPRITE_SHEET = new Image();
SHIP_SPRITE_SHEET.src = 'img/ship-sheet.png';

// Explosion sprite sheet
const EXPLOSION_SPRITE_SHEET = { 'asteroid': new Image(), 'ship': new Image() };
EXPLOSION_SPRITE_SHEET.asteroid.src = 'img/asteroid-explosion.png';
EXPLOSION_SPRITE_SHEET.ship.src = 'img/ship-explosion.png';

// Sprites properties
//const SHIP_SPRITE = { sx: 0, sy: 942, sw: 112, sh: 74, h: 40, w: 60 };
const SHIP_SPRITE = {
    blue: [
        {
            sx: 63, sy: 86, sw: 80, sh: 64, w: 64, h: 80,
            launchers:
              {
                  small:
                    {
                        left:
                          {
                              sx: 83, sy: 231, sw: 6
                          },
                        right:
                          {
                              sx: 118, sy: 231, sw: 6
                          }
                    }
              }
        },
    ],
    red : [
        {
            sx: 68, sy: 216, sw: 70, sh: 66, w: 70, h: 66,
            launchers:
              {
                  small:
                    {
                        left:
                          {
                              sx: 83, sy: 231, sw: 6
                          },
                        right:
                          {
                              sx: 118, sy: 231, sw: 6
                          }
                    }
              }
        },
    ]

};
//const BULLET_SPRITE = { sx: 856, sy: 602, sw: 9, sh: 37, h: 37, w: 9 };
const BULLET_SPRITE = { radius: 4, h: 8, w: 8 };
const EXPLOSION_SPRITE = {
    'ship'    : [
        { sx: 14, sy: 40, sw: 100, sh: 100, h: 100, w: 100 },
        { sx: 118, sy: 40, sw: 100, sh: 100, h: 100, w: 100 },
        { sx: 220, sy: 40, sw: 100, sh: 100, h: 100, w: 100 },
        { sx: 330, sy: 40, sw: 100, sh: 100, h: 100, w: 100 },
        { sx: 14, sy: 165, sw: 100, sh: 100, h: 100, w: 100 },
        { sx: 118, sy: 165, sw: 100, sh: 100, h: 100, w: 100 },
        { sx: 220, sy: 165, sw: 100, sh: 100, h: 100, w: 100 },
        { sx: 330, sy: 165, sw: 100, sh: 100, h: 100, w: 100 },
    ],
    'asteroid': [
        { sx: 10, sy: 130, sw: 55, sh: 55, h: 55, w: 55 },
        { sx: 69, sy: 191, sw: 55, sh: 55, h: 55, w: 55 },
        { sx: 127, sy: 191, sw: 55, sh: 55, h: 55, w: 55 },
        { sx: 185, sy: 191, sw: 55, sh: 55, h: 55, w: 55 },
        { sx: 243, sy: 191, sw: 55, sh: 55, h: 55, w: 55 },

    ]
};
const PARTICLE_SPRITE = [
    { sx: 396, sy: 414, sw: 29, sh: 25, h: 29, w: 25 },
    { sx: 602, sy: 646, sw: 15, sh: 15, h: 15, w: 15 },
    { sx: 365, sy: 814, sw: 16, sh: 18, h: 16, w: 18 },
    { sx: 407, sy: 263, sw: 26, sh: 25, h: 26, w: 25 },
    { sx: 396, sy: 414, sw: 29, sh: 25, h: 29, w: 25 },
    { sx: 602, sy: 646, sw: 15, sh: 15, h: 15, w: 15 },
    { sx: 365, sy: 814, sw: 16, sh: 18, h: 16, w: 18 },
];
const ASTEROID_SPRITE = [

    { sx: 0, sy: 520, sw: 119, sh: 97, h: 45, w: 55 },
    { sx: 326, sy: 453, sw: 99, sh: 95, h: 53, w: 55 },
    { sx: 224, sy: 664, sw: 102, sh: 84, h: 45, w: 55 },

    { sx: 0, sy: 618, sw: 119, sh: 97, h: 45, w: 55 },
    { sx: 326, sy: 549, sw: 99, sh: 95, h: 53, w: 55 },
    { sx: 224, sy: 748, sw: 100, sh: 84, h: 46, w: 55 },
];