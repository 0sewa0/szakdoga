
function Unit(start_x, start_y, radius) 
{
    //this.velocity = createVector(0,0);
    
    this.body_position = createVector(start_x, start_y);
    this.body_radius = radius;
    this.body_color = 255;

    this.arm_position_1 = createVector(start_x + radius, start_y + radius/2);
    this.arm_position_2 = createVector(start_x + radius, start_y - radius*2);
    this.arm_width = 10;
    this.arm_color = "red";


    this.movement_speed = 5;

    
    this.show = function() 
    {
        this.draw_body();
        this.draw_arm();
    }

    this.update = function()
    {
        this.move();
     //   this.aim();
    }

    this.move = function()
    {

        if(keyIsDown(65)) // LEFT == A
        {
            this.body_position.x -= this.movement_speed;
            this.arm_position_1.x -= this.movement_speed; 
            this.arm_position_2.x -= this.movement_speed; 
        }
        if(keyIsDown(68)) // RIGHT == D
        {
            this.body_position.x += this.movement_speed;
            this.arm_position_1.x += this.movement_speed;
            this.arm_position_2.x += this.movement_speed; 
        }
        if(keyIsDown(87)) // UP == W  
        {
            this.body_position.y -= this.movement_speed;
            this.arm_position_1.y -= this.movement_speed; 
            this.arm_position_2.y -= this.movement_speed;
        }
        if(keyIsDown(83)) // DOWN == S
        {
            this.body_position.y += this.movement_speed;
            this.arm_position_1.y += this.movement_speed; 
            this.arm_position_2.y += this.movement_speed;
        }
    }
/*
    this.aim = function()
    {
        var mouse = createVector(mouseX, mouseY);
        mouse.setmag
        var angle = p5.Vector.angleBetween(this.arm_position, mouse);
        
        if(!isNaN(angle))
        {
            console.log(angle);
            this.arm_position.rotate(angle);
        }
    }
*/
    this.draw_body = function()
    {
        stroke(this.body_color);
        strokeWeight(1);
        fill(this.body_color);
        ellipse(this.body_position.x, this.body_position.y, this.body_radius * 2, this.body_radius * 2);
    }

    this.draw_arm = function() 
    {
        stroke(this.arm_color);
        strokeWeight(this.arm_width);
        line(this.arm_position_1.x, this.arm_position_1.y, this.arm_position_2.x, this.arm_position_2.y);
    }
}