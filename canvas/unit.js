
function Unit(start_x, start_y, user, color = UNIT_BASE_COLOR) 
{

    this.user = user; // The id of the user controlling this unit
    this.shots = []; //All active shots of the unit
    this.points = 0;

    this.body_position = createVector(start_x, start_y);
    this.body_radius = UNIT_RADIUS;
    this.body_color = color;

    this.velocity_X = 0;
    this.velocity_Y = 0;
    this.friction = UNIT_FRICTION;
    this.movement_speed = UNIT_MOVEMENT_SPEED;


    this.show = function() 
    {
        this.draw_body();
    }

    this.move = function()
    {
        if(keyIsDown(65)) // move LEFT == A
        {
            this.velocity_X -= this.movement_speed;
        }
        if(keyIsDown(68)) // move RIGHT == D
        {
            this.velocity_X += this.movement_speed;
        }
        if(keyIsDown(87)) // move UP == W  
        {
            this.velocity_Y -= this.movement_speed;
        }
        if(keyIsDown(83)) // move DOWN == S
        {
            this.velocity_Y += this.movement_speed;
        }
        this.velocity_X *= this.friction;
        this.velocity_Y *= this.friction;
        this.body_position.add(createVector(this.velocity_X,this.velocity_Y));
    }

    this.shoot = function() 
    {
        this.shots.push(new Shot(this.body_position, this.user));
    }

    this.get_hit = function(shot) 
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
    
    this.draw_body = function()
    {
        push();
        stroke(this.body_color);
        strokeWeight(UNIT_STROKE_WEIGHT);
        fill(this.body_color);
        ellipse(this.body_position.x, this.body_position.y, this.body_radius * 2, this.body_radius * 2);
        pop();
    }
}