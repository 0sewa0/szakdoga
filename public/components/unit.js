class Unit {

    constructor(startX, startY, user, id, spawn, color = UNIT_BASE_COLOR, trailColor = UNIT_BASE_TRAIL_COLOR) {
        this.user = user; // The id of the user controlling this unit
        this.spawn = spawn;
        this.id = id;
        this.shots = []; //All active shots of the unit
        this.shotIdCounter = 0;
        this.score = 0; //The points collected during the game

        this.bodyPosition = createVector(startX, startY);
        this.bodyColor = color;

        this.velocity = createVector(0, 0);

        this.lastShot = 0;
        this.shieldCharge = UNIT_SHIELD_CHARGE;
        this.shield = false;
        this.shieldFull = true;

        this.trailColor = trailColor;
    }

    show(inGame = true) {
        this.drawBody(inGame);
        if (this.lastShot != 0) {
            this.lastShot--; // FIXME: This should be handled on the server side
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
        if (keyIsDown(65)) // LEFT == A
        {
            keysDown++;
            this.velocity.x -= UNIT_MOVEMENT_SPEED / keysDown;
        }
        if (keyIsDown(68)) // RIGHT == D
        {
            keysDown++;
            this.velocity.x += UNIT_MOVEMENT_SPEED / keysDown;
        }
        if (keyIsDown(87)) // UP == W
        {
            keysDown++;
            this.velocity.y -= UNIT_MOVEMENT_SPEED / keysDown;
        }
        if (keyIsDown(83)) // DOWN == S
        {
            keysDown++;
            this.velocity.y += UNIT_MOVEMENT_SPEED / keysDown;
        }
        (keyIsDown(32) && this.shieldCharge > 0 && this.shieldFull) ? this.shieldOn(): this.shieldOff();

        this.velocity.x *= UNIT_FRICTION;
        this.velocity.y *= UNIT_FRICTION;
        this.bodyPosition.add(this.velocity);
        this.boundaryCheck();

    }

    /**
     *Draws the trail effect by drawing smaller circles on previus locations with a different color
     */
    drawTrail() {
        push();
            noStroke();
            fill(this.trailColor);
            for (let index = 1; index < 4; index++) {
                ellipse(this.bodyPosition.x - this.velocity.x * index, this.bodyPosition.y - this.velocity.y * index, (UNIT_RADIUS * 2) - (index * 4.5), (UNIT_RADIUS * 2) - (index * 4.5));
            }
        pop();
    }

    displayInfoText(inGame = true) {
        push();
            textAlign(CENTER);
            textStyle(BOLD);
            fill(CANVAS_TEXT_COLOR);
            if(inGame) {
                textSize((UNIT_RADIUS / this.user.length)*3);
                text(`${this.user}\n${this.score}`, this.bodyPosition.x, this.bodyPosition.y);
            }
            else {
                textSize(UNIT_RADIUS / 3);
                text(`PRESS\nENTER`, this.bodyPosition.x, this.bodyPosition.y);
            }
        pop();
    }
    /**
     * Turns the shield on
     * Drains the shield
     */
    shieldOn() {
        this.shield = true;
        this.shieldCharge -= UNIT_SHIELD_CHARGE_LOSS;
    }

    /**
     * Turns the shield off
     * Recharges the shield
     */
    shieldOff() {
        this.shield = false;
        this.shieldFull = false;
        (this.shieldCharge < UNIT_SHIELD_CHARGE) ? this.shieldCharge += UNIT_SHIELD_CHARGE_RATE: this.shieldFull = true;
    }

    /**
     * It checks:
        -   Is the player on the map? => Prevents the player to leave it
        -   Is the player touching any of the obstacles? => Prevents the player to enter it (however it can happen, but then the player can easly leave it)
    */
    boundaryCheck() {
        if (this.bodyPosition.x > CANVAS_MAP_X) {
            this.bodyPosition.x = CANVAS_MAP_X;
        }
        if (this.bodyPosition.x < -CANVAS_MAP_X) {
            this.bodyPosition.x = -CANVAS_MAP_X;
        }
        if (this.bodyPosition.y > CANVAS_MAP_Y) {
            this.bodyPosition.y = CANVAS_MAP_Y;
        }
        if (this.bodyPosition.y < -CANVAS_MAP_Y) {
            this.bodyPosition.y = -CANVAS_MAP_Y;
        }
        CANVAS_OBSTACLES.forEach(obstacle => {
            if (this.bodyPosition.x > obstacle.x1 - UNIT_RADIUS + 10 && this.bodyPosition.x < obstacle.x4 + UNIT_RADIUS - 10 && this.bodyPosition.y < obstacle.y1 + UNIT_RADIUS - 10 && this.bodyPosition.y > obstacle.y2 - UNIT_RADIUS + 10) {
                //This 'line' of code makes it possible that when you touch the border of an obstacle, it will stop you while having a smooth rubber like effect
                (this.bodyPosition.x < obstacle.x1) ? this.bodyPosition.x = lerp(this.bodyPosition.x, obstacle.x1 - UNIT_RADIUS, 0.2): (this.bodyPosition.x > obstacle.x4) ? this.bodyPosition.x = lerp(this.bodyPosition.x, obstacle.x4 + UNIT_RADIUS, 0.2) : (this.bodyPosition.y > obstacle.y1) ? this.bodyPosition.y = lerp(this.bodyPosition.y, obstacle.y1 + UNIT_RADIUS, 0.2) : (this.bodyPosition.y < obstacle.y2) ? this.bodyPosition.y = lerp(this.bodyPosition.y, obstacle.y2 - UNIT_RADIUS, 0.2) : false;
            }
        });
        let distance_from_center = p5.Vector.dist(this.bodyPosition, createVector(CANVAS_OBSTACLES_CENTER_PIECE.x, CANVAS_OBSTACLES_CENTER_PIECE.y));
        if (distance_from_center < UNIT_RADIUS + CANVAS_OBSTACLES_CENTER_PIECE.r1 / 2) {
            let angle = this.bodyPosition.heading();
            let push = p5.Vector.fromAngle(angle).mult(3 * CANVAS_OBSTACLES_CENTER_PIECE.r1 / 5);
            this.bodyPosition = this.bodyPosition.lerp(push, 0.2);
        }
    }

    /**
     * Checks if the player is allowed to shoot (again)
     * If true, it shoots by creating a new shot and adding it to the array and resets the cooldown
     */
    shoot() {
        if (this.lastShot == 0) {
            let new_shot = new Shot(this.bodyPosition, this.user, this.shotIdCounter++);
            this.shots.push(new_shot);
            this.lastShot = SHOT_COOLDOWN;
            return new_shot;
        }
    }

    /**
     * First it calculates the distance between the unit and the shot
     * If the distance is smaller than the sum of the two objects radii(plural of radius) then the two object intesect
     */
    getHit(shot) {
        let distance = p5.Vector.dist(this.bodyPosition, shot.position);
        if (distance < UNIT_RADIUS + SHOT_RADIUS) {
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
        let distance = p5.Vector.dist(this.bodyPosition, other.bodyPosition);
        if (distance < UNIT_RADIUS * 2) {
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
        push();
            (this.shield) ? stroke(UNIT_SHIELD_COLOR) | strokeWeight(UNIT_SHIELD_STROKE_WEIGHT): stroke(this.bodyColor) | strokeWeight(UNIT_STROKE_WEIGHT);
            (inGame) ? fill(this.bodyColor) : fill(UNIT_INACTIVE_COLOR);
            ellipse(this.bodyPosition.x, this.bodyPosition.y, UNIT_RADIUS * 2, UNIT_RADIUS * 2);
        pop();
        this.displayInfoText(inGame);
    }
}