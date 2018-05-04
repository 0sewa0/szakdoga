import * as params from './params'
import Shot from './shot'

export default class Unit {

    constructor(startX, startY, user, id, name, spawn, color = params.UNIT_BASE_COLOR, trailColor = params.UNIT_BASE_TRAIL_COLOR) {
        this.user = user; // The id of the user controlling this unit
        this.name = name;
        this.spawn = spawn;
        this.id = id;
        this.shots = []; //All active shots of the unit
        this.shotIdCounter = 0;
        this.score = 0; //The points collected during the game

        this.bodyPosition = p5.createVector(startX, startY);
        this.bodyColor = color;
        this.bodyIMG = null;

        this.velocity = p5.createVector(0, 0);

        this.lastShot = 0;
        this.shieldIMG = null;
        this.shieldCharge = params.UNIT_SHIELD_CHARGE;
        this.shield = false;
        this.shieldFull = true;

        this.trailColor = trailColor;
    }

    show(inGame = true) {
        this.drawBody(inGame);
        if (this.lastShot != 0) {
            this.lastShot--;
        }
    }

    /**
     * Handles the key presses
     * Handles the shield usage
     * Handles the actual movement
        -   Maintains a velocity vector which stores the direction where the player is headed at what speed
        -   Slows the player to a stop using friction on both axis
     * Calls for the boundary check
    */
    move() {

        let keysDown = 0;
        if (p5.keyIsDown(65)) // LEFT == A
        {
            keysDown++;
            this.velocity.x -= params.UNIT_MOVEMENT_SPEED / keysDown;
        }
        if (p5.keyIsDown(68)) // RIGHT == D
        {
            keysDown++;
            this.velocity.x += params.UNIT_MOVEMENT_SPEED / keysDown;
        }
        if (p5.keyIsDown(87)) // UP == W
        {
            keysDown++;
            this.velocity.y -= params.UNIT_MOVEMENT_SPEED / keysDown;
        }
        if (p5.keyIsDown(83)) // DOWN == S
        {
            keysDown++;
            this.velocity.y += params.UNIT_MOVEMENT_SPEED / keysDown;
        }
        (p5.keyIsDown(32) && this.shieldCharge > 0 && this.shieldFull) ? this.shieldOn(): this.shieldOff();

        this.velocity.x *= params.UNIT_FRICTION;
        this.velocity.y *= params.UNIT_FRICTION;
        this.bodyPosition.add(this.velocity);
        this.boundaryCheck();

    }

    /**
     *Draws the trail effect by drawing smaller circles on previus locations with a different color
     */
    drawTrail() {
        p5.push();
            p5.noStroke();
            p5.fill(this.trailColor);
            for (let index = 1; index < 4; index++) {
                p5.ellipse(this.bodyPosition.x - this.velocity.x * index, this.bodyPosition.y - this.velocity.y * index, (params.UNIT_RADIUS * 2) - (index * 4.5), (params.UNIT_RADIUS * 2) - (index * 4.5));
            }
        p5.pop();
    }

    displayInfoText(inGame = true) {
        p5.push();
            p5.textAlign(p5.CENTER);
            p5.textStyle(p5.BOLD);
            p5.fill(params.CANVAS_TEXT_COLOR);
            if(inGame) {
                const div = (this.name.length > 4) ? this.name.length : 4;
                p5.textSize(( params.UNIT_RADIUS / div )*3);
                p5.text(`${this.name}`, this.bodyPosition.x, this.bodyPosition.y);
                p5.textSize(( params.UNIT_RADIUS / 4 )*3);
                p5.text(`${this.score}`, this.bodyPosition.x, this.bodyPosition.y + 35);
            }
            else {
                p5.textSize(params.UNIT_RADIUS / 3);
                p5.text(`PRESS\nENTER`, this.bodyPosition.x, this.bodyPosition.y);
            }
        p5.pop();
    }
    /**
     * Turns the shield on
     * Drains the shield
     */
    shieldOn() {
        this.shield = true;
        this.shieldCharge -= params.UNIT_SHIELD_CHARGE_LOSS;
    }

    /**
     * Turns the shield off
     * Recharges the shield
     */
    shieldOff() {
        this.shield = false;
        this.shieldFull = false;
        (this.shieldCharge < params.UNIT_SHIELD_CHARGE) ? this.shieldCharge += params.UNIT_SHIELD_CHARGE_RATE: this.shieldFull = true;
    }

    /**
     * It checks:
        -   Is the player on the map? => Prevents the player to leave it
        -   Is the player touching any of the obstacles? => Prevents the player to enter it (however it can happen, but then the player can easly leave it)
    */
    boundaryCheck() {
        if (this.bodyPosition.x > params.CANVAS_MAP_X) {
            this.bodyPosition.x = params.CANVAS_MAP_X;
        }
        if (this.bodyPosition.x < -params.CANVAS_MAP_X) {
            this.bodyPosition.x = -params.CANVAS_MAP_X;
        }
        if (this.bodyPosition.y > params.CANVAS_MAP_Y) {
            this.bodyPosition.y = params.CANVAS_MAP_Y;
        }
        if (this.bodyPosition.y < -params.CANVAS_MAP_Y) {
            this.bodyPosition.y = -params.CANVAS_MAP_Y;
        }
        params.CANVAS_OBSTACLES.forEach(obstacle => {
            if (this.bodyPosition.x > obstacle.x1 - params.UNIT_RADIUS + 10 &&
                this.bodyPosition.x < obstacle.x4 + params.UNIT_RADIUS - 10 &&
                this.bodyPosition.y < obstacle.y1 + params.UNIT_RADIUS - 10 &&
                this.bodyPosition.y > obstacle.y2 - params.UNIT_RADIUS + 10) {
                //This 'line' of code makes it possible that when you touch the border of an obstacle, it will stop you while having a smooth rubber like effect
                    (this.bodyPosition.x < obstacle.x1) ? this.bodyPosition.x = p5.lerp(this.bodyPosition.x, obstacle.x1 - params.UNIT_RADIUS, 0.2) :
                    (this.bodyPosition.x > obstacle.x4) ? this.bodyPosition.x = p5.lerp(this.bodyPosition.x, obstacle.x4 + params.UNIT_RADIUS, 0.2) :
                    (this.bodyPosition.y > obstacle.y1) ? this.bodyPosition.y = p5.lerp(this.bodyPosition.y, obstacle.y1 + params.UNIT_RADIUS, 0.2) :
                    (this.bodyPosition.y < obstacle.y2) ? this.bodyPosition.y = p5.lerp(this.bodyPosition.y, obstacle.y2 - params.UNIT_RADIUS, 0.2) : false;
            }
        });
        const distance_from_center = this.bodyPosition.dist(p5.createVector(params.CANVAS_OBSTACLES_CENTER_PIECE.x, params.CANVAS_OBSTACLES_CENTER_PIECE.y));
        if (distance_from_center < params.UNIT_RADIUS + params.CANVAS_OBSTACLES_CENTER_PIECE.r1 / 2) {
            const angle = this.bodyPosition.heading();
            const push = p5.createVector(1 * Math.cos(angle), 1 * Math.sin(angle)).mult(3 * params.CANVAS_OBSTACLES_CENTER_PIECE.r1 / 5);
            this.bodyPosition = this.bodyPosition.lerp(push, 0.2);
        }
    }

    /**
     * Checks if the player is allowed to shoot (again)
     * If true, it shoots by creating a new shot and adding it to the array and resets the cooldown
     */
    shoot() {
        if (this.lastShot == 0) {
            const new_shot = new Shot(this.bodyPosition, this.user, this.shotIdCounter++);
            this.shots.push(new_shot);
            this.lastShot = params.SHOT_COOLDOWN;
            return new_shot;
        }
    }

    /**
     * First it calculates the distance between the unit and the shot
     * If the distance is smaller than the sum of the two objects radii(plural of radius) then the two object intesect
     */
    getHit(shot) {
        const distance = this.bodyPosition.dist(shot.position);
        if (distance < params.UNIT_RADIUS + params.SHOT_RADIUS) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * First it calculates the distance between the unit and the other unit
     * Then if the distance is smaller than the sum of the two objects radii(plural of radius) then the two object intesect
     */
    touching(other) {
        const distance = this.bodyPosition.dist(other.bodyPosition);
        if (distance < params.UNIT_RADIUS * 2) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * The options which determan the way we draw objects are stored globaly, and we want to 'protect' them from so we store them in a stack temporarly. (push)
     * Then we draw our special object with different options
     * Then we restore the options to what they were before (pop)
     */
    drawBody(inGame = true) {
        this.drawTrail();
        p5.push();
            if(inGame) {
                if(this.bodyIMG) {
                    p5.image(this.bodyIMG, this.bodyPosition.x - params.UNIT_RADIUS, this.bodyPosition.y - params.UNIT_RADIUS, params.UNIT_RADIUS * 2, params.UNIT_RADIUS * 2);
                } else {
                    p5.fill(this.bodyColor)
                    p5.stroke(this.bodyColor);
                    p5.strokeWeight(params.UNIT_STROKE_WEIGHT);
                    p5.ellipse(this.bodyPosition.x, this.bodyPosition.y, params.UNIT_RADIUS * 2, params.UNIT_RADIUS * 2);
                    this.displayInfoText(inGame);
                }
                if(this.shield) {
                    if(this.shieldIMG) {
                        p5.image(this.shieldIMG, this.bodyPosition.x - params.UNIT_RADIUS * 1.25, this.bodyPosition.y - params.UNIT_RADIUS * 1.25, params.UNIT_RADIUS * 2.5, params.UNIT_RADIUS * 2.5);
                    } else {
                        p5.stroke(params.UNIT_SHIELD_COLOR);
                        p5.strokeWeight(params.UNIT_SHIELD_STROKE_WEIGHT);
                        p5.ellipse(this.bodyPosition.x, this.bodyPosition.y, params.UNIT_RADIUS * 2, params.UNIT_RADIUS * 2);
                    }
                }
            } else {
                p5.fill(params.UNIT_INACTIVE_COLOR)
                p5.ellipse(this.bodyPosition.x, this.bodyPosition.y, params.UNIT_RADIUS * 2, params.UNIT_RADIUS * 2);
                this.displayInfoText(inGame);
            };
        p5.pop();
    }
}