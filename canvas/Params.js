//This files only purpose is to store static values in on place to preseve consistancy and provide a more readable code thats convenient to maintain

//MAP parameters
const CANVAS_BORDER_COLOR = 'rgb(128, 0, 0)';
const CANVAS_MAP_X = 1000;
const CANVAS_MAP_Y = 1000;
const CANVAS_SIZE_X = window.innerWidth;
const CANVAS_SIZE_Y = window.innerHeight; 
const CANVAS_COLOR = 60; 
const CANVAS_ZOOM_BASE = 64;
const CANVAS_ZOOM_MULTIPLIER = 3;
    //TODO: Add span points
    //TODO: Add obsticles 
const CANVAS_OBSTACLES_HEIGHT = 200; 
const CANVAS_OBSTACLES_WIDTH = 500;


//UNIT parameters
const UNIT_RADIUS = 40;
const UNIT_BASE_COLOR = 'rgb(70, 162, 185)';
const UNIT_BASE_TRAIL_COLOR = 'rgb(70, 120, 185)';
const UNIT_STROKE_WEIGHT = 1;
const UNIT_FRICTION = 0.8;
const UNIT_MOVEMENT_SPEED = 2;
const UNIT_BOUNCE_OFF = 50;

//SHOT parameters
const SHOT_RADIUS = 7;
const SHOT_SPEED = 20;
const SHOT_BASE_COLOR = 'rgb(54, 140, 226)';
const SHOT_STROKE_WEIGHT = 1;
const SHOT_COOLDOWN = 100;   // The player can only shoot once in a period of time
const SHOT_TTL = 30;         // TIME TO LIVE