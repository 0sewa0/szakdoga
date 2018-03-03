class Unit
{

    constructor(start_x, start_y, user, color = UNIT_BASE_COLOR, trail_color = UNIT_BASE_TRAIL_COLOR)
    {
        this.user = user;   // The id of the user controlling this unit
        this.shots = [];    //All active shots of the unit
        this.points = 0;    //The points collected during the game

        this.body_position = createVector(start_x, start_y);
        this.body_radius = UNIT_RADIUS;
        this.body_color = color;

        this.velocity = createVector(0, 0);
        this.friction = UNIT_FRICTION;
        this.movement_speed = UNIT_MOVEMENT_SPEED;

        this.last_shot = 0;
        this.shield_charge = UNIT_SHIELD_CHARGE;
        this.shield = false;
        this.shield_full = true;

        this.trail_color = trail_color;
    }

    show()
    {
        this.draw_body();
        if(this.last_shot != 0)
        {
            this.last_shot--; // FIXME: This should be handled on the server side
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
    move()
    {
        if(keyIsDown(65))   // LEFT == A
        {
            this.velocity.x -= this.movement_speed;
        }
        if(keyIsDown(68))   // RIGHT == D
        {
            this.velocity.x += this.movement_speed;
        }
        if(keyIsDown(87))   // UP == W
        {
            this.velocity.y -= this.movement_speed;
        }
        if(keyIsDown(83))   // DOWN == S
        {
            this.velocity.y += this.movement_speed;
        }
        (keyIsDown(32) && this.shield_charge > 0 && this.shield_full) ? this.shield_on() : this.shield_off();

        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.body_position.add(this.velocity);
        this.boundary_check();

    }

    /**
     *Draws the trail effect by drawing smaller circles on previus locations with a different color
    */
    draw_trail()
    {
        push();
        noStroke();
        fill(this.trail_color);
        for (let index = 1; index < 6; index++)
        {
            ellipse(this.body_position.x - this.velocity.x * index , this.body_position.y - this.velocity.y * index, (this.body_radius * 2) - (index * 12), (this.body_radius * 2) - (index * 12));
        }
        pop();
    }

    /**
     * Turns the shield on
     * Drains the shield
    */
    shield_on()
    {
        this.shield = true;
        this.shield_charge -= UNIT_SHIELD_CHARGE_LOSS;
    }

    /**
     * Turns the shield of
     * Recharges the shield
    */
    shield_off()
    {
        this.shield = false;
        this.shield_full = false;
        (this.shield_charge < UNIT_SHIELD_CHARGE) ? this.shield_charge += UNIT_SHIELD_CHARGE_RATE : this.shield_full = true;
    }

    /**
     * It checks:
        -   Is the player on the map? => Prevents the player to leave it
        -   Is the player touching any of the obstacles? => Prevents the player to enter it (however it can happen, but then the player can easly leave it)
    */
    boundary_check()
    {
        if(this.body_position.x > CANVAS_MAP_X)
        {
            this.body_position.x = CANVAS_MAP_X;
        }
        if(this.body_position.x < -CANVAS_MAP_X)
        {
            this.body_position.x = -CANVAS_MAP_X;
        }
        if(this.body_position.y > CANVAS_MAP_Y)
        {
            this.body_position.y = CANVAS_MAP_Y;
        }
        if(this.body_position.y < -CANVAS_MAP_Y)
        {
            this.body_position.y = -CANVAS_MAP_Y;
        }
        CANVAS_OBSTACLES.forEach(obstacle =>
            {
                if(this.body_position.x > obstacle.x1 - UNIT_RADIUS + 10 && this.body_position.x < obstacle.x4 + UNIT_RADIUS - 10 && this.body_position.y < obstacle.y1 + UNIT_RADIUS - 10 && this.body_position.y > obstacle.y2 - UNIT_RADIUS + 10)
                {
                    //This 'line' of code makes it possible that when you touch the border of an obstacle, it will stop you while having a smooth rubber like effect
                    (this.body_position.x < obstacle.x1) ? this.body_position.x = lerp(this.body_position.x, obstacle.x1 - UNIT_RADIUS, 0.2) : (this.body_position.x > obstacle.x4) ? this.body_position.x = lerp(this.body_position.x, obstacle.x4 + UNIT_RADIUS, 0.2) : (this.body_position.y > obstacle.y1) ? this.body_position.y = lerp(this.body_position.y, obstacle.y1 + UNIT_RADIUS, 0.2) : (this.body_position.y < obstacle.y2) ? this.body_position.y = lerp(this.body_position.y, obstacle.y2 - UNIT_RADIUS, 0.2) : false;
                }
            });
        let distance_from_center = p5.Vector.dist(this.body_position, createVector(CANVAS_OBSTACLES_CENTER_PIECE.x, CANVAS_OBSTACLES_CENTER_PIECE.y));
        if(distance_from_center < this.body_radius + CANVAS_OBSTACLES_CENTER_PIECE.r1 / 2)
        {
            let angle = this.body_position.heading();
            let push = p5.Vector.fromAngle(angle).mult(3 * CANVAS_OBSTACLES_CENTER_PIECE.r1 / 5);
            this.body_position = this.body_position.lerp(push, 0.2);
        }
    }

    /**
     * Checks if the player is allowed to shoot (again)
     * If true, it shoots by creating a new shot and adding it to the array and resets the cooldown
    */
    shoot()
    {
        if(this.last_shot == 0)
        {
            this.shots.push(new Shot(this.body_position, this.user));
            this.last_shot = SHOT_COOLDOWN;
        }
    }

    /**
     * First it calculates the distance between the unit and the shot
     * If the distance is smaller than the sum of the two objects radii(plural of radius) then the two object intesect
    */
    get_hit(shot)
    {
        let distance = p5.Vector.dist(this.body_position, shot.position);
        if( distance < this.body_radius + shot.radius)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * First it calculates the distance between the unit and the other unit
     * Then if the distance is smaller than the sum of the two objects radii(plural of radius) then the two object intesect
    */
    touching(other)
    {
        let distance = p5.Vector.dist(this.body_position, other.body_position);
        if( distance < this.body_radius + other.body_radius)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * The options which determan the way we draw objects are stored globaly, and we want to 'protect' them from so we store them in a stack temporarly. (push)
     * Then we draw our special object with different options
     * Then we restore the options to what they were before (pop)
    */
    draw_body()
    {
        this.draw_trail();
        push();
        (this.shield) ? stroke(UNIT_SHIELD_COLOR) | strokeWeight(UNIT_SHIELD_STROKE_WEIGHT) : stroke(this.body_color) | strokeWeight(UNIT_STROKE_WEIGHT);
        fill(this.body_color);
        ellipse(this.body_position.x, this.body_position.y, this.body_radius * 2, this.body_radius * 2);
        pop();
    }
}