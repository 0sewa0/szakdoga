class Shot
{
    constructor(start, user, color = SHOT_BASE_COLOR)
    {
        this.user = user;   // The id of the user that this bullet belongs to

        this.position = start.copy();
        this.radius = SHOT_RADIUS;
        this.color = color;
        this.velocity = createVector(mouseX - width/2, mouseY - height/2).setMag(SHOT_SPEED);   // The vector that defines the direction that the shot goes in and at what speed 
        this.ttl = SHOT_TTL;    // How long the shot stays in the game (without this it would fly for quite a while)    
    }

    update()
    {
        this.position.add(this.velocity);   //Move the shot
    }

    render()
    {
        push();             // The options which determan the way we draw objects are stored globaly, and we want to 'protect' them from so we store them in a stack temporarly.
        stroke(this.color); // Then we draw our special object with different options
        strokeWeight(SHOT_STROKE_WEIGHT);
        fill(this.color);
        ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
        pop();              // Then we restore the options to what they were before
    } 

    show()
    {
        this.update();
        this.render();
        this.ttl--;
    }
}