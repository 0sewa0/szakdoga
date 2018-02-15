//This files only purpose is to store static values in on place to preseve consistancy and provide a more readable code thats convenient to maintain

//UNIT parameters
const UNIT_RADIUS = 40;
const UNIT_BASE_COLOR = 'rgb(255, 214, 138)';
const UNIT_BASE_TRAIL_COLOR = 'rgb(102, 217, 237)';
const UNIT_SHIELD_COLOR = 'rgb(97, 175, 239)'; // TODO: Add block(shield) skill
const UNIT_STROKE_WEIGHT = 1;
const UNIT_FRICTION = 0.8;
const UNIT_MOVEMENT_SPEED = 2;
const UNIT_BOUNCE_OFF = 50;

//SHOT parameters
const SHOT_RADIUS = 7;
const SHOT_SPEED = 20;
const SHOT_BASE_COLOR = 'rgb(181, 232, 144)';
const SHOT_STROKE_WEIGHT = 1;
const SHOT_COOLDOWN = 100;   // The player can only shoot once in a period of time
const SHOT_TTL = 30;         // TIME TO LIVE


//MAP parameters
const CANVAS_MAP_X = 1000;
const CANVAS_MAP_Y = 1000;
const CANVAS_SIZE_X = window.innerWidth;
const CANVAS_SIZE_Y = window.innerHeight; 
const CANVAS_COLOR = 'rgb(69, 76, 89)'; 
const CANVAS_ZOOM_BASE = 64;
const CANVAS_ZOOM_MULTIPLIER = 3;

//TODO: Add span points
//TODO: Add obsticles 
const CANVAS_BORDER_COLOR = 'rgb(224, 108, 117)';
const CANVAS_BORDERS =
[

    //Top border
    {
        x1 : -CANVAS_MAP_X - UNIT_RADIUS,
        y1 : -CANVAS_MAP_Y - UNIT_RADIUS,

        x2 : CANVAS_MAP_X + UNIT_RADIUS,
        y2 : -CANVAS_MAP_Y - UNIT_RADIUS,
        
        
        x3 : CANVAS_MAP_X + UNIT_RADIUS,
        y3 : -CANVAS_MAP_Y - CANVAS_SIZE_Y / 2 - UNIT_RADIUS,

        x4 : -CANVAS_MAP_X - UNIT_RADIUS,
        y4 : -CANVAS_MAP_Y - CANVAS_SIZE_Y / 2 - UNIT_RADIUS
        
    },
    //Left border
    {
        x1 : -CANVAS_MAP_X - CANVAS_SIZE_X / 2 - UNIT_RADIUS,
        y1 : CANVAS_MAP_Y + CANVAS_SIZE_Y / 2 + UNIT_RADIUS,

        x2 : -CANVAS_MAP_X - UNIT_RADIUS,
        y2 : CANVAS_MAP_Y + CANVAS_SIZE_Y / 2 + UNIT_RADIUS,

        x3 : -CANVAS_MAP_X - UNIT_RADIUS,
        y3 : -CANVAS_MAP_Y - CANVAS_SIZE_Y / 2 - UNIT_RADIUS,

        x4 : -CANVAS_MAP_X - CANVAS_SIZE_X / 2 - UNIT_RADIUS,
        y4 : -CANVAS_MAP_Y - CANVAS_SIZE_Y / 2 - UNIT_RADIUS

       
    },
    //Right border
    {
        x1 : CANVAS_MAP_X + UNIT_RADIUS,
        y1 : CANVAS_MAP_Y + CANVAS_SIZE_Y / 2 + UNIT_RADIUS,

        x2 : CANVAS_MAP_X + CANVAS_SIZE_X / 2 + UNIT_RADIUS,
        y2 : CANVAS_MAP_Y + CANVAS_SIZE_Y / 2 + UNIT_RADIUS,
        
        x3 : CANVAS_MAP_X + CANVAS_SIZE_X / 2 + UNIT_RADIUS,
        y3 : -CANVAS_MAP_Y - CANVAS_SIZE_Y / 2 - UNIT_RADIUS,

        x4 : CANVAS_MAP_X + UNIT_RADIUS,
        y4 : -CANVAS_MAP_Y - CANVAS_SIZE_Y / 2 - UNIT_RADIUS
        
    },
    //Bottom border
    {
        x1 : -CANVAS_MAP_X - UNIT_RADIUS,
        y1 : CANVAS_MAP_Y + UNIT_RADIUS,

        x2 : CANVAS_MAP_X + UNIT_RADIUS,
        y2 : CANVAS_MAP_Y + UNIT_RADIUS,
    
        x3 : CANVAS_MAP_X + UNIT_RADIUS,
        y3 : CANVAS_MAP_Y + CANVAS_SIZE_Y / 2 + UNIT_RADIUS,
        
        x4 : -CANVAS_MAP_X - UNIT_RADIUS,
        y4 : CANVAS_MAP_Y + CANVAS_SIZE_Y / 2 + UNIT_RADIUS
        
    }


]
const CANVAS_OBSTACLES_COLOR = 'rgb(171, 178, 191)';
const CANVAS_OBSTACLES = 
[
    //down_left: 
    {
		x1: -CANVAS_MAP_X + 100,
		y1: CANVAS_MAP_Y - 100,
		x2: -CANVAS_MAP_X + 100,
		y2: CANVAS_MAP_Y - 100 * 2,
		x3: -CANVAS_MAP_X + 100 * 2,
		y3: CANVAS_MAP_Y - 100 * 2,
		x4: -CANVAS_MAP_X + 100 * 2,
        y4: CANVAS_MAP_Y - 100,
    },
    //down_right:
    {
        x1 : CANVAS_MAP_X - 100,
        y1 : CANVAS_MAP_Y - 100,
        x2 : CANVAS_MAP_X - 100,
        y2 : CANVAS_MAP_Y - 100 - 100,
        x3 : CANVAS_MAP_X - 100 - 100,
        y3 : CANVAS_MAP_Y - 100 - 100,
        x4 : CANVAS_MAP_X - 100 - 100,
        y4 : CANVAS_MAP_Y - 100,
    },
    //up_left:
    {
        x1 : -CANVAS_MAP_X + 100,
        y1 : -CANVAS_MAP_Y + 100,
        x2 : -CANVAS_MAP_X + 100 + 100,
        y2 : -CANVAS_MAP_Y + 100,
        x3 : -CANVAS_MAP_X + 100 + 100,
        y3 : -CANVAS_MAP_Y + 100 + 100,
        x4 : -CANVAS_MAP_X + 100,
        y4 : -CANVAS_MAP_Y + 100 + 100,
    },
    //up_right:
    {
        x1 : CANVAS_MAP_X - 100,
        y1 : -CANVAS_MAP_Y + 100,
        x2 : CANVAS_MAP_X - 100 - 100,
        y2 : -CANVAS_MAP_Y + 100,
        x3 : CANVAS_MAP_X - 100 - 100,
        y3 : -CANVAS_MAP_Y + 100 + 100,
        x4 : CANVAS_MAP_X - 100,
        y4 : -CANVAS_MAP_Y + 100 + 100,
    }
    
]
