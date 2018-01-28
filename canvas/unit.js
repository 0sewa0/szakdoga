
function Unit(start_x, start_y, radius) 
{
    
    this.body_position = createVector(start_x, start_y);
    this.body_radius = radius;
    this.body_color = 255;

    this.velocity_X = 0;
    this.velocity_Y = 0;
    this.friction = 0.60;
    this.movement_speed = 5;

    
    this.show = function() 
    {
        this.draw_body();
    }

    this.update = function()
    {
        this.move();
    }

    this.move = function()
    {
        if(keyIsDown(65)) // LEFT == A
        {
            this.velocity_X -= this.movement_speed;
        }
        if(keyIsDown(68)) // RIGHT == D
        {
            this.velocity_X += this.movement_speed;
        }
        if(keyIsDown(87)) // UP == W  
        {
            this.velocity_Y -= this.movement_speed;
        }
        if(keyIsDown(83)) // DOWN == S
        {
            this.velocity_Y += this.movement_speed;
        }
        this.velocity_X *= this.friction;
        this.velocity_Y *= this.friction;
        this.body_position.add(createVector(this.velocity_X,this.velocity_Y));
    }

    this.draw_body = function()
    {
        stroke(this.body_color);
        strokeWeight(1);
        fill(this.body_color);
        ellipse(this.body_position.x, this.body_position.y, this.body_radius * 2, this.body_radius * 2);
    }
}