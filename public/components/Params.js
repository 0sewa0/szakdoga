//This files only purpose is to store static values in on place to preseve consistancy and provide a more readable code thats convenient to maintain

//UNIT parameters
const UNIT_RADIUS = 40;
const UNIT_BASE_COLOR = 'rgb(255, 214, 138)';//#ffd68a
const UNIT_BASE_TRAIL_COLOR = 'rgb(102, 217, 237)';//#66d9ed
const UNIT_INACTIVE_COLOR = 'rgb(224, 108, 117)'; //#e06c75
const UNIT_STROKE_WEIGHT = 1;
const UNIT_FRICTION = 0.88;
const UNIT_MOVEMENT_SPEED = 1;
const UNIT_BOUNCE_OFF = 2;

const UNIT_SHIELD_COLOR = 'rgb(97, 175, 239)';//#61afef
const UNIT_SHIELD_CHARGE = 20;
const UNIT_SHIELD_CHARGE_RATE = 0.1;
const UNIT_SHIELD_CHARGE_LOSS = 1;
const UNIT_SHIELD_STROKE_WEIGHT = 10;

//SHOT parameters
const SHOT_RADIUS = 7;
const SHOT_SPEED = 20;
const SHOT_BASE_COLOR = 'rgb(181, 232, 144)';//#b5e890
const SHOT_STROKE_WEIGHT = 1;
const SHOT_COOLDOWN = 100; // The player can only shoot once in a period of time
const SHOT_TTL = 20; // TIME TO LIVE


//MAP parameters
const CANVAS_MAP_X = 1000;
const CANVAS_MAP_Y = 1000;
const CANVAS_SIZE_X = window.innerWidth;
const CANVAS_SIZE_Y = window.innerHeight;
const CANVAS_COLOR = 'rgb(69, 76, 89)';//#454c59
const CANVAS_ZOOM_BASE = 64;
const CANVAS_ZOOM_MULTIPLIER = 3;

const CANVAS_TEXT_COLOR = 'rgb(69, 76, 89)'; //#454c59

const CANVAS_BORDER_COLOR = 'rgb(224, 108, 117)'; //#e06c75
const CANVAS_BORDERS = [

    //Top border
    {
        x1: -CANVAS_MAP_X - UNIT_RADIUS,
        y1: -CANVAS_MAP_Y - UNIT_RADIUS,

        x2: CANVAS_MAP_X + UNIT_RADIUS,
        y2: -CANVAS_MAP_Y - UNIT_RADIUS,


        x3: CANVAS_MAP_X + UNIT_RADIUS,
        y3: -CANVAS_MAP_Y - CANVAS_SIZE_Y / 2 - UNIT_RADIUS,

        x4: -CANVAS_MAP_X - UNIT_RADIUS,
        y4: -CANVAS_MAP_Y - CANVAS_SIZE_Y / 2 - UNIT_RADIUS

    },
    //Left border
    {
        x1: -CANVAS_MAP_X - CANVAS_SIZE_X / 2 - UNIT_RADIUS,
        y1: CANVAS_MAP_Y + CANVAS_SIZE_Y / 2 + UNIT_RADIUS,

        x2: -CANVAS_MAP_X - UNIT_RADIUS,
        y2: CANVAS_MAP_Y + CANVAS_SIZE_Y / 2 + UNIT_RADIUS,

        x3: -CANVAS_MAP_X - UNIT_RADIUS,
        y3: -CANVAS_MAP_Y - CANVAS_SIZE_Y / 2 - UNIT_RADIUS,

        x4: -CANVAS_MAP_X - CANVAS_SIZE_X / 2 - UNIT_RADIUS,
        y4: -CANVAS_MAP_Y - CANVAS_SIZE_Y / 2 - UNIT_RADIUS


    },
    //Right border
    {
        x1: CANVAS_MAP_X + UNIT_RADIUS,
        y1: CANVAS_MAP_Y + CANVAS_SIZE_Y / 2 + UNIT_RADIUS,

        x2: CANVAS_MAP_X + CANVAS_SIZE_X / 2 + UNIT_RADIUS,
        y2: CANVAS_MAP_Y + CANVAS_SIZE_Y / 2 + UNIT_RADIUS,

        x3: CANVAS_MAP_X + CANVAS_SIZE_X / 2 + UNIT_RADIUS,
        y3: -CANVAS_MAP_Y - CANVAS_SIZE_Y / 2 - UNIT_RADIUS,

        x4: CANVAS_MAP_X + UNIT_RADIUS,
        y4: -CANVAS_MAP_Y - CANVAS_SIZE_Y / 2 - UNIT_RADIUS

    },
    //Bottom border
    {
        x1: -CANVAS_MAP_X - UNIT_RADIUS,
        y1: CANVAS_MAP_Y + UNIT_RADIUS,

        x2: CANVAS_MAP_X + UNIT_RADIUS,
        y2: CANVAS_MAP_Y + UNIT_RADIUS,

        x3: CANVAS_MAP_X + UNIT_RADIUS,
        y3: CANVAS_MAP_Y + CANVAS_SIZE_Y / 2 + UNIT_RADIUS,

        x4: -CANVAS_MAP_X - UNIT_RADIUS,
        y4: CANVAS_MAP_Y + CANVAS_SIZE_Y / 2 + UNIT_RADIUS

    }


]

const CANVAS_OBSTACLES_COLOR = 'rgb(171, 178, 191)'; //#abb2bf
const CANVAS_OBSTACLES_MAP_RATIO_X = CANVAS_MAP_X / 10;
const CANVAS_OBSTACLES_MAP_RATIO_Y = CANVAS_MAP_Y / 10;
const CANVAS_OBSTACLES_CENTER_PIECE = {
    x: 0,
    y: 0,
    r1: CANVAS_OBSTACLES_MAP_RATIO_X * 4,
    r2: CANVAS_OBSTACLES_MAP_RATIO_Y * 4
}
const CANVAS_OBSTACLES = [
    //down_left_horizontal:
    {
        x1: -CANVAS_MAP_X + CANVAS_OBSTACLES_MAP_RATIO_X, // down left corner
        y1: CANVAS_MAP_Y - CANVAS_OBSTACLES_MAP_RATIO_Y,

        x2: -CANVAS_MAP_X + CANVAS_OBSTACLES_MAP_RATIO_X, // top left corner
        y2: CANVAS_MAP_Y - CANVAS_OBSTACLES_MAP_RATIO_Y * 2,

        x3: -CANVAS_MAP_X + CANVAS_OBSTACLES_MAP_RATIO_X * 9, // top right corner
        y3: CANVAS_MAP_Y - CANVAS_OBSTACLES_MAP_RATIO_Y * 2,

        x4: -CANVAS_MAP_X + CANVAS_OBSTACLES_MAP_RATIO_X * 9, // down right corner
        y4: CANVAS_MAP_Y - CANVAS_OBSTACLES_MAP_RATIO_Y
    },
    //down_left_vertical:
    {
        x1: -CANVAS_MAP_X + CANVAS_OBSTACLES_MAP_RATIO_X * 5, // down left corner
        y1: CANVAS_MAP_Y - CANVAS_OBSTACLES_MAP_RATIO_Y,

        x2: -CANVAS_MAP_X + CANVAS_OBSTACLES_MAP_RATIO_X * 5, // top left corner
        y2: CANVAS_MAP_Y - CANVAS_OBSTACLES_MAP_RATIO_Y * 7,

        x3: -CANVAS_MAP_X + CANVAS_OBSTACLES_MAP_RATIO_X * 7, // top right corner
        y3: CANVAS_MAP_Y - CANVAS_OBSTACLES_MAP_RATIO_Y * 7,

        x4: -CANVAS_MAP_X + CANVAS_OBSTACLES_MAP_RATIO_X * 7, // down right corner
        y4: CANVAS_MAP_Y - CANVAS_OBSTACLES_MAP_RATIO_Y
    },
    //down_right_horizontal:
    {
        x1: CANVAS_MAP_X - CANVAS_OBSTACLES_MAP_RATIO_X * 9, // down left corner
        y1: CANVAS_MAP_Y - CANVAS_OBSTACLES_MAP_RATIO_Y,

        x2: CANVAS_MAP_X - CANVAS_OBSTACLES_MAP_RATIO_X * 9, //top left corner
        y2: CANVAS_MAP_Y - CANVAS_OBSTACLES_MAP_RATIO_Y * 2,

        x3: CANVAS_MAP_X - CANVAS_OBSTACLES_MAP_RATIO_X, //top right corner
        y3: CANVAS_MAP_Y - CANVAS_OBSTACLES_MAP_RATIO_Y * 2,

        x4: CANVAS_MAP_X - CANVAS_OBSTACLES_MAP_RATIO_X, //down right corner
        y4: CANVAS_MAP_Y - CANVAS_OBSTACLES_MAP_RATIO_Y
    },
    //down_right_vertical:
    {
        x1: CANVAS_MAP_X - CANVAS_OBSTACLES_MAP_RATIO_X * 7, // down left corner
        y1: CANVAS_MAP_Y - CANVAS_OBSTACLES_MAP_RATIO_Y,

        x2: CANVAS_MAP_X - CANVAS_OBSTACLES_MAP_RATIO_X * 7, //top left corner
        y2: CANVAS_MAP_Y - CANVAS_OBSTACLES_MAP_RATIO_Y * 7,

        x3: CANVAS_MAP_X - CANVAS_OBSTACLES_MAP_RATIO_X * 5, //top right corner
        y3: CANVAS_MAP_Y - CANVAS_OBSTACLES_MAP_RATIO_Y * 7,

        x4: CANVAS_MAP_X - CANVAS_OBSTACLES_MAP_RATIO_X * 5, //down right corner
        y4: CANVAS_MAP_Y - CANVAS_OBSTACLES_MAP_RATIO_Y
    },
    //up_left_horizontal:
    {
        x1: -CANVAS_MAP_X + CANVAS_OBSTACLES_MAP_RATIO_X, //down left corner
        y1: -CANVAS_MAP_Y + CANVAS_OBSTACLES_MAP_RATIO_Y * 2,

        x2: -CANVAS_MAP_X + CANVAS_OBSTACLES_MAP_RATIO_X, //top left corner
        y2: -CANVAS_MAP_Y + CANVAS_OBSTACLES_MAP_RATIO_Y,

        x3: -CANVAS_MAP_X + CANVAS_OBSTACLES_MAP_RATIO_X * 9, //top right corner
        y3: -CANVAS_MAP_Y + CANVAS_OBSTACLES_MAP_RATIO_Y,

        x4: -CANVAS_MAP_X + CANVAS_OBSTACLES_MAP_RATIO_X * 9, // down right corner
        y4: -CANVAS_MAP_Y + CANVAS_OBSTACLES_MAP_RATIO_Y * 2
    },
    //up_left_vertical:
    {
        x1: -CANVAS_MAP_X + CANVAS_OBSTACLES_MAP_RATIO_X * 5, //down left corner
        y1: -CANVAS_MAP_Y + CANVAS_OBSTACLES_MAP_RATIO_Y * 7,

        x2: -CANVAS_MAP_X + CANVAS_OBSTACLES_MAP_RATIO_X * 5, //top left corner
        y2: -CANVAS_MAP_Y + CANVAS_OBSTACLES_MAP_RATIO_Y,

        x3: -CANVAS_MAP_X + CANVAS_OBSTACLES_MAP_RATIO_X * 7, //top right corner
        y3: -CANVAS_MAP_Y + CANVAS_OBSTACLES_MAP_RATIO_Y,

        x4: -CANVAS_MAP_X + CANVAS_OBSTACLES_MAP_RATIO_X * 7, // down right corner
        y4: -CANVAS_MAP_Y + CANVAS_OBSTACLES_MAP_RATIO_Y * 7
    },
    //up_right_horizontal:
    {
        x1: CANVAS_MAP_X - CANVAS_OBSTACLES_MAP_RATIO_X * 9, // down left corner
        y1: -CANVAS_MAP_Y + CANVAS_OBSTACLES_MAP_RATIO_Y * 2,

        x2: CANVAS_MAP_X - CANVAS_OBSTACLES_MAP_RATIO_X * 9, //top left corner
        y2: -CANVAS_MAP_Y + CANVAS_OBSTACLES_MAP_RATIO_Y,

        x3: CANVAS_MAP_X - CANVAS_OBSTACLES_MAP_RATIO_X, // top right corner
        y3: -CANVAS_MAP_Y + CANVAS_OBSTACLES_MAP_RATIO_Y,

        x4: CANVAS_MAP_X - CANVAS_OBSTACLES_MAP_RATIO_X, //down right corner
        y4: -CANVAS_MAP_Y + CANVAS_OBSTACLES_MAP_RATIO_Y * 2
    },
    //up_right_vercital:
    {
        x1: CANVAS_MAP_X - CANVAS_OBSTACLES_MAP_RATIO_X * 7, // down left corner
        y1: -CANVAS_MAP_Y + CANVAS_OBSTACLES_MAP_RATIO_Y * 7,

        x2: CANVAS_MAP_X - CANVAS_OBSTACLES_MAP_RATIO_X * 7, //top left corner
        y2: -CANVAS_MAP_Y + CANVAS_OBSTACLES_MAP_RATIO_Y,

        x3: CANVAS_MAP_X - CANVAS_OBSTACLES_MAP_RATIO_X * 5, // top right corner
        y3: -CANVAS_MAP_Y + CANVAS_OBSTACLES_MAP_RATIO_Y,

        x4: CANVAS_MAP_X - CANVAS_OBSTACLES_MAP_RATIO_X * 5, //down right corner
        y4: -CANVAS_MAP_Y + CANVAS_OBSTACLES_MAP_RATIO_Y * 7
    }
]

const CANVAS_SPAWN_POINTS = function () {
    return Array(12).fill().map((_, i) => {
        let vector = createVector(UNIT_RADIUS * 4, 0);
        vector = vector.rotate((i + 1) * ((2 * PI) / 12));
        return vector;
    });
}