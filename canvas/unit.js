
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

        this.velocity = createVector(0,0);
        this.friction = UNIT_FRICTION;
        this.movement_speed = UNIT_MOVEMENT_SPEED;
        this.last_shot = 0;
        
            //TODO: Add a trail effect, with an array that stores previous ~5 locations and draws a lighter colored circle at those locations
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

    move()  // Move according the buttons the player pressed
    {
        if(keyIsDown(65))   // move LEFT == A
        {
            this.velocity.x -= this.movement_speed;
        }
        if(keyIsDown(68))   // move RIGHT == D
        {
            this.velocity.x += this.movement_speed;
        }
        if(keyIsDown(87))   // move UP == W  
        {
            this.velocity.y -= this.movement_speed;
        }
        if(keyIsDown(83))   // move DOWN == S
        {
            this.velocity.y += this.movement_speed;
        }
        this.velocity.x *= this.friction;   // Slow down on the X axis
        this.velocity.y *= this.friction;   // Slow down on the Y axis
        this.body_position.add(this.velocity);  // Move the unit 
        this.boundary_check();
              
    }

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
    }

    shoot() 
    {
        if(this.last_shot == 0) // Checks if the player is allowed to shoot again
        {
            this.shots.push(new Shot(this.body_position, this.user)); // Shoot by creating a new shot and adding it to the array
            this.last_shot = SHOT_COOLDOWN;
        }
    }

    get_hit(shot) 
    {
        let distance = p5.Vector.dist(this.body_position, shot.position);   // Calculates the distance between the unit and the shot
        if( distance < this.body_radius + shot.radius)                      // If the distance is smaller than the sum of the two objects radii(plural of radius) then the two object intesect
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    touching(other)
    {
        let distance = p5.Vector.dist(this.body_position, other.body_position);   // Calculates the distance between the unit and the other unit
        if( distance < this.body_radius + other.body_radius)                      // If the distance is smaller than the sum of the two objects radii(plural of radius) then the two object intesect
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    
    draw_body()
    {
        this.draw_trail();
        push();                     // The options which determan the way we draw objects are stored globaly, and we want to 'protect' them from so we store them in a stack temporarly. 
        stroke(this.body_color);    // Then we draw our special object with different options
        strokeWeight(UNIT_STROKE_WEIGHT);
        fill(this.body_color);
        ellipse(this.body_position.x, this.body_position.y, this.body_radius * 2, this.body_radius * 2);
        pop();                      // Then we restore the options to what they were before
        
    }
}