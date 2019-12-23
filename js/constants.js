// Global constants
const CANVAS = document.getElementById('game');
const CONTEXT = CANVAS.getContext('2d');
const STAGE = { x: 600, y: 600 };

// Game defaults
const FRAME_RATE = 30;
const ASTEROID_SPAWN_INTERVAL = 30;
const EXPLOSION_FRAME_INTERVAL = 10;
const PARTICLE_LIVETIME = 100;
const PARTICLE_FADEOUT_SPEED = 3;
const BULLET_SPEED = 15;
const SCORE_FACTOR = 2;

// Sounds
const BOOM_SOUND = 'sound/boom.mp3';
const FIRE_SOUND = 'sound/fire.mp3';

// Background image
const BACKGROUND_IMG = new Image();
const BACKGROUND_IMG_SCROLL_SPEED = 3;
BACKGROUND_IMG.src = 'img/space.png';

// Main sprite sheet
const SPRITE_SHEET = new Image();
SPRITE_SHEET.src = 'img/sheet.png';

// Explosion sprite sheet
const EXPLOSION_SPRITE_SHEET = new Image();
EXPLOSION_SPRITE_SHEET.src = 'img/explosion.png';

// Sprites properties
const SHIP_SPRITE = { sx: 0, sy: 942, sw: 112, sh: 74, h: 40, w: 60 };
const BULLET_SPRITE = { sx: 856, sy: 602, sw: 9, sh: 37, h: 37, w: 9 };
const EXPLOSION_SPRITE = [
/*    { sx: 603, sy: 600, sw: 46, sh: 46, h: 46, w: 46 },
    { sx: 581, sy: 661, sw: 46, sh: 46, h: 46, w: 46 },*/
    { sx: 18, sy: 76, sw: 40, sh: 48, h: 40, w: 48 },
    { sx: 68, sy: 70, sw: 55, sh: 55, h: 55, w: 55 },
    { sx: 126, sy: 70, sw: 55, sh: 55, h: 55, w: 55 },
    { sx: 185, sy: 70, sw: 55, sh: 55, h: 55, w: 55 },
    { sx: 243, sy: 70, sw: 55, sh: 55, h: 55, w: 55 },
];
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
    { sx: 0, sy: 618, sw: 119, sh: 97, h: 45, w: 55 },
    { sx: 326, sy: 549, sw: 99, sh: 95, h: 53, w: 55 },
    { sx: 224, sy: 748, sw: 100, sh: 84, h: 46, w: 55 },
];